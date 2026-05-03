"""Eligibility API router."""

import logging
from fastapi import APIRouter, HTTPException

from src.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse
from src.services.eligibility_service import evaluate_eligibility

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])


@router.post("/check", response_model=EligibilityCheckResponse)
async def check_eligibility(payload: EligibilityCheckRequest):
    """Evaluate voter eligibility based on hard-coded ECI rules.

    Accepts age, citizenship, and residency details and returns a
    deterministic eligibility result with reasons and official links.
    """
    try:
        result = evaluate_eligibility(payload)
        return result
    except Exception as exc:
        logger.exception("Eligibility check failed.")
        raise HTTPException(status_code=500, detail=str(exc))
