"""Unit tests for the eligibility service."""

import pytest
from src.services.eligibility_service import evaluate_eligibility
from src.schemas.eligibility import EligibilityCheckRequest

def test_eligible_new_voter():
    payload = EligibilityCheckRequest(
        age_years=19,
        citizen=True,
        resident_in_india=True,
        currently_registered=False
    )
    result = evaluate_eligibility(payload)
    assert result.eligible is True
    assert result.phase == "new_form6"
    assert any("19 years old" in r.text for r in result.reasons)

def test_ineligible_underage():
    payload = EligibilityCheckRequest(
        age_years=17,
        citizen=True,
        resident_in_india=True,
        currently_registered=False
    )
    result = evaluate_eligibility(payload)
    assert result.eligible is False
    assert result.phase == "learn_only"
    assert any("need to be at least 18" in r.text for r in result.reasons)

def test_ineligible_non_citizen():
    payload = EligibilityCheckRequest(
        age_years=25,
        citizen=False,
        resident_in_india=True,
        currently_registered=False
    )
    result = evaluate_eligibility(payload)
    assert result.eligible is False
    assert any("Only Indian citizens can register" in r.text for r in result.reasons)

def test_ineligible_non_resident():
    payload = EligibilityCheckRequest(
        age_years=30,
        citizen=True,
        resident_in_india=False,
        currently_registered=False
    )
    result = evaluate_eligibility(payload)
    assert result.eligible is False
    assert any("must ordinarily reside in India" in r.text for r in result.reasons)

def test_already_registered():
    payload = EligibilityCheckRequest(
        age_years=22,
        citizen=True,
        resident_in_india=True,
        currently_registered=True
    )
    result = evaluate_eligibility(payload)
    assert result.eligible is True
    assert result.phase == "new_form6"
