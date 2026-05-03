"""Google Maps Geocoding service for Delhi voter centre lookups."""

import logging
import math
from typing import Optional

import googlemaps

from src.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_gmaps: Optional[googlemaps.Client] = None


def _get_gmaps_client() -> googlemaps.Client:
    """Lazily initialise the Google Maps client."""
    global _gmaps
    if _gmaps is None:
        api_key = settings.GOOGLE_MAPS_API_KEY
        if not api_key:
            raise RuntimeError("GOOGLE_MAPS_API_KEY is not configured. Check your .env file.")
        _gmaps = googlemaps.Client(key=api_key)
    return _gmaps


def geocode_locality(query: str) -> Optional[dict]:
    """Geocode a locality string and return ``{formatted, lat, lng}`` or ``None``."""
    client = _get_gmaps_client()
    try:
        results = client.geocode(f"{query}, Delhi, India")
        if not results:
            return None
        top = results[0]
        location = top["geometry"]["location"]
        return {
            "formatted": top.get("formatted_address", query),
            "lat": location["lat"],
            "lng": location["lng"],
        }
    except Exception:
        logger.exception("Geocoding failed for query: %s", query)
        return None


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate the Haversine distance in kilometres between two lat/lng points."""
    R = 6371.0  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
