"""Residence & Delhi Maps API router."""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from src.schemas.residence import (
    ResidenceExample,
    ResidenceExamplesResponse,
    DelhiCentresResponse,
    VoterCentre,
)
from src.services.maps_service import geocode_locality, haversine_distance
from src.utils.data_loader import load_json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/residence", tags=["Residence & Maps"])


@router.get("/examples", response_model=ResidenceExamplesResponse)
async def get_residence_examples(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
):
    """Return curated residence-scenario examples from Form 6 guidelines."""
    try:
        raw = load_json("residence_examples.json")
        examples = [ResidenceExample(**item) for item in raw]
        return ResidenceExamplesResponse(examples=examples)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Residence examples data not found.")
    except Exception as exc:
        logger.exception("Failed to load residence examples.")
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/delhi-centres", response_model=DelhiCentresResponse)
async def get_delhi_centres(
    ac: Optional[str] = Query(None, description="Assembly Constituency number or name"),
    q: Optional[str] = Query(None, description="Locality / PIN code to geocode"),
):
    """Look up Delhi voter centres by Assembly Constituency or locality search.

    - If ``ac`` is provided, centres are filtered by matching AC number/name.
    - If ``q`` is provided, the Google Maps Geocoding API resolves it to
      lat/lng and the nearest centres are returned sorted by distance.
    - At least one of ``ac`` or ``q`` must be supplied.
    """
    if not ac and not q:
        raise HTTPException(
            status_code=400,
            detail="At least one of 'ac' (Assembly Constituency) or 'q' (locality) must be provided.",
        )

    try:
        raw_centres = load_json("delhi_centres.json")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Delhi centres dataset not found.")

    query_normalized = ""

    # --- Filter by AC ---
    if ac:
        query_normalized = ac
        matched = [
            c for c in raw_centres
            if c["acNo"] == ac or c["acName"].lower() == ac.lower()
        ]
        if not matched:
            raise HTTPException(status_code=404, detail=f"No centres found for AC '{ac}'.")
        centres = [VoterCentre(**c) for c in matched]
        return DelhiCentresResponse(queryNormalized=query_normalized, centres=centres)

    # --- Geocode locality and find nearest centres ---
    geo_result = geocode_locality(q)  # type: ignore[arg-type]
    if not geo_result:
        # Fallback: return all centres when geocoding fails
        logger.warning("Geocoding returned no results for '%s'. Returning all centres.", q)
        centres = [VoterCentre(**c) for c in raw_centres[:5]]
        return DelhiCentresResponse(queryNormalized=q or "", centres=centres)

    query_normalized = geo_result["formatted"]
    user_lat, user_lng = geo_result["lat"], geo_result["lng"]

    # Calculate distances and sort
    for c in raw_centres:
        c["_distance"] = haversine_distance(user_lat, user_lng, c["lat"], c["lng"])
    raw_centres.sort(key=lambda c: c["_distance"])

    # Return top 5 nearest centres
    top_centres = []
    for c in raw_centres[:5]:
        c_copy = {k: v for k, v in c.items() if k != "_distance"}
        top_centres.append(VoterCentre(**c_copy))

    return DelhiCentresResponse(queryNormalized=query_normalized, centres=top_centres)
