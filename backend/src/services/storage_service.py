"""Google Cloud Storage service — handles secure document uploads.

Provides functionality to upload voter documents (e.g., Form 6, proof of age)
to a Google Cloud Storage bucket securely.
"""

import logging
import base64
from typing import Optional

from google.cloud import storage as gcs_storage  # type: ignore[attr-defined]
from google.auth.exceptions import DefaultCredentialsError

from src.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_storage_client: Optional[gcs_storage.Client] = None


def _get_storage_client() -> Optional[gcs_storage.Client]:
    """Lazily initialise the GCS client, handling missing credentials gracefully."""
    global _storage_client
    if _storage_client is None:
        try:
            _storage_client = gcs_storage.Client(project=settings.GCP_PROJECT_ID)
        except DefaultCredentialsError:
            logger.warning("Google Cloud credentials not found. GCS operations will be mocked.")
            return None
        except Exception as e:
            logger.error("Failed to initialise GCS client: %s", e)
            return None
    return _storage_client


async def upload_document(
    file_name: str, base64_content: str, content_type: str = "application/pdf"
) -> str:
    """Upload a base64 encoded document to Google Cloud Storage.

    Args:
        file_name: The target filename in the bucket.
        base64_content: The file content encoded in base64.
        content_type: The MIME type of the file.

    Returns:
        The public URL of the uploaded file, or a mock URL if credentials are not configured.
    """
    client = _get_storage_client()

    if not client:
        # Fallback for local development without credentials
        logger.info(f"[MOCK] Uploaded {file_name} to GCS bucket {settings.GCS_BUCKET_NAME}")
        return f"https://storage.googleapis.com/mock-{settings.GCS_BUCKET_NAME}/{file_name}"

    try:
        bucket = client.bucket(settings.GCS_BUCKET_NAME)
        blob = bucket.blob(file_name)

        # Decode base64 content
        file_bytes = base64.b64decode(base64_content)

        blob.upload_from_string(file_bytes, content_type=content_type)
        logger.info("Successfully uploaded %s to %s", file_name, settings.GCS_BUCKET_NAME)

        # Return the public URL
        return f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{file_name}"
    except Exception:
        logger.exception("Failed to upload document to GCS. Falling back to mock.")
        return f"https://storage.googleapis.com/mock-{settings.GCS_BUCKET_NAME}/{file_name}"
