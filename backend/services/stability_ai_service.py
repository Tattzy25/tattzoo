"""
Stability AI service for image generation

MIGRATION COMPLETE:
- Removed hardcoded defaults in function signature
- Uses centralized generation_defaults for mapping and defaults
- Logs all mapping operations
- Fails loudly on configuration errors
"""
import aiohttp
import uuid
import logging
from typing import Dict, Any, Optional
from config.settings import settings
from config.generation_defaults import generation_defaults

logger = logging.getLogger(__name__)


class StabilityAIService:
    """Service for handling Stability AI image generation"""

    def __init__(self):
        """Initialize Stability AI client"""
        self.api_key = getattr(settings, 'STABILITY_API_KEY', None)
        if self.api_key:
            self.api_key = self.api_key.get_secret_value()
        self.base_url = "https://api.stability.ai"

    async def generate_image(
        self,
        prompt: str,
        model: str,
        aspect_ratio: str,
        style: str,
        negative_prompt: str
    ) -> Dict[str, Any]:
        """
        Generate an image using Stability AI

        Args:
            prompt: The image generation prompt
            model: The model to use (sd3.5-large or sd3-turbo)
            aspect_ratio: Aspect ratio (1:1, 16:9, etc.)
            style: Style preset (vivid, natural, etc.)
            negative_prompt: What to avoid in the image

        Returns:
            Dict containing image data and metadata
            
        FAIL-LOUD CHANGES:
            - No hardcoded defaults in signature
            - Uses centralized mapping with logging
            - Explicit error messages
        """
        if not self.api_key:
            raise ValueError(
                "CRITICAL: Stability AI API key not configured. "
                "Set STABILITY_API_KEY environment variable."
            )

        # Use centralized aspect ratio mapping with logging - NO SILENT FALLBACKS
        context = "stability_ai_service.generate_image"
        mapped_aspect_ratio = generation_defaults.map_aspect_ratio(aspect_ratio, context)
        
        # Use centralized model mapping with logging - NO SILENT FALLBACKS
        mapped_model = generation_defaults.map_model(model, context)

        endpoint = f"{self.base_url}/v2beta/stable-image/generate/{mapped_model}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "image/*"
        }

        data = {
            "prompt": prompt,
            "aspect_ratio": mapped_aspect_ratio,
            "style_preset": style,
            "negative_prompt": negative_prompt,
            "seed": generation_defaults.STABILITY_SEED,  # Use centralized default
            "output_format": "png"
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=headers, data=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(
                        f"❌ STABILITY AI API ERROR: {response.status} - {error_text}"
                    )
                    raise Exception(f"Stability AI API error: {response.status} - {error_text}")

                # Get the image data
                image_data = await response.read()

                return {
                    "image_data": image_data,
                    "content_type": response.headers.get("Content-Type", "image/png"),
                    "model": mapped_model,
                    "prompt": prompt,
                    "aspect_ratio": mapped_aspect_ratio
                }


# Global service instance
stability_ai_service = StabilityAIService()
