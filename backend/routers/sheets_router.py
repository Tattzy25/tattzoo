"""
Google Sheets API router for TaTTTy backend

This router provides endpoints for:
1. Reading data from Google Sheets (gallery, content, etc.)
2. Logging user interactions and generations
3. Collecting feedback and analytics
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from backend.services.google_sheets_service import google_sheets_service
from backend.models.schemas import TattooGenerationLog, UserFeedback
from backend.config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/sheets", tags=["Google Sheets"])

@router.get("/test", response_model=Dict[str, Any])
async def test_connection():
    """Test Google Sheets connection"""
    try:
        if not google_sheets_service.client:
            raise HTTPException(
                status_code=503, 
                detail="Google Sheets service not configured"
            )
        
        return {
            "status": "connected",
            "message": "Google Sheets service is operational",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Google Sheets connection test failed: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Google Sheets connection failed: {str(e)}"
        )

@router.get("/gallery/{spreadsheet_id}", response_model=List[Dict[str, Any]])
async def get_gallery_from_sheets(
    spreadsheet_id: str,
    worksheet_name: str = "Gallery"
):
    """Fetch tattoo gallery data from Google Sheets"""
    try:
        records = await google_sheets_service.read_all_records(
            spreadsheet_id, 
            worksheet_name
        )
        
        if not records:
            logger.warning(f"No records found in {spreadsheet_id}/{worksheet_name}")
            return []
        
        # Filter out empty rows and format data
        gallery_data = []
        for record in records:
            if record.get('image_url') and record.get('title'):
                gallery_data.append({
                    'id': record.get('id'),
                    'title': record.get('title'),
                    'image_url': record.get('image_url'),
                    'style': record.get('style'),
                    'placement': record.get('placement'),
                    'mood': record.get('mood'),
                    'tags': record.get('tags', '').split(',') if record.get('tags') else [],
                    'created_at': record.get('created_at')
                })
        
        return gallery_data
        
    except Exception as e:
        logger.error(f"Failed to fetch gallery data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch gallery data: {str(e)}"
        )

@router.get("/content/{spreadsheet_id}", response_model=Dict[str, Any])
async def get_content_from_sheets(
    spreadsheet_id: str,
    worksheet_name: str = "Content"
):
    """Fetch app content (headings, copy, etc.) from Google Sheets"""
    try:
        records = await google_sheets_service.read_all_records(
            spreadsheet_id,
            worksheet_name
        )
        
        # Convert list of records to key-value pairs
        content_data = {}
        for record in records:
            if record.get('key') and record.get('value'):
                content_data[record['key']] = {
                    'value': record['value'],
                    'category': record.get('category'),
                    'last_updated': record.get('last_updated')
                }
        
        return content_data
        
    except Exception as e:
        logger.error(f"Failed to fetch content data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch content data: {str(e)}"
        )

@router.post("/log/generation")
async def log_tattoo_generation(generation_data: TattooGenerationLog):
    """Log tattoo generation to Google Sheets"""
    try:
        if not settings.TATTOO_LOG_SPREADSHEET_ID:
            raise HTTPException(
                status_code=503,
                detail="Tattoo logging spreadsheet not configured"
            )
        
        # Prepare data for logging
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'user_id': generation_data.user_id,
            'session_id': generation_data.session_id,
            'prompt': generation_data.prompt,
            'style': generation_data.style,
            'placement': generation_data.placement,
            'mood': generation_data.mood,
            'size': generation_data.size,
            'model_used': generation_data.model_used,
            'generation_time': generation_data.generation_time,
            'success': generation_data.success,
            'error_message': generation_data.error_message
        }
        
        success = await google_sheets_service.log_tattoo_generation(
            log_data,
            settings.TATTOO_LOG_SPREADSHEET_ID
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to log generation to spreadsheet"
            )
        
        return {
            "status": "logged",
            "message": "Generation logged successfully",
            "timestamp": log_data['timestamp']
        }
        
    except Exception as e:
        logger.error(f"Failed to log generation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to log generation: {str(e)}"
        )

@router.post("/feedback")
async def submit_feedback(feedback: UserFeedback):
    """Submit user feedback to Google Sheets"""
    try:
        if not settings.FEEDBACK_SPREADSHEET_ID:
            raise HTTPException(
                status_code=503,
                detail="Feedback spreadsheet not configured"
            )
        
        # Prepare feedback data
        feedback_row = [
            datetime.now().isoformat(),
            feedback.user_id,
            feedback.feedback_type,
            feedback.rating,
            feedback.message,
            feedback.page,
            feedback.feature_used,
            feedback.user_agent
        ]
        
        success = await google_sheets_service.append_row(
            settings.FEEDBACK_SPREADSHEET_ID,
            feedback_row,
            "Feedback"
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to submit feedback to spreadsheet"
            )
        
        return {
            "status": "submitted",
            "message": "Feedback submitted successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to submit feedback: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit feedback: {str(e)}"
        )

@router.get("/analytics/{spreadsheet_id}", response_model=Dict[str, Any])
async def get_analytics_data(
    spreadsheet_id: str,
    worksheet_name: str = "Analytics",
    date_range: Optional[str] = None
):
    """Get analytics data from Google Sheets"""
    try:
        records = await google_sheets_service.read_all_records(
            spreadsheet_id,
            worksheet_name
        )
        
        # Process analytics data
        analytics = {
            "total_generations": 0,
            "popular_styles": {},
            "popular_placements": {},
            "daily_usage": {},
            "user_engagement": {}
        }
        
        for record in records:
            # Count total generations
            analytics["total_generations"] += 1
            
            # Track popular styles
            style = record.get('style')
            if style:
                analytics["popular_styles"][style] = analytics["popular_styles"].get(style, 0) + 1
            
            # Track popular placements
            placement = record.get('placement')
            if placement:
                analytics["popular_placements"][placement] = analytics["popular_placements"].get(placement, 0) + 1
            
            # Track daily usage
            date = record.get('date')
            if date:
                analytics["daily_usage"][date] = analytics["daily_usage"].get(date, 0) + 1
        
        return analytics
        
    except Exception as e:
        logger.error(f"Failed to get analytics data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get analytics data: {str(e)}"
        )

@router.put("/content/{spreadsheet_id}/{key}")
async def update_content(
    spreadsheet_id: str,
    key: str,
    value: str,
    category: Optional[str] = None
):
    """Update content in Google Sheets (admin only)"""
    try:
        # Find the row with the matching key
        records = await google_sheets_service.read_all_records(
            spreadsheet_id,
            "Content"
        )
        
        row_num = None
        for i, record in enumerate(records, start=2):  # Start at 2 (assuming header in row 1)
            if record.get('key') == key:
                row_num = i
                break
        
        if not row_num:
            # Add new row if key doesn't exist
            new_row = [key, value, category or "", datetime.now().isoformat()]
            success = await google_sheets_service.append_row(
                spreadsheet_id,
                new_row,
                "Content"
            )
        else:
            # Update existing row
            updates = [
                [key, value, category or "", datetime.now().isoformat()]
            ]
            success = await google_sheets_service.update_range(
                spreadsheet_id,
                f"A{row_num}:D{row_num}",
                updates,
                "Content"
            )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to update content"
            )
        
        return {
            "status": "updated",
            "key": key,
            "value": value
        }
        
    except Exception as e:
        logger.error(f"Failed to update content: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update content: {str(e)}"
        )