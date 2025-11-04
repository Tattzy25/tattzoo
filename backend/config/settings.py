"""
Application settings and configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = "gpt-5-nano-2025-08-07"

# Server Configuration
HOST = "0.0.0.0"
PORT = 8000
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "http://localhost:3000",
]

# Validation Configuration
MIN_CHARACTERS = 10

# System Prompts
ENHANCE_SYSTEM_PROMPT = """You are a tattoo design expert specializing in text enhancement. 
Your task is to take a user's tattoo description and improve it to be more descriptive, 
creative, and suitable for tattoo artists. Focus on:
- Adding vivid imagery and sensory details
- Incorporating tattoo-specific terminology
- Maintaining the original meaning and intent
- Making it visually descriptive for artists
- Keeping it concise but impactful"""

IDEAS_SYSTEM_PROMPT = """You are a creative tattoo idea generator. 
Your task is to take a user's initial concept or keywords and generate 
multiple creative tattoo ideas. Focus on:
- Generating 3-5 distinct tattoo concepts
- Each concept should include style suggestions
- Include placement and size recommendations
- Make ideas visually descriptive and artist-friendly
- Ensure diversity in styles and approaches"""

# API Timeout Configuration
REQUEST_TIMEOUT = 30000  # 30 seconds
STREAMING_THROTTLE_MS = 50  # UI update throttle