# Voter Registration Journey — Enhancement Roadmap

This document tracks completed work and future enhancements for code quality, testing, and Google services integration.

---

## ✅ Completed

### Code Quality
- [x] Pydantic schemas with strict validation (ge, le, min_length, aliases)
- [x] Structured logging with Python `logging` module
- [x] Centralised settings via `pydantic-settings` with `.env` support
- [x] Global exception handler middleware
- [x] Black code formatter (line-length=100)
- [x] Flake8 linter configured
- [x] ESLint configured for React/Hooks/Refresh
- [x] Docstrings on all Python modules and functions
- [x] JSDoc comments on all frontend API functions
- [x] `.dockerignore` and `.gcloudignore` for optimised builds
- [x] `pyproject.toml` with pytest, black, and flake8 configuration
- [x] Error boundaries in React for crash recovery
- [x] Consistent API error handling with `handleResponse` wrapper
- [x] LRU caching on data loader and settings singleton

### Testing
- [x] Backend: `test_eligibility_service.py` — 5 unit tests
- [x] Backend: `test_maps_service.py` — 3 unit tests (Haversine)
- [x] Backend: `test_quiz_service.py` — 3 unit tests (grading)
- [x] Backend: `test_api_routes.py` — 30+ integration tests (all endpoints)
- [x] Backend: `test_data_loader.py` — 10 unit tests (JSON loading, caching)
- [x] Backend: `test_schemas.py` — 10 unit tests (Pydantic validation)
- [x] Backend: `test_config.py` — 6 unit tests (settings, singleton)
- [x] Backend: `conftest.py` — Shared pytest fixtures
- [x] Frontend: `api.test.js` — 20+ unit tests (all API functions)
- [x] Frontend: `store.test.js` — 15+ unit tests (Zustand store)
- [x] Frontend: `Eligibility.test.jsx` — Component rendering tests

### Google Services
- [x] **Gemini AI (2.5 Flash)** — AI Q&A assistant with grounded answers
- [x] **Gemini File API** — Document upload and RAG-style retrieval
- [x] **Google Maps Geocoding** — Locality to lat/lng conversion
- [x] **Google Maps Distance** — Nearest voter centre calculation
- [x] **Gemini Translation** — English ↔ Hindi translation API
- [x] **Gemini TTS** — Spoken-word narration for accessibility
- [x] **Google Cloud Run** — Containerized production deployment
- [x] **Google Artifact Registry** — Docker image versioning
- [x] **Google Cloud Build** — CI/CD container build pipeline

- [x] **Google Cloud Storage** — Secure upload of voter documents
- [x] **Google Sheets API** — Append form submissions as a mock database
- [x] **Google Cloud Vision** — Validate uploaded passport photos
- [x] **Google Cloud Speech-to-Text** — Voice input for AI queries
- [x] **Google reCAPTCHA Enterprise** — Bot protection on submissions

---

## 🔜 Future Enhancements

### Code Quality Improvements
- [ ] Add `mypy` type checking with `py.typed` marker
- [ ] Add `isort` for import ordering
- [ ] Add `pre-commit` hooks (black, flake8, mypy, isort)
- [ ] Add `Prettier` for frontend code formatting
- [ ] Add `husky` + `lint-staged` for pre-commit frontend checks
- [ ] Convert frontend to TypeScript for static type safety
- [ ] Add `eslint-plugin-a11y` for accessibility linting
- [ ] Add API request/response logging middleware with request IDs
- [ ] Add rate limiting middleware (e.g., `slowapi`)
- [ ] Add input sanitisation layer (XSS prevention)
- [ ] Add CORS origin allow-list for production
- [ ] Add health check for dependent services (Gemini, Maps)
- [ ] Add structured JSON logging (for Cloud Logging integration)
- [ ] Add OpenTelemetry tracing for request observability
- [ ] Implement retry logic with exponential backoff for external APIs
- [ ] Add API versioning (e.g., `/api/v1/`)

### Testing Improvements
- [ ] Add `pytest-cov` with minimum coverage threshold (e.g., 80%)
- [ ] Add end-to-end tests with Playwright or Cypress
- [ ] Add snapshot tests for React components
- [ ] Add load testing with Locust or k6
- [ ] Add contract tests for API schemas (Schemathesis)
- [ ] Add mutation testing with `mutmut`
- [ ] Add frontend accessibility tests with `jest-axe`
- [ ] Add visual regression tests with Chromatic
- [ ] Set up CI/CD pipeline with GitHub Actions (test on every PR)
- [ ] Add test fixtures for Gemini API responses (mocked)

### Additional Google Services
- [ ] **Google Drive API** — Allow users to upload documents from Drive
- [ ] **Google Cloud Logging** — Structured logging with severity levels
- [ ] **Google Cloud Monitoring** — Dashboard with custom metrics
- [ ] **Google Cloud Secret Manager** — Secure API key storage
- [ ] **Google Cloud Firestore** — Persist user progress across sessions
- [ ] **Google Cloud Pub/Sub** — Event-driven architecture for notifications
- [ ] **Google Analytics (GA4)** — User behaviour tracking and funnel analysis
- [ ] **Google Cloud CDN** — Global content delivery for static assets
- [ ] **Google Cloud Scheduler** — Periodic data refresh jobs
- [ ] **Google Cloud Tasks** — Async background processing queue
