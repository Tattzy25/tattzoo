"""
Database connection and session management for PostgreSQL with Neon using asyncpg

This module provides:
- Async database connection using asyncpg (no SQLAlchemy)
- Connection pooling for performance
- Proper error handling and connection cleanup
"""
import os
import logging
import asyncpg
from typing import AsyncGenerator, Optional
from contextlib import asynccontextmanager

from config.settings import settings

# Configure logging
logger = logging.getLogger(__name__)

# Global connection pool
connection_pool: Optional[asyncpg.pool.Pool] = None


def init_database():
    """Initialize database connection pool"""
    global connection_pool
    
    if not settings.DATABASE_URL:
        logger.warning("DATABASE_URL not set, database functionality will be disabled")
        return
    
    try:
        # Create connection pool
        connection_pool = asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=1,
            max_size=10,
            command_timeout=60,
            server_settings={
                "application_name": "tattzoo-backend"
            }
        )
        
        logger.info("✅ Database connection pool initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize database connection pool: {e}")
        raise


@asynccontextmanager
async def get_db_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    """
    Get an async database connection from the pool
    
    Yields:
        asyncpg.Connection: Async database connection
    
    Raises:
        Exception: If database is not initialized or connection fails
    """
    if not connection_pool:
        raise Exception("Database not initialized. Call init_database() first")
    
    connection = await connection_pool.acquire()
    try:
        yield connection
    finally:
        await connection_pool.release(connection)


async def test_connection():
    """Test database connection"""
    if not connection_pool:
        return False
    
    try:
        async with get_db_connection() as conn:
            result = await conn.fetchval("SELECT version();")
            logger.info(f"✅ Database connection test successful: {result}")
            return True
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False


async def execute_query(query: str, *args) -> Optional[list]:
    """Execute a query and return results"""
    try:
        async with get_db_connection() as conn:
            result = await conn.fetch(query, *args)
            return result
    except Exception as e:
        logger.error(f"❌ Query execution failed: {e}")
        return None


async def execute_command(command: str, *args) -> bool:
    """Execute a command (INSERT, UPDATE, DELETE)"""
    try:
        async with get_db_connection() as conn:
            await conn.execute(command, *args)
            return True
    except Exception as e:
        logger.error(f"❌ Command execution failed: {e}")
        return False