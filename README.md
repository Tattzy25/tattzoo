# TaTTTy — Comprehensive README

  ## Project snapshot — what this is about
  TaTTTy is a Vite + React single-page app (TypeScript) that helps users generate tattoo concepts and preview them using an AR "Try It On" experience. Key capabilities:
  - TaTTTy AI generator: prompt-based generator where users answer two configurable questions to produce tattoo concepts.
  - "Ask TaTTTy" assistant: sends user text to a backend AI endpoint to "enhance" or "generate ideas" (supports SSE streaming and JSON responses).
  - Local mock generation for offline/testing flows.
  - AR preview (MediaPipe BlazePose) to overlay generated transparent PNG tattoos on camera feed.
  - Data layer designed to migrate from static `src/data/` files to a DB/CMS without refactoring UI components.

  ## Quick facts
  - Stack: React, Vite, TypeScript
  - Dev server: port 3000 (configured in `vite.config.ts`)
  - Build output: `build/`
  - Scripts (see `package.json`):
    - `npm run dev` — start dev server
    - `npm run build` — production build

  ## Table of contents
  - Getting started
  - Architecture & directory map
  - Important runtime flows
    - Ask TaTTTy API contract
    - Generator flow & session handling
    - License/rate-limit behavior
    - Dynamic questions system
    - AR "Try It On"
  - Data & migration notes
  - Troubleshooting & git advice (why 10k files appear)
  - Next steps

  ---

  ## Getting started (local development)

  Prereqs:
  - Node.js (18+ recommended)
  - npm (or another Node package manager)

  Install and run (PowerShell / pwsh):

  ```powershell
  npm install
  npm run dev
  ```

  - Dev server opens on port 3000 by default.
  - Build for production:

  ```powershell
  npm run build
  ```

  If you plan to use the Ask TaTTTy backend functionality, point `src/data/ask-tattty.ts` at your backend (default baseURL is `http://localhost:8000`).

  ---

  ## Architecture & directory map (high-level)

  - `index.html` — SPA entry for Vite
  - `vite.config.ts` — build and alias config
  - `src/main.tsx` — React bootstrap
  - `src/App.tsx` — providers: `LicenseProvider`, `GeneratorProvider`
  - `src/components/` — UI components; `GeneratorPage` is the main page
  - `src/contexts/` — `GeneratorContext`, `LicenseContext`
  - `src/services/` — `submissionService` / `sessionDataStore`
  - `src/data/` — static content (gallery, generator options, field labels). Intended to be replaced by DB/CMS at runtime.
  - `public/ar.html` — standalone AR experience

  Design notes:
  - Components are prop-driven; replacing static data with API calls should be low-effort.
  - `GeneratorContext` contains the main generation lifecycle. `LicenseContext` enforces a simple frontend rate-limit model.

  ---

  ## Important runtime flows

  ### Ask TaTTTy API contract (summary)

  Frontend calls:
  - `POST /api/ai/enhance` or `POST /api/ai/ideas`
  - Body:
    ```json
    { "type": "enhance" | "ideas", "contextType": "tattty", "targetText": "...", "hasSelection": false }
    ```

  Responses supported (backend must return one):
  1. Streaming (SSE): `Content-Type: text/event-stream` with `data: {"token": "...","done": false}` chunks. Final message contains `{"done": true}`.
  2. Non-streaming JSON: `{ "result": "..." }` (frontend requires `result` field).

  Error format must be JSON: `{ "error": "message" }` with appropriate HTTP status.

  Frontend timeout: 30s (AbortSignal.timeout(30000)).

  Backend should log requests to DB using `log_ask_tattty_request(...)` (see `ask_tattty_schema.sql`).

  ### Generator flow (TaTTTy)

  - Users answer two configurable questions (Q1/Q2) and select style/placement/mood/etc.
  - `sessionDataStore` holds SourceCard data (questions + optional image files) until the user hits create.
  - `GeneratorContext.handleGenerate()` validates inputs and either calls a mock generator (currently) or should POST `FormData` to `/api/generate` in a real backend flow.
  - On success, generated images are stored in state and saved to local history (localStorage). The license usage counter is incremented.

  ### License & rate-limiting

  - `LicenseContext` stores license info in `localStorage` and enforces a frontend limit (default 3 generations per hour).
  - Current `verifyLicense` is frontend-only (pattern check). For production, implement server-side verification.

  ### Dynamic Questions system

  - Questions are defined in `src/data/field-labels.ts` and backed by a `generator_questions` DB table (schema documented in `DYNAMIC_QUESTIONS_SYSTEM.md`).
  - The UI is built to accept questions from an API so you can change copy without deploying the frontend.

  ### AR "Try It On"

  - `ResultsCard` exposes a hidden canvas with the generated PNG (must be transparent). `TryItOnButton` converts to a 512×512 PNG and opens `public/ar.html`.
  - AR page uses MediaPipe BlazePose (33 landmarks) to compute placement, rotation, and scale for each body part.
  - Requirements: transparent PNGs, HTTPS for camera, modern browser.

  ---

  ## Data layer & migration notes (static → DB/CMS)

  - `src/data/` is a staging layer. Files mirror DB tables for gallery, generator options, moods, aspect ratios, etc.
  - Migration checklist (high level):
    1. Create DB tables for gallery, generator options, timeline steps, social proof, moods, aspect ratios.
    2. Replace imports from `/data` with API fetches on app init.
    3. Keep components prop-driven — they won't need structural refactors when data moves to the DB.

  Icon handling: store icon names in DB and map to React components after fetching.

  ---

  ## Troubleshooting & git advice (why ~10k files appear)

  Common causes:
  - `node_modules/` was added to the repo before `.gitignore` existed.
  - Build outputs or caches (e.g., `.vite/`, `build/`, `dist/`) were tracked.
  - Large asset folders accidentally added.

  Important points:
  - Adding `.gitignore` doesn't untrack already-tracked files.
  - To inspect what's counted (PowerShell):
    ```powershell
    git status
    git status --porcelain | Measure-Object -Line
    git status --porcelain | ForEach-Object { ($_ -replace '^[ ?MARC]+','') } | ForEach-Object { Split-Path -Path $_ -Parent } | Group-Object | Sort-Object Count -Descending | Select-Object -First 20
    ```

  Safe index cleanup (example sequence):
  1. Commit your `.gitignore`:
    ```powershell
    git add .gitignore
    git commit -m "Add .gitignore"
    ```
  2. Untrack ignored files (this modifies the git index; you'll typically commit the changes):
    ```powershell
    git rm -r --cached .
    git add .
    git commit -m "Apply .gitignore and remove ignored files from index"
    ```

  Preview cleaning untracked ignored files (dry-run):
  ```powershell
  git clean -ndX
  ```
  Actual removal (destructive):
  ```powershell
  git clean -fdX
  ```

  If large binaries are committed in history and must be removed, use `git filter-repo` or BFG Repo Cleaner (requires coordination and force push).

  ---

  ## Next steps & recommendations

  1. Connect a dev backend for Ask TaTTTy (FastAPI example available in docs) and update `src/data/ask-tattty.ts` baseURL.
  2. Move static content from `src/data/` to API endpoints and fetch at app init.
  3. Implement server-side license verification for production.
  4. If you have a large tracked folder (e.g., `node_modules`), run the preview commands above and then apply the `git rm --cached` + commit sequence when ready.

  ---

  ## Database Schema Files

  The project includes PostgreSQL database schema files located in `backend/neon_db/`:

  - `ask_tattty` - Main Ask TaTTTy API request tracking and configuration
  - `frontend_database_schema` - Frontend-specific UI content and user preferences
  - `tattoo_colors` - Tattoo color palette and options
  - `tattoo_moods` - Mood/thematic categories for tattoo generation
  - `tattoo_placements` - Body placement locations for tattoos
  - `tattoo_sizes` - Size options and dimensions for tattoos
  - `tattoo_styles` - Artistic style categories for tattoos

  These files contain complete PostgreSQL-compatible SQL schemas with:
  - Table definitions with proper constraints and indexes
  - Sample data for development and testing
  - Functions and triggers for automated operations
  - Multi-language support for UI content

  To execute these schemas against a PostgreSQL database, use the `run_schemas.py` script in the `backend/db/` directory.

  ---

  If you want, I can save a separate `README_FULL.md` instead of replacing this file, or run `git status` now and produce the exact minimal cleanup commands tailored to your current index. Tell me which you prefer.

  ---
  _Generated/updated by project tooling — keep this file in repo root for deploy and documentation._



![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Tattzy25/tattzoo?utm_source=oss&utm_medium=github&utm_campaign=Tattzy25%2Ftattzoo&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)