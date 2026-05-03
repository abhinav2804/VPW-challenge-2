"""Google Cloud Speech-to-Text service — handles voice inputs.

Converts spoken audio (in English or Hindi) to text so users can
ask questions using their voice instead of typing.
"""

import logging
import base64
from typing import Optional

from google.cloud import speech
from google.auth.exceptions import DefaultCredentialsError

logger = logging.getLogger(__name__)

_speech_client: Optional[speech.SpeechClient] = None


def _get_speech_client() -> Optional[speech.SpeechClient]:
    """Lazily initialise the Speech client."""
    global _speech_client
    if _speech_client is None:
        try:
            _speech_client = speech.SpeechClient()
        except DefaultCredentialsError:
            logger.warning("Google Cloud credentials not found. Speech operations will be mocked.")
            return None
        except Exception as e:
            logger.error("Failed to initialise Speech client: %s", e)
            return None
    return _speech_client


async def transcribe_audio(base64_audio: str, language_code: str = "en-IN") -> str:
    """Transcribe base64 encoded audio to text using Google Cloud Speech-to-Text.

    Args:
        base64_audio: The audio content encoded in base64 (LINEAR16, 16000Hz).
        language_code: BCP-47 language tag ('en-IN' or 'hi-IN').

    Returns:
        The transcribed text.
    """
    client = _get_speech_client()

    if not client:
        # Fallback for local development
        logger.info("[MOCK] Transcribed audio using Speech API.")
        return "This is a mocked audio transcription. Error: Google Cloud credentials or client not initialized."

    try:
        content = base64.b64decode(base64_audio)

        audio = speech.RecognitionAudio(content=content)
        # WebM contains header information, allowing auto-detection of sample rate and encoding
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            language_code=language_code,
            alternative_language_codes=(
                ["en-IN", "hi-IN"] if language_code == "en-IN" else ["hi-IN", "en-IN"]
            ),
        )

        response = client.recognize(config=config, audio=audio)

        # Concatenate all alternative transcripts
        transcripts = []
        for result in response.results:
            transcripts.append(result.alternatives[0].transcript)

        return " ".join(transcripts)

    except Exception as e:
        logger.error(f"Failed to transcribe audio. Error: {str(e)}")
        logger.exception("Falling back to mock.")
        return f"This is a mocked audio transcription (fallback). Error was: {str(e)}"
