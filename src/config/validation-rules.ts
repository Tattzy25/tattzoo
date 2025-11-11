/**
 * VALIDATION RULES CONFIGURATION
 * 
 * All validation constants and rules in one centralized location.
 * 
 * MIGRATION STRATEGY:
 * These rules should eventually come from:
 * - Database for configurable validation rules
 * - Environment variables for deployment-specific limits
 * - API endpoints for dynamic validation
 * 
 * FAIL-LOUD POLICY:
 * - Validation failures should show clear error messages to users
 * - Log all validation failures for monitoring
 * - No silent skips or bypasses
 * 
 * DATABASE MIGRATION:
 * - Table: `validation_rules`
 * - Query: SELECT * FROM validation_rules WHERE is_active = true
 */

/**
 * Text Input Validation Rules
 */
export const TEXT_VALIDATION = {
  prompt: {
    min: 10,
    max: 5000,
    errorMessages: {
      tooShort: 'Write Something First! (minimum 10 characters)',
      tooLong: 'Prompt is too long (maximum 5000 characters)',
      empty: 'Prompt cannot be empty',
    },
  },
  question: {
    min: 50,
    max: 2000,
    errorMessages: {
      tooShort: 'Add More Details! (minimum 50 characters)',
      tooLong: 'Question is too long (maximum 2000 characters)',
      empty: 'Question cannot be empty',
    },
  },
  enhancement: {
    min: 10,
    max: 5000,
    errorMessages: {
      tooShort: 'Add more details for better enhancement (minimum 10 characters)',
      tooLong: 'Text is too long for enhancement (maximum 5000 characters)',
      empty: 'Nothing to enhance',
    },
  },
} as const;

/**
 * Image Upload Validation Rules
 */
export const IMAGE_VALIDATION = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  minWidth: 256,
  minHeight: 256,
  maxWidth: 4096,
  maxHeight: 4096,
  errorMessages: {
    fileTooLarge: 'Image file is too large (maximum 5MB)',
    tooManyFiles: 'Too many files (maximum 5 images)',
    invalidFormat: 'Invalid image format (use PNG, JPEG, or WebP)',
    dimensionsTooSmall: 'Image dimensions too small (minimum 256x256)',
    dimensionsTooLarge: 'Image dimensions too large (maximum 4096x4096)',
    uploadFailed: 'Image upload failed. Please try again.',
  },
} as const;

/**
 * License Key Validation Rules
 */
export const LICENSE_VALIDATION = {
  pattern: /^TZY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  prefix: 'TZY',
  segmentLength: 4,
  errorMessages: {
    invalid: 'Invalid license key format',
    expired: 'License key has expired',
    notFound: 'License key not found',
    inactive: 'License key is inactive',
    quotaExceeded: 'License key quota exceeded',
  },
} as const;

/**
 * Email Validation Rules
 */
export const EMAIL_VALIDATION = {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  maxLength: 254,
  errorMessages: {
    invalid: 'Invalid email address',
    tooLong: 'Email address is too long',
    empty: 'Email address is required',
  },
} as const;

/**
 * API Request Validation Rules
 */
export const API_VALIDATION = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  errorMessages: {
    timeout: 'Request timed out. Please try again.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    unauthorized: 'Unauthorized. Please check your license key.',
    forbidden: 'Access forbidden.',
    notFound: 'Resource not found.',
    validationError: 'Validation error. Please check your input.',
  },
} as const;

/**
 * Rate Limiting Rules
 */
export const RATE_LIMIT = {
  generations: {
    maxPerHour: 3,
    maxPerDay: 10,
    errorMessages: {
      hourlyExceeded: 'Hourly generation limit exceeded (3 per hour)',
      dailyExceeded: 'Daily generation limit exceeded (10 per day)',
    },
  },
  apiCalls: {
    maxPerMinute: 60,
    errorMessages: {
      rateLimitExceeded: 'Too many requests. Please wait a moment.',
    },
  },
} as const;

/**
 * Form Field Validation Rules
 */
export const FORM_VALIDATION = {
  required: {
    style: false, // Optional - has default
    placement: false, // Optional
    size: false, // Optional
    color: false, // Optional - has default
    mood: false, // Optional - has default
    aspectRatio: false, // Optional - has default
    model: false, // Optional - has default
    question1: true, // Required
    question2: true, // Required
    licenseKey: true, // Required
    email: true, // Required
  },
  errorMessages: {
    required: 'This field is required',
    invalid: 'Invalid value',
  },
} as const;

/**
 * Streaming Response Validation
 */
export const STREAMING_VALIDATION = {
  throttleMs: 50, // Throttle UI updates every 50ms
  maxChunkSize: 1024, // 1KB per chunk
  errorMessages: {
    streamInterrupted: 'Stream was interrupted. Please try again.',
    invalidChunk: 'Invalid data received',
  },
} as const;

/**
 * Helper function to validate text input
 */
export function validateText(
  text: string,
  type: keyof typeof TEXT_VALIDATION
): { valid: boolean; error?: string } {
  const rules = TEXT_VALIDATION[type];
  
  if (!text || text.trim().length === 0) {
    return { valid: false, error: rules.errorMessages.empty };
  }
  
  if (text.length < rules.min) {
    return { valid: false, error: rules.errorMessages.tooShort };
  }
  
  if (text.length > rules.max) {
    return { valid: false, error: rules.errorMessages.tooLong };
  }
  
  return { valid: true };
}

/**
 * Helper function to validate image file
 */
export function validateImage(
  file: File
): { valid: boolean; error?: string } {
  if (file.size > IMAGE_VALIDATION.maxFileSize) {
    return { valid: false, error: IMAGE_VALIDATION.errorMessages.fileTooLarge };
  }
  
  if (!IMAGE_VALIDATION.allowedFormats.includes(file.type)) {
    return { valid: false, error: IMAGE_VALIDATION.errorMessages.invalidFormat };
  }
  
  return { valid: true };
}

/**
 * Helper function to validate license key format
 */
export function validateLicenseKey(
  key: string
): { valid: boolean; error?: string } {
  if (!LICENSE_VALIDATION.pattern.test(key)) {
    return { valid: false, error: LICENSE_VALIDATION.errorMessages.invalid };
  }
  
  return { valid: true };
}

/**
 * Helper function to validate email
 */
export function validateEmail(
  email: string
): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: EMAIL_VALIDATION.errorMessages.empty };
  }
  
  if (email.length > EMAIL_VALIDATION.maxLength) {
    return { valid: false, error: EMAIL_VALIDATION.errorMessages.tooLong };
  }
  
  if (!EMAIL_VALIDATION.pattern.test(email)) {
    return { valid: false, error: EMAIL_VALIDATION.errorMessages.invalid };
  }
  
  return { valid: true };
}

/**
 * All validation rules in one object
 */
export const VALIDATION_RULES = {
  text: TEXT_VALIDATION,
  image: IMAGE_VALIDATION,
  license: LICENSE_VALIDATION,
  email: EMAIL_VALIDATION,
  api: API_VALIDATION,
  rateLimit: RATE_LIMIT,
  form: FORM_VALIDATION,
  streaming: STREAMING_VALIDATION,
} as const;

/**
 * Log validation configuration on app startup (development only)
 */
if (import.meta.env.DEV) {
  console.log('✅ Validation Configuration Loaded:');
  console.log('  Min Prompt Length:', TEXT_VALIDATION.prompt.min);
  console.log('  Max Image Size:', `${IMAGE_VALIDATION.maxFileSize / 1024 / 1024}MB`);
  console.log('  API Timeout:', `${API_VALIDATION.timeout / 1000}s`);
}
