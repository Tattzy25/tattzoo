-- ASK TATTY SCHEMA
-- Database schema for Ask TaTTTy AI assistant feature
-- Tracks API calls, configuration, and UI content

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE: ask_tattty_requests
-- Purpose: Track every Ask TaTTTy API call from button click to result
-- =============================================================================
CREATE TABLE ask_tattty_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('enhance', 'ideas')),
    input_text TEXT NOT NULL,
    output_text TEXT NOT NULL,
    input_char_count INTEGER NOT NULL CHECK (input_char_count >= 0),
    output_char_count INTEGER NOT NULL CHECK (output_char_count >= 0),
    -- Token usage and model/cost tracking
    input_tokens INTEGER NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
    output_tokens INTEGER NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
    total_tokens INTEGER NOT NULL DEFAULT 0 CHECK (total_tokens >= 0),
    model VARCHAR(100) NULL,
    cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
    response_time_ms INTEGER NOT NULL CHECK (response_time_ms >= 0),
    was_successful BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics and performance
CREATE INDEX idx_ask_tattty_action ON ask_tattty_requests(action_type);
CREATE INDEX idx_ask_tattty_created ON ask_tattty_requests(created_at DESC);
CREATE INDEX idx_ask_tattty_session ON ask_tattty_requests(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_ask_tattty_success ON ask_tattty_requests(was_successful);

-- =============================================================================
-- TABLE: ask_tattty_config
-- Purpose: API configuration per environment (dev/staging/production)
-- =============================================================================
CREATE TABLE ask_tattty_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    environment VARCHAR(20) UNIQUE NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
    api_base_url VARCHAR(255) NOT NULL,
    enhance_endpoint VARCHAR(100) NOT NULL DEFAULT '/api/ai/enhance',
    ideas_endpoint VARCHAR(100) NOT NULL DEFAULT '/api/ai/ideas',
    request_timeout_ms INTEGER NOT NULL DEFAULT 30000 CHECK (request_timeout_ms >= 1000),
    min_characters INTEGER NOT NULL DEFAULT 10 CHECK (min_characters >= 0),
    streaming_throttle_ms INTEGER NOT NULL DEFAULT 50 CHECK (streaming_throttle_ms >= 0),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Only one environment can be active at a time
CREATE UNIQUE INDEX idx_ask_tattty_config_active ON ask_tattty_config(is_active) WHERE is_active = true;

-- =============================================================================
-- TABLE: ask_tattty_content
-- Purpose: UI labels and error messages (multi-language support)
-- =============================================================================
CREATE TABLE ask_tattty_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language VARCHAR(10) UNIQUE NOT NULL,
    button_text VARCHAR(50) NOT NULL DEFAULT 'Ask TaTTTy',
    loading_text VARCHAR(50) NOT NULL DEFAULT 'Thinking...',
    enhance_button VARCHAR(50) NOT NULL DEFAULT 'Enhance My Text',
    ideas_button VARCHAR(50) NOT NULL DEFAULT 'Give Me Ideas',
    revert_button VARCHAR(50) NOT NULL DEFAULT 'Back',
    re_enhance_button VARCHAR(50) NOT NULL DEFAULT 'Redo',
    revert_tooltip VARCHAR(200) NOT NULL DEFAULT 'Revert to original text',
    re_enhance_tooltip VARCHAR(200) NOT NULL DEFAULT 'Re-enhance with new result',
    empty_text_error VARCHAR(100) NOT NULL DEFAULT 'Write Something First!',
    text_too_short_error VARCHAR(100) NOT NULL DEFAULT 'Add More Details!',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- FUNCTION: log_ask_tattty_request
-- Purpose: Log Ask TaTTTy API call with all details
-- =============================================================================
CREATE OR REPLACE FUNCTION log_ask_tattty_request(
    action VARCHAR,
    input TEXT,
    output TEXT,
    response_ms INTEGER,
    session_id_value VARCHAR DEFAULT NULL,
    is_successful BOOLEAN DEFAULT true,
    err_msg TEXT DEFAULT NULL,
    in_tokens INTEGER DEFAULT 0,
    out_tokens INTEGER DEFAULT 0,
    tot_tokens INTEGER DEFAULT 0,
    model_name VARCHAR DEFAULT NULL,
    cost NUMERIC DEFAULT 0
) RETURNS UUID AS $$
DECLARE
    request_id UUID;
    input_len INTEGER;
    output_len INTEGER;
BEGIN
    -- Calculate character counts
    input_len := LENGTH(input);
    output_len := LENGTH(output);
    
    -- Insert the request
    INSERT INTO ask_tattty_requests (
        session_id,
        action_type,
        input_text,
        output_text,
        input_char_count,
        output_char_count,
        input_tokens,
        output_tokens,
        total_tokens,
        model,
        cost_usd,
        response_time_ms,
        was_successful,
        error_message
    ) VALUES (
        session_id_value,
        action,
        input,
        output,
        input_len,
        output_len,
        COALESCE(in_tokens, 0),
        COALESCE(out_tokens, 0),
        COALESCE(tot_tokens, COALESCE(in_tokens,0) + COALESCE(out_tokens,0)),
        model_name,
        COALESCE(cost, 0),
        response_ms,
        is_successful,
        err_msg
    )
    RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCTION: update_updated_at_column
-- Purpose: Auto-update updated_at timestamp on row change
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS: Auto-update timestamps
-- =============================================================================
CREATE TRIGGER trigger_update_ask_tattty_config_updated_at
    BEFORE UPDATE ON ask_tattty_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_ask_tattty_content_updated_at
    BEFORE UPDATE ON ask_tattty_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED DATA: Default configuration
-- =============================================================================

-- Development configuration
INSERT INTO ask_tattty_config (
    environment,
    api_base_url,
    enhance_endpoint,
    ideas_endpoint,
    request_timeout_ms,
    min_characters,
    streaming_throttle_ms,
    is_active
) VALUES (
    'development',
    'http://localhost:8000',
    '/api/ai/enhance',
    '/api/ai/ideas',
    30000,
    10,
    50,
    true
)
ON CONFLICT (environment) DO UPDATE SET
    api_base_url = EXCLUDED.api_base_url,
    enhance_endpoint = EXCLUDED.enhance_endpoint,
    ideas_endpoint = EXCLUDED.ideas_endpoint,
    request_timeout_ms = EXCLUDED.request_timeout_ms,
    min_characters = EXCLUDED.min_characters,
    streaming_throttle_ms = EXCLUDED.streaming_throttle_ms,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- Staging configuration (inactive by default)
INSERT INTO ask_tattty_config (
    environment,
    api_base_url,
    enhance_endpoint,
    ideas_endpoint,
    request_timeout_ms,
    min_characters,
    streaming_throttle_ms,
    is_active
) VALUES (
    'staging',
    'https://staging-api.tattty.com',
    '/api/ai/enhance',
    '/api/ai/ideas',
    30000,
    10,
    50,
    false
)
ON CONFLICT (environment) DO UPDATE SET
    api_base_url = EXCLUDED.api_base_url,
    enhance_endpoint = EXCLUDED.enhance_endpoint,
    ideas_endpoint = EXCLUDED.ideas_endpoint,
    request_timeout_ms = EXCLUDED.request_timeout_ms,
    min_characters = EXCLUDED.min_characters,
    streaming_throttle_ms = EXCLUDED.streaming_throttle_ms,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- Production configuration (inactive by default)
INSERT INTO ask_tattty_config (
    environment,
    api_base_url,
    enhance_endpoint,
    ideas_endpoint,
    request_timeout_ms,
    min_characters,
    streaming_throttle_ms,
    is_active
) VALUES (
    'production',
    'https://api.tattty.com',
    '/api/ai/enhance',
    '/api/ai/ideas',
    30000,
    10,
    50,
    false
)
ON CONFLICT (environment) DO UPDATE SET
    api_base_url = EXCLUDED.api_base_url,
    enhance_endpoint = EXCLUDED.enhance_endpoint,
    ideas_endpoint = EXCLUDED.ideas_endpoint,
    request_timeout_ms = EXCLUDED.request_timeout_ms,
    min_characters = EXCLUDED.min_characters,
    streaming_throttle_ms = EXCLUDED.streaming_throttle_ms,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- SEED DATA: Default English content
-- =============================================================================
INSERT INTO ask_tattty_content (
    language,
    button_text,
    loading_text,
    enhance_button,
    ideas_button,
    revert_button,
    re_enhance_button,
    revert_tooltip,
    re_enhance_tooltip,
    empty_text_error,
    text_too_short_error
) VALUES (
    'en',
    'Ask TaTTTy',
    'Thinking...',
    'Enhance My Text',
    'Give Me Ideas',
    'Back',
    'Redo',
    'Revert to original text',
    'Re-enhance with new result',
    'Write Something First!',
    'Add More Details!'
)
ON CONFLICT (language) DO UPDATE SET
    button_text = EXCLUDED.button_text,
    loading_text = EXCLUDED.loading_text,
    enhance_button = EXCLUDED.enhance_button,
    ideas_button = EXCLUDED.ideas_button,
    revert_button = EXCLUDED.revert_button,
    re_enhance_button = EXCLUDED.re_enhance_button,
    revert_tooltip = EXCLUDED.revert_tooltip,
    re_enhance_tooltip = EXCLUDED.re_enhance_tooltip,
    empty_text_error = EXCLUDED.empty_text_error,
    text_too_short_error = EXCLUDED.text_too_short_error,
    updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- ANALYTICS VIEWS
-- =============================================================================

-- View for most popular action types
CREATE OR REPLACE VIEW vw_ask_tattty_action_stats AS
SELECT 
    action_type,
    COUNT(*) as request_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ask_tattty_requests), 2) as percentage
FROM ask_tattty_requests
GROUP BY action_type
ORDER BY request_count DESC;

-- View for success rate analytics
CREATE OR REPLACE VIEW vw_ask_tattty_success_stats AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE was_successful = true) as successful_requests,
    COUNT(*) FILTER (WHERE was_successful = false) as failed_requests,
    ROUND(COUNT(*) FILTER (WHERE was_successful = true) * 100.0 / COUNT(*), 2) as success_rate_percentage,
    AVG(response_time_ms) FILTER (WHERE was_successful = true) as avg_response_time_ms
FROM ask_tattty_requests;

-- View for hourly activity
CREATE OR REPLACE VIEW vw_ask_tattty_hourly_activity AS
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as request_count,
    COUNT(*) FILTER (WHERE was_successful = true) as successful_count,
    COUNT(*) FILTER (WHERE was_successful = false) as failed_count
FROM ask_tattty_requests
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour DESC;

-- =============================================================================
-- GRANTS (if using separate database users)
-- =============================================================================
-- GRANTS (if using separate database keyholders)
-- GRANT SELECT, INSERT ON ask_tattty_requests TO your_backend_keyholder;
-- GRANT SELECT, UPDATE ON ask_tattty_config TO your_backend_keyholder;
-- GRANT SELECT ON ask_tattty_content TO your_backend_keyholder;
-- GRANT EXECUTE ON FUNCTION log_ask_tattty_request TO your_backend_keyholder;
-- GRANT SELECT ON vw_ask_tattty_action_stats TO your_analytics_keyholder;
-- GRANT SELECT ON vw_ask_tattty_success_stats TO your_analytics_keyholder;
-- GRANT SELECT ON vw_ask_tattty_hourly_activity TO your_analytics_keyholder;

-- =============================================================================
-- SCHEMA VALIDATION
-- =============================================================================
COMMENT ON TABLE ask_tattty_requests IS 'Tracks every Ask TaTTTy API call from button click to result';
COMMENT ON TABLE ask_tattty_config IS 'API configuration per environment (dev/staging/production)';
COMMENT ON TABLE ask_tattty_content IS 'UI labels and error messages (multi-language support)';
COMMENT ON FUNCTION log_ask_tattty_request IS 'Log Ask TaTTTy API call with all details';

-- =============================================================================
-- DEPLOYMENT NOTES
-- =============================================================================
-- 1. Run this SQL in your Neon PostgreSQL database
-- 2. Verify tables: ask_tattty_requests, ask_tattty_config, ask_tattty_content
-- 3. Backend should call log_ask_tattty_request() after each API request
-- 4. Frontend reads from ask_tattty_config and ask_tattty_content tables
-- 5. Dashboard integration queries for ops.tattty.com monitoring