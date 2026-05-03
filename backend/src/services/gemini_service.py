"""Gemini AI service — wraps the Google GenAI SDK for grounded Q&A.

This service mirrors the pattern already established in
``google-service/filesearch/search.py`` but exposes a clean async interface
consumable by FastAPI route handlers.
"""

import logging
from typing import Optional, List, Dict, Any

from google import genai
from google.genai import types

from src.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

# ---------------------------------------------------------------------------
# Client initialisation
# ---------------------------------------------------------------------------

_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    """Lazily initialise the GenAI client so import‑time failures are avoided."""
    global _client
    if _client is None:
        api_key = settings.gemini_api_key
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY / GEMINI_KEY is not configured. Check your .env file."
            )
        _client = genai.Client(api_key=api_key)
    return _client


# ---------------------------------------------------------------------------
# System prompts per phase
# ---------------------------------------------------------------------------

_PHASE_SYSTEM_PROMPTS: dict[str, str] = {
    "eligibility": (
        "You are a friendly voter-registration assistant for India. "
        "The user is checking whether they are eligible to register. "
        "Answer ONLY based on the official ECI documents provided. "
        "If you don't know, say so — never invent rules."
    ),
    "residence": (
        "You are helping an Indian voter understand the concept of 'ordinary residence' "
        "as defined by the Election Commission of India. Use concrete examples "
        "(hostels, PGs, recent moves) from the uploaded Form 6 guidelines."
    ),
    "documents": (
        "You are a document-preparation assistant for voter registration in India. "
        "Help the user understand which proofs of age and address are accepted, "
        "citing the official Form 6 guidelines."
    ),
    "registration": (
        "You are guiding an Indian user through the step-by-step process of "
        "submitting Form 6 online via the NVSP portal or the Voter Helpline app. "
        "Be precise and cite official instructions."
    ),
    "status": (
        "You are helping the user understand what happens after Form 6 is submitted — "
        "verification, acceptance, EPIC issuance. Use official ECI lifecycle descriptions."
    ),
}

_BASE_SYSTEM_PROMPT = (
    "You are VoteGuide AI, a gamified voter-registration assistant for India. "
    "You MUST rely exclusively on the official documents uploaded to you "
    "(ECI Form 6, Form 6 Guidelines, CEO Delhi guides, NVSP descriptions, "
    "Voter Helpline App info). Never invent or assume rules. "
    "Always cite the source document when possible. "
    "Keep answers concise, friendly, and jargon-free. "
    "IMPORTANT: Always respond in the language specified in the 'User context' "
    "(e.g. if language=hi, respond in Hindi; if language=en, respond in English)."
)

# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


def get_uploaded_file_refs() -> List[Any]:
    """Return references to all files previously uploaded to the Gemini File API.

    The backend expects the user to have uploaded documents via the
    ``scripts/ingest_documents.py`` helper. This function fetches the
    list at runtime so new uploads are picked up without a restart.
    """
    client = _get_client()
    try:
        files = list(client.files.list())
        logger.info("Found %d uploaded file(s) in Gemini File API.", len(files))
        return files
    except Exception:
        logger.exception("Failed to list Gemini files.")
        return []


async def ask_ai(question: str, phase: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Send a grounded question to Gemini and return ``{answer, sources}``."""

    client = _get_client()

    # Build system instruction
    phase_prompt = _PHASE_SYSTEM_PROMPTS.get(phase, "")
    context_str = ""
    if context:
        context_str = " ".join(f"{k}={v}" for k, v in context.items())
    system_instruction = (
        f"{_BASE_SYSTEM_PROMPT}\n\n{phase_prompt}\n\nUser context: {context_str}".strip()
    )

    # Gather all uploaded file references to ground the answer
    file_refs = get_uploaded_file_refs()

    # Build the contents list: file references first, then the question
    contents: List[Any] = []
    for fref in file_refs:
        contents.append(fref)
    contents.append(question)

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
            ),
        )

        answer_text = response.text or "I'm sorry, I couldn't generate an answer right now."

        # Extract grounding sources if available
        sources = _extract_sources(file_refs)

        return {"answer": answer_text, "sources": sources}

    except Exception:
        logger.exception("Gemini API call failed.")
        return {
            "answer": "I'm having trouble connecting to the AI service right now. Please try again shortly.",
            "sources": [],
        }


def _extract_sources(file_refs: List[Any]) -> List[Dict[str, Any]]:
    """Build a deterministic sources list from the uploaded file references.

    Since the Gemini File API does not return per-chunk citations in the
    same way a vector-store RAG would, we list all referenced documents
    as potential sources so the frontend can display them.
    """
    source_mapping = {
        "Form_6_English": {
            "title": "Form 6 – ECI (National)",
            "url": "https://voters.eci.gov.in/formspdf/Form_6_English.pdf",
        },
        "Form-6_en": {
            "title": "Guidelines for Form 6 – ECI",
            "url": "https://voters.eci.gov.in/guidelines/Form-6_en.pdf",
        },
        "Delhi_FORM6": {
            "title": "Delhi Form 6 – CEO Delhi",
            "url": "https://www.ceodelhi.gov.in/WriteReadData/userfiles/file/Forms/FORM6.pdf",
        },
        "Delhi_form6_Guide": {
            "title": "Delhi Form 6 Guide – CEO Delhi",
            "url": "https://ceodelhi.gov.in/WriteReadData/userfiles/file/Forms/form%206_Guide.pdf",
        },
        "NVSP": {"title": "NVSP Portal – ECI", "url": "https://www.nvsp.in/"},
        "Voter_Helpline": {
            "title": "Voter Helpline App – ECI",
            "url": "https://voterportal.eci.gov.in/",
        },
    }

    sources = []
    for fref in file_refs:
        name = getattr(fref, "display_name", "") or getattr(fref, "name", "")
        for key, val in source_mapping.items():
            if key.lower() in name.lower():
                sources.append(val)
                break

    # Deduplicate
    seen = set()
    unique_sources = []
    for s in sources:
        if s["url"] not in seen:
            seen.add(s["url"])
            unique_sources.append(s)

    return unique_sources
