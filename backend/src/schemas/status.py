"""Pydantic schemas for the Status & Next Steps API."""

from pydantic import BaseModel, Field


class StatusStage(BaseModel):
    """A single stage in the voter registration lifecycle."""

    id: str
    label: str
    description: str
    estimated_time_range: str = Field(..., alias="estimatedTimeRange")
    where_to_check: str = Field(..., alias="whereToCheck")

    model_config = {"populate_by_name": True}


class StatusStagesResponse(BaseModel):
    """Response body for GET /api/status/stages."""

    stages: list[StatusStage]
