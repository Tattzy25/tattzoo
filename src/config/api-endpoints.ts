/**
 * API ENDPOINTS CONFIGURATION
 * 
 * All API endpoint configurations in one centralized location.
 * 
 * MIGRATION STRATEGY:
 * - Development: Use localhost endpoints
 * - Staging: Use environment variables to override
 * - Production: Use environment variables (REQUIRED)
 * 
 * FAIL-LOUD POLICY:
 * - In production, missing API URLs should throw errors
 * - All endpoints must be explicitly configured
 * - No hardcoded URLs in components
 * 
 * ENVIRONMENT VARIABLES:
 * - VITE_API_BASE_URL: Base URL for backend API
 * - VITE_BACKEND_PORT: Backend port (default: 8000)
 * - VITE_ENABLE_MOCK_MODE: Enable mock data generation (default: false)
 */

/**
 * Get environment variable or throw error if required and missing
 */
function getEnvVar(key: string, required: boolean = false, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(
      `CRITICAL CONFIGURATION ERROR: Required environment variable "${key}" is not set. ` +
      `Please check your .env file and ensure this variable is configured.`
    );
  }
  
  if (!value && !defaultValue) {
    console.warn(
      `⚠️ CONFIGURATION WARNING: Environment variable "${key}" is not set. ` +
      `Using hardcoded fallback. Set this variable in your .env file for proper configuration.`
    );
  }
  
  return value || '';
}

/**
 * Determine if we're in production mode
 */
const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Backend API Configuration
 * 
 * In production, VITE_API_BASE_URL MUST be set
 * In development, defaults to localhost:8000
 */
const BACKEND_BASE_URL = IS_PRODUCTION
  ? getEnvVar('VITE_API_BASE_URL', true) // Required in production
  : getEnvVar('VITE_API_BASE_URL', false, 'http://localhost:8000'); // Optional in dev

/**
 * AI Service Endpoints
 * 
 * DATABASE MIGRATION:
 * These endpoint paths should come from database:
 * - Table: `api_endpoints`
 * - Query: SELECT * FROM api_endpoints WHERE service = 'ai' AND is_active = true
 */
export const AI_ENDPOINTS = {
  enhance: '/api/ai/enhance',
  ideas: '/api/ai/ideas',
  chat: '/api/ai/chat',
} as const;

/**
 * Image Generation Endpoints
 * 
 * DATABASE MIGRATION:
 * - Table: `api_endpoints`
 * - Query: SELECT * FROM api_endpoints WHERE service = 'image_generation'
 */
export const IMAGE_ENDPOINTS = {
  generate: '/api/generate/',
  variations: '/api/generate/variations',
  upscale: '/api/generate/upscale',
  edit: '/api/generate/edit',
} as const;

/**
 * License/Key Management Endpoints
 * 
 * DATABASE MIGRATION:
 * - Table: `api_endpoints`
 * - Query: SELECT * FROM api_endpoints WHERE service = 'license'
 */
export const LICENSE_ENDPOINTS = {
  verify: '/api/license/verify',
  usage: '/api/license/usage',
  renew: '/api/license/renew',
} as const;

/**
 * Content/Data Endpoints
 * 
 * These will replace hardcoded data arrays
 * DATABASE MIGRATION:
 * - Table: `api_endpoints`
 * - Query: SELECT * FROM api_endpoints WHERE service = 'content'
 */
export const CONTENT_ENDPOINTS = {
  gallery: '/api/content/gallery',
  styles: '/api/content/styles',
  placements: '/api/content/placements',
  sizes: '/api/content/sizes',
  colors: '/api/content/colors',
  moods: '/api/content/moods',
  aspectRatios: '/api/content/aspect-ratios',
  questions: '/api/content/questions',
} as const;

/**
 * API Configuration Object
 * 
 * Use this for all API calls in the application
 */
export const API_CONFIG = {
  baseURL: BACKEND_BASE_URL,
  endpoints: {
    ai: AI_ENDPOINTS,
    image: IMAGE_ENDPOINTS,
    license: LICENSE_ENDPOINTS,
    content: CONTENT_ENDPOINTS,
  },
  timeout: 30000, // 30 seconds - should match backend
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Helper function to build full API URL
 * 
 * @param endpoint - Endpoint path (e.g., '/api/ai/enhance')
 * @returns Full URL (e.g., 'http://localhost:8000/api/ai/enhance')
 */
export function buildApiUrl(endpoint: string): string {
  const base = API_CONFIG.baseURL.endsWith('/')
    ? API_CONFIG.baseURL.slice(0, -1)
    : API_CONFIG.baseURL;
  
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${base}${path}`;
}

/**
 * Helper function to get full URL for AI endpoints
 */
export function getAiEndpoint(endpoint: keyof typeof AI_ENDPOINTS): string {
  return buildApiUrl(AI_ENDPOINTS[endpoint]);
}

/**
 * Helper function to get full URL for image endpoints
 */
export function getImageEndpoint(endpoint: keyof typeof IMAGE_ENDPOINTS): string {
  return buildApiUrl(IMAGE_ENDPOINTS[endpoint]);
}

/**
 * Helper function to get full URL for license endpoints
 */
export function getLicenseEndpoint(endpoint: keyof typeof LICENSE_ENDPOINTS): string {
  return buildApiUrl(LICENSE_ENDPOINTS[endpoint]);
}

/**
 * Helper function to get full URL for content endpoints
 */
export function getContentEndpoint(endpoint: keyof typeof CONTENT_ENDPOINTS): string {
  return buildApiUrl(CONTENT_ENDPOINTS[endpoint]);
}

/**
 * Mock Mode Configuration
 * 
 * Enable mock mode in development for offline work
 */
export const MOCK_MODE_ENABLED = getEnvVar('VITE_ENABLE_MOCK_MODE', false, 'false') === 'true';

/**
 * Log API configuration on app startup
 */
if (!IS_PRODUCTION) {
  console.log('📡 API Configuration Loaded:');
  console.log('  Base URL:', API_CONFIG.baseURL);
  console.log('  Mock Mode:', MOCK_MODE_ENABLED ? 'ENABLED' : 'DISABLED');
  console.log('  Environment:', IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT');
}
