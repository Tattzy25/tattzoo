"""
Key management service: secure key generation, hashing, validation, activation,
and daily usage enforcement for image generations and AR views.

Design notes:
- Keys are generated with Crockford Base32 characters, prefixed with 'TZY-'
- Only argon2id hash is stored; lookup uses sha256 digest (key_digest)
- Email fingerprint uses HMAC-SHA256(lower(email), EMAIL_FINGERPRINT_SALT)
- Daily caps enforced via key_usage_daily with UPSERT semantics
"""
import hmac
import hashlib
import secrets
import datetime
from typing import Optional, Tuple, Literal

from argon2 import PasswordHasher
from fastapi import HTTPException

from config.settings import settings
from db.database_asyncpg import get_db_connection


ph = PasswordHasher()


# Crockford Base32 alphabet (no I, L, O, U to avoid confusion)
CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def _random_crockford(length: int) -> str:
    return ''.join(secrets.choice(CROCKFORD_ALPHABET) for _ in range(length))


def _checksum_for_key(payload: str) -> str:
    # Take sha256 of payload and map first 10 bits to 2 Crockford chars
    digest = hashlib.sha256(payload.encode('utf-8')).digest()
    val = int.from_bytes(digest[:2], 'big')  # 16 bits
    idx1 = (val >> 5) & 0x1F
    idx2 = val & 0x1F
    return CROCKFORD_ALPHABET[idx1] + CROCKFORD_ALPHABET[idx2]


def _format_key(prefix: str, payload: str, checksum: str, group: int = 4) -> str:
    groups = [payload[i:i+group] for i in range(0, len(payload), group)]
    return f"{prefix}-" + '-'.join(groups) + f"-{checksum}"


def email_fingerprint(email: str) -> str:
    normalized = email.strip().lower()
    return hmac.new(
        settings.EMAIL_FINGERPRINT_SALT.encode('utf-8'),
        normalized.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()


def key_digest(plaintext_key: str) -> str:
    return hashlib.sha256(plaintext_key.encode('utf-8')).hexdigest()


async def issue_key(email: str) -> Tuple[str, str]:
    """
    Generate and persist a new key for the provided email.
    Returns (plaintext_key, key_id)
    """
    payload_len = 20
    payload = _random_crockford(payload_len)
    checksum = _checksum_for_key(payload)
    plaintext_key = _format_key(settings.KEY_PREFIX, payload, checksum)

    digest = key_digest(plaintext_key)
    key_hash = ph.hash(plaintext_key)
    fp = email_fingerprint(email)

    issued_at = datetime.datetime.utcnow()
    expires_at = issued_at + datetime.timedelta(days=30)

    async with get_db_connection() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO keys (key_hash, key_digest, prefix, email_fingerprint, issued_at, expires_at, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'issued')
            RETURNING id
            """,
            key_hash, digest, settings.KEY_PREFIX, fp, issued_at, expires_at
        )
        key_id = str(row["id"]) if row else None
    if not key_id:
        raise HTTPException(status_code=500, detail="Failed to issue key")
    return plaintext_key, key_id


async def activate_key(plaintext_key: str, email: str, otp_ref: Optional[str]) -> bool:
    fp = email_fingerprint(email)
    digest = key_digest(plaintext_key)
    now = datetime.datetime.utcnow()
    async with get_db_connection() as conn:
        # Ensure key exists and verify hash
        row = await conn.fetchrow(
            "SELECT id, key_hash, status, expires_at FROM keys WHERE key_digest = $1 AND email_fingerprint = $2",
            digest, fp
        )
        if not row:
            return False
        try:
            ph.verify(row["key_hash"], plaintext_key)
        except Exception:
            return False
        if row["expires_at"] <= now:
            # Mark expired
            await conn.execute("UPDATE keys SET status='expired' WHERE id=$1", row["id"])
            return False
        # Activate
        await conn.execute(
            "UPDATE keys SET status='active', activated_at=$2 WHERE id=$1",
            row["id"], now
        )
        # Log validation
        await conn.execute(
            """
            INSERT INTO key_validations (key_id, email_fingerprint, otp_ref, outcome)
            VALUES ($1, $2, $3, 'success')
            """,
            row["id"], fp, otp_ref
        )
    return True


async def validate_key(plaintext_key: str, email: str) -> Tuple[bool, str, int, int]:
    """Return (is_valid, status, images_used, ar_views_used) for today."""
    fp = email_fingerprint(email)
    digest = key_digest(plaintext_key)
    today = datetime.datetime.utcnow().date()
    now = datetime.datetime.utcnow()

    async with get_db_connection() as conn:
        row = await conn.fetchrow(
            "SELECT id, key_hash, status, expires_at FROM keys WHERE key_digest = $1 AND email_fingerprint = $2",
            digest, fp
        )
        if not row:
            return False, "missing", 0, 0
        try:
            ph.verify(row["key_hash"], plaintext_key)
        except Exception:
            return False, "mismatch", 0, 0
        if row["expires_at"] <= now:
            await conn.execute("UPDATE keys SET status='expired' WHERE id=$1", row["id"])
            return False, "expired", 0, 0
        usage = await conn.fetchrow(
            "SELECT images_used, ar_views_used FROM key_usage_daily WHERE key_id=$1 AND usage_date=$2",
            row["id"], today
        )
        images_used = int(usage["images_used"]) if usage else 0
        ar_views_used = int(usage["ar_views_used"]) if usage else 0
        return True, row["status"], images_used, ar_views_used


async def record_usage(plaintext_key: str, email: str, action: Literal['image','ar']) -> Tuple[int, int]:
    """
    Increment usage for the given action; enforce caps.
    Returns (images_used, ar_views_used) after increment.
    """
    fp = email_fingerprint(email)
    digest = key_digest(plaintext_key)
    today = datetime.datetime.utcnow().date()
    now = datetime.datetime.utcnow()

    async with get_db_connection() as conn:
        row = await conn.fetchrow(
            "SELECT id, key_hash, status, expires_at FROM keys WHERE key_digest = $1 AND email_fingerprint = $2",
            digest, fp
        )
        if not row:
            raise HTTPException(status_code=404, detail="Key not found")
        try:
            ph.verify(row["key_hash"], plaintext_key)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid key")
        if row["status"] != 'active':
            raise HTTPException(status_code=403, detail="Key not active")
        if row["expires_at"] <= now:
            await conn.execute("UPDATE keys SET status='expired' WHERE id=$1", row["id"])
            raise HTTPException(status_code=403, detail="Key expired")

        # Upsert today's usage
        await conn.execute(
            """
            INSERT INTO key_usage_daily (key_id, usage_date, images_used, ar_views_used)
            VALUES ($1, $2, 0, 0)
            ON CONFLICT (key_id, usage_date) DO NOTHING
            """,
            row["id"], today
        )

        usage = await conn.fetchrow(
            "SELECT images_used, ar_views_used FROM key_usage_daily WHERE key_id=$1 AND usage_date=$2",
            row["id"], today
        )
        images_used = int(usage["images_used"]) if usage else 0
        ar_views_used = int(usage["ar_views_used"]) if usage else 0

        if action == 'image':
            if images_used >= settings.IMAGES_DAILY_CAP:
                raise HTTPException(status_code=429, detail="Image daily cap reached")
            images_used += 1
            await conn.execute(
                "UPDATE key_usage_daily SET images_used=$3, updated_at=$4 WHERE key_id=$1 AND usage_date=$2",
                row["id"], today, images_used, now
            )
        else:
            if ar_views_used >= settings.AR_VIEWS_DAILY_CAP:
                raise HTTPException(status_code=429, detail="AR daily cap reached")
            ar_views_used += 1
            await conn.execute(
                "UPDATE key_usage_daily SET ar_views_used=$3, updated_at=$4 WHERE key_id=$1 AND usage_date=$2",
                row["id"], today, ar_views_used, now
            )

        return images_used, ar_views_used