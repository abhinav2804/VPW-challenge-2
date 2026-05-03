"""Pydantic schemas for the Document Checklist API."""

from pydantic import BaseModel


class ChecklistItem(BaseModel):
    """A single item in a checklist section."""

    id: str
    label: str
    examples: list[str]
    mandatory: bool


class ChecklistSection(BaseModel):
    """A section grouping related checklist items."""

    id: str
    title: str
    description: str
    items: list[ChecklistItem]


class DocumentChecklistResponse(BaseModel):
    """Response body for GET /api/documents/checklist."""

    sections: list[ChecklistSection]
