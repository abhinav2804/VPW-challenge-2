"""Help & Sources API router."""

import logging
from fastapi import APIRouter, HTTPException

from src.schemas.sources import SourcesResponse, OfficialSource
from src.utils.data_loader import load_json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sources", tags=["Sources"])


@router.get("", response_model=SourcesResponse)
async def get_sources():
    """Return a consolidated list of all official ECI materials and portals.

    This endpoint serves as the data source for the Help & Sources screen.
    """
    try:
        raw = load_json("official_sources.json")
        documents = [OfficialSource(**doc) for doc in raw]
        return SourcesResponse(documents=documents)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Official sources data not found.")
    except Exception as exc:
        logger.exception("Failed to load official sources.")
        raise HTTPException(status_code=500, detail=str(exc))
