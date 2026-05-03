"""Unit tests for the core configuration module."""

from src.core.config import Settings, get_settings


class TestSettings:
    """Configuration and settings tests."""

    def test_default_project_name(self):
        s = Settings()
        assert "Voter" in s.PROJECT_NAME

    def test_default_port(self):
        s = Settings()
        assert s.PORT == 8000

    def test_gemini_key_property_prefers_api_key(self):
        s = Settings(GEMINI_API_KEY="key1", GEMINI_KEY="key2")
        assert s.gemini_api_key == "key1"

    def test_gemini_key_property_falls_back(self):
        s = Settings(GEMINI_API_KEY="", GEMINI_KEY="fallback")
        assert s.gemini_api_key == "fallback"

    def test_get_settings_singleton(self):
        """get_settings should return a cached instance."""
        s1 = get_settings()
        s2 = get_settings()
        assert s1 is s2

    def test_extra_fields_ignored(self):
        """Unknown env vars should not crash the settings."""
        s = Settings(UNKNOWN_VAR="test")
        assert not hasattr(s, "UNKNOWN_VAR")
