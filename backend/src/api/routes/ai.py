"""AI Answer API router."""

import logging
from fastapi import APIRouter, HTTPException

from src.schemas.ai import AIAnswerRequest, AIAnswerResponse
from src.services.gemini_service import ask_ai

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/answer", response_model=AIAnswerResponse)
async def get_ai_answer(payload: AIAnswerRequest):
    """Return a grounded AI answer using Gemini + uploaded ECI documents.

    The response includes the answer text and a list of source citations
    derived from the files in the Gemini File API.
    """
    try:
        result = await ask_ai(
            question=payload.question,
            phase=payload.phase,
            context=payload.context,
        )
        return AIAnswerResponse(**result)
    except Exception as exc:
        logger.exception("AI answer generation failed.")
        raise HTTPException(status_code=500, detail=str(exc))
