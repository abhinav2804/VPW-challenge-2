"""Eligibility evaluation service — encapsulates the hard-coded ECI rules."""

from src.schemas.eligibility import (
    EligibilityCheckRequest,
    EligibilityCheckResponse,
    EligibilityReason,
    EligibilityLink,
)


# ---------------------------------------------------------------------------
# Official ECI links
# ---------------------------------------------------------------------------

_DEFAULT_LINKS = [
    EligibilityLink(title="NVSP – New voter registration", url="https://www.nvsp.in/"),
    EligibilityLink(title="ECI – Voter eligibility overview", url="https://eci.gov.in/"),
    EligibilityLink(title="Voter Helpline App", url="https://voterportal.eci.gov.in/"),
]


def evaluate_eligibility(req: EligibilityCheckRequest) -> EligibilityCheckResponse:
    """Run the deterministic ECI eligibility rules and return a structured result."""

    reasons: list[EligibilityReason] = []

    # Rule 1: Age >= 18
    age_ok = req.age_years >= 18
    if age_ok:
        reasons.append(
            EligibilityReason(text=f"You are {req.age_years} years old (≥ 18).", severity="info")
        )
    else:
        reasons.append(
            EligibilityReason(
                text=f"You are {req.age_years} years old. You need to be at least 18 to register.",
                severity="warn",
            )
        )

    # Rule 2: Indian citizen
    citizen_ok = req.citizen
    if citizen_ok:
        reasons.append(EligibilityReason(text="You are an Indian citizen.", severity="info"))
    else:
        reasons.append(
            EligibilityReason(text="Only Indian citizens can register as voters.", severity="warn")
        )

    # Rule 3: Resident in India
    resident_ok = req.resident_in_india
    if resident_ok:
        reasons.append(EligibilityReason(text="You reside in India.", severity="info"))
    else:
        reasons.append(
            EligibilityReason(
                text="You must ordinarily reside in India to register in a constituency.",
                severity="warn",
            )
        )

    from typing import Literal
    eligible = age_ok and citizen_ok and resident_ok
    phase: Literal["new_form6", "learn_only"] = "new_form6" if eligible else "learn_only"

    # Build a human-readable summary
    if eligible:
        summary = "You meet the basic criteria to register as a new voter using Form 6."
        if req.currently_registered:
            summary = (
                "You appear to already be registered. If you've moved, "
                "you may need to file Form 6A for a transfer instead of Form 6."
            )
    else:
        failing = [r.text for r in reasons if r.severity == "warn"]
        summary = (
            "You don't currently meet all criteria for voter registration. "
            + " ".join(failing)
            + " You can still explore the learning modules."
        )

    return EligibilityCheckResponse(
        eligible=eligible,
        phase=phase,
        summary=summary,
        reasons=reasons,
        links=_DEFAULT_LINKS,
    )
