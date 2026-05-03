"""Unit tests for Pydantic schema validation logic."""

import pytest
from pydantic import ValidationError
from src.schemas.eligibility import EligibilityCheckRequest
from src.schemas.quiz import QuizGradeRequest, QuizQuestion, QuizOption


class TestEligibilitySchema:
    """Validation tests for the Eligibility request schema."""

    def test_valid_request(self):
        req = EligibilityCheckRequest(age_years=19, citizen=True, resident_in_india=True)
        assert req.age_years == 19

    def test_alias_support(self):
        """Schema must accept camelCase from the frontend."""
        req = EligibilityCheckRequest(
            **{
                "ageYears": 25,
                "citizen": True,
                "residentInIndia": True,
            }
        )
        assert req.age_years == 25
        assert req.resident_in_india is True

    def test_age_min_boundary(self):
        with pytest.raises(ValidationError):
            EligibilityCheckRequest(age_years=-1, citizen=True, resident_in_india=True)

    def test_age_max_boundary(self):
        with pytest.raises(ValidationError):
            EligibilityCheckRequest(age_years=200, citizen=True, resident_in_india=True)

    def test_missing_citizen_field(self):
        with pytest.raises(ValidationError):
            EligibilityCheckRequest(age_years=20, resident_in_india=True)

    def test_optional_fields(self):
        req = EligibilityCheckRequest(
            age_years=19,
            citizen=True,
            resident_in_india=True,
            state="Delhi",
            city="New Delhi",
        )
        assert req.state == "Delhi"

    def test_zero_age_valid(self):
        """Age 0 is valid (ge=0 constraint)."""
        req = EligibilityCheckRequest(age_years=0, citizen=True, resident_in_india=True)
        assert req.age_years == 0

    def test_age_150_valid(self):
        """Age 150 is the max (le=150 constraint)."""
        req = EligibilityCheckRequest(age_years=150, citizen=True, resident_in_india=True)
        assert req.age_years == 150


class TestQuizSchema:
    """Validation tests for the Quiz request schema."""

    def test_valid_grade_request(self):
        req = QuizGradeRequest(question_ids=["q1", "q2"], answers=["a", "b"])
        assert len(req.question_ids) == 2

    def test_alias_support(self):
        req = QuizGradeRequest(**{"questionIds": ["q1"], "answers": ["a"]})
        assert req.question_ids == ["q1"]

    def test_empty_lists_rejected(self):
        with pytest.raises(ValidationError):
            QuizGradeRequest(question_ids=[], answers=[])

    def test_quiz_question_structure(self):
        q = QuizQuestion(
            id="q1",
            topic="forms",
            question="What form?",
            options=[QuizOption(id="a", text="Form 6")],
        )
        assert q.id == "q1"
