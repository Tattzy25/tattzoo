"""
Tattoo Generation Service - Orchestrates the full tattoo generation workflow
"""
import uuid
import base64
from typing import Dict, Any, Optional
from datetime import datetime

from services.openai_service import openai_service
from services.stability_ai_service import stability_ai_service
from services.key_manager_service import validate_key, record_usage
from config.settings import settings


class TattooGenerationService:
    """Service for orchestrating the complete tattoo generation workflow"""

    async def generate_tattoo(self, generation_data: Dict[str, Any], license_key: str, email: str) -> Dict[str, Any]:
        """
        Generate a tattoo using the complete workflow:
        1. Validate license
        2. Enhance prompt with OpenAI
        3. Generate image with Stability AI
        4. Upload to Vercel Blob
        5. Save metadata to Neon
        6. Return result

        Args:
            generation_data: All user selections and inputs
            license_key: User's license key
            email: User's email

        Returns:
            Dict with image URL and metadata
        """
        # Step 1: Validate license
        is_valid, status, images_used, ar_views_used = await validate_key(license_key, email)
        if not is_valid or status != 'active':
            raise ValueError("Invalid or expired license key")

        # Step 2: Create enhanced prompt using OpenAI
        enhanced_prompt = await self._enhance_prompt_with_openai(generation_data)

        # Step 3: Generate image with Stability AI
        image_result = await stability_ai_service.generate_image(
            prompt=enhanced_prompt,
            model=generation_data.get("model", "sd3.5-large"),
            aspect_ratio=generation_data.get("aspect_ratio", "1:1"),
            style="vivid",
            negative_prompt="blurry, low quality, distorted, ugly, text, words, letters"
        )

        # Step 4: Upload to Vercel Blob (placeholder - would need Vercel Blob SDK)
        image_url = await self._upload_to_vercel_blob(image_result["image_data"])

        # Step 5: Save metadata to Neon
        metadata = await self._save_metadata_to_neon(
            generation_data=generation_data,
            enhanced_prompt=enhanced_prompt,
            image_url=image_url,
            license_key=license_key,
            email=email
        )

        # Step 6: Update license usage
        await record_usage(license_key, email, "image")

        return {
            "image_url": image_url,
            "metadata": metadata,
            "generation_id": metadata["id"]
        }

    async def _enhance_prompt_with_openai(self, generation_data: Dict[str, Any]) -> str:
        """Create a detailed tattoo generation prompt using OpenAI (heavy enhancement for image gen)"""
        # Combine all user inputs into a comprehensive prompt for AI image generation
        prompt_parts = []

        # Add user stories/questions as the core content
        if generation_data.get("question1"):
            prompt_parts.append(f"Story/Concept: {generation_data['question1']}")
        if generation_data.get("question2"):
            prompt_parts.append(f"Additional Details: {generation_data['question2']}")

        # Add all the technical specifications
        specs = [
            f"Style: {generation_data.get('tattoo_style', 'Traditional')}",
            f"Colors: {generation_data.get('color_preference', 'Black & Grey')}",
            f"Mood: {generation_data.get('mood', 'balanced')}",
            f"Placement: {generation_data.get('placement', 'forearm')}",
            f"Size: {generation_data.get('size', 'medium')}",
            f"Aspect Ratio: {generation_data.get('aspect_ratio', '1:1')}"
        ]
        prompt_parts.extend(specs)

        # Create the full context for OpenAI to generate a professional tattoo prompt
        full_context = "\n".join(prompt_parts)

        # Use a specialized system prompt for tattoo image generation
        tattoo_system_prompt = """You are a professional tattoo artist and prompt engineer specializing in creating detailed, vivid prompts for AI tattoo image generation.

Your task is to take user descriptions and preferences and transform them into highly detailed, professional tattoo design prompts that will generate stunning, realistic tattoo artwork.

Requirements:
- Create extremely detailed, vivid descriptions optimized for AI image generation
- Focus on visual elements: line work, shading, colors, composition, symbolism
- Include technical tattoo terminology and artistic details
- Ensure the prompt creates a cohesive, professional tattoo design
- Maintain the authenticity and emotional depth of the user's story
- Optimize for photorealistic tattoo rendering with proper skin texture and ink diffusion

Output: A single, comprehensive paragraph (200-400 words) that serves as a complete AI image generation prompt for a tattoo design."""

        try:
            # Use OpenAI with the specialized tattoo prompt system
            response = openai_service.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": tattoo_system_prompt},
                    {"role": "user", "content": f"Create a detailed tattoo design prompt based on these specifications:\n\n{full_context}"}
                ],
                max_tokens=1000,
                temperature=0.8,  # Higher creativity for artistic prompts
            )

            enhanced_prompt = response.choices[0].message.content
            if enhanced_prompt:
                return enhanced_prompt.strip()
            else:
                return f"Professional tattoo design: {full_context}. Highly detailed, realistic tattoo artwork with proper shading, line work, and skin texture."

        except Exception as e:
            # Fallback to basic prompt construction if OpenAI fails
            return f"Professional tattoo design: {full_context}. Highly detailed, realistic tattoo artwork with proper shading, line work, and skin texture."

    async def _upload_to_vercel_blob(self, image_data: bytes) -> str:
        """Upload image to Vercel Blob storage"""
        # Placeholder - would need @vercel/blob SDK
        # For now, return a mock URL
        image_id = str(uuid.uuid4())
        return f"https://blob.vercel-storage.com/tattoos/{image_id}.png"

    async def _save_metadata_to_neon(self, generation_data: Dict[str, Any], enhanced_prompt: str, image_url: str, license_key: str, email: str) -> Dict[str, Any]:
        """Save generation metadata to Neon database"""
        generation_id = str(uuid.uuid4())

        # Placeholder - would need database insertion logic
        metadata = {
            "id": generation_id,
            "license_key": license_key,
            "email": email,
            "enhanced_prompt": enhanced_prompt,
            "image_url": image_url,
            "generation_data": generation_data,
            "created_at": datetime.utcnow().isoformat(),
            "model_used": generation_data.get("model", "sd3.5-large"),
            "aspect_ratio": generation_data.get("aspect_ratio", "1:1")
        }

        # TODO: Insert into Neon database
        # await db.execute("""
        #     INSERT INTO tattoo_generations (id, license_key, email, enhanced_prompt, image_url, generation_data, created_at, model_used, aspect_ratio)
        #     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        # """, generation_id, license_key, email, enhanced_prompt, image_url, json.dumps(generation_data), datetime.utcnow(), metadata["model_used"], metadata["aspect_ratio"])

        return metadata


# Global service instance
tattoo_generation_service = TattooGenerationService()
