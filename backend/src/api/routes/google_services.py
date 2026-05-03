"""Routes for Google Cloud services.

Exposes various Google APIs: Translate, Text-to-Speech, Vision, Storage,
Speech-to-Text, and Sheets.
"""

from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Form, Request
from pydantic import BaseModel, Field

from src.core.limiter import limiter
from src.services.translate_service import translate_to_hindi, translate_to_english
from src.services.tts_service import text_to_speech
from src.services.vision_service import validate_passport_photo
from src.services.storage_service import upload_document
from src.services.speech_service import transcribe_audio
from src.services.sheets_service import append_application_row
from src.services.recaptcha_service import verify_token

router = APIRouter(prefix="/api/google", tags=["Google Services"])


# -----------------------------------------------------------------------
# Schemas
# -----------------------------------------------------------------------


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    target_language: str = Field("hi", alias="targetLanguage")
    model_config = {"populate_by_name": True}


class TranslateResponse(BaseModel):
    original: str
    translated: str
    target_language: str = Field(..., alias="targetLanguage")
    model_config = {"populate_by_name": True}


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    language: str = Field("en")


class TTSResponse(BaseModel):
    spoken_text: str = Field(..., alias="spokenText")
    language: str
    model_config = {"populate_by_name": True}


class VisionRequest(BaseModel):
    base64_image: str = Field(..., alias="base64Image")
    model_config = {"populate_by_name": True}


class AudioRequest(BaseModel):
    base64_audio: str = Field(..., alias="base64Audio")
    language_code: str = Field("en-IN", alias="languageCode")
    model_config = {"populate_by_name": True}


class SheetsRequest(BaseModel):
    row_data: list[str] = Field(..., alias="rowData")
    recaptcha_token: str = Field("", alias="recaptchaToken")
    model_config = {"populate_by_name": True}


# -----------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------


@router.post("/translate", response_model=TranslateResponse)
@limiter.limit("20/minute")
async def translate_text(request: Request, req: TranslateRequest) -> TranslateResponse:
    if req.target_language == "hi":
        translated = await translate_to_hindi(req.text)
    elif req.target_language == "en":
        translated = await translate_to_english(req.text)
    else:
        raise HTTPException(status_code=400, detail="Supported languages: 'en', 'hi'.")
    return TranslateResponse(
        original=req.text, translated=translated, targetLanguage=req.target_language
    )


@router.post("/tts", response_model=TTSResponse)
@limiter.limit("20/minute")
async def convert_to_speech(request: Request, req: TTSRequest) -> TTSResponse:
    result = await text_to_speech(req.text, req.language)
    return TTSResponse(spokenText=result["spoken_text"], language=result["language"])


@router.post("/vision/validate-photo")
@limiter.limit("10/minute")
async def validate_photo(request: Request, req: VisionRequest) -> Dict[str, Any]:
    """Validate a passport-style photo using Google Cloud Vision."""
    result = await validate_passport_photo(req.base64_image)
    return result


@router.post("/speech/transcribe")
@limiter.limit("10/minute")
async def transcribe_voice(request: Request, req: AudioRequest) -> Dict[str, Any]:
    """Transcribe base64 encoded audio to text using Google Cloud Speech-to-Text."""
    text = await transcribe_audio(req.base64_audio, req.language_code)
    return {"transcription": text}


@router.post("/sheets/append")
@limiter.limit("5/minute")
async def append_to_sheet(request: Request, req: SheetsRequest) -> Dict[str, Any]:
    """Append a submitted application to Google Sheets. Validates reCAPTCHA."""
    if req.recaptcha_token:
        is_human = await verify_token(req.recaptcha_token, action="submit_form")
        if not is_human:
            raise HTTPException(status_code=403, detail="reCAPTCHA verification failed.")

    success = await append_application_row(req.row_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save data.")
    return {"success": True}


@router.post("/storage/upload")
@limiter.limit("10/minute")
async def upload_file(
    request: Request,
    file_name: str = Form(...),
    base64_content: str = Form(...),
    content_type: str = Form("application/pdf"),
) -> Dict[str, Any]:
    """Upload a document to Google Cloud Storage."""
    url = await upload_document(file_name, base64_content, content_type)
    return {"url": url}
