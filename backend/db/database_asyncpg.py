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
import asyncio
from contextlib import asynccontextmanager

from config.settings import settings

# Configure logging
logger = logging.getLogger(__name__)

# Global connection pool
connection_pool: Optional[asyncpg.pool.Pool] = None


async def init_database():
    """Initialize database connection pool (async, best effort)

    - If `DATABASE_URL` is missing or connection fails, log the error and
      continue without a pool so the API remains available.
    - Downstream DB-dependent features must guard usage accordingly.
    """
    global connection_pool

    if not settings.DATABASE_URL:
        logger.error("CRITICAL: DATABASE_URL is not configured — DB logging disabled")
        connection_pool = None
        return

    try:
        # Create connection pool (await required)
        connection_pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=1,
            max_size=10,
            command_timeout=60,
            server_settings={
                "application_name": "tattzoo-backend"
            }
        )

        logger.info("✅ Database connection pool initialized successfully")

    except Exception:
        logger.exception("❌ Failed to initialize database connection pool — continuing without DB")
        connection_pool = None
        return


async def close_database():
    """Close the database connection pool"""
    global connection_pool
    if connection_pool:
        try:
            await connection_pool.close()
            logger.info("🛑 Database connection pool closed")
        except Exception:
            logger.exception("❌ Failed to close database connection pool")


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