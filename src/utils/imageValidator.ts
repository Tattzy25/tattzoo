/**
 * IMAGE VALIDATION UTILITIES
 * Ensures all tattoo images meet transparency requirements
 * 
 * CRITICAL: All tattoo designs MUST have transparent backgrounds (PNG with alpha channel)
 */

/**
 * Check if an image URL points to a PNG file
 */
export function isPngUrl(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return lowercaseUrl.endsWith('.png') || lowercaseUrl.includes('.png?');
}

/**
 * Validate that an image has a transparent background by checking the canvas
 * Returns true if image has transparency, false otherwise
 * 
 * Note: This requires the image to be loaded and CORS-enabled
 */
export async function validateImageTransparency(imageUrl: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // First check if it's a PNG
  if (!isPngUrl(imageUrl)) {
    return {
      isValid: false,
      error: 'Image must be PNG format for transparency support',
    };
  }

  try {
    // Create image element
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS
    
    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Create canvas to check pixels
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return {
        isValid: false,
        error: 'Could not create canvas context',
      };
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Sample pixels to check for transparency
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check if any pixel has alpha < 255 (has some transparency)
    let hasTransparency = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        hasTransparency = true;
        break;
      }
    }

    if (!hasTransparency) {
      return {
        isValid: false,
        error: 'Image does not contain transparent pixels. Tattoo designs must have transparent backgrounds.',
      };
    }

    return { isValid: true };

  } catch (error) {
    return {
      isValid: false,
      error: `Failed to validate image: ${(error as Error).message}`,
    };
  }
}

/**
 * Display requirements for tattoo images
 */
export const TATTOO_IMAGE_REQUIREMENTS = {
  format: 'PNG',
  background: 'Transparent (alpha channel)',
  minWidth: 512,
  minHeight: 512,
  maxWidth: 2048,
  maxHeight: 2048,
  aspectRatios: ['1:1', '4:3', '16:9'],
} as const;

/**
 * Get a user-friendly error message for image validation
 */
export function getImageValidationMessage(type: 'upload' | 'generation'): string {
  if (type === 'upload') {
    return `Tattoo images must be PNG format with a transparent background. Please ensure your image meets these requirements.`;
  }
  
  return `Generated tattoo must be PNG format with transparent background. Please contact support if this error persists.`;
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(imageUrl: string): Promise<{
  isValid: boolean;
  width?: number;
  height?: number;
  error?: string;
}> {
  try {
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const { minWidth, minHeight, maxWidth, maxHeight } = TATTOO_IMAGE_REQUIREMENTS;

    if (img.width < minWidth || img.height < minHeight) {
      return {
        isValid: false,
        width: img.width,
        height: img.height,
        error: `Image too small. Minimum dimensions: ${minWidth}x${minHeight}px`,
      };
    }

    if (img.width > maxWidth || img.height > maxHeight) {
      return {
        isValid: false,
        width: img.width,
        height: img.height,
        error: `Image too large. Maximum dimensions: ${maxWidth}x${maxHeight}px`,
      };
    }

    return {
      isValid: true,
      width: img.width,
      height: img.height,
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Failed to load image: ${(error as Error).message}`,
    };
  }
}
