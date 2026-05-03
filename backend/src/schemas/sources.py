"""Pydantic schemas for the Help & Sources API."""

from pydantic import BaseModel
from typing import Literal


class OfficialSource(BaseModel):
    """A single official document/source entry."""

    id: str
    title: str
    type: Literal["form", "guideline", "portal", "app"]
    url: str
    description: str


class SourcesResponse(BaseModel):
    """Response body for GET /api/sources."""

    documents: list[OfficialSource]
