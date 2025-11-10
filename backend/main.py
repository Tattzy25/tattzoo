"""
Main FastAPI application for Tattty Backend

This is the entry point for the Tattty tattoo generator backend API.
It orchestrates all routers and middleware for the application.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routers import ai_router, health_router, key_router, image_router
from db.database_asyncpg import init_database, close_database

# Configure logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events"""
    # Startup
    try:
        await init_database()
        logger.info("✅ Database initialization completed")
    except Exception as e:
        logger.warning(f"⚠️ Database initialization skipped: {e}")

    yield

    # Shutdown
    try:
        await close_database()
        logger.info("🛑 Database connection closed")
    except Exception as e:
        logger.warning(f"⚠️ Database cleanup failed: {e}")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application

    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title="Tattty Backend API",
        version="1.0.0",
        description="Backend API for Tattty tattoo generator with AI enhancement",
        debug=settings.DEBUG,
        lifespan=lifespan
    )

    # Configure CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health_router.router)
    app.include_router(ai_router.router)
    app.include_router(key_router.router)
    app.include_router(image_router.router)

    return app


# Create application instance
app = create_app()


if __name__ == "__main__":
    """
    Entry point for running the application directly
    """
    import uvicorn
    
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
