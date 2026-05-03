"""Pydantic schemas for the Registration Walkthrough API."""

from pydantic import BaseModel, Field
from typing import Optional


class RegistrationStep(BaseModel):
    """A single step in the registration walkthrough."""

    step_number: int = Field(..., alias="stepNumber")
    title: str
    description: str
    tips: list[str]
    common_errors: list[str] = Field(default_factory=list, alias="commonErrors")
    video_url: Optional[str] = Field(None, alias="videoUrl")

    model_config = {"populate_by_name": True, "by_alias": True}


class RegistrationStepsResponse(BaseModel):
    """Response body for GET /api/registration/steps."""

    channel: str
    steps: list[RegistrationStep]
