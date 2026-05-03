"""conftest.py — shared fixtures for the backend test suite."""

import pytest
from fastapi.testclient import TestClient
from src.main import app


@pytest.fixture(scope="module")
def client():
    """Provide a FastAPI test client for integration tests."""
    with TestClient(app) as c:
        yield c


@pytest.fixture
def eligible_payload() -> dict:
    """Standard eligible voter payload."""
    return {
        "ageYears": 19,
        "citizen": True,
        "residentInIndia": True,
        "currentlyRegistered": False,
    }


@pytest.fixture
def underage_payload() -> dict:
    """Underage voter payload."""
    return {
        "ageYears": 16,
        "citizen": True,
        "residentInIndia": True,
        "currentlyRegistered": False,
    }


@pytest.fixture
def non_citizen_payload() -> dict:
    """Non-citizen voter payload."""
    return {
        "ageYears": 25,
        "citizen": False,
        "residentInIndia": True,
        "currentlyRegistered": False,
    }
