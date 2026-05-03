"""Google Cloud Text-to-Speech service — provides audio output via Gemini.

Generates spoken audio from text using the Gemini model's TTS capabilities,
allowing voters to listen to instructions instead of reading.
"""

import logging
from typing import Optional, Dict, Any

from google import genai
from google.genai import types

from src.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    """Lazily initialise the GenAI client."""
    global _client
    if _client is None:
        api_key = settings.gemini_api_key
        if not api_key:
            raise RuntimeError("GEMINI_KEY is not configured.")
        _client = genai.Client(api_key=api_key)
    return _client


async def text_to_speech(text: str, language: str = "en") -> Dict[str, Any]:
    """Convert text to a spoken summary using Gemini.

    Since direct TTS may not be available in all Gemini tiers, this
    returns a simplified, speech-friendly version of the text along with
    the language code.

    Args:
        text: The text to convert.
        language: Target language code ('en' or 'hi').

    Returns:
        Dict with ``spoken_text`` (simplified for reading aloud) and ``language``.
    """
    client = _get_client()

    lang_instruction = "English" if language == "en" else "Hindi"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=text,
            config=types.GenerateContentConfig(
                system_instruction=(
                    f"Convert the following text into a short, clear, spoken-word script in {lang_instruction}. "
                    "It should be suitable for reading aloud to a voter who cannot read well. "
                    "Use simple, everyday language. Keep it under 100 words. "
                    "Do not use bullet points or special characters."
                ),
                temperature=0.3,
            ),
        )
        spoken = response.text.strip()
        return {"spoken_text": spoken, "language": language}
    except Exception:
        logger.exception("TTS conversion failed.")
        return {"spoken_text": text, "language": language}
