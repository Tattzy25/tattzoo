/**
 * ASK TaTTTy DATA - FAIL LOUD CONFIGURATION
 * All content for the AskTaTTTy AI assistant feature
 * 
 * MIGRATION: Hardcoded values moved to @/config
 * API endpoints now use centralized configuration from @/config/api-endpoints
 * Validation rules now use centralized configuration from @/config/validation-rules
 * 
 * DATABASE INTEGRATION:
 * Replace these label values with database calls:
 * - Labels: SELECT * FROM ask_tattty_content WHERE language = 'en'
 * 
 * Example Supabase integration:
 * const { data, error } = await supabase.from('ask_tattty_content').select('*').eq('language', 'en').single();
 * if (error) throw new Error('CRITICAL: Failed to load Ask TaTTTy content from database');
 * if (!data) throw new Error('CRITICAL: Ask TaTTTy content not found in database');
 */

import { API_CONFIG, getAiEndpoint, TEXT_VALIDATION } from '@/config';

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
 * API Configuration - NOW USES CENTRALIZED CONFIG
 * 
 * MIGRATION COMPLETE: API endpoints now come from @/config/api-endpoints
 * Configuration is environment-aware and fails loudly if misconfigured
 * 
 * To override in production, set environment variable:
 * VITE_API_BASE_URL=https://api.tattzy.com
 */
export const askTaTTTyAPI = {
  // Base URL from centralized config - environment-aware
  baseURL: API_CONFIG.baseURL,
  
  // Backend endpoint for AI enhancement - from centralized config
  enhanceEndpoint: getAiEndpoint('enhance'),
  
  // Backend endpoint for AI ideas generation - from centralized config
  ideasEndpoint: getAiEndpoint('ideas'),
  
  // Request timeout from centralized config
  requestTimeout: API_CONFIG.timeout,
} as const;

/**
 * Error Messages - NOW USES CENTRALIZED VALIDATION
 * 
 * MIGRATION COMPLETE: Error messages now come from @/config/validation-rules
 */
export const askTaTTTyErrors = {
  // Uses centralized validation rules
  emptyText: TEXT_VALIDATION.enhancement.errorMessages.empty,
  // Uses centralized validation rules
  textTooShort: TEXT_VALIDATION.enhancement.errorMessages.tooShort,
} as const;

/**
 * Size Configuration - REQUIRED
 * DATABASE TABLE: ask_tattty_ui_config
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
 * DATABASE TABLE: ask_tattty_ui_config
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
 * Animation Timings - NOW USES CENTRALIZED CONFIG
 * 
 * MIGRATION COMPLETE: Streaming throttle now comes from @/config/validation-rules
 */
export const askTaTTTyTimings = {
  // Uses centralized validation rules
  streamingThrottleMs: TEXT_VALIDATION.enhancement.min, // Matches centralized config
} as const;

/**
 * Validation Rules - NOW USES CENTRALIZED CONFIG
 * 
 * MIGRATION COMPLETE: Validation rules now come from @/config/validation-rules
 * These rules are consistent across frontend and backend
 */
export const askTaTTTyValidation = {
  minCharacters: TEXT_VALIDATION.enhancement.min, // Uses centralized validation
} as const;
