"""Registration Walkthrough API router."""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from src.schemas.registration import RegistrationStepsResponse, RegistrationStep
from src.utils.data_loader import load_json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/registration", tags=["Registration"])


@router.get("/steps", response_model=RegistrationStepsResponse)
async def get_registration_steps(
    channel: Optional[str] = Query("portal", description="Channel: 'portal' or 'app'"),
) -> RegistrationStepsResponse:
    """Return step-by-step registration walkthrough for the chosen channel.

    Supported channels:
    - ``portal`` — NVSP web portal steps (default)
    - ``app`` — Voter Helpline mobile app steps
    """
    channel = (channel or "portal").lower().strip()
    if channel not in ("portal", "app"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid channel '{channel}'. Must be 'portal' or 'app'.",
        )

    try:
        raw = load_json("registration_steps.json")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Registration steps data not found.")

    if not isinstance(raw, dict):
        raise HTTPException(status_code=500, detail="Invalid data format for registration steps.")

    steps_data = raw.get(channel, [])
    steps = [RegistrationStep(**s) for s in steps_data]
    return RegistrationStepsResponse(channel=channel, steps=steps)
