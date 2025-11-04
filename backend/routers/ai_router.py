"""
AI Router for handling tattoo enhancement and idea generation endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import AsyncGenerator
from services.openai_service import openai_service
from models.schemas import EnhanceRequest, IdeasRequest, AIResponse
from config.settings import settings

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/enhance", response_model=AIResponse)
async def enhance_text(request: EnhanceRequest) -> AIResponse:
    """
    Enhance tattoo description text
    
    Args:
        request: EnhanceRequest containing text and optional selection info
        
    Returns:
        AIResponse with enhanced text or error
    """
    try:
        # Validate input
        if not request.text or len(request.text.strip()) < settings.MIN_CHARACTERS:
            raise HTTPException(
                status_code=400, 
                detail=f"Text must be at least {settings.MIN_CHARACTERS} characters long"
            )
        
        # Process enhancement
        enhanced_text = ""
        async for chunk in openai_service.enhance_text(
            request.text, 
            request.selection_info
        ):
            enhanced_text += chunk
        
        return AIResponse(content=enhanced_text, success=True)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to enhance text: {str(e)}"
        )


@router.post("/ideas", response_model=AIResponse)
async def generate_ideas(request: IdeasRequest) -> AIResponse:
    """
    Generate tattoo ideas from text
    
    Args:
        request: IdeasRequest containing text and optional selection info
        
    Returns:
        AIResponse with generated ideas or error
    """
    try:
        # Validate input
        if not request.text or len(request.text.strip()) < settings.MIN_CHARACTERS:
            raise HTTPException(
                status_code=400, 
                detail=f"Text must be at least {settings.MIN_CHARACTERS} characters long"
            )
        
        # Process idea generation
        ideas_text = ""
        async for chunk in openai_service.generate_ideas(
            request.text, 
            request.selection_info
        ):
            ideas_text += chunk
        
        return AIResponse(content=ideas_text, success=True)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate ideas: {str(e)}"
        )


@router.get("/health")
async def ai_health():
    """Health check for AI services"""
    return {
        "status": "healthy", 
        "service": "ai-processing",
        "model": "gpt-5-nano-2025-08-07"
    }