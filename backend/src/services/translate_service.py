"""Google Cloud Translate service — provides Hindi translation via Gemini.

Uses the Gemini generative AI model as a translation engine to avoid
requiring a separate ``google-cloud-translate`` dependency.  This keeps
the deployment lightweight while still leveraging Google's language
understanding capabilities.
"""

import logging
from typing import Optional

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


async def translate_to_hindi(text: str) -> str:
    """Translate English text to Hindi using Gemini.

    Args:
        text: The English text to translate.

    Returns:
        Translated Hindi text, or the original text on failure.
    """
    client = _get_client()
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=text,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a professional English-to-Hindi translator. "
                    "Translate the following text to Hindi (Devanagari script). "
                    "Return ONLY the Hindi translation, nothing else. "
                    "Keep proper nouns and technical terms as-is."
                ),
                temperature=0.1,
            ),
        )
        translated = response.text or ""
        return translated.strip()
    except Exception:
        logger.exception("Translation failed, returning original text.")
        return text


async def translate_to_english(text: str) -> str:
    """Translate Hindi text to English using Gemini.

    Args:
        text: The Hindi text to translate.

    Returns:
        Translated English text, or the original text on failure.
    """
    client = _get_client()
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=text,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a professional Hindi-to-English translator. "
                    "Translate the following Hindi text to English. "
                    "Return ONLY the English translation, nothing else."
                ),
                temperature=0.1,
            ),
        )
        translated = response.text or ""
        return translated.strip()
    except Exception:
        logger.exception("Translation failed, returning original text.")
        return text
