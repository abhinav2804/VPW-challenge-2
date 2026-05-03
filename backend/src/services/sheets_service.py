"""Google Sheets API service — saves mock application submissions.

Acts as a mock database by appending submitted form data to a Google Sheet.
"""

import logging
from typing import Optional

from googleapiclient.discovery import build
import google.auth
from google.auth.exceptions import DefaultCredentialsError

from src.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_sheets_service = None


def _get_sheets_service():
    """Lazily initialise the Google Sheets client."""
    global _sheets_service
    if _sheets_service is None:
        try:
            credentials, project = google.auth.default(
                scopes=["https://www.googleapis.com/auth/spreadsheets"]
            )
            _sheets_service = build('sheets', 'v4', credentials=credentials)
        except DefaultCredentialsError:
            logger.warning("Google Cloud credentials not found. Sheets operations will be mocked.")
            return None
        except Exception as e:
            logger.error("Failed to initialise Sheets client: %s", e)
            return None
    return _sheets_service


async def append_application_row(data: list) -> bool:
    """Append a row of data to the configured Google Sheet.

    Args:
        data: A list of string values representing a row.

    Returns:
        True if successful, False otherwise.
    """
    service = _get_sheets_service()
    
    if not settings.GOOGLE_SHEETS_ID or not service:
        # Fallback for local development
        logger.info(f"[MOCK] Appended row to Google Sheet: {data}")
        return True

    try:
        sheet = service.spreadsheets()
        
        body = {
            'values': [data]
        }
        
        result = sheet.values().append(
            spreadsheetId=settings.GOOGLE_SHEETS_ID,
            range="Sheet1!A1",
            valueInputOption="USER_ENTERED",
            body=body
        ).execute()
        
        logger.info(f"Appended {result.get('updates').get('updatedCells')} cells to Google Sheet.")
        return True
    except Exception as e:
        logger.exception("Failed to append row to Google Sheets.")
        return False
