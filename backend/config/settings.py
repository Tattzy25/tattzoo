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
from pathlib import Path
try:
    from pydantic.v1 import BaseSettings, Field, validator
    from pydantic.v1.types import SecretStr
except ImportError:
    from pydantic import BaseSettings, Field, validator
    from pydantic.types import SecretStr

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from common locations
# 1) Default .env in current working directory
load_dotenv()
# 2) Project root .env.local
load_dotenv(dotenv_path=Path.cwd() / ".env.local")
# 3) Backend folder .env.local (ensures backend/main.py from project root still loads backend env)
backend_env_local = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=backend_env_local)


class Settings(BaseSettings):
    """Application settings with environment variable loading and validation"""
    
    # API Configuration
    OPENAI_API_KEY: SecretStr = Field(
        ...,
        description="OpenAI API key for AI operations (required)",
        env="OPENAI_API_KEY"
    )
    
    OPENAI_MODEL: str = Field(
        default="gpt-5-mini-2025-08-07",
        description="OpenAI model to use for AI operations (Ask Tattty feature)",
        env="OPENAI_MODEL"
    )

    # Groq Configuration
    GROQ_API_KEY: Optional[SecretStr] = Field(
        default=None,
        description="Groq API key for AI operations (optional if using Groq)",
        env="GROQ_API_KEY"
    )
    GROQ_MODEL: str = Field(
        default="openai/gpt-oss-120b",
        description="Groq model to use for AI operations (Ideas feature)",
        env="GROQ_MODEL"
    )

    # Ask TaTTTy logging toggle
    ASK_TATTTY_LOGGING_ENABLED: bool = Field(
        default=True,
        description="Enable/disable Ask TaTTTy request logging",
        env="ASK_TATTTY_LOGGING_ENABLED"
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
        default=[
            "http://localhost:3001",
            "http://localhost:3000",
            "http://localhost:3002",
            "http://localhost:3003",
            "https://tattty.com",
            "https://www.tattty.com"
        ],
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

    # Feature Flags
    ASK_TATTTY_LOGGING_ENABLED: bool = Field(
        default=False,
        description="Enable database logging for Ask TaTTTy enhance/ideas routes",
        env="ASK_TATTTY_LOGGING_ENABLED"
    )

    # Database Configuration
    DATABASE_URL: str = Field(
        default="",
        description="PostgreSQL database connection URL",
        env="DATABASE_URL"
    )

    # Key Management Configuration
    KEY_PREFIX: str = Field(
        default="TZY",
        description="Prefix for generated license keys",
        env="KEY_PREFIX"
    )
    IMAGES_DAILY_CAP: int = Field(
        default=20,
        description="Daily cap for image generations per key",
        env="IMAGES_DAILY_CAP",
        ge=1
    )
    AR_VIEWS_DAILY_CAP: int = Field(
        default=20,
        description="Daily cap for AR views per key",
        env="AR_VIEWS_DAILY_CAP",
        ge=1
    )
    EMAIL_FINGERPRINT_SALT: str = Field(
        default="change-me",
        description="Secret salt for HMAC email fingerprinting",
        env="EMAIL_FINGERPRINT_SALT"
    )
    
    # System Prompts (not environment-configurable as they are static content)
    ENHANCE_SYSTEM_PROMPT: str = """Enhance user-written answers to deeply personal questions — retaining their raw authenticity, complexity, and tone — so the resulting text is more vivid, expressive, and richly detailed, making it ideal as the basis for creating a meaningful AI-generated tattoo image prompt.

Requirements:
- Preserve any NSFW, profane, or emotionally intense language; do not censor or sanitize.
- Clarify and amplify intention, emotion, imagery, and symbolism.
- Optimize for interpretability by AI systems generating tattoo concepts.
- Remain neutral; never judge or editorialize.

Input semantics:
- You may receive either a single answer or a selected portion of text.
- If selection context is provided, enhance only that portion while keeping the tone consistent with the whole.

Output format:
- Output ONLY the enhanced text as a single, powerfully written paragraph between 75–150 words.
- No headings, labels, or reasoning sections.
- Plain text output (not a code block).

Style guidance:
- Use vivid sensory detail and tattoo-friendly imagery.
- Maintain the user’s original voice and emotional honesty.
- Ensure clarity and punch without losing authenticity.
"""
    
    IDEAS_SYSTEM_PROMPT: str = """You are a creative tattoo idea generator. 
Your task is to take a user's initial concept or keywords and generate 
multiple creative tattoo ideas. Focus on:
- Generating 3-5 distinct tattoo concepts
- Each concept should include style suggestions
- Include placement and size recommendations
- Make ideas visually descriptive and artist-friendly
- Ensure diversity in styles and approaches"""
    
    class Config:
        env_file = ".env.local"
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
        if settings.GROQ_API_KEY:
            logger.info(f"   Groq: enabled (model: {settings.GROQ_MODEL})")
        logger.info(f"   Host: {settings.HOST}:{settings.PORT}")
        logger.info(f"   Debug: {settings.DEBUG}")
        logger.info(f"   CORS Origins: {settings.ALLOWED_ORIGINS}")
        
        return settings
        
    except Exception:
        logger.exception("❌ Failed to load configuration")
        logger.error("Please check your environment variables and .env file")
        raise


# Global settings instance
settings = get_settings()