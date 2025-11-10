"""
Stability AI service for image generation
"""
import aiohttp
import uuid
from typing import Dict, Any, Optional
from config.settings import settings


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
        model: str = "sd3.5-large",
        aspect_ratio: str = "1:1",
        style: str = "vivid",
        negative_prompt: str = ""
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
        """
        if not self.api_key:
            raise ValueError("Stability AI API key not configured")

        # Map aspect ratios to Stability AI format
        aspect_ratio_map = {
            "1:1": "1:1",
            "16:9": "16:9",
            "9:16": "9:16",
            "4:3": "4:3",
            "3:4": "3:4",
            "21:9": "21:9",
            "9:21": "9:21"
        }

        # Map model names
        model_map = {
            "sd3.5-large": "sd3.5-large",
            "sd3-turbo": "sd3-turbo"
        }

        endpoint = f"{self.base_url}/v2beta/stable-image/generate/{model_map.get(model, 'sd3.5-large')}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "image/*"
        }

        data = {
            "prompt": prompt,
            "aspect_ratio": aspect_ratio_map.get(aspect_ratio, "1:1"),
            "style_preset": style,
            "negative_prompt": negative_prompt or "blurry, low quality, distorted, ugly",
            "seed": 0,  # For consistent results during development
            "output_format": "png"
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=headers, data=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Stability AI API error: {response.status} - {error_text}")

                # Get the image data
                image_data = await response.read()

                return {
                    "image_data": image_data,
                    "content_type": response.headers.get("Content-Type", "image/png"),
                    "model": model,
                    "prompt": prompt,
                    "aspect_ratio": aspect_ratio
                }


# Global service instance
stability_ai_service = StabilityAIService()
