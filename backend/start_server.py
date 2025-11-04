#!/usr/bin/env python3
"""
Start script for Tattty Backend API
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import settings to trigger validation
from config.settings import settings

# Check if OpenAI API key is set
if not settings.OPENAI_API_KEY:
    print("❌ ERROR: OPENAI_API_KEY environment variable is not set!")
    print("Please create a .env file in the backend directory with:")
    print("OPENAI_API_KEY=your_actual_openai_api_key")
    print("\nYou can get your API key from: https://platform.openai.com/api-keys")
    sys.exit(1)

# Import and run the FastAPI app
from main import app
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Tattty Backend API...")
    print(f"🔑 OpenAI API Key: {'*' * 20}{settings.OPENAI_API_KEY.get_secret_value()[-4:]}")
    print(f"🤖 Model: {settings.OPENAI_MODEL}")
    print(f"🌐 Server: http://{settings.HOST}:{settings.PORT}")
    print("📋 Available endpoints:")
    print("   POST /api/ai/enhance - Enhance tattoo descriptions")
    print("   POST /api/ai/ideas   - Generate tattoo ideas")
    print("   GET  /health        - Health check")
    print("-" * 50)
    
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)