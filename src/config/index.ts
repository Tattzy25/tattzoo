/**
 * CONFIGURATION MODULE - CENTRALIZED EXPORTS
 * 
 * All application configuration in one place.
 * Import from here instead of individual files for consistency.
 * 
 * USAGE:
 * import { DEFAULT_VALUES, API_CONFIG, IMAGE_PATHS, VALIDATION_RULES } from '@/config';
 * 
 * MIGRATION NOTES:
 * - All hardcoded values have been moved to this configuration module
 * - Default values are clearly documented and logged when used
 * - API endpoints are centralized and environment-aware
 * - Image paths support CDN and local assets
 * - Validation rules are consistent across the app
 * 
 * FAIL-LOUD PHILOSOPHY:
 * - Missing required configuration throws errors
 * - Using defaults logs warnings
 * - All fallbacks are explicit and monitored
 */

// Export all default values
export {
  DEFAULT_VALUES,
  DEFAULT_TATTOO_VALUES,
  DEFAULT_AI_MODEL_VALUES,
  DEFAULT_VALIDATION_VALUES,
  DEFAULT_UI_VALUES,
  logDefaultUsage,
  getDefaultValue,
  type TattooStyle,
  type ColorPreference,
  type Mood,
  type AspectRatio,
  type ModelType,
} from './default-values';

// Export all API configurations
export {
  API_CONFIG,
  AI_ENDPOINTS,
  IMAGE_ENDPOINTS,
  LICENSE_ENDPOINTS,
  CONTENT_ENDPOINTS,
  MOCK_MODE_ENABLED,
  buildApiUrl,
  getAiEndpoint,
  getImageEndpoint,
  getLicenseEndpoint,
  getContentEndpoint,
} from './api-endpoints';

// Export all image paths
export {
  IMAGE_PATHS,
  HERO_IMAGES,
  PLACEHOLDER_IMAGES,
  BRAND_IMAGES,
  AR_IMAGES,
  GALLERY_IMAGE_REQUIREMENTS,
  validateImageUrl,
  getImageWithFallback,
  isPlaceholderImage,
  type ImageCategory,
} from './image-paths';

// Export all validation rules
export {
  VALIDATION_RULES,
  TEXT_VALIDATION,
  IMAGE_VALIDATION,
  LICENSE_VALIDATION,
  EMAIL_VALIDATION,
  API_VALIDATION,
  RATE_LIMIT,
  FORM_VALIDATION,
  STREAMING_VALIDATION,
  validateText,
  validateImage,
  validateLicenseKey,
  validateEmail,
} from './validation-rules';

/**
 * Log configuration status on app initialization
 */
if (import.meta.env.DEV) {
  console.log('⚙️ Configuration Module Loaded');
  console.log('  📁 Modules: default-values, api-endpoints, image-paths, validation-rules');
  console.log('  🔧 Environment:', import.meta.env.MODE);
  console.log('  🚨 Fail-Loud Mode: ENABLED');
}
