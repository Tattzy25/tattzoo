"""
Image Generation Router for handling tattoo image generation endpoints

MIGRATION COMPLETE:
- Removed hardcoded Form defaults
- Uses centralized generation_defaults for default values
- Logs all default usage for monitoring
"""
import time
import base64
from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.responses import Response, JSONResponse
from typing import Optional
from services.tattoo_generation_service import tattoo_generation_service
from models.schemas import GenerateImageRequest, AIResponse
from config.settings import settings
from config.generation_defaults import generation_defaults

router = APIRouter(prefix="/api/generate", tags=["Image Generation"])


@router.post("/", response_class=Response)
async def generate_image(
    license_key: str = Form(...),
    email: str = Form(...),
    question1: Optional[str] = Form(None),
    question2: Optional[str] = Form(None),
    # NO HARDCODED DEFAULTS - Use centralized generation_defaults instead
    tattoo_style: Optional[str] = Form(None),
    color_preference: Optional[str] = Form(None),
    mood: Optional[str] = Form(None),
    placement: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    aspect_ratio: Optional[str] = Form(None),
    model: Optional[str] = Form(None)
) -> Response:
    """
    Generate a tattoo image using the complete workflow

    Args:
        All form data from the frontend submission
        
    FAIL-LOUD CHANGES:
        - No hardcoded Form defaults
        - Missing values use centralized defaults with logging
        - All default usage is tracked

    Returns:
        Image response with generated tattoo
    """
    try:
        # Validate required fields FIRST (before applying defaults)
        if not question1 or len(question1.strip()) < generation_defaults.MIN_QUESTION_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Question 1 must be at least {generation_defaults.MIN_QUESTION_LENGTH} characters long"
            )
        if not question2 or len(question2.strip()) < generation_defaults.MIN_QUESTION_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Question 2 must be at least {generation_defaults.MIN_QUESTION_LENGTH} characters long"
            )
        
        # Apply defaults with logging - NO SILENT FALLBACKS
        context = f"image_router - user:{email}"
        
        final_style = generation_defaults.get_style_default(tattoo_style, context)
        final_color = generation_defaults.get_color_default(color_preference, context)
        final_mood = generation_defaults.get_mood_default(mood, context)
        final_aspect_ratio = generation_defaults.get_aspect_ratio_default(aspect_ratio, context)
        final_model = generation_defaults.get_model_default(model, context)
        
        # Optional fields (no defaults applied, but can be None)
        final_placement = placement
        final_size = size
        
        # Compile all generation data with defaults applied
        generation_data = {
            "question1": question1,
            "question2": question2,
            "tattoo_style": final_style,
            "color_preference": final_color,
            "mood": final_mood,
            "placement": final_placement,
            "size": final_size,
            "aspect_ratio": final_aspect_ratio,
            "model": final_model
        }

        # Generate the tattoo using the complete workflow
        result = await tattoo_generation_service.generate_tattoo(generation_data, license_key, email)

        # For now, return a placeholder response since we don't have actual image data
        # In production, this would fetch the image from Vercel Blob
        return JSONResponse(
            content={
                "image_url": result["image_url"],
                "generation_id": result["generation_id"],
                "metadata": result["metadata"]
            },
            headers={
                "X-Generation-ID": result["generation_id"]
            }
        )

    except ValueError as e:
        if "API key not configured" in str(e):
            raise HTTPException(
                status_code=503,
                detail="Image generation service not configured. Please set STABILITY_API_KEY environment variable."
            )
        elif "license key" in str(e).lower():
            raise HTTPException(
                status_code=403,
                detail="Invalid or expired license key"
            )
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")


@router.get("/health")
async def image_generation_health():
    """Health check for image generation services"""
    stability_key = getattr(settings, 'STABILITY_API_KEY', None)
    has_api_key = stability_key is not None
    if has_api_key and stability_key:
        try:
            has_api_key = bool(stability_key.get_secret_value())
        except:
            has_api_key = False

    return {
        "status": "healthy" if has_api_key else "unhealthy",
        "service": "image-generation",
        "provider": "stability-ai",
        "api_key_configured": has_api_key
    }
