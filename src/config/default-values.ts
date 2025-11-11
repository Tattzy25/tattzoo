/**
 * DEFAULT VALUES CONFIGURATION
 * 
 * All default values for the application in one centralized location.
 * 
 * MIGRATION STRATEGY:
 * These values should eventually come from:
 * 1. Database/CMS for user-configurable defaults
 * 2. Environment variables for deployment-specific settings
 * 3. API endpoints for dynamic configuration
 * 
 * FAIL-LOUD POLICY:
 * When these defaults are used, the system logs a WARNING.
 * In production, missing required values should throw errors instead of using defaults.
 * 
 * USAGE:
 * import { DEFAULT_VALUES } from '@/config/default-values';
 * const style = userSelection ?? DEFAULT_VALUES.tattoo.style; // Log warning when default used
 */

/**
 * Tattoo Generation Defaults
 * 
 * DATABASE MIGRATION:
 * - Table: `default_settings`
 * - Query: SELECT * FROM default_settings WHERE category = 'tattoo_generation'
 */
export const DEFAULT_TATTOO_VALUES = {
  style: 'Traditional',
  colorPreference: 'Black & Grey',
  mood: 'happy',
  aspectRatio: '1:1',
  model: 'sd3.5-large',
  placement: 'forearm',
  size: 'medium',
} as const;

/**
 * AI Model Defaults
 * 
 * DATABASE MIGRATION:
 * - Table: `ai_model_config`
 * - Query: SELECT * FROM ai_model_config WHERE is_default = true
 */
export const DEFAULT_AI_MODEL_VALUES = {
  imageGeneration: 'sd3.5-large' as const,
  textEnhancement: 'gpt-4' as const,
  fallbackBehavior: 'throw-error' as const, // 'throw-error' | 'use-default' | 'prompt-user'
} as const;

/**
 * Validation Defaults
 * 
 * DATABASE MIGRATION:
 * - Table: `validation_rules`
 * - Query: SELECT * FROM validation_rules WHERE is_active = true
 */
export const DEFAULT_VALIDATION_VALUES = {
  minPromptLength: 10,
  maxPromptLength: 5000,
  minQuestionLength: 50,
  maxQuestionLength: 2000,
  requestTimeoutMs: 30000,
  streamingThrottleMs: 50,
} as const;

/**
 * UI Display Defaults
 * 
 * DATABASE MIGRATION:
 * - Table: `ui_preferences`
 * - Query: SELECT * FROM ui_preferences WHERE scope = 'global'
 */
export const DEFAULT_UI_VALUES = {
  theme: 'dark' as const,
  animationSpeed: 'normal' as const,
  galleryItemsPerPage: 30,
  maxImageUploads: 5,
} as const;

/**
 * All default values in one object for easy access
 */
export const DEFAULT_VALUES = {
  tattoo: DEFAULT_TATTOO_VALUES,
  aiModel: DEFAULT_AI_MODEL_VALUES,
  validation: DEFAULT_VALIDATION_VALUES,
  ui: DEFAULT_UI_VALUES,
} as const;

/**
 * Helper function to log when defaults are used
 * This helps identify where fallbacks are happening in production
 */
export function logDefaultUsage(
  category: keyof typeof DEFAULT_VALUES,
  key: string,
  value: any,
  context?: string
): void {
  const message = context
    ? `⚠️ DEFAULT VALUE USED: ${category}.${key} = "${value}" (Context: ${context})`
    : `⚠️ DEFAULT VALUE USED: ${category}.${key} = "${value}"`;
  
  console.warn(message);
  
  // In production, you might want to send this to your analytics/monitoring service
  // Example: trackEvent('default_value_used', { category, key, value, context });
}

/**
 * Helper function to get a default value with automatic logging
 */
export function getDefaultValue<T>(
  category: keyof typeof DEFAULT_VALUES,
  key: string,
  context?: string
): T {
  const categoryObj = DEFAULT_VALUES[category] as Record<string, any>;
  const value = categoryObj[key];
  
  if (value === undefined) {
    throw new Error(
      `DEFAULT VALUE NOT FOUND: ${category}.${key}. ` +
      `This indicates a configuration error. Please check your default-values.ts file.`
    );
  }
  
  logDefaultUsage(category, key, value, context);
  return value as T;
}

/**
 * Type exports for TypeScript support
 */
export type TattooStyle = typeof DEFAULT_TATTOO_VALUES.style;
export type ColorPreference = typeof DEFAULT_TATTOO_VALUES.colorPreference;
export type Mood = typeof DEFAULT_TATTOO_VALUES.mood;
export type AspectRatio = typeof DEFAULT_TATTOO_VALUES.aspectRatio;
export type ModelType = typeof DEFAULT_TATTOO_VALUES.model;
