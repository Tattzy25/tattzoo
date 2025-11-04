"""
OpenAI service for handling AI operations
"""
import openai
from typing import AsyncGenerator
from config.settings import settings


class OpenAIService:
    """Service for handling OpenAI API operations"""
    
    def __init__(self):
        """Initialize OpenAI client"""
        openai.api_key = settings.OPENAI_API_KEY.get_secret_value()
    
    async def enhance_text(self, text: str, selection_info: str = None) -> AsyncGenerator[str, None]:
        """
        Enhance tattoo description text using OpenAI
        
        Args:
            text: The text to enhance
            selection_info: Optional selection context
            
        Yields:
            Enhanced text chunks
        """
        user_prompt = f"Enhance this tattoo description: {text}"
        if selection_info:
            user_prompt += f"\nSelection context: {selection_info}"
        
        async for chunk in self._call_openai_api(settings.ENHANCE_SYSTEM_PROMPT, user_prompt):
            yield chunk
    
    async def generate_ideas(self, text: str, selection_info: str = None) -> AsyncGenerator[str, None]:
        """
        Generate tattoo ideas using OpenAI
        
        Args:
            text: The concept or keywords
            selection_info: Optional selection context
            
        Yields:
            Idea text chunks
        """
        user_prompt = f"Generate tattoo ideas based on: {text}"
        if selection_info:
            user_prompt += f"\nSelection context: {selection_info}"
        
        async for chunk in self._call_openai_api(settings.IDEAS_SYSTEM_PROMPT, user_prompt):
            yield chunk
    
    async def _call_openai_api(
        self, 
        system_prompt: str, 
        user_prompt: str
    ) -> AsyncGenerator[str, None]:
        """
        Call OpenAI API with streaming support
        
        Args:
            system_prompt: The system role prompt
            user_prompt: The user input prompt
            
        Yields:
            Response text chunks
        """
        try:
            response = openai.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                stream=True,
                max_tokens=1000,
                temperature=0.7
            )
            
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            yield f"Error: {str(e)}"
            raise


# Global service instance
openai_service = OpenAIService()