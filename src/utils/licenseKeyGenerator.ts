/**
 * LICENSE KEY GENERATOR
 * Generates unique license keys in format: TATY-XXXX-XXXX-XXXX
 * 
 * NOTE: This is FRONTEND ONLY for demo purposes
 * In production, keys should be generated server-side and validated against a database
 */

/**
 * Generates a random license key
 * Format: TATY-XXXX-XXXX-XXXX (alphanumeric, uppercase, no ambiguous chars like O/0, I/1)
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed O, I, 0, 1 for clarity
  
  const generateSegment = (length: number): string => {
    let segment = '';
    for (let i = 0; i < length; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };

  return `TATY-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}`;
}

/**
 * Validates license key format (frontend validation only)
 */
export function isValidKeyFormat(key: string): boolean {
  const pattern = /^TATY-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(key);
}

/**
 * Formats a key (removes spaces, converts to uppercase, adds hyphens)
 */
export function formatLicenseKey(input: string): string {
  // Remove all non-alphanumeric characters
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // If it starts with TATY, remove it for reformatting
  const withoutPrefix = cleaned.startsWith('TATY') ? cleaned.slice(4) : cleaned;
  
  // Take only first 12 characters
  const trimmed = withoutPrefix.slice(0, 12);
  
  // Add hyphens every 4 characters
  const segments = [];
  for (let i = 0; i < trimmed.length; i += 4) {
    segments.push(trimmed.slice(i, i + 4));
  }
  
  return segments.length > 0 ? `TATY-${segments.join('-')}` : '';
}
