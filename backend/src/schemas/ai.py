"""Pydantic schemas for the AI Answer API."""

from pydantic import BaseModel, Field
from typing import Optional, Literal


VALID_PHASES = ("intro", "general", "eligibility", "residence", "documents", "registration", "status", "quiz", "sources")


class AIAnswerRequest(BaseModel):
    """Request body for POST /api/ai/answer."""

    question: str = Field(..., min_length=1, max_length=2000, description="The user's question.")
    phase: Literal["intro", "general", "eligibility", "residence", "documents", "registration", "status", "quiz", "sources"] = Field(
        ..., description="Current phase of the voter journey."
    )
    context: Optional[dict] = Field(None, description="Additional context (e.g., city, state).")

    model_config = {"populate_by_name": True}


class AISource(BaseModel):
    """A source citation returned with the AI answer."""

    title: str
    url: str


class AIAnswerResponse(BaseModel):
    """Response body for POST /api/ai/answer."""

    answer: str
    sources: list[AISource]
