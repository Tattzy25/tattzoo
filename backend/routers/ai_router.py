"""
AI Router for handling tattoo enhancement and idea generation endpoints
"""
import time
from fastapi import APIRouter, HTTPException
from typing import AsyncGenerator
from services.openai_service import openai_service
from services.groq_service import groq_service
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
    usage = None
    model_name = settings.GROQ_MODEL
    was_successful = True
    error_message = None
    
    try:
        # Validate input
        if not request.targetText or len(request.targetText.strip()) < settings.MIN_CHARACTERS:
            raise HTTPException(
                status_code=400, 
                detail=f"Text must be at least {settings.MIN_CHARACTERS} characters long"
            )
        
        # Process enhancement via Groq (streaming accumulation to text)
        enhanced_text, usage, model_name = await groq_service.enhance_text(
            request.targetText,
            request.selection_info
        )
        
        return AIResponse(content=enhanced_text, result=enhanced_text, success=True)
        
    except HTTPException as e:
        was_successful = False
        error_message = str(e.detail)
        raise
    except Exception as e:
        was_successful = False
        error_message = str(e)
        # Fail loud: do not mask exceptions with generic HTTP responses
        raise
    finally:
        # Skip logging entirely if disabled for Ask TaTTTy feature
        if settings.ASK_TATTTY_LOGGING_ENABLED:
            response_time_ms = int((time.time() - start_time) * 1000)
            try:
                await ask_tattty_logger.log_request(
                    action_type="enhance",
                    input_text=request.targetText,
                    output_text=enhanced_text,
                    response_time_ms=response_time_ms,
                    was_successful=was_successful,
                    error_message=error_message,
                    usage=usage,
                    model=model_name
                )
            except Exception:
                # Fail loud in logs, but preserve API response
                import logging
                logging.getLogger(__name__).exception("Failed to log 'enhance' request")


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
    usage = None
    model_name = settings.OPENAI_MODEL
    was_successful = True
    error_message = None
    
    try:
        # Validate input (no automatic fallback prompts for ideas)
        # Ideas may accept empty input, but we do not substitute defaults
        
        # Process idea generation via Groq (streaming accumulation to text)
        ideas_text, usage, model_name = await groq_service.generate_ideas(
            request.targetText,
            request.selection_info
        )
        
        return AIResponse(content=ideas_text, result=ideas_text, success=True)
        
    except HTTPException as e:
        was_successful = False
        error_message = str(e.detail)
        raise
    except Exception as e:
        was_successful = False
        error_message = str(e)
        # Fail loud: do not mask exceptions with generic HTTP responses
        raise
    finally:
        # Skip logging entirely if disabled for Ask TaTTTy feature
        if settings.ASK_TATTTY_LOGGING_ENABLED:
            response_time_ms = int((time.time() - start_time) * 1000)
            try:
                await ask_tattty_logger.log_request(
                    action_type="ideas",
                    input_text=request.targetText,
                    output_text=ideas_text,
                    response_time_ms=response_time_ms,
                    was_successful=was_successful,
                    error_message=error_message,
                    usage=usage,
                    model=model_name
                )
            except Exception:
                import logging
                logging.getLogger(__name__).exception("Failed to log 'ideas' request")


@router.get("/health")
async def ai_health():
    """Health check for AI services"""
    return {
        "status": "healthy", 
        "service": "ai-processing",
        "model": settings.OPENAI_MODEL
    }