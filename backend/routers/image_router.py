"""
Image Generation Router for handling tattoo image generation endpoints
"""
import time
import base64
from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.responses import Response, JSONResponse
from typing import Optional
from services.tattoo_generation_service import tattoo_generation_service
from models.schemas import GenerateImageRequest, AIResponse
from config.settings import settings

router = APIRouter(prefix="/api/generate", tags=["Image Generation"])


@router.post("/", response_class=Response)
async def generate_image(
    license_key: str = Form(...),
    email: str = Form(...),
    question1: Optional[str] = Form(None),
    question2: Optional[str] = Form(None),
    tattoo_style: Optional[str] = Form("Traditional"),
    color_preference: Optional[str] = Form("Black & Grey"),
    mood: Optional[str] = Form("happy"),
    placement: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    aspect_ratio: Optional[str] = Form("1:1"),
    model: Optional[str] = Form("sd3.5-large")
) -> Response:
    """
    Generate a tattoo image using the complete workflow

    Args:
        All form data from the frontend submission

    Returns:
        Image response with generated tattoo
    """
    try:
        # Compile all generation data
        generation_data = {
            "question1": question1,
            "question2": question2,
            "tattoo_style": tattoo_style,
            "color_preference": color_preference,
            "mood": mood,
            "placement": placement,
            "size": size,
            "aspect_ratio": aspect_ratio,
            "model": model
        }

        # Validate required fields
        if not question1 or len(question1.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Question 1 must be at least 50 characters long"
            )
        if not question2 or len(question2.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Question 2 must be at least 50 characters long"
            )

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
