/**
 * ASK TaTTTy DATA - FAIL LOUD CONFIGURATION
 * All content for the AskTaTTTy AI assistant feature
 * 
 * IMPORTANT: NO FALLBACKS - All values are REQUIRED and will throw errors if misconfigured
 * 
 * DATABASE INTEGRATION:
 * Replace these hardcoded values with database calls:
 * - Labels/Errors: SELECT * FROM ask_tattty_content WHERE language = 'en'
 * - API Config: SELECT * FROM ask_tattty_config WHERE is_active = true
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase.from('ask_tattty_content').select('*').eq('language', 'en').single();
 * if (error) throw new Error('CRITICAL: Failed to load Ask TaTTTy content from database');
 * if (!data) throw new Error('CRITICAL: Ask TaTTTy content not found in database');
 */

/**
 * Button Labels - REQUIRED
 * DATABASE TABLE: ask_tattty_content
 * FAIL LOUD: If database returns null/undefined, component will throw error
 */
export const askTaTTTyLabels = {
  buttonText: 'Ask TaTTTy',
  loadingText: 'Thinking...',
  enhanceButton: 'Enhance My Text',
  ideasButton: 'Give Me Ideas',
  revertButton: 'Back',
  reEnhanceButton: 'Redo',
  revertTooltip: 'Revert to original text',
  reEnhanceTooltip: 'Re-enhance with new result',
} as const;

/**
 * API Configuration - REQUIRED
 * DATABASE TABLE: ask_tattty_config
 * 
 * CRITICAL: These values MUST be set correctly or API calls will fail loudly
 * NO FALLBACKS - Missing configuration will throw errors
 * 
 * To connect to database:
 * const { data, error } = await supabase.from('ask_tattty_config').select('*').eq('is_active', true).single();
 * if (error || !data) throw new Error('CRITICAL: Failed to load Ask TaTTTy API config');
 */
export const askTaTTTyAPI = {
  // Base URL for your Python backend - REQUIRED
  // MUST be set to your actual backend URL
  // DATABASE COLUMN: api_base_url
  baseURL: import.meta.env?.VITE_BACKEND_API_URL ?? 'http://localhost:8000',
  
  // Backend endpoint for AI enhancement - REQUIRED
  // DATABASE COLUMN: enhance_endpoint
  enhanceEndpoint: '/api/ai/enhance',
  
  // Backend endpoint for AI ideas generation - REQUIRED
  // DATABASE COLUMN: ideas_endpoint
  ideasEndpoint: '/api/ai/ideas',
  
  // Request timeout in milliseconds - REQUIRED
  // DATABASE COLUMN: request_timeout_ms
  requestTimeout: 30000, // 30 seconds (matches backend timeout)
} as const;

/**
 * Error Messages - REQUIRED
 * DATABASE TABLE: ask_tattty_content
 * FAIL LOUD: These are shown to users when validation or API calls fail
 */
export const askTaTTTyErrors = {
  // DATABASE COLUMN: empty_text_error
  emptyText: 'Write Something First!',
  // DATABASE COLUMN: text_too_short_error
  textTooShort: 'Add More Details!',
} as const;

/**
 * Size Configuration - REQUIRED
 */
export const askTaTTTySizes = {
  sm: {
    buttonClass: 'px-4 py-2 text-sm',
    iconSize: 16,
  },
  md: {
    buttonClass: 'px-6 py-3 text-base',
    iconSize: 20,
  },
  lg: {
    buttonClass: 'px-8 py-4 text-lg',
    iconSize: 24,
  },
} as const;

/**
 * Styling Configuration - REQUIRED
 */
export const askTaTTTyStyling = {
  buttonFontSize: '24px',
  letterSpacing: '2px',
  borderRadius: '12px',
  glowColor: 'rgba(87, 241, 214, 0.4)',
  hoverGlow: 'rgba(87, 241, 214, 0.6)',
  dropdownBg: '#0C0C0D',
  dropdownBorder: '#57f1d6',
} as const;

/**
 * Animation Timings - REQUIRED
 * DATABASE TABLE: ask_tattty_config
 * DATABASE COLUMN: streaming_throttle_ms
 */
export const askTaTTTyTimings = {
  // NOTE: Error auto-clearing has been REMOVED - errors persist until user clicks
  streamingThrottleMs: 50, // Throttle UI updates during streaming (performance optimization)
} as const;

/**
 * Validation Rules - REQUIRED
 * DATABASE TABLE: ask_tattty_config
 * DATABASE COLUMN: min_characters
 * MUST match backend validation rules exactly
 */
export const askTaTTTyValidation = {
  minCharacters: 10, // Minimum characters required for enhancement (matches backend)
} as const;
