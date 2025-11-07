"""
Ask TaTTTy request logging service

This service handles logging of all Ask TaTTTy API calls to the database
for analytics, monitoring, and debugging purposes.
"""
import time
from typing import Optional, Dict
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
        error_message: Optional[str] = None,
        usage: Optional[Dict[str, int]] = None,
        model: Optional[str] = None
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

            # Extract token usage
            input_tokens = int(usage.get("input_tokens", 0)) if usage else 0
            output_tokens = int(usage.get("output_tokens", 0)) if usage else 0
            total_tokens = int(usage.get("total_tokens", input_tokens + output_tokens)) if usage else (input_tokens + output_tokens)

            # Pricing table (USD per 1K tokens)
            pricing = {
                # Example pricing; unknown models default to 0 cost
                "gpt-4o-mini": {"input_per_1K": 0.0003, "output_per_1K": 0.0015},
                "gpt-4o": {"input_per_1K": 0.005, "output_per_1K": 0.015},
            }
            model_name = model or "unknown"
            rates = pricing.get(model_name, {"input_per_1K": 0.0, "output_per_1K": 0.0})
            cost_usd = (input_tokens / 1000.0) * rates["input_per_1K"] + (output_tokens / 1000.0) * rates["output_per_1K"]
            
            # Use the PostgreSQL function to log the request
            async with get_db_connection() as conn:
                request_id = await conn.fetchval("""
                    SELECT log_ask_tattty_request(
                        $1, $2, $3, $4, $5, $6, $7,
                        $8, $9, $10, $11, $12
                    )
                """,
                    action_type,
                    input_text,
                    output_text,
                    response_time_ms,
                    session_id,
                    was_successful,
                    error_message,
                    input_tokens,
                    output_tokens,
                    total_tokens,
                    model_name,
                    cost_usd
                )
            
            logger.info(
                f"✅ Logged Ask TaTTTy {action_type} request: "
                f"{input_char_count}→{output_char_count} chars, "
                f"{response_time_ms}ms, tokens={total_tokens}, model={model_name}, cost=${cost_usd:.6f}, success={was_successful}"
            )
            
            return request_id
            
        except Exception as e:
            # Fail loud: include stack trace and propagate the error
            logger.exception("❌ Failed to log Ask TaTTTy request")
            raise


# Global logger instance
ask_tattty_logger = AskTatttyLogger()