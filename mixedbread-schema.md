Mixedbread Data Schema (Production)

Store
- name: tattty
- visibility: private
- expiration: none

File Object
- id (file_id): string
- url: string
- filename: string
- status: string
- metadata: JSON
- created_at: timestamp

Metadata (JSON)
- prompt: string
- original_questions: string
- style: string
- color: string
- mood: string
- placement: string
- size: string
- model: string
- aspect_ratio: string  // 1:1 | 16:9 | 9:16
- generated_at: string  // ISO timestamp
- type: string          // tattoo_generation
- user_id: string (optional)

Generation Result (MCP tool: groq_to_stability_chain)
- image_url: string
- file_id: string
- enhanced_prompt: string
- metadata: JSON (see Metadata)
- filename: string

Gallery Search Result (MCP tool: search_tattoo_gallery)
- file_id: string
- url: string
- score: number
- metadata: JSON
- filename: string

Frontend Persistence (non-rendered fields saved)
- generationHistory entry:
  - imageUrl: string (image_url)
  - prompt: string (enhanced_prompt or Q1+Q2 fallback)
  - params: JSON {
      style: string,
      color: string,
      mood: string,
      placement: string,
      size: string,
      aspectRatio: string,
      model: string,
      fileId: string,
      metadata: JSON,
      filename: string
    }

Accepted Filters (metadata keys)
- style: { $eq: "Japanese" }
- color: { $eq: "Black & Grey" }
- placement: { $eq: "back" }
- size: { $in: ["medium","large"] }
- generated_at: { $gte: "2025-11-01T00:00:00" }

Environment (Server)
- MIXEDBREAD_API_KEY
- MIXEDBREAD_STORE_NAME=tattty

Transport (Frontend)
- VITE_MCP_ENDPOINT=https://tattzy-mcp.up.railway.app/mcp