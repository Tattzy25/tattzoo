import { GenerationParams } from '../types';
import { createGenerationFormData, logGenerationParams } from '../utilities';

export class GenerationService {
  static async generateTattoo(params: GenerationParams): Promise<string> {
    logGenerationParams(params);

    try {
      const formData = createGenerationFormData(params);

      const response = await fetch('/api/generate/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image generation failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.image_url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      throw error;
    }
  }
}