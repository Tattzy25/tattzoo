"""
Key Router: endpoints for key activation, validation, and usage tracking
"""
from fastapi import APIRouter, HTTPException
from models.schemas import (
    KeyValidateRequest,
    KeyValidateResponse,
    KeyUseRequest,
    KeyActivateRequest,
    KeyUsageResponse,
)
from services.key_manager_service import (
    issue_key,
    activate_key,
    validate_key,
    record_usage,
)
from config.settings import settings


router = APIRouter(prefix="/api/key", tags=["Key Management"])


@router.post("/validate", response_model=KeyValidateResponse)
async def validate(req: KeyValidateRequest) -> KeyValidateResponse:
    is_valid, status, images_used, ar_views_used = await validate_key(req.key, req.email)
    return KeyValidateResponse(
        valid=is_valid,
        status=status,
        images_used=images_used,
        ar_views_used=ar_views_used,
        images_cap=settings.IMAGES_DAILY_CAP,
        ar_views_cap=settings.AR_VIEWS_DAILY_CAP,
    )


@router.post("/use", response_model=KeyUsageResponse)
async def use(req: KeyUseRequest) -> KeyUsageResponse:
    action = req.action.lower()
    if action not in ("image", "ar"):
        raise HTTPException(status_code=400, detail="Invalid action")
    images_used, ar_views_used = await record_usage(req.key, req.email, action)  # type: ignore
    return KeyUsageResponse(images_used=images_used, ar_views_used=ar_views_used)


@router.post("/activate")
async def activate(req: KeyActivateRequest):
    ok = await activate_key(req.key, req.email, req.otp_ref)
    if not ok:
        raise HTTPException(status_code=400, detail="Activation failed")
    return {"activated": True}


# Optional: endpoint to issue a key (used by PayPal capture flow)
@router.post("/issue")
async def issue(email: str):
    plaintext_key, key_id = await issue_key(email)
    return {"key": plaintext_key, "key_id": key_id}