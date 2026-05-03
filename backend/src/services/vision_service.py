"""Google Cloud Vision service — validates uploaded profile photos.

Uses the Vision API to ensure uploaded photos meet the basic criteria
for voter registration (e.g., contains exactly one face, proper lighting).
"""

import logging
import base64
from typing import Optional

from google.cloud import vision
from google.auth.exceptions import DefaultCredentialsError

logger = logging.getLogger(__name__)

_vision_client: Optional[vision.ImageAnnotatorClient] = None


def _get_vision_client() -> Optional[vision.ImageAnnotatorClient]:
    """Lazily initialise the Vision client."""
    global _vision_client
    if _vision_client is None:
        try:
            _vision_client = vision.ImageAnnotatorClient()
        except DefaultCredentialsError:
            logger.warning("Google Cloud credentials not found. Vision operations will be mocked.")
            return None
        except Exception as e:
            logger.error("Failed to initialise Vision client: %s", e)
            return None
    return _vision_client


async def validate_passport_photo(base64_image: str) -> dict:
    """Validate a passport-style photo using Google Cloud Vision.

    Checks:
    1. Exactly one face is detected.
    2. The face is clearly visible (not underexposed/blurred).
    
    Args:
        base64_image: The image content encoded in base64.

    Returns:
        Dict containing `is_valid` boolean and `reason` string.
    """
    client = _get_vision_client()
    
    if not client:
        # Fallback for local development
        logger.info("[MOCK] Validated passport photo using Vision API.")
        return {"is_valid": True, "reason": "Mock validation passed."}

    try:
        content = base64.b64decode(base64_image)
        image = vision.Image(content=content)
        
        # Perform face detection
        response = client.face_detection(image=image)
        faces = response.face_annotations
        
        if response.error.message:
            raise Exception(response.error.message)
            
        if len(faces) == 0:
            return {"is_valid": False, "reason": "No face detected in the photo. Please upload a clear photo."}
            
        if len(faces) > 1:
            return {"is_valid": False, "reason": "Multiple faces detected. Please upload a photo with only yourself."}
            
        face = faces[0]
        
        # Check lighting conditions (under-exposed)
        if face.under_exposed_likelihood >= vision.Likelihood.LIKELY:
            return {"is_valid": False, "reason": "The photo is too dark. Please ensure good lighting."}
            
        if face.blurred_likelihood >= vision.Likelihood.LIKELY:
            return {"is_valid": False, "reason": "The photo is blurred. Please upload a sharp image."}
            
        return {"is_valid": True, "reason": "Photo meets basic criteria."}
        
    except Exception as e:
        logger.exception("Failed to validate photo with Vision API.")
        # Fail open if the API errors out, so we don't block the user
        return {"is_valid": True, "reason": "Validation skipped due to server error."}
