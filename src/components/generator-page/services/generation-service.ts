import { GenerationParams } from '../types';
import { createGenerationFormData, logGenerationParams } from '../utilities';

export class GenerationService {
  static async generateTattoo(params: GenerationParams): Promise<string> {
    logGenerationParams(params);

    try {
      const formData = createGenerationFormData(params);
      const API_BASE = (import.meta as any)?.env?.VITE_BACKEND_API_URL || '';
      if (!API_BASE) {
        throw new Error('Backend base URL not configured');
      }
      let url: string;
      try {
        url = new URL('/api/generate/', API_BASE).toString();
      } catch {
        throw new Error('Invalid backend URL configuration');
      }
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let msg = `Image generation failed: ${response.status}`;
        try {
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const errorJson = await response.json();
            if (errorJson?.error) msg = errorJson.error;
          } else {
            const errorText = await response.text();
            if (errorText) msg = `${msg} - ${errorText}`;
          }
        } catch {}
        throw new Error(msg);
      }

      const result = await response.json();
      if (!result || !result.image_url) {
        throw new Error('Backend error: Missing image_url in response');
      }
      return result.image_url;
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      throw error;
    }
  }
}