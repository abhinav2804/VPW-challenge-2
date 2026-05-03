"""Pydantic schemas for the Eligibility API."""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class EligibilityCheckRequest(BaseModel):
    """Request body for POST /api/eligibility/check."""

    age_years: int = Field(..., alias="ageYears", ge=0, le=150, description="Age of the user in years.")
    citizen: bool = Field(..., description="Whether the user is an Indian citizen.")
    resident_in_india: bool = Field(..., alias="residentInIndia", description="Whether the user currently resides in India.")
    currently_registered: Optional[bool] = Field(None, alias="currentlyRegistered", description="Whether the user is already registered as a voter.")
    state: Optional[str] = Field(None, description="State of residence.")
    city: Optional[str] = Field(None, description="City of residence.")

    model_config = {"populate_by_name": True}


class EligibilityReason(BaseModel):
    """A single reason item in the eligibility response."""

    text: str
    severity: Literal["info", "warn"]


class EligibilityLink(BaseModel):
    """An external link returned with the eligibility response."""

    title: str
    url: str


class EligibilityCheckResponse(BaseModel):
    """Response body for POST /api/eligibility/check."""

    eligible: bool
    phase: Literal["new_form6", "learn_only"]
    summary: str
    reasons: list[EligibilityReason]
    links: list[EligibilityLink]
