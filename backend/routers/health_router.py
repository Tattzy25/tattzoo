"""
Health router for service status and monitoring
"""
from fastapi import APIRouter
from models.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns:
        HealthResponse indicating service status
    """
    return HealthResponse(
        status="healthy",
        service="tattty-backend",
        version="1.0.0"
    )


@router.get("/")
async def root():
    """
    Root endpoint
    
    Returns:
        Basic service information
    """
    return {
        "message": "Tattty Backend API is running", 
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "enhance": "/api/ai/enhance",
            "ideas": "/api/ai/ideas"
        }
    }