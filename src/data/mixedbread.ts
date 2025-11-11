/**
 * Mixedbread search client
 * Frontend -> Backend proxy: POST /mixedbread/search
 */
// Independent Mixedbread config (do NOT depend on AskTaTTTy)
// Frontend expects VITE_BACKEND_URL to point at FastAPI base, e.g. http://localhost:8000
const BACKEND_BASE_URL = (import.meta as any)?.env?.VITE_BACKEND_URL as string | undefined;

export type MixedbreadFilterOp = 'eq' | 'in' | 'gte' | 'lte' | 'like';

export interface MixedbreadFilterExpr {
  key: string;
  operator: MixedbreadFilterOp;
  value: unknown;
}

export interface MixedbreadFilters {
  all?: MixedbreadFilterExpr[];
  any?: MixedbreadFilterExpr[];
  none?: MixedbreadFilterExpr[];
}

export interface MixedbreadSearchRequest {
  query: string;
  top_k?: number;
  filters?: MixedbreadFilters;
}

export interface MixedbreadChunk {
  id?: string;
  type?: string;
  text?: string;
  image_url?: string;
  score?: number;
  metadata?: Record<string, any>;
  // Some SDKs return file info nested
  file_id?: string;
  file?: { id?: string; external_id?: string; url?: string };
  url?: string;
}

export interface MixedbreadSearchResponse {
  results?: MixedbreadChunk[];
  // Some APIs return top-level `chunks`
  chunks?: MixedbreadChunk[];
  [k: string]: any;
}

export type GalleryProduct = {
  id: string;
  image: string;
  name: string;
  brand?: string;
  badge?: string | null;
  price?: string | number;
  metadata?: Record<string, any>;
};

export function buildTattooFilters(sel: {
  style?: string[];
  color?: string[];
  vibe?: string[];
  size?: string[];
  gender?: string[];
  top10?: string[];
}) {
  const all: MixedbreadFilterExpr[] = [];

  if (sel.style && sel.style.length)
    all.push({ key: 'style', operator: 'in', value: sel.style.map((s) => s.toLowerCase()) });
  if (sel.color && sel.color.length)
    all.push({ key: 'color_mode', operator: 'in', value: sel.color.map((c) => c.toLowerCase()) });
  if (sel.vibe && sel.vibe.length)
    all.push({ key: 'mood', operator: 'in', value: sel.vibe.map((v) => v.toLowerCase()) });
  if (sel.size && sel.size.length)
    all.push({ key: 'size_category', operator: 'in', value: sel.size.map((v) => v.toLowerCase()) });

  // Always exclude deprecated
  const none: MixedbreadFilterExpr[] = [{ key: 'deprecated', operator: 'eq', value: true }];

  return { all, none } as MixedbreadFilters;
}

export async function searchMixedbread(req: MixedbreadSearchRequest, signal?: AbortSignal): Promise<MixedbreadChunk[]> {
  if (!BACKEND_BASE_URL) {
    throw new Error('VITE_BACKEND_URL is not set. Please define it in your .env and point it to your FastAPI server (e.g., http://localhost:8000).');
  }
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/mixedbread/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Mixedbread search failed: ${res.status} ${text}`);
    }
    const data: MixedbreadSearchResponse = await res.json();
    const items = data.results || data.chunks || [];
    return items;
  } catch (err) {
    // No fallbacks: surface the error to the UI
    throw err;
  }
}

export function chunkToDesignLike(chunk: MixedbreadChunk) {
  const id = chunk.id || chunk.file_id || chunk.file?.id || crypto.randomUUID();
  const img =
    chunk.image_url ||
    chunk.url ||
    (chunk.metadata && (chunk.metadata.image_url || chunk.metadata.preview_url)) ||
    chunk.file?.url ||
    undefined;
  const title =
    (chunk.metadata && (chunk.metadata.prompt_summary || chunk.metadata.title)) ||
    chunk.text ||
    'Tattoo design';
  if (!img) return null;
  return { id, title, image: img } as { id: string; title: string; image: string };
}

export function chunkToProduct(chunk: MixedbreadChunk): GalleryProduct | null {
  const id = chunk.id || chunk.file_id || chunk.file?.id || crypto.randomUUID();
  const image =
    chunk.image_url ||
    chunk.url ||
    (chunk.metadata && (chunk.metadata.image_url || chunk.metadata.preview_url)) ||
    chunk.file?.url ||
    undefined;
  if (!image) return null;
  const name =
    (chunk.metadata && (chunk.metadata.title || chunk.metadata.prompt_summary)) ||
    chunk.text ||
    'Tattoo design';
  const badge = (chunk.metadata && (chunk.metadata.badge || (chunk.metadata.popular ? 'Popular' : undefined))) || null;
  return {
    id: String(id),
    image,
    name,
    brand: (chunk.metadata && chunk.metadata.brand) || 'Tattty',
    badge,
    metadata: chunk.metadata || {},
  };
}
