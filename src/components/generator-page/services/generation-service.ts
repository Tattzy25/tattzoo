import { GenerationParams } from '../types';
import { logGenerationParams } from '../utilities';
import { McpHttpClient } from '../../../services/mcpClient';

export class GenerationService {
  private static client: McpHttpClient | null = null;

  static async generateTattoo(
    params: GenerationParams,
    onProgress?: (message: string, progress: number) => void
  ): Promise<any> {
    logGenerationParams(params);

    const endpoint = ((import.meta as any)?.env?.VITE_MCP_ENDPOINT as string | undefined)
      || 'https://tattzy-mcp.up.railway.app/mcp';
    if (!this.client) {
      this.client = new McpHttpClient(endpoint);
      await this.client.initialize();
    }

    const questions = `${(params.question1 || '').trim()}\n\n${(params.question2 || '').trim()}`.trim();
    const args = {
      questions,
      style: params.tattoo_style,
      color: params.color_preference,
      mood: params.mood,
      placement: params.placement,
      size: params.size,
      aspect_ratio: params.aspect_ratio,
      model: params.model,
    };

    try {
      const result = await this.client.callTool('groq_to_stability_chain', args, onProgress);
      const url = result?.image_url || result?.url || result?.data_url || null;
      if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:'))) return result;
      throw new Error('Generation result missing image url');
    } catch (e: any) {
      const msg = e?.message || 'Generation failed';
      throw new Error(msg);
    }
  }

  static async generateTattooDirectStability(
    params: GenerationParams,
    onProgress?: (message: string, progress: number) => void
  ): Promise<any> {
    logGenerationParams(params);
    const endpoint = ((import.meta as any)?.env?.VITE_MCP_ENDPOINT as string | undefined)
      || 'https://tattzy-mcp.up.railway.app/mcp';
    if (!this.client) {
      this.client = new McpHttpClient(endpoint);
      await this.client.initialize();
    }
    const prompt = `${(params.question1 || '').trim()}\n\n${(params.question2 || '').trim()}`.trim();
    const args = { prompt, output_format: 'png' };
    try {
      const result = await this.client.callTool('stability_sd35_generate', args, onProgress);
      const url = result?.image_url || result?.url || result?.data_url || null;
      if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:'))) return result;
      throw new Error('Generation result missing image url');
    } catch (e: any) {
      const msg = e?.message || 'Generation failed';
      throw new Error(msg);
    }
  }
}