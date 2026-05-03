"""Pydantic schemas for the Quiz Engine APIs."""

from pydantic import BaseModel, Field


class QuizOption(BaseModel):
    """A single answer option for a quiz question."""

    id: str
    text: str


class QuizQuestion(BaseModel):
    """A quiz question returned to the frontend (answer stripped)."""

    id: str
    topic: str
    question: str
    options: list[QuizOption]


class QuizQuestionsResponse(BaseModel):
    """Response body for GET /api/quiz/questions."""

    questions: list[QuizQuestion]


class QuizGradeRequest(BaseModel):
    """Request body for POST /api/quiz/grade."""

    question_ids: list[str] = Field(..., alias="questionIds", min_length=1)
    answers: list[str] = Field(..., min_length=1)

    model_config = {"populate_by_name": True}


class QuizDetailedResult(BaseModel):
    """Detailed result for a single graded question."""

    question_id: str = Field(..., alias="questionId")
    correct: bool
    explanation: str

    model_config = {"populate_by_name": True}


class QuizGradeResponse(BaseModel):
    """Response body for POST /api/quiz/grade."""

    score: int
    max_score: int = Field(..., alias="maxScore")
    detailed: list[QuizDetailedResult]

    model_config = {"populate_by_name": True}
