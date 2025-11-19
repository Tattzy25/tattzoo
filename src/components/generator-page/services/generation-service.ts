import { GenerationParams } from '../types';
import { createGenerationFormData, logGenerationParams } from '../utilities';

export class GenerationService {
  static async generateTattoo(params: GenerationParams): Promise<string> {
    logGenerationParams(params);

    try {
      const formData = createGenerationFormData(params);
      const endpoint = (import.meta as any)?.env?.VITE_GENERATE_ENDPOINT as string | undefined;
      if (!endpoint) {
        throw new Error('Generate endpoint not configured (VITE_GENERATE_ENDPOINT)');
      }
      const url: string = endpoint;
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

      let imageUrl: string | null = null;
      try {
        const result = await response.json();
        imageUrl = result?.image_url || result?.imageUrl || result?.url || null;
      } catch {
        const text = await response.text();
        const trimmed = (text || '').trim();
        if (trimmed.startsWith('http')) imageUrl = trimmed;
      }

      if (!imageUrl) {
        throw new Error('Backend error: Missing image URL in response');
      }
      return imageUrl;
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      throw error;
    }
  }
}