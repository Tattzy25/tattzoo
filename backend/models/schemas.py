"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel
from typing import Optional


class EnhanceRequest(BaseModel):
    """Request schema for text enhancement"""
    text: str
    selection_info: Optional[str] = None


class IdeasRequest(BaseModel):
    """Request schema for idea generation"""
    text: str
    selection_info: Optional[str] = None


class AIResponse(BaseModel):
    """Response schema for AI operations"""
    content: str
    success: bool
    error: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response schema"""
    status: str
    service: str
    version: str


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    details: Optional[str] = None