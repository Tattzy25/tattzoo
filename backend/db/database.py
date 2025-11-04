"""
Database connection and session management for PostgreSQL with Neon

This module provides:
- Async database connection using asyncpg
- SQLAlchemy async session management
- Connection pooling for performance
- Proper error handling and connection cleanup
"""
import os
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

from config.settings import settings

# Configure logging
logger = logging.getLogger(__name__)

# SQLAlchemy Base for models
Base = declarative_base()

# Database engine and session factory
engine = None
AsyncSessionLocal = None

def init_database():
    """Initialize database connection and create session factory"""
    global engine, AsyncSessionLocal
    
    if not settings.DATABASE_URL:
        logger.warning("DATABASE_URL not set, database functionality will be disabled")
        return
    
    try:
        # Create async engine with connection pooling
        engine = create_async_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            poolclass=NullPool,  # Use NullPool for serverless environments like Neon
            pool_pre_ping=True,  # Check connections before using them
            connect_args={
                "command_timeout": 60,
                "server_settings": {
                    "application_name": "tattzoo-backend"
                }
            }
        )
        
        # Create async session factory
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False
        )
        
        logger.info("✅ Database connection initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize database connection: {e}")
        raise

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Get an async database session
    
    Yields:
        AsyncSession: Async database session
    
    Raises:
        Exception: If database is not initialized or connection fails
    """
    if not AsyncSessionLocal:
        raise Exception("Database not initialized. Call init_database() first")
    
    session = AsyncSessionLocal()
    try:
        yield session
        await session.commit()
    except Exception as e:
        await session.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        await session.close()

async def test_connection():
    """Test database connection"""
    if not engine:
        return False
    
    try:
        async with engine.connect() as conn:
            result = await conn.scalar("SELECT version();")
            logger.info(f"✅ Database connection test successful: {result}")
            return True
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False