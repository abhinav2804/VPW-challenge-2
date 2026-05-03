"""Unit tests for the quiz service."""

from src.services.quiz_service import grade_quiz_submission
from src.schemas.quiz import QuizGradeRequest


def test_grade_quiz_all_correct():
    payload = QuizGradeRequest(
        question_ids=["q1", "q3", "q5"],
        answers=["b", "c", "a"],  # Correct answers for these in quiz_questions.json
    )
    result = grade_quiz_submission(payload)
    assert result.score == 3
    assert result.max_score == 3
    assert all(r.correct for r in result.detailed)


def test_grade_quiz_partial_correct():
    payload = QuizGradeRequest(
        question_ids=["q1", "q3"],
        answers=["b", "a"],  # q1 correct (b), q3 incorrect (a - should be c)
    )
    result = grade_quiz_submission(payload)
    assert result.score == 1
    assert result.max_score == 2
    assert result.detailed[0].correct is True
    assert result.detailed[1].correct is False


def test_grade_quiz_missing_question():
    payload = QuizGradeRequest(question_ids=["non_existent"], answers=["any"])
    result = grade_quiz_submission(payload)
    assert result.score == 0
    assert result.detailed[0].correct is False
    assert "not found" in result.detailed[0].explanation
