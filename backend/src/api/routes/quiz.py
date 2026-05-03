"""Quiz Engine API router."""

import logging
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, HTTPException, Query

from src.schemas.quiz import (
    QuizQuestion,
    QuizOption,
    QuizQuestionsResponse,
    QuizGradeRequest,
    QuizGradeResponse,
)
from src.utils.data_loader import load_json

from src.services.quiz_service import grade_quiz_submission

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])


def _load_quiz_bank() -> List[Dict[str, Any]]:
    """Load the full quiz question bank (with answers)."""
    data = load_json("quiz_questions.json")
    if not isinstance(data, list):
        return []
    return data


@router.get("/questions", response_model=QuizQuestionsResponse)
async def get_quiz_questions(
    topic: Optional[str] = Query(None, description="Filter by topic: residence, documents, forms"),
) -> QuizQuestionsResponse:
    """Return quiz questions with answers stripped out.

    Optionally filter by ``topic``. Correct answers and explanations are
    never sent to the frontend — they're only used during grading.
    """
    try:
        bank = _load_quiz_bank()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Quiz data not found.")

    # Filter by topic if provided
    if topic:
        topic_lower = topic.lower().strip()
        bank = [q for q in bank if q.get("topic", "").lower() == topic_lower]

    # Sanitise: strip correctAnswer and explanation before returning
    questions = []
    for q in bank:
        questions.append(
            QuizQuestion(
                id=q["id"],
                topic=q["topic"],
                question=q["question"],
                options=[QuizOption(**opt) for opt in q["options"]],
            )
        )

    return QuizQuestionsResponse(questions=questions)


@router.post("/grade", response_model=QuizGradeResponse)
async def grade_quiz(payload: QuizGradeRequest) -> QuizGradeResponse:
    """Grade submitted quiz answers against the question bank.

    Returns a score, max score, and per-question detailed feedback
    including whether the answer was correct and the explanation.
    """
    if len(payload.question_ids) != len(payload.answers):
        raise HTTPException(
            status_code=400,
            detail="questionIds and answers arrays must be the same length.",
        )

    try:
        return grade_quiz_submission(payload)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Quiz data not found.")
    except Exception:
        logger.exception("Quiz grading failed.")
        raise HTTPException(status_code=500, detail="An error occurred during grading.")
