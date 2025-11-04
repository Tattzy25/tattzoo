-- ============================================================================
-- KEY MANAGEMENT SCHEMA - Tattzoo Application
-- ============================================================================
-- Provides license key issuance, activation, usage tracking, and transactions
-- Neon PostgreSQL compatible; designed for asyncpg execution
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: keys
-- Stores issued keys (only hashed) and lifecycle state
-- status: 'issued' | 'active' | 'revoked' | 'expired'
-- ============================================================================
CREATE TABLE IF NOT EXISTS keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_hash TEXT NOT NULL,                         -- argon2id hash of the key
  key_digest CHAR(64) UNIQUE NOT NULL,            -- sha256 hex digest for lookup
  prefix VARCHAR(10) NOT NULL DEFAULT 'TZY',
  email_fingerprint CHAR(64) NOT NULL,            -- HMAC-SHA256(lower(email), secret_salt)
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  activated_at TIMESTAMP NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'issued',
  revocation_reason TEXT NULL,
  CHECK (status IN ('issued','active','revoked','expired'))
);

CREATE INDEX IF NOT EXISTS idx_keys_email_fingerprint ON keys(email_fingerprint);
CREATE INDEX IF NOT EXISTS idx_keys_status ON keys(status);
CREATE INDEX IF NOT EXISTS idx_keys_expires_at ON keys(expires_at);

-- ============================================================================
-- TABLE: key_validations
-- Audit log of OTP validations and outcomes
-- ============================================================================
CREATE TABLE IF NOT EXISTS key_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_id UUID NOT NULL REFERENCES keys(id) ON DELETE CASCADE,
  email_fingerprint CHAR(64) NOT NULL,
  otp_ref VARCHAR(255) NULL,
  outcome VARCHAR(20) NOT NULL,                   -- 'success' | 'failure'
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_key_validations_key_id ON key_validations(key_id);

-- ============================================================================
-- TABLE: key_usage_daily
-- Tracks per-day usage caps for images and AR views
-- ============================================================================
CREATE TABLE IF NOT EXISTS key_usage_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_id UUID NOT NULL REFERENCES keys(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,                        -- UTC date
  images_used INTEGER NOT NULL DEFAULT 0,
  ar_views_used INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_key_usage_per_day UNIQUE (key_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_key_usage_key_id ON key_usage_daily(key_id);
CREATE INDEX IF NOT EXISTS idx_key_usage_date ON key_usage_daily(usage_date);

-- ============================================================================
-- TABLE: transactions
-- Records PayPal transactions for key issuance
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paypal_order_id VARCHAR(128) UNIQUE NOT NULL,
  key_id UUID NULL REFERENCES keys(id) ON DELETE SET NULL,
  email_fingerprint CHAR(64) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,                    -- 'authorized' | 'captured' | 'failed' | 'refunded'
  captured_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_email_fingerprint ON transactions(email_fingerprint);

-- ============================================================================
-- TABLE: webhook_events
-- Ensures idempotent processing of external events
-- ============================================================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload_hash CHAR(64) NOT NULL,                  -- sha256 of raw payload
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FUNCTION: update_updated_at_column
-- Shared trigger function to auto-update updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for key_usage_daily updates
DROP TRIGGER IF EXISTS update_key_usage_daily_updated_at ON key_usage_daily;
CREATE TRIGGER update_key_usage_daily_updated_at
  BEFORE UPDATE ON key_usage_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEW: active_keys
-- Convenience view for active, non-expired keys
-- ============================================================================
CREATE OR REPLACE VIEW active_keys AS
SELECT * FROM keys
WHERE status = 'active' AND expires_at > NOW();

-- ============================================================================
-- NOTES
-- - All key lookups should use key_digest to find rows, then verify with argon2id
-- - email_fingerprint is non-reversible and used only for diagnostics and fraud signals
-- - usage_date is UTC; compute on server using NOW() AT TIME ZONE 'UTC'
-- ============================================================================