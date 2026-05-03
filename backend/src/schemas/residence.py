"""Pydantic schemas for the Residence & Maps APIs."""

from pydantic import BaseModel, Field
from typing import Optional


class ResidenceExample(BaseModel):
    """A single residence example card."""

    title: str
    description: str
    official_basis: str = Field(..., alias="officialBasis")

    model_config = {"populate_by_name": True}


class ResidenceExamplesResponse(BaseModel):
    """Response body for GET /api/residence/examples."""

    examples: list[ResidenceExample]


class VoterCentre(BaseModel):
    """A single voter centre / AERO office."""

    id: str
    ac_no: str = Field(..., alias="acNo")
    ac_name: str = Field(..., alias="acName")
    name: str
    address: str
    lat: float
    lng: float
    phone: Optional[str] = None
    email: Optional[str] = None

    model_config = {"populate_by_name": True}


class DelhiCentresResponse(BaseModel):
    """Response body for GET /api/residence/delhi-centres."""

    query_normalized: str = Field(..., alias="queryNormalized")
    centres: list[VoterCentre]

    model_config = {"populate_by_name": True}
