"""Status & Next Steps API router."""

import logging
from fastapi import APIRouter, HTTPException

from src.schemas.status import StatusStagesResponse, StatusStage
from src.utils.data_loader import load_json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/status", tags=["Status"])


@router.get("/stages", response_model=StatusStagesResponse)
async def get_status_stages() -> StatusStagesResponse:
    """Return the voter registration lifecycle stages.

    Covers: Submitted → Under Verification → Accepted → EPIC Issued.
    """
    try:
        raw = load_json("status_stages.json")
        stages = [StatusStage(**s) for s in raw]
        return StatusStagesResponse(stages=stages)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Status stages data not found.")
    except Exception as exc:
        logger.exception("Failed to load status stages.")
        raise HTTPException(status_code=500, detail=str(exc))
