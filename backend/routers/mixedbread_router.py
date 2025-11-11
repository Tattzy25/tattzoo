"""
FastAPI router for Mixedbread operations used by the frontend and admin scripts.

Endpoints:
- POST /mixedbread/search: search the tattoo store with query + optional filters
- POST /mixedbread/files/attach: attach metadata to an already uploaded file by file_id or external_id
  (If only external_id is provided, the call will fail unless you also pass file_id. Preferred: pass file_id.)

Note: For bulk seeding, prefer a script that iterates local assets and calls these endpoints or service directly.
"""
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.mixedbread_service import mixedbread_service
from config.settings import settings


router = APIRouter(prefix="/mixedbread", tags=["mixedbread"])


class SearchRequest(BaseModel):
    query: str
    top_k: int = 12
    filters: Optional[Dict[str, Any]] = None


@router.post("/search")
async def search(req: SearchRequest):
    if not settings.MIXEDBREAD_API_KEY:
        raise HTTPException(status_code=503, detail="Mixedbread is not configured")
    try:
        res = await mixedbread_service.search(query=req.query, top_k=req.top_k, filters=req.filters)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AttachRequest(BaseModel):
    file_id: str
    external_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    overwrite: bool = True
    store_identifier: Optional[str] = None


@router.post("/files/attach")
async def attach_file_to_store(req: AttachRequest):
    if not settings.MIXEDBREAD_API_KEY:
        raise HTTPException(status_code=503, detail="Mixedbread is not configured")
    try:
        res = await mixedbread_service.add_file_to_store(
            file_id=req.file_id,
            store_identifier=req.store_identifier,
            external_id=req.external_id,
            metadata=req.metadata,
            overwrite=req.overwrite,
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
