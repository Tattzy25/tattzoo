"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel
from typing import Optional


class EnhanceRequest(BaseModel):
    """Request schema for text enhancement"""
    type: str
    contextType: str
    targetText: str
    hasSelection: bool
    selection_info: Optional[str] = None


class IdeasRequest(BaseModel):
    """Request schema for idea generation"""
    type: str
    contextType: str
    targetText: str
    hasSelection: bool
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


# Key management schemas
class KeyValidateRequest(BaseModel):
    key: str
    email: str


class KeyValidateResponse(BaseModel):
    valid: bool
    status: str
    images_used: int
    ar_views_used: int
    images_cap: int
    ar_views_cap: int


class KeyUseRequest(BaseModel):
    key: str
    email: str
    action: str  # 'image' or 'ar'


class KeyActivateRequest(BaseModel):
    key: str
    email: str
    otp_ref: Optional[str] = None


class KeyUsageResponse(BaseModel):
    images_used: int
    ar_views_used: int