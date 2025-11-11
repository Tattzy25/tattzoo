"""
Backend Default Values Configuration

All default values for tattoo generation parameters centralized in one location.

MIGRATION STRATEGY:
These values should eventually come from:
1. Database for user-configurable defaults
2. Environment variables for deployment-specific settings
3. API configuration endpoints

FAIL-LOUD POLICY:
- When defaults are used, log a warning
- In production, missing required values should throw errors
- No silent fallbacks without logging

DATABASE MIGRATION:
- Table: `generation_defaults`
- Query: SELECT * FROM generation_defaults WHERE is_active = true
"""

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class GenerationDefaults:
    """
    Centralized default values for tattoo generation
    
    These defaults are used when frontend doesn't provide values.
    All usage is logged for monitoring.
    """
    
    # Tattoo Style Defaults
    STYLE = "Traditional"
    COLOR_PREFERENCE = "Black & Grey"
    MOOD = "happy"
    PLACEMENT = "forearm"
    SIZE = "medium"
    
    # Image Generation Defaults
    ASPECT_RATIO = "1:1"
    MODEL = "sd3.5-large"
    
    # AI Model Defaults
    STABILITY_STYLE = "vivid"
    STABILITY_NEGATIVE_PROMPT = "blurry, low quality, distorted, ugly, text, words, letters"
    STABILITY_SEED = 0  # 0 = random seed
    
    # Validation Defaults
    MIN_QUESTION_LENGTH = 50
    MAX_QUESTION_LENGTH = 2000
    MIN_PROMPT_LENGTH = 10
    MAX_PROMPT_LENGTH = 5000
    
    # Aspect Ratio Mapping (for Stability AI)
    ASPECT_RATIO_MAP = {
        "1:1": "1:1",
        "16:9": "16:9",
        "9:16": "9:16",
        "4:3": "4:3",
        "3:4": "3:4",
        "21:9": "21:9",
        "9:21": "9:21",
        "3:2": "16:9",  # Map to closest supported
        "5:4": "1:1",   # Map to closest supported
        "4:5": "1:1",   # Map to closest supported
    }
    
    # Model Name Mapping (for Stability AI)
    MODEL_MAP = {
        "sd3.5-large": "sd3.5-large",
        "sd3-turbo": "sd3-turbo",
        "sd3.5-turbo": "sd3-turbo",  # Alias
        "quality": "sd3.5-large",     # Alias
        "fast": "sd3-turbo",          # Alias
    }
    
    @classmethod
    def log_default_usage(
        cls,
        parameter: str,
        value: Any,
        context: Optional[str] = None
    ) -> None:
        """
        Log when a default value is used
        
        This helps identify where fallbacks are happening in production
        and enables monitoring of missing parameter patterns.
        
        Args:
            parameter: Name of the parameter using default
            value: The default value being used
            context: Additional context (e.g., function name, user ID)
        """
        message = f"⚠️ DEFAULT VALUE USED: {parameter} = {value}"
        if context:
            message += f" (Context: {context})"
        
        logger.warning(message)
        
        # TODO: In production, send to analytics/monitoring service
        # Example: track_event('default_value_used', {
        #     'parameter': parameter,
        #     'value': value,
        #     'context': context
        # })
    
    @classmethod
    def get_style_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get tattoo style with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("tattoo_style", cls.STYLE, context)
        return cls.STYLE
    
    @classmethod
    def get_color_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get color preference with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("color_preference", cls.COLOR_PREFERENCE, context)
        return cls.COLOR_PREFERENCE
    
    @classmethod
    def get_mood_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get mood with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("mood", cls.MOOD, context)
        return cls.MOOD
    
    @classmethod
    def get_placement_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get placement with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("placement", cls.PLACEMENT, context)
        return cls.PLACEMENT
    
    @classmethod
    def get_size_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get size with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("size", cls.SIZE, context)
        return cls.SIZE
    
    @classmethod
    def get_aspect_ratio_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get aspect ratio with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("aspect_ratio", cls.ASPECT_RATIO, context)
        return cls.ASPECT_RATIO
    
    @classmethod
    def get_model_default(cls, provided_value: Optional[str], context: str = "") -> str:
        """Get model with logging if default is used"""
        if provided_value:
            return provided_value
        cls.log_default_usage("model", cls.MODEL, context)
        return cls.MODEL
    
    @classmethod
    def map_aspect_ratio(cls, aspect_ratio: str, context: str = "") -> str:
        """
        Map aspect ratio to Stability AI supported format
        
        FAIL LOUD: Logs warning if mapping occurs
        """
        mapped = cls.ASPECT_RATIO_MAP.get(aspect_ratio, cls.ASPECT_RATIO)
        
        if mapped != aspect_ratio:
            logger.warning(
                f"⚠️ ASPECT RATIO MAPPED: {aspect_ratio} -> {mapped} "
                f"(Context: {context})"
            )
        
        return mapped
    
    @classmethod
    def map_model(cls, model: str, context: str = "") -> str:
        """
        Map model name to Stability AI supported format
        
        FAIL LOUD: Logs warning if mapping occurs
        """
        mapped = cls.MODEL_MAP.get(model, cls.MODEL)
        
        if mapped != model:
            logger.warning(
                f"⚠️ MODEL NAME MAPPED: {model} -> {mapped} "
                f"(Context: {context})"
            )
        
        return mapped
    
    @classmethod
    def get_all_defaults(cls) -> Dict[str, Any]:
        """Get all default values as a dictionary"""
        return {
            "style": cls.STYLE,
            "color_preference": cls.COLOR_PREFERENCE,
            "mood": cls.MOOD,
            "placement": cls.PLACEMENT,
            "size": cls.SIZE,
            "aspect_ratio": cls.ASPECT_RATIO,
            "model": cls.MODEL,
        }
    
    @classmethod
    def validate_required_fields(
        cls,
        data: Dict[str, Any],
        required_fields: list[str]
    ) -> tuple[bool, Optional[str]]:
        """
        Validate that required fields are present and non-empty
        
        FAIL LOUD: Returns False and error message if validation fails
        
        Args:
            data: Dictionary of field values
            required_fields: List of required field names
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        for field in required_fields:
            value = data.get(field)
            
            if value is None:
                return False, f"Required field '{field}' is missing"
            
            if isinstance(value, str) and not value.strip():
                return False, f"Required field '{field}' is empty"
        
        return True, None


# Export singleton instance
generation_defaults = GenerationDefaults()
