"""Unit tests for the data_loader utility module."""

import pytest
from src.utils.data_loader import load_json


class TestDataLoader:
    """Tests for the JSON data loading utility."""

    def test_load_quiz_questions(self):
        data = load_json("quiz_questions.json")
        assert isinstance(data, list)
        assert len(data) > 0

    def test_load_delhi_centres(self):
        data = load_json("delhi_centres.json")
        assert isinstance(data, list)

    def test_load_delhi_ac_list(self):
        data = load_json("delhi_ac_list.json")
        assert isinstance(data, list)
        assert len(data) == 70  # Delhi has 70 Assembly Constituencies

    def test_load_residence_examples(self):
        data = load_json("residence_examples.json")
        assert isinstance(data, list)
        assert len(data) >= 3

    def test_load_document_checklist(self):
        data = load_json("document_checklist.json")
        assert isinstance(data, list)

    def test_load_registration_steps(self):
        data = load_json("registration_steps.json")
        assert isinstance(data, dict)
        assert "portal" in data or "steps" in data

    def test_load_status_stages(self):
        data = load_json("status_stages.json")
        assert isinstance(data, list)

    def test_load_official_sources(self):
        data = load_json("official_sources.json")
        assert isinstance(data, list)

    def test_load_nonexistent_file_raises(self):
        with pytest.raises(FileNotFoundError):
            load_json("this_file_does_not_exist.json")

    def test_data_is_cached(self):
        """Subsequent calls should return the same cached object."""
        data1 = load_json("quiz_questions.json")
        data2 = load_json("quiz_questions.json")
        assert data1 is data2
