"""
Mixedbread Search service wrapper

Provides minimal async helpers for:
- Uploading files to Mixedbread Files API
- Adding files to a Store with metadata
- Searching a Store with optional metadata filters

This service is optional and activates only if MIXEDBREAD_API_KEY is present.
"""
from __future__ import annotations

import aiohttp
from typing import Any, Dict, List, Optional
from config.settings import settings


class MixedbreadService:
    def __init__(self) -> None:
        self.base_url = "https://api.mixedbread.com/v1"
        self.api_key: Optional[str] = None
        if getattr(settings, "MIXEDBREAD_API_KEY", None):
            try:
                self.api_key = settings.MIXEDBREAD_API_KEY.get_secret_value()  # type: ignore[attr-defined]
            except Exception:
                # If not SecretStr, allow plain string
                self.api_key = str(settings.MIXEDBREAD_API_KEY)
        self.default_store = getattr(settings, "MIXEDBREAD_TATTOO_STORE_ID", None)
        self.timeout = aiohttp.ClientTimeout(total=getattr(settings, "MIXEDBREAD_TIMEOUT_MS", 15000) / 1000)

    def _headers(self) -> Dict[str, str]:
        if not self.api_key:
            raise ValueError("Mixedbread API key not configured")
        return {
            "Authorization": f"Bearer {self.api_key}"
        }

    async def upload_file(self, file_bytes: bytes, filename: str, mime_type: str = "application/octet-stream") -> Dict[str, Any]:
        """Upload a raw file to Mixedbread Files API and return file object.

        Returns JSON like { id, filename, bytes, mime_type, version, created_at, updated_at }
        """
        if not self.api_key:
            raise ValueError("Mixedbread API key not configured")

        form = aiohttp.FormData()
        form.add_field("file", file_bytes, filename=filename, content_type=mime_type)

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.post(f"{self.base_url}/files", headers=self._headers(), data=form) as resp:
                if resp.status >= 300:
                    text = await resp.text()
                    raise RuntimeError(f"Upload failed ({resp.status}): {text}")
                return await resp.json()

    async def add_file_to_store(
        self,
        file_id: str,
        store_identifier: Optional[str] = None,
        *,
        external_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        overwrite: bool = True,
    ) -> Dict[str, Any]:
        """Attach an uploaded file to a store with metadata.

        If a file with the same external_id exists and overwrite=True, it will be replaced/updated.
        """
        if not self.api_key:
            raise ValueError("Mixedbread API key not configured")
        store = store_identifier or self.default_store
        if not store:
            raise ValueError("Mixedbread store identifier not provided")

        payload: Dict[str, Any] = {
            "file_id": file_id,
            "overwrite": overwrite,
        }
        if external_id:
            payload["external_id"] = external_id
        if metadata is not None:
            payload["metadata"] = metadata

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.post(f"{self.base_url}/stores/{store}/files", headers=self._headers(), json=payload) as resp:
                if resp.status >= 300:
                    text = await resp.text()
                    raise RuntimeError(f"Add to store failed ({resp.status}): {text}")
                return await resp.json()

    async def list_store_files(self, store_identifier: Optional[str] = None, *, limit: int = 100, cursor: Optional[str] = None) -> Dict[str, Any]:
        """List files within a store (paginated)."""
        if not self.api_key:
            raise ValueError("Mixedbread API key not configured")
        store = store_identifier or self.default_store
        if not store:
            raise ValueError("Mixedbread store identifier not provided")

        params = {"limit": str(limit)}
        if cursor:
            params["cursor"] = cursor

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.get(f"{self.base_url}/stores/{store}/files", headers=self._headers(), params=params) as resp:
                if resp.status >= 300:
                    text = await resp.text()
                    raise RuntimeError(f"List store files failed ({resp.status}): {text}")
                return await resp.json()

    async def search(
        self,
        query: str,
        *,
        store_identifiers: Optional[List[str]] = None,
        top_k: int = 12,
        filters: Optional[Dict[str, Any]] = None,
        search_options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Search chunks within stores with optional metadata filters."""
        if not self.api_key:
            raise ValueError("Mixedbread API key not configured")

        payload: Dict[str, Any] = {
            "query": query,
            "top_k": top_k,
        }
        if store_identifiers:
            payload["store_identifiers"] = store_identifiers
        elif self.default_store:
            payload["store_identifiers"] = [self.default_store]
        if filters:
            payload["filters"] = filters
        if search_options:
            payload["search_options"] = search_options

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.post(f"{self.base_url}/stores/search", headers=self._headers(), json=payload) as resp:
                if resp.status >= 300:
                    text = await resp.text()
                    raise RuntimeError(f"Search failed ({resp.status}): {text}")
                return await resp.json()


# Global instance
mixedbread_service = MixedbreadService()
