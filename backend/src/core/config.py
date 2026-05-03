"""Centralised application settings.

Reads from a ``.env`` file at the backend root. Supports both
``GEMINI_API_KEY`` and ``GEMINI_KEY`` (the latter used by the existing
``google-service/`` code) for seamless interop.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application-wide configuration loaded from environment variables."""

    PROJECT_NAME: str = "Voter Registration Journey API"
    PORT: int = 8000

    # Gemini — accept either variable name
    GEMINI_API_KEY: str = ""
    GEMINI_KEY: str = ""

    # Google Maps
    GOOGLE_MAPS_API_KEY: str = ""

    # Optional: path to a service-account JSON for Google APIs
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

    # Google Cloud Storage
    GCS_BUCKET_NAME: str = "vpw-voter-documents"

    # Google Sheets API
    GOOGLE_SHEETS_ID: str = ""

    # Google Cloud Project ID (needed for reCAPTCHA and Speech)
    GCP_PROJECT_ID: str = "eternal-calling-478712-j6"

    # Google reCAPTCHA Enterprise Site Key
    RECAPTCHA_SITE_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def gemini_api_key(self) -> str:
        """Return whichever Gemini key is set, preferring GEMINI_API_KEY."""
        return self.GEMINI_API_KEY or self.GEMINI_KEY


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings singleton.

    Also tries loading the project-root ``.env`` if the backend-local
    one isn't found, for dev convenience.
    """
    root_env = os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env")
    if os.path.isfile(root_env):
        from dotenv import load_dotenv

        load_dotenv(root_env, override=False)
    return Settings()
