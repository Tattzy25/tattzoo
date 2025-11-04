"""
AI Router for handling tattoo enhancement and idea generation endpoints
"""
import time
from fastapi import APIRouter, HTTPException
from typing import AsyncGenerator
from services.openai_service import openai_service
from services.ask_tattty_logger import ask_tattty_logger
from models.schemas import EnhanceRequest, IdeasRequest, AIResponse
from config.settings import settings

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/enhance", response_model=AIResponse)
async def enhance_text(
    request: EnhanceRequest
) -> AIResponse:
    """
    Enhance tattoo description text
    
    Args:
        request: EnhanceRequest containing text and optional selection info
        
    Returns:
        AIResponse with enhanced text or error
    """
    start_time = time.time()
    enhanced_text = ""
    was_successful = True
    error_message = None
    
    try:
        # Validate input
        if not request.targetText or len(request.targetText.strip()) < settings.MIN_CHARACTERS:
            raise HTTPException(
                status_code=400, 
                detail=f"Text must be at least {settings.MIN_CHARACTERS} characters long"
            )
        
        # Process enhancement
        async for chunk in openai_service.enhance_text(
            request.targetText, 
            request.selection_info
        ):
            enhanced_text += chunk
        
        return AIResponse(content=enhanced_text, success=True)
        
    except HTTPException as e:
        was_successful = False
        error_message = str(e.detail)
        raise
    except Exception as e:
        was_successful = False
        error_message = str(e)
        raise HTTPException(
            status_code=500, 
            detail="Sorry, we're experiencing technical difficulties. Please try again in a moment."
        )
    finally:
        # Log the request to database
        response_time_ms = int((time.time() - start_time) * 1000)
        await ask_tattty_logger.log_request(
            action_type="enhance",
            input_text=request.targetText,
            output_text=enhanced_text,
            response_time_ms=response_time_ms,
            was_successful=was_successful,
            error_message=error_message
        )


@router.post("/ideas", response_model=AIResponse)
async def generate_ideas(
    request: IdeasRequest
) -> AIResponse:
    """
    Generate tattoo ideas from text
    
    Args:
        request: IdeasRequest containing text and optional selection info
        
    Returns:
        AIResponse with generated ideas or error
    """
    start_time = time.time()
    ideas_text = ""
    was_successful = True
    error_message = None
    
    try:
        # Validate input - Ideas endpoint should work with empty/minimal text
        # since it generates ideas from scratch, not enhancing existing text
        if not request.targetText or request.targetText.strip() == "":
            # Use a default prompt for empty text to generate creative ideas
            request.targetText = "creative tattoo ideas"
        
        # Process idea generation
        async for chunk in openai_service.generate_ideas(
            request.targetText, 
            request.selection_info
        ):
            ideas_text += chunk
        
        return AIResponse(content=ideas_text, success=True)
        
    except HTTPException as e:
        was_successful = False
        error_message = str(e.detail)
        raise
    except Exception as e:
        was_successful = False
        error_message = str(e)
        raise HTTPException(
            status_code=500, 
            detail="Sorry, we're experiencing technical difficulties. Please try again in a moment."
        )
    finally:
        # Log the request to database
        response_time_ms = int((time.time() - start_time) * 1000)
        await ask_tattty_logger.log_request(
            action_type="ideas",
            input_text=request.targetText,
            output_text=ideas_text,
            response_time_ms=response_time_ms,
            was_successful=was_successful,
            error_message=error_message
        )


@router.get("/health")
async def ai_health():
    """Health check for AI services"""
    return {
        "status": "healthy", 
        "service": "ai-processing",
        "model": "gpt-5-nano-2025-08-07"
    }