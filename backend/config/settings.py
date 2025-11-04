"""
Application settings and configuration with environment-based loading

This module provides a robust configuration system that:
1. Loads all values from environment variables
2. Provides sensible defaults with clear documentation
3. Validates all configuration values
4. Ensures zero hardcoded values in production
5. Supports different environments (development, production)

Environment Variables Required:
- OPENAI_API_KEY: Your OpenAI API key (required)
- OPENAI_MODEL: OpenAI model to use (default: gpt-4)
- HOST: Server host (default: 0.0.0.0)
- PORT: Server port (default: 8000)
- DEBUG: Enable debug mode (default: false)
- ALLOWED_ORIGINS: Comma-separated list of CORS origins
- MIN_CHARACTERS: Minimum input characters (default: 10)
- REQUEST_TIMEOUT: API timeout in ms (default: 30000)
- STREAMING_THROTTLE_MS: Streaming throttle in ms (default: 50)
"""
import os
import logging
from typing import List, Optional
from dotenv import load_dotenv
from pydantic import BaseSettings, Field, validator
from pydantic.types import SecretStr

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings with environment variable loading and validation"""
    
    # API Configuration
    OPENAI_API_KEY: SecretStr = Field(
        ...,
        description="OpenAI API key for AI operations (required)",
        env="OPENAI_API_KEY"
    )
    
    OPENAI_MODEL: str = Field(
        default="gpt-5-nano-2025-08-07",
        description="OpenAI model to use for AI operations (Ask Tattty feature)",
        env="OPENAI_MODEL"
    )
    
    # Server Configuration
    HOST: str = Field(
        default="0.0.0.0",
        description="Server host address to bind to",
        env="HOST"
    )
    
    PORT: int = Field(
        default=8000,
        description="Server port to listen on",
        env="PORT",
        ge=1,
        le=65535
    )
    
    DEBUG: bool = Field(
        default=False,
        description="Enable debug mode with detailed logging",
        env="DEBUG"
    )
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3001", "http://localhost:3000"],
        description="List of allowed CORS origins",
        env="ALLOWED_ORIGINS"
    )
    
    @validator('ALLOWED_ORIGINS', pre=True)
    def parse_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from comma-separated string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    # Validation Configuration
    MIN_CHARACTERS: int = Field(
        default=10,
        description="Minimum number of characters required for input validation",
        env="MIN_CHARACTERS",
        ge=1
    )
    
    # API Timeout Configuration
    REQUEST_TIMEOUT: int = Field(
        default=30000,
        description="API request timeout in milliseconds",
        env="REQUEST_TIMEOUT",
        ge=1000
    )
    
    STREAMING_THROTTLE_MS: int = Field(
        default=50,
        description="Streaming response throttle delay in milliseconds",
        env="STREAMING_THROTTLE_MS",
        ge=0
    )
    
    # System Prompts (not environment-configurable as they are static content)
    ENHANCE_SYSTEM_PROMPT: str = """You are a tattoo design expert specializing in text enhancement. 
Your task is to take a user's tattoo description and improve it to be more descriptive, 
creative, and suitable for tattoo artists. Focus on:
- Adding vivid imagery and sensory details
- Incorporating tattoo-specific terminology
- Maintaining the original meaning and intent
- Making it visually descriptive for artists
- Keeping it concise but impactful"""
    
    IDEAS_SYSTEM_PROMPT: str = """You are a creative tattoo idea generator. 
Your task is to take a user's initial concept or keywords and generate 
multiple creative tattoo ideas. Focus on:
- Generating 3-5 distinct tattoo concepts
- Each concept should include style suggestions
- Include placement and size recommendations
- Make ideas visually descriptive and artist-friendly
- Ensure diversity in styles and approaches"""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        
        @classmethod
        def customise_sources(cls, init_settings, env_settings, file_secret_settings):
            """Customize configuration loading sources"""
            return env_settings, init_settings, file_secret_settings


def get_settings() -> Settings:
    """
    Get application settings with validation and error handling
    
    Returns:
        Settings: Validated application settings
        
    Raises:
        ValueError: If required environment variables are missing or invalid
    """
    try:
        settings = Settings()
        
        # Validate required settings
        if not settings.OPENAI_API_KEY.get_secret_value():
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        logger.info("✅ Configuration loaded successfully")
        logger.info(f"   Model: {settings.OPENAI_MODEL}")
        logger.info(f"   Host: {settings.HOST}:{settings.PORT}")
        logger.info(f"   Debug: {settings.DEBUG}")
        logger.info(f"   CORS Origins: {settings.ALLOWED_ORIGINS}")
        
        return settings
        
    except Exception as e:
        logger.error(f"❌ Failed to load configuration: {e}")
        logger.error("Please check your environment variables and .env file")
        raise


# Global settings instance
settings = get_settings()