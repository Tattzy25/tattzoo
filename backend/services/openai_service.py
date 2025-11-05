"""
OpenAI service for handling AI operations
"""
from openai import OpenAI
from typing import Tuple, Dict
from config.settings import settings


class OpenAIService:
    """Service for handling OpenAI API operations"""
    
    def __init__(self):
        """Initialize OpenAI client"""
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY.get_secret_value())
    
    async def enhance_text(self, text: str, selection_info: str = None) -> Tuple[str, Dict[str, int], str]:
        """
        Enhance tattoo description text using OpenAI
        
        Args:
            text: The text to enhance
            selection_info: Optional selection context
            
        Returns:
            A tuple of (content, usage, model)
        """
        user_prompt = f"Enhance this tattoo description: {text}"
        if selection_info:
            user_prompt += f"\nSelection context: {selection_info}"
        
        content, usage, model = await self._call_openai_api(settings.ENHANCE_SYSTEM_PROMPT, user_prompt)
        return content, usage, model

    async def generate_ideas(self, text: str, selection_info: str = None) -> Tuple[str, Dict[str, int], str]:
        """
        Generate tattoo ideas using OpenAI
        
        Args:
            text: The concept or keywords
            selection_info: Optional selection context
            
        Returns:
            A tuple of (content, usage, model)
        """
        user_prompt = f"Generate tattoo ideas based on: {text}"
        if selection_info:
            user_prompt += f"\nSelection context: {selection_info}"
        
        content, usage, model = await self._call_openai_api(settings.IDEAS_SYSTEM_PROMPT, user_prompt)
        return content, usage, model

    async def _call_openai_api(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> Tuple[str, Dict[str, int], str]:
        """
        Call OpenAI API with streaming support
        
        Args:
            system_prompt: The system role prompt
            user_prompt: The user input prompt
            
        Returns:
            content text, usage dict, and model string
        """
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=1000,
                temperature=0.7,
            )

            content = response.choices[0].message.content if response.choices else ""
            usage_obj = getattr(response, "usage", None) or {}
            usage = {
                "input_tokens": usage_obj.get("prompt_tokens", 0),
                "output_tokens": usage_obj.get("completion_tokens", 0),
                "total_tokens": usage_obj.get("total_tokens", 0),
            }
            model = getattr(response, "model", settings.OPENAI_MODEL)
            return content, usage, model

        except Exception:
            # Propagate to caller
            raise


# Global service instance
openai_service = OpenAIService()