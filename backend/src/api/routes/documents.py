"""Document Checklist API router."""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from src.schemas.documents import DocumentChecklistResponse, ChecklistSection
from src.utils.data_loader import load_json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("/checklist", response_model=DocumentChecklistResponse)
async def get_document_checklist(
    state: Optional[str] = Query(None, description="State for filtering (future use)"),
    age_band: Optional[str] = Query(None, alias="ageBand", description="Age band for filtering (future use)"),
):
    """Return the structured document checklist derived from Form 6 requirements.

    Each section contains items with labels, examples, and mandatory flags.
    Optional ``state`` and ``ageBand`` params are accepted for future
    state-specific filtering.
    """
    try:
        raw = load_json("document_checklist.json")
        sections = [ChecklistSection(**section) for section in raw]
        return DocumentChecklistResponse(sections=sections)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Document checklist data not found.")
    except Exception as exc:
        logger.exception("Failed to load document checklist.")
        raise HTTPException(status_code=500, detail=str(exc))
