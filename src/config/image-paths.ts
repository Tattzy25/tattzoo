/**
 * IMAGE PATHS CONFIGURATION
 * 
 * All image paths and asset URLs in one centralized location.
 * 
 * MIGRATION STRATEGY:
 * - Development: Use local assets from /public or external CDN
 * - Production: Use CDN or Vercel Blob storage
 * 
 * FAIL-LOUD POLICY:
 * - Missing images should show broken image icon with error message
 * - Log warnings for missing assets
 * - No silent fallbacks to empty strings
 * 
 * ENVIRONMENT VARIABLES:
 * - VITE_CDN_BASE_URL: Base URL for CDN assets
 * - VITE_ASSETS_PATH: Path to assets folder (default: /images)
 */

/**
 * Get environment variable for asset configuration
 */
function getAssetEnvVar(key: string, defaultValue: string): string {
  const value = import.meta.env[key];
  
  if (!value) {
    console.warn(
      `⚠️ ASSET CONFIGURATION: Environment variable "${key}" not set. ` +
      `Using default: "${defaultValue}". Set this in .env for custom configuration.`
    );
    return defaultValue;
  }
  
  return value;
}

/**
 * Base paths for different asset types
 */
const ASSETS_BASE_PATH = getAssetEnvVar('VITE_ASSETS_PATH', '/images');
const CDN_BASE_URL = getAssetEnvVar('VITE_CDN_BASE_URL', '');

/**
 * Helper to build asset URL
 * 
 * If CDN is configured, use it. Otherwise, use local path.
 */
function buildAssetUrl(path: string): string {
  // If path is already a full URL (starts with http:// or https://), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If CDN is configured, use it
  if (CDN_BASE_URL) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanCdn = CDN_BASE_URL.endsWith('/') ? CDN_BASE_URL.slice(0, -1) : CDN_BASE_URL;
    return `${cleanCdn}/${cleanPath}`;
  }
  
  // Otherwise, use local path
  const cleanBasePath = ASSETS_BASE_PATH.endsWith('/') ? ASSETS_BASE_PATH.slice(0, -1) : ASSETS_BASE_PATH;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBasePath}${cleanPath}`;
}

/**
 * Hero/Background Images
 * 
 * DATABASE MIGRATION:
 * - Table: `ui_assets`
 * - Query: SELECT * FROM ui_assets WHERE category = 'hero_images'
 */
export const HERO_IMAGES = {
  background: buildAssetUrl('hero-background.jpg'),
  fallback: buildAssetUrl('hero-fallback.jpg'),
} as const;

/**
 * Placeholder Images
 * 
 * Used when real images are not available
 * 
 * DATABASE MIGRATION:
 * - Table: `ui_assets`
 * - Query: SELECT * FROM ui_assets WHERE category = 'placeholders'
 */
export const PLACEHOLDER_IMAGES = {
  tattoo: buildAssetUrl('placeholder-tattoo.png'),
  avatar: buildAssetUrl('placeholder-avatar.png'),
  gallery: buildAssetUrl('placeholder-gallery.png'),
  loading: buildAssetUrl('loading-spinner.gif'),
} as const;

/**
 * Icon/Logo Images
 * 
 * DATABASE MIGRATION:
 * - Table: `ui_assets`
 * - Query: SELECT * FROM ui_assets WHERE category = 'branding'
 */
export const BRAND_IMAGES = {
  logo: buildAssetUrl('logo.svg'),
  logoLight: buildAssetUrl('logo-light.svg'),
  logoDark: buildAssetUrl('logo-dark.svg'),
  favicon: buildAssetUrl('favicon.ico'),
} as const;

/**
 * AR/Try-On Related Images
 * 
 * DATABASE MIGRATION:
 * - Table: `ui_assets`
 * - Query: SELECT * FROM ui_assets WHERE category = 'ar_assets'
 */
export const AR_IMAGES = {
  bodyModelPlaceholder: buildAssetUrl('body-model-placeholder.png'),
  cameraPermissionIcon: buildAssetUrl('camera-permission.svg'),
} as const;

/**
 * Gallery Images
 * 
 * IMPORTANT: Gallery images should come from database/CMS
 * This is a temporary structure for migration
 * 
 * DATABASE MIGRATION:
 * - Table: `gallery_designs`
 * - Query: SELECT id, title, image_url FROM gallery_designs WHERE is_active = true
 * 
 * NOTE: All gallery images MUST have transparent backgrounds (PNG with alpha)
 */
export const GALLERY_IMAGE_REQUIREMENTS = {
  format: 'PNG with transparent background (alpha channel)',
  minWidth: 512,
  minHeight: 512,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  requiredTransparency: true,
} as const;

/**
 * Image validation helper
 * 
 * Validates that an image URL/path exists and is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`❌ IMAGE VALIDATION FAILED: ${url}`, error);
    return false;
  }
}

/**
 * Helper to get image path with fallback
 * 
 * FAIL-LOUD: Logs warning when fallback is used
 */
export function getImageWithFallback(
  imagePath: string | undefined | null,
  fallbackPath: string,
  context?: string
): string {
  if (!imagePath) {
    const message = context
      ? `⚠️ IMAGE PATH MISSING: Using fallback for ${context}`
      : `⚠️ IMAGE PATH MISSING: Using fallback image`;
    
    console.warn(message, {
      requestedPath: imagePath,
      fallbackPath,
    });
    
    return fallbackPath;
  }
  
  return buildAssetUrl(imagePath);
}

/**
 * All image paths in one object
 */
export const IMAGE_PATHS = {
  hero: HERO_IMAGES,
  placeholder: PLACEHOLDER_IMAGES,
  brand: BRAND_IMAGES,
  ar: AR_IMAGES,
} as const;

/**
 * Log configuration on app startup (development only)
 */
if (import.meta.env.DEV) {
  console.log('🖼️ Image Configuration Loaded:');
  console.log('  Assets Base Path:', ASSETS_BASE_PATH);
  console.log('  CDN Base URL:', CDN_BASE_URL || 'Not configured (using local paths)');
  console.log('  Sample Hero Image:', HERO_IMAGES.background);
}

/**
 * Export helper to check if an image path is a placeholder
 */
export function isPlaceholderImage(imagePath: string): boolean {
  return Object.values(PLACEHOLDER_IMAGES).includes(imagePath);
}

/**
 * Type exports
 */
export type ImageCategory = 'hero' | 'placeholder' | 'brand' | 'ar';
