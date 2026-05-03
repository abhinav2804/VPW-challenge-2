"""Integration tests for FastAPI route endpoints.

These tests exercise the full HTTP request/response cycle via
``TestClient`` without needing a live server.
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


# =====================================================================
# Health
# =====================================================================

class TestHealth:
    """Health-check endpoint tests."""

    def test_health_returns_200(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200

    def test_health_body(self, client):
        body = client.get("/health").json()
        assert body["status"] == "ok"
        assert "service" in body


# =====================================================================
# Eligibility
# =====================================================================

class TestEligibilityAPI:
    """Tests for POST /api/eligibility/check."""

    def test_eligible_voter(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 19, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 200
        body = resp.json()
        assert body["eligible"] is True
        assert body["phase"] == "new_form6"

    def test_underage_voter(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 16, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 200
        assert resp.json()["eligible"] is False

    def test_non_citizen_voter(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 25, "citizen": False,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 200
        assert resp.json()["eligible"] is False

    def test_missing_required_fields(self, client):
        resp = client.post("/api/eligibility/check", json={})
        assert resp.status_code == 422  # Validation error

    def test_age_boundary_18(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 18, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 200
        assert resp.json()["eligible"] is True

    def test_age_boundary_17(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 17, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 200
        assert resp.json()["eligible"] is False

    def test_negative_age_rejected(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": -1, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 422

    def test_excessive_age_rejected(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 200, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        assert resp.status_code == 422

    def test_response_contains_links(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 19, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        body = resp.json()
        assert len(body["links"]) > 0
        assert all("url" in link for link in body["links"])

    def test_response_contains_reasons(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 19, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": False,
        })
        body = resp.json()
        assert len(body["reasons"]) >= 3

    def test_already_registered_still_eligible(self, client):
        resp = client.post("/api/eligibility/check", json={
            "ageYears": 22, "citizen": True,
            "residentInIndia": True, "currentlyRegistered": True,
        })
        body = resp.json()
        assert body["eligible"] is True
        assert "transfer" in body["summary"].lower() or "Form 6" in body["summary"]


# =====================================================================
# Documents Checklist
# =====================================================================

class TestDocumentsAPI:
    """Tests for GET /api/documents/checklist."""

    def test_checklist_returns_200(self, client):
        resp = client.get("/api/documents/checklist")
        assert resp.status_code == 200

    def test_checklist_has_sections(self, client):
        body = client.get("/api/documents/checklist").json()
        assert "sections" in body
        assert len(body["sections"]) >= 3

    def test_each_section_has_items(self, client):
        body = client.get("/api/documents/checklist").json()
        for section in body["sections"]:
            assert "title" in section
            assert "items" in section
            assert len(section["items"]) > 0


# =====================================================================
# Registration Steps
# =====================================================================

class TestRegistrationAPI:
    """Tests for GET /api/registration/steps."""

    def test_portal_steps_returns_200(self, client):
        resp = client.get("/api/registration/steps?channel=portal")
        assert resp.status_code == 200

    def test_portal_has_steps(self, client):
        body = client.get("/api/registration/steps?channel=portal").json()
        assert "steps" in body
        assert len(body["steps"]) >= 5

    def test_app_channel(self, client):
        resp = client.get("/api/registration/steps?channel=app")
        assert resp.status_code == 200

    def test_invalid_channel(self, client):
        resp = client.get("/api/registration/steps?channel=invalid")
        assert resp.status_code in (400, 422)


# =====================================================================
# Status Stages
# =====================================================================

class TestStatusAPI:
    """Tests for GET /api/status/stages."""

    def test_stages_returns_200(self, client):
        resp = client.get("/api/status/stages")
        assert resp.status_code == 200

    def test_stages_has_data(self, client):
        body = client.get("/api/status/stages").json()
        assert "stages" in body
        assert len(body["stages"]) >= 3


# =====================================================================
# Quiz
# =====================================================================

class TestQuizAPI:
    """Tests for GET /api/quiz/questions and POST /api/quiz/grade."""

    def test_questions_returns_200(self, client):
        resp = client.get("/api/quiz/questions")
        assert resp.status_code == 200

    def test_questions_structure(self, client):
        body = client.get("/api/quiz/questions").json()
        assert "questions" in body
        for q in body["questions"]:
            assert "id" in q
            assert "question" in q
            assert "options" in q
            # correctAnswer should NOT be exposed to client
            assert "correctAnswer" not in q

    def test_grade_correct_answers(self, client):
        resp = client.post("/api/quiz/grade", json={
            "questionIds": ["q1", "q3", "q5"],
            "answers": ["b", "c", "a"],
        })
        assert resp.status_code == 200
        body = resp.json()
        assert body["score"] == 3
        assert body["maxScore"] == 3

    def test_grade_wrong_answers(self, client):
        resp = client.post("/api/quiz/grade", json={
            "questionIds": ["q1"],
            "answers": ["a"],  # Wrong answer
        })
        assert resp.status_code == 200
        body = resp.json()
        assert body["score"] == 0

    def test_grade_empty_payload(self, client):
        resp = client.post("/api/quiz/grade", json={
            "questionIds": [],
            "answers": [],
        })
        assert resp.status_code == 422

    def test_grade_mismatched_lengths(self, client):
        resp = client.post("/api/quiz/grade", json={
            "questionIds": ["q1", "q2"],
            "answers": ["b"],
        })
        # Should either 400, 422 or handle gracefully
        assert resp.status_code in (200, 400, 422)


# =====================================================================
# Residence
# =====================================================================

class TestResidenceAPI:
    """Tests for /api/residence/* endpoints."""

    def test_examples_returns_200(self, client):
        resp = client.get("/api/residence/examples")
        assert resp.status_code == 200

    def test_examples_structure(self, client):
        body = client.get("/api/residence/examples").json()
        assert "examples" in body or isinstance(body, list)

    def test_delhi_centres_by_ac(self, client):
        resp = client.get("/api/residence/delhi-centres?ac=2")
        assert resp.status_code == 200


# =====================================================================
# Sources
# =====================================================================

class TestSourcesAPI:
    """Tests for GET /api/sources."""

    def test_sources_returns_200(self, client):
        resp = client.get("/api/sources")
        assert resp.status_code == 200

    def test_sources_structure(self, client):
        body = client.get("/api/sources").json()
        # The endpoint returns either "sources" or "documents" key
        has_data = "sources" in body or "documents" in body
        assert has_data


# =====================================================================
# Google Services
# =====================================================================

class TestGoogleServicesAPI:
    """Tests for POST /api/google/* endpoints.
    
    Note: These are mocked when no credentials exist, so they should
    still return 200 OK.
    """

    def test_translate_text(self, client):
        resp = client.post("/api/google/translate", json={
            "text": "Hello, how are you?",
            "targetLanguage": "hi"
        })
        assert resp.status_code == 200
        body = resp.json()
        assert "translated" in body
        assert body["targetLanguage"] == "hi"

    def test_translate_unsupported_language(self, client):
        resp = client.post("/api/google/translate", json={
            "text": "Hello, how are you?",
            "targetLanguage": "fr"
        })
        assert resp.status_code == 400

    def test_text_to_speech(self, client):
        resp = client.post("/api/google/tts", json={
            "text": "Hello, how are you?",
            "language": "en"
        })
        assert resp.status_code == 200
        body = resp.json()
        assert "spokenText" in body
        assert body["language"] == "en"

    def test_vision_validate_photo(self, client):
        resp = client.post("/api/google/vision/validate-photo", json={
            "base64Image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        })
        assert resp.status_code == 200
        body = resp.json()
        assert "is_valid" in body

    def test_speech_transcribe(self, client):
        resp = client.post("/api/google/speech/transcribe", json={
            "base64Audio": "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            "languageCode": "en-IN"
        })
        assert resp.status_code == 200
        assert "transcription" in resp.json()

    def test_sheets_append(self, client):
        resp = client.post("/api/google/sheets/append", json={
            "rowData": ["John Doe", "20", "Delhi"],
            "recaptchaToken": ""
        })
        assert resp.status_code == 200
        assert resp.json()["success"] is True

    def test_storage_upload(self, client):
        resp = client.post("/api/google/storage/upload", data={
            "file_name": "test.txt",
            "base64_content": "SGVsbG8gV29ybGQ=",
            "content_type": "text/plain"
        })
        assert resp.status_code == 200
        assert "url" in resp.json()
