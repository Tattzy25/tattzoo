# Copilot Instructions for TaTTTy

## Project Overview
- **TaTTTy** is a Vite + React (TypeScript) SPA for AI-powered tattoo concept generation and AR preview (see `README.md`).
- Backend (Python, FastAPI) in `backend/` provides AI endpoints for prompt enhancement, image generation, and key management.
- Data layer (`src/data/`) is designed for easy migration from static files to a database/CMS with minimal UI refactor.

## Architecture & Key Patterns
- **Frontend:**
  - Main entry: `src/main.tsx`, root component: `src/App.tsx`.
  - UI components in `src/components/` (modular, prop-driven, often stateless).
  - Data imported from `src/data/` (see `src/data/README.md` for structure and migration plan).
  - AR "Try It On" uses MindAR (`public/js/mindar-body.prod.js`) and MediaPipe BlazePose.
  - API integration: `src/data/ask-tattty.ts` (configurable backend URL).
- **Backend:**
  - Entrypoint: `backend/main.py` (FastAPI app), with routers in `backend/routers/`.
  - Service logic in `backend/services/` (AI, key management, logging, etc).
  - Database access in `backend/db/` (asyncpg, SQL schemas).
  - Config in `backend/config/settings.py`.

## Developer Workflows
- **Frontend:**
  - Install: `npm install`
  - Dev server: `npm run dev` (port 3000)
  - Build: `npm run build` (output in `build/`)
  - AR dev: ensure MindAR is present in `public/js/` (see `src/public/js/README.md`).
- **Backend:**
  - Install Python deps: `pip install -r requirements.txt`
  - Run: `python main.py` or `python start_server.py` (default port 8000)
  - Test endpoints with mock data or real AI keys.
- **Data migration:**
  - All static data in `src/data/` is structured for future DB migration (see `src/data/README.md`).

## Project-Specific Conventions
- **Component data** always passed as props, never imported directly in child components.
- **API endpoints** are versioned and documented in `backend/routers/`.
- **AR/AI features** are optional for local dev; mock flows are available.
- **MCP tools** (see `.clinerules/mcp-tools-priority.md`): Always use provided file, search, and browser tools for automation and debugging.

## Integration Points
- **Frontend ↔ Backend:** via REST API (`src/data/ask-tattty.ts`)
- **AR preview:** loads MindAR from `public/js/`, overlays PNGs on camera feed.
- **Database:** planned migration from `src/data/` to DB (see migration checklist in `src/data/README.md`).

## References
- `README.md` (project intro, scripts, architecture)
- `src/data/README.md` (data structure, migration)
- `.clinerules/mcp-tools-priority.md` (tooling rules)
- `src/public/js/README.md` (AR library setup)

---

**For AI agents:**
- Use MCP tools for all file/search/web operations.
- Follow prop-driven data flow and avoid direct imports in UI children.
- Reference backend endpoints and data contracts from routers/services.
- When in doubt, check referenced READMEs for up-to-date conventions.
