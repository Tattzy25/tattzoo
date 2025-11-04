"""
Ask TaTTTy request logging service

This service handles logging of all Ask TaTTTy API calls to the database
for analytics, monitoring, and debugging purposes.
"""
import time
from typing import Optional
import logging
import asyncpg

from db.database_asyncpg import get_db_connection

logger = logging.getLogger(__name__)


class AskTatttyLogger:
    """Service for logging Ask TaTTTy API requests"""
    
    async def log_request(
        self,
        action_type: str,
        input_text: str,
        output_text: str,
        response_time_ms: int,
        session_id: Optional[str] = None,
        was_successful: bool = True,
        error_message: Optional[str] = None
    ) -> Optional[str]:
        """
        Log an Ask TaTTTy API request to the database
        
        Args:
            action_type: Type of action ('enhance' or 'ideas')
            input_text: Original input text
            output_text: AI-generated output text
            response_time_ms: Response time in milliseconds
            session_id: Optional session identifier
            was_successful: Whether the request was successful
            error_message: Error message if request failed
            
        Returns:
            UUID of the logged request, or None if logging failed
        """
        try:
            # Calculate character counts
            input_char_count = len(input_text)
            output_char_count = len(output_text)
            
            # Use the PostgreSQL function to log the request
            async with get_db_connection() as conn:
                request_id = await conn.fetchval("""
                    SELECT log_ask_tattty_request(
                        $1, $2, $3, $4, $5, $6, $7
                    )
                """,
                    action_type,
                    input_text,
                    output_text,
                    response_time_ms,
                    session_id,
                    was_successful,
                    error_message
                )
            
            logger.info(
                f"✅ Logged Ask TaTTTy {action_type} request: "
                f"{input_char_count}→{output_char_count} chars, "
                f"{response_time_ms}ms, success={was_successful}"
            )
            
            return request_id
            
        except Exception as e:
            logger.error(f"❌ Failed to log Ask TaTTTy request: {e}")
            # Don't raise the error - logging failure shouldn't break the API
            return None


# Global logger instance
ask_tattty_logger = AskTatttyLogger()