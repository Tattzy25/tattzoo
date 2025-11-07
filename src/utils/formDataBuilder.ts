/**
 * FormData Builder Utility
 * Converts generation payload with File objects to FormData for API submission
 * 
 * IMPORTANT: Images are stored as File[] throughout the app and sent as actual files,
 * NOT converted to base64. This is the correct way to send files to backends.
 */

interface GenerationPayload {
  prompt?: string;
  model?: string;
  style?: string;
  placement?: string | null;
  size?: string | null;
  color?: string;
  mood?: string;
  images?: File[];
  generatorType?: string;
  [key: string]: any;
}

/**
 * Convert generation parameters to FormData for multipart/form-data submission
 * This ensures images are sent as actual files, NOT base64 strings
 * 
 * @param payload - Generation parameters including File objects
 * @returns FormData ready for fetch/axios POST request
 * 
 * @example
 * const formData = buildFormData(generationParams);
 * fetch('/api/generate', {
 *   method: 'POST',
 *   body: formData
 * });
 */
export function buildFormData(payload: GenerationPayload): FormData {
  const formData = new FormData();
  
  // Add all non-file fields as JSON or strings
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'images') {
      // Handle images separately below
      return;
    }
    
    if (value !== null && value !== undefined) {
      // Convert objects/arrays to JSON strings
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  // Add image files (NOT base64)
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file, index) => {
      // Append each file with indexed name: images[0], images[1], etc.
      formData.append(`images[${index}]`, file, file.name);
    });
  }
  
  return formData;
}

/**
 * Example usage when you actually connect to a real backend:
 * 
 * // In handleGenerate or submission service:
 * const formData = buildFormData(generationParams);
 * 
 * const response = await fetch('/api/generate', {
 *   method: 'POST',
 *   body: formData,
 *   // DO NOT set Content-Type header - browser sets it automatically with boundary
 * });
 */
