# Configuration Directory

This directory contains all centralized configuration for the TaTTTy application.

## Purpose

Eliminate hardcoded values and silent fallbacks throughout the codebase by:
- Centralizing all default values
- Documenting migration paths to database/CMS
- Making failures loud and visible
- Enabling environment-based configuration

## Files

### `index.ts`
Central export point for all configuration. Import from here:
```typescript
import { DEFAULT_VALUES, API_CONFIG, IMAGE_PATHS, VALIDATION_RULES } from '@/config';
```

### `default-values.ts`
All default values for the application including:
- Tattoo generation defaults (style, color, mood, etc.)
- AI model defaults
- Validation defaults
- UI preferences

**Fail-Loud Features:**
- Logs warning when defaults are used
- Provides `logDefaultUsage()` helper
- Documents database migration path

### `api-endpoints.ts`
All API endpoint configurations:
- AI service endpoints (enhance, ideas, chat)
- Image generation endpoints
- License management endpoints
- Content/data endpoints

**Fail-Loud Features:**
- Throws error if required env vars missing in production
- Warns when using hardcoded fallbacks
- Supports mock mode for offline development

### `image-paths.ts`
All image paths and asset URLs:
- Hero/background images
- Placeholder images
- Brand/logo images
- AR assets

**Fail-Loud Features:**
- Logs warnings for missing images
- Validates image URLs
- Supports CDN configuration

### `validation-rules.ts`
All validation constants and rules:
- Text input validation (prompts, questions)
- Image upload validation
- License key validation
- Email validation
- API request validation
- Rate limiting rules

**Fail-Loud Features:**
- Clear error messages for all validation failures
- Helper functions for common validations
- Consistent rules across frontend and backend

## Environment Variables

### Required in Production
- `VITE_API_BASE_URL`: Backend API URL (REQUIRED in production)

### Optional
- `VITE_BACKEND_PORT`: Backend port (default: 8000)
- `VITE_ENABLE_MOCK_MODE`: Enable mock data (default: false)
- `VITE_CDN_BASE_URL`: CDN base URL for assets
- `VITE_ASSETS_PATH`: Local assets path (default: /images)

## Migration Strategy

### Phase 1: Centralize (CURRENT)
✅ Move all hardcoded values to config files
✅ Document migration paths
✅ Add fail-loud warnings

### Phase 2: Environment Variables
- Add .env file support
- Configure staging/production environments
- Remove hardcoded fallbacks

### Phase 3: Database Migration
- Create database tables for configurable values
- Replace static config with API calls
- Keep config files as fallback structure

### Phase 4: CMS Integration
- Connect to headless CMS for content
- Dynamic configuration updates
- Real-time config changes without deployment

## Usage Examples

### Using Default Values
```typescript
import { DEFAULT_VALUES, logDefaultUsage } from '@/config';

// Get default with automatic logging
const style = userSelection ?? DEFAULT_VALUES.tattoo.style;
// ⚠️ Logs: "DEFAULT VALUE USED: tattoo.style = Traditional"
```

### Using API Endpoints
```typescript
import { getAiEndpoint } from '@/config';

const url = getAiEndpoint('enhance');
// Returns: "http://localhost:8000/api/ai/enhance" (dev)
// Returns: "https://api.tattzy.com/api/ai/enhance" (prod)
```

### Using Image Paths
```typescript
import { HERO_IMAGES, getImageWithFallback } from '@/config';

// Direct path
<img src={HERO_IMAGES.background} alt="Hero" />

// With fallback and logging
const imgSrc = getImageWithFallback(
  userUploadedImage,
  HERO_IMAGES.fallback,
  'hero section'
);
```

### Using Validation
```typescript
import { validateText, validateEmail } from '@/config';

const textResult = validateText(prompt, 'prompt');
if (!textResult.valid) {
  throw new Error(textResult.error);
}

const emailResult = validateEmail(userEmail);
if (!emailResult.valid) {
  throw new Error(emailResult.error);
}
```

## Fail-Loud Philosophy

This configuration system follows a "fail-loud" approach:

1. **No Silent Fallbacks**: When defaults are used, warnings are logged
2. **Clear Error Messages**: All failures show helpful messages
3. **Required vs Optional**: Explicitly mark what's required
4. **Production Safety**: Missing required config throws errors in production
5. **Development Warnings**: Missing optional config logs warnings in dev

## TypeScript Support

All configuration modules export types for TypeScript:
```typescript
import type { TattooStyle, ColorPreference, Mood } from '@/config';
```

## Testing

To test configuration:
```bash
# Development mode (uses defaults)
npm run dev

# Production mode (requires env vars)
npm run build
```

## Notes

- All configuration is immutable (`as const`)
- Helper functions validate configuration at runtime
- Database migration paths documented inline
- Environment-aware (different behavior in dev vs prod)
