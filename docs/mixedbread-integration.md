# Mixedbread Integration (Tattty)

This document describes how Tattty uses Mixedbread Search for tattoo assets.

## Overview

Mixedbread provides multimodal semantic search over uploaded files (images, text, etc.). We ingest tattoo PNGs with transparent backgrounds and attach rich metadata so the frontend can filter by style, color, mood, placement, size, popularity, etc.

## Environment Variables

Add these to `.env.local` (already supported in `settings.py`):

```bash
MIXEDBREAD_API_KEY=sk-...
MIXEDBREAD_TATTOO_STORE_ID=tattoo-gallery
MIXEDBREAD_TIMEOUT_MS=15000
```

## Metadata Schema (Example)

```json
{
  "style": "traditional",
  "color_mode": "black & grey",
  "mood": "resilient",
  "placement": ["forearm", "arm"],
  "size_category": "medium",
  "aspect_ratio": "16:9",
  "tags": ["phoenix", "rebirth", "mythical", "fire"],
  "prompt_summary": "A traditional black & grey phoenix symbolizing resilience.",
  "source": "generator-v1",
  "version": 1,
  "transparent_bg": true,
  "skin_tone_supported": true,
  "published_at": "2025-11-11T00:00:00Z",
  "last_updated": "2025-11-11T00:00:00Z",
  "deprecated": false,
  "license": "tattty-proprietary",
  "author": "system",
  "quality_score": 0.92,
  "popularity": 128,
  "ai_model": "stability:sd3.5-large"
}
```

## Backend Components

- `backend/services/mixedbread_service.py`: Async wrapper for upload, add-to-store, listing and search.
- `backend/routers/mixedbread_router.py`: Exposes `/mixedbread/search` and `/mixedbread/files/attach`.
- `backend/config/settings.py`: Holds Mixedbread env vars (API key, store ID, timeout).
- `backend/main.py`: Includes router; central CORS + app wiring.

## Upload + Attach Flow

1. Upload file: `POST /v1/files` (raw PNG bytes)
2. Attach to store with metadata: `POST /v1/stores/{store}/files` body includes `file_id`, `metadata`, `external_id`, `overwrite`.

Example (Python):

```python
from services.mixedbread_service import mixedbread_service

async def ingest_png(file_bytes: bytes, filename: str, metadata: dict):
    file_obj = await mixedbread_service.upload_file(file_bytes, filename, mime_type="image/png")
    store_file = await mixedbread_service.add_file_to_store(
        file_id=file_obj["id"],
        external_id=f"tattoos/{filename}",
        metadata=metadata,
    )
    return store_file
```

## Searching

Frontend calls backend:

```http
POST /mixedbread/search
{
  "query": "phoenix fire rebirth",
  "top_k": 12,
  "filters": {
    "all": [
      {"key": "style", "operator": "eq", "value": "traditional"},
      {"key": "color_mode", "operator": "eq", "value": "black & grey"}
    ],
    "none": [
      {"key": "deprecated", "operator": "eq", "value": true}
    ]
  }
}
```

Response returns scored chunks; for images `type` may be `image_url`.

## Filter Builder (TS)

```ts
export function buildTattooFilters(sel: any) {
  const all: any[] = [];
  if (sel.style) all.push({ key: 'style', operator: 'eq', value: sel.style.toLowerCase() });
  if (sel.color) all.push({ key: 'color_mode', operator: 'eq', value: sel.color.toLowerCase() });
  if (sel.mood) all.push({ key: 'mood', operator: 'eq', value: sel.mood.toLowerCase() });
  return { all, none: [{ key: 'deprecated', operator: 'eq', value: true }] };
}
```

## Neon vs Mixedbread

- Neon remains for license key issuance, key-holder quotas, audit logging (relational + RLS on key tables).
- Mixedbread is for content retrieval (search index, metadata filtering, multimodal parsing). No RLS equivalent for per-row permission—assume all ingested tattoo assets are public/searchable to verified key-holders.
- Keep Neon if you need: rate limiting history, per-key usage counters, compliance/audit trails.

## Next Steps

1. Add ingestion script to loop over `galleryDesigns` and attach metadata.
2. Replace static gallery in `FullScreenGalleryOverlay` with dynamic search results (fallback to static if Mixedbread not configured).
3. Add caching layer (in-memory) for popular queries if needed.

## Error Handling Guidelines

- 429: Implement retry/backoff (not yet added).
- Non-200: surface `detail` to logs and return 502 to frontend.
- Missing transparency: validate images before ingest (todo).

## Security

- API key only in backend env; never expose to frontend.
- Optionally validate allowed origins before responding.

## Performance Tips

- Use `top_k` modest (<= 24) for gallery browsing.
- Pre-filter with metadata instead of broad queries when user selections exist.

## Future Enhancements

- Add popularity update endpoint (increment popularity after views).
- Add question-answering endpoint for semantic prompt enrichment.
- Store ingestion audit rows in Neon to correlate Mixedbread file IDs with internal asset IDs.

---
Revision: 2025-11-11
