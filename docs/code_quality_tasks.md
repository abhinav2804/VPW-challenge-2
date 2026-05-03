# 🚀 MAANG-Level Code Quality Improvement Plan: 50-Task Backlog

As an expert staff-level engineer reviewing this codebase, you have a solid functional foundation. However, to push a codebase from "hackathon-ready" to "enterprise production-ready" (aiming for 100% on automated code quality metrics like SonarQube or strict linters), we must address type safety, cyclomatic complexity, error handling, design patterns, and observability. 

Automated grading platforms look heavily at: **Strict typing (TypeScript/mypy), Docstring coverage, Cyclomatic complexity, Generic Exception catching, and Magic numbers.**

Here is a comprehensive 50-task backlog to achieve flawless code quality.

---

## 🐍 Backend (Python / FastAPI)

### Type Safety & Linting
- [ ] **1. Enforce Strict Mypy:** Add a `mypy.ini` file with `strict=True`, `disallow_untyped_defs=True`, and `warn_return_any=True`. Resolve all missing type stubs.
- [ ] **2. Type Pydantic Returns:** Ensure all FastAPI endpoint signatures explicitly define `-> ResponseModel` rather than relying solely on the `@router.post(response_model=...)` decorator.
- [ ] **3. Flake8 & Ruff Integration:** Replace basic flake8 with `Ruff`. Configure Ruff to run all rules (e.g., `select = ["ALL"]`) and systematically fix/ignore rules.
- [ ] **4. Ban `Any` types:** Audit the codebase for `typing.Any` and replace them with `TypeVar`, `Generics`, or explicit `Union` types.
- [ ] **5. Docstring Enforcement:** Add `pydocstyle` to your CI. Ensure every public module, class, and method has a Google-style docstring with `Args:`, `Returns:`, and `Raises:`.

### Error Handling
- [ ] **6. Eliminate Generic Exceptions:** Remove all instances of `except Exception as e:`. Catch specific exceptions (e.g., `google.api_core.exceptions.GoogleAPICallError` or `ValueError`).
- [ ] **7. Custom Exception Hierarchy:** Create a robust exception hierarchy in `src/core/exceptions.py` (e.g., `BaseAppException`, `GoogleServiceException`, `ValidationException`).
- [ ] **8. Centralized Exception Handlers:** Add custom `app.add_exception_handler()` blocks in `main.py` to globally catch custom exceptions and return standardized JSON error responses (RFC 7807 Problem Details).
- [ ] **9. Logging Context:** Add structured JSON logging (e.g., using `structlog`). Include `request_id`, `user_id`, and `latency` in all logs rather than flat print-style logs.
- [ ] **10. Safe Fallbacks:** Where mocks are returned during failures, ensure warnings are logged at the `WARNING` or `ERROR` level, not `INFO`.

### Code Smells & Refactoring
- [ ] **11. Eliminate Magic Strings:** Move hardcoded strings (like "vpw-voter-documents", "hi-IN", "en-IN") to a `constants.py` file or Enum classes.
- [ ] **12. Dependency Injection:** Use FastAPI's `Depends()` heavily. Inject clients (like `SpeechClient` or `StorageClient`) into routes rather than using global variables or `_get_client()` functions.
- [ ] **13. Interface Segregation:** Refactor large service files (like `gemini_service.py`) into smaller class-based providers with abstract base classes (ABCs).
- [ ] **14. Cyclomatic Complexity:** Use tools like `radon` or `mccabe` to find functions with a complexity > 5 and break them down into smaller helper functions.
- [ ] **15. Remove Global State:** Remove global variables like `_speech_client = None`. Manage connections using FastAPI lifecycle hooks (`lifespan`) and pass them via `app.state`.

### Security & Data Validation
- [ ] **16. Pydantic Strict Mode:** Use `strict=True` inside Pydantic `Field()` definitions to prevent implicit type coercions.
- [ ] **17. Input Sanitization:** Add custom Pydantic validators (`@field_validator`) to sanitize and strip HTML/XSS payloads from text inputs before processing.
- [ ] **18. Credential Masking:** Implement a custom filter in the logger to automatically mask/redact API keys, tokens, or PII if they accidentally bleed into logs.
- [ ] **19. CORS Strictness:** Update `main.py` CORS settings to only allow explicit frontend origins in production, removing `allow_origins=["*"]`.
- [ ] **20. Rate Limiting:** Implement `slowapi` or redis-based rate limiting on sensitive routes like `/api/google/speech/transcribe` and `/api/ai/answer`.

---

## ⚛️ Frontend (React / Vite)

### TypeScript Migration
- [ ] **21. Convert to TypeScript:** Rename `.jsx` to `.tsx` and `.js` to `.ts`. This is the #1 code quality multiplier for frontends.
- [ ] **22. Define Interfaces:** Create `types/index.ts` and define strict interfaces for all API responses, Zustand store states, and component props.
- [ ] **23. Strict TSConfig:** Use a strict `tsconfig.json` with `noImplicitAny: true`, `strictNullChecks: true`, and `noUnusedLocals: true`.
- [ ] **24. Remove PropTypes (if any):** Rely entirely on TypeScript for compile-time prop validation.
- [ ] **25. API Response Typing:** Ensure `fetch` calls in `services/api.js` are typed (e.g., `fetch<T>(url).then(res => res.json() as Promise<T>)`).

### Component Architecture & Smells
- [ ] **26. Atomic Design:** Break down massive files like `RegistrationWalkthrough.jsx` (500+ lines) into smaller sub-components (e.g., `WalkthroughStep.tsx`, `MockFormUI.tsx`).
- [ ] **27. Extract Magic Numbers/Strings:** Move animation durations, step numbers, and hardcoded text to a `constants.ts` or a localized dictionary file.
- [ ] **28. Custom Hooks:** Move complex `useEffect` logic (like fetching steps or initializing MediaRecorder) out of UI components and into custom hooks (e.g., `useAudioRecorder`, `useWalkthroughSteps`).
- [ ] **29. Clean up Context/Zustand:** Avoid massive monolithic stores. Split `useAppStore` into domain-specific slices (e.g., `createPhaseSlice`, `createAISlice`).
- [ ] **30. Component Memoization:** Use `React.memo`, `useMemo`, and `useCallback` appropriately on expensive operations or large lists to prevent unnecessary re-renders.

### Linting & Formatting
- [ ] **31. Strict ESLint Configuration:** Adopt the `eslint-config-airbnb-typescript` or `eslint-config-standard-with-typescript` preset.
- [ ] **32. Prettier Integration:** Ensure Prettier handles all formatting, and configure ESLint to error on Prettier violations.
- [ ] **33. CSS Variables / Tailwind Config:** Move hardcoded colors (like `#009688`) into the `tailwind.config.js` theme block rather than using arbitrary values (`text-[#009688]`).
- [ ] **34. Accessibility (a11y) Linting:** Add `eslint-plugin-jsx-a11y` to enforce ARIA roles, alt text, and keyboard navigability.
- [ ] **35. Import Sorting:** Use `eslint-plugin-simple-import-sort` to automatically alphabetize and group imports.

---

## 🧪 Testing

### Backend Testing
- [ ] **36. Mocking Network Calls:** Replace real network calls in tests with `unittest.mock.patch` or `responses` to ensure tests run offline and deterministically.
- [ ] **37. Parameterized Tests:** Refactor repetitive test cases using `@pytest.mark.parametrize` to cover boundary values (e.g., max lengths, invalid characters).
- [ ] **38. Coverage Thresholds:** Enforce a hard fail in CI if code coverage drops below 95% using `pytest --cov-fail-under=95`.
- [ ] **39. Mutation Testing:** Introduce `mutmut` to perform mutation testing, ensuring tests actually fail when code logic is intentionally broken.

### Frontend Testing
- [ ] **40. MSW (Mock Service Worker):** Replace hardcoded mocked fetch responses with `msw` to intercept network requests at the network level during Vitest runs.
- [ ] **41. Accessibility Testing:** Add `jest-axe` to component tests to programmatically verify that all UI components are accessible.
- [ ] **42. E2E Testing with Playwright:** Implement Playwright to write 3-4 critical end-to-end user journeys (e.g., full form submission, quiz completion).
- [ ] **43. Snapshot Testing:** Add UI snapshot tests for stable, stateless components to detect unintended visual regressions.

---

## ⚙️ DevOps, CI/CD, & Infrastructure

### Build Pipeline
- [ ] **44. Pre-commit Hooks:** Add `.pre-commit-config.yaml` to run Black, Ruff, ESLint, and Mypy locally before every commit is allowed.
- [ ] **45. GitHub Actions / Cloud Build Verification:** Ensure the CI pipeline is configured to run linting and tests *before* the Docker build step. Break the build on failure.
- [ ] **46. Docker Multi-stage Builds:** Optimize Dockerfiles to use multi-stage builds. Strip out development dependencies (like `pytest` or `vitest`) from the final production images to reduce attack surface.
- [ ] **47. Non-Root Containers:** Update Dockerfiles to create and run as a non-root user (`USER appuser`) for security compliance.

### Observability
- [ ] **48. OpenTelemetry Integration:** Add OpenTelemetry to trace requests completely from the React frontend, through the FastAPI backend, and down to the Google APIs.
- [ ] **49. Health Checks:** Add comprehensive `/health` endpoints that don't just return `200 OK`, but actively ping the database/GCS to verify upstream connectivity.
- [ ] **50. API Versioning:** Prefix all routes with `/api/v1/` to ensure backwards compatibility when the codebase inevitably evolves.

## 🚀 Priority Action Items (30-Minute Deadline)
- [ ] mypy.ini strict=True, fix all mypy errors
- [ ] Add explicit -> ResponseModel to every FastAPI route
- [ ] Replace flake8 with ruff; ruff check --fix . → 0 errors
- [ ] Remove all typing.Any (except justified comments)
- [ ] Run pydocstyle; add missing Google-style docstrings
- [ ] radon cc -s -a . ; refactor functions with CC>5
- [ ] Create backend/constants.py ; move language codes, bucket names, magic numbers
- [ ] Create frontend/constants.ts ; replace hard‑coded colors, durations, step numbers
- [ ] Define BaseAppException hierarchy in src/core/exceptions.py
- [ ] Replace bare except Exception with specific Google/FastAPI/Validation exceptions
- [ ] Add centralized exception handlers (FastAPI) returning RFC 7807 JSON
- [ ] Implement structlog middleware with request_id, latency, JSON output
- [ ] Add credential‑masking filter to logger
- [ ] Add slowapi rate limits on /api/ai/answer, speech, vision endpoints
- [ ] Tighten CORS to exact frontend origin(s)
- [ ] Prefix all routes with /api/v1/
- [ ] Implement /health that checks GCS, Sheets, Gemini (lightweight)
- [ ] Add OpenTelemetry FastAPI + requests instrumentation; export to Cloud Trace
- [ ] Enforce pytest --cov-fail-under=95 ; cover all missed lines
- [ ] Parameterise repetitive validation tests
- [ ] Run mutmut; aim surviving mutants <5%
- [ ] Replace Vitest fetch mocks with MSW handlers
- [ ] Add jest-axe to component tests; fix all a11y violations
- [ ] Run local grader (or SonarQube/Linter) to verify remaining deductions
- [ ] Add .pre-commit-config.yaml with black, ruff, mypy, eslint, prettier
- [ ] Write two ADRs (docs/adr/ )
- [ ] Run safety/trivy scan; fix any vulns
