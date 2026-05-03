# Frontend Implementation Guide: Voter Registration Journey

This document serves as the master, highly-granular checklist for developing the single-page application frontend. Each task is atomic to ensure steady progress and easy tracking.

## Phase 0: Project Setup & Foundation
- [x] Run `npm create vite@latest` (or Next.js equivalent) to initialize the project directory.
- [x] Clean up default boilerplate files (remove default CSS, logos, etc.).
- [x] Install routing dependencies (e.g., `react-router-dom`).
- [x] Set up root routing configuration file (`App.jsx` or `routes.jsx`).
- [x] Create basic placeholder route definitions for all 8 main screens.
- [x] Install Tailwind CSS, PostCSS, and Autoprefixer.
- [x] Initialize Tailwind configuration (`tailwind.config.js`).
- [x] Define warm neutral background colors in Tailwind config.
- [x] Define civic teal/blue primary accent colors in Tailwind config.
- [x] Define saffron/gold badge accent colors in Tailwind config.
- [x] Import modern Google Fonts (e.g., Inter, Roboto, or Outfit) in `index.html`.
- [x] Configure typography base settings in Tailwind (minimum 16px body text).
- [x] Install `lucide-react` (or similar library) for standard SVG icons.
- [x] Install state management library (e.g., `zustand`).
- [x] Create `store/useAppStore.js` file.
- [x] Define initial state: `currentPhase: 0` in store.
- [x] Define initial state: `progressPercentage: 0` in store.
- [x] Define initial state: `audienceType: null` in store.
- [x] Define initial state: `theme: 'light'` in store.
- [x] Define initial state: `language: 'en'` in store.

## Phase 1: App Shell & Global Components
- [x] Create `components/layout/AppShell.jsx` wrapper component.
- [x] Implement responsive grid/flex layout logic (1 column mobile, 2 columns desktop).
- [x] Create `components/layout/HeaderBar.jsx`.
- [x] Design and integrate SVG Logo ("VoteGuide" / "Election Quest") in HeaderBar.
- [x] Add app title "Voter Registration Journey" next to Logo.
- [x] Create `components/ui/ThemeToggle.jsx` component.
- [x] Implement light/dark mode DOM switching logic in `ThemeToggle.jsx`.
- [x] Create `components/ui/LanguageToggle.jsx` component (EN/HI).
- [x] Integrate Theme and Language toggles into `HeaderBar`.
- [x] Create `components/ui/ProgressTracker.jsx`.
- [x] Implement visual horizontal stepper mapped to `progressPercentage` state.
- [x] Create `components/ai/FloatingAIAssistantButton.jsx` with bottom-right fixed positioning.
- [x] Create `components/ai/AIAssistantPanel.jsx` base structure.
- [x] Add state logic to render AI panel as a Drawer on mobile and side-panel on desktop.
- [x] Create `components/ui/ToastContainer.jsx` for global notifications.
- [x] Create `components/ui/BottomStickyCTA.jsx` for contextual bottom-fixed buttons.

## Phase 2: Screen 1 - Home / Mission Landing
- [x] Create `pages/Home.jsx` template.
- [x] Create `components/home/HeroMissionCard.jsx`.
- [x] Add main headline text to `HeroMissionCard`.
- [x] Add subtext referencing ECI rules to `HeroMissionCard`.
- [x] Add "Start my journey" primary button inside `HeroMissionCard`.
- [x] Add "I'm under 18, just teach me." secondary button inside `HeroMissionCard`.
- [x] Create `components/home/AudienceSelectorChips.jsx`.
- [x] Add "Under 18" chip UI.
- [x] Add "18-20" chip UI.
- [x] Add "21+" chip UI.
- [x] Implement click logic for chips to update `audienceType` in Zustand store.
- [x] Create `components/home/MissionPreviewStrip.jsx`.
- [x] Add "Eligibility" mini-card with relevant icon.
- [x] Add "Forms & docs" mini-card with relevant icon.
- [x] Add "Online registration" mini-card with relevant icon.
- [x] Create `components/home/IntroVideoCard.jsx`.
- [x] Embed ECI/NVSP/Voter Helpline YouTube/video iframe.
- [x] Build "Watched official guide" visual badge overlay.
- [x] Implement event handler for "Start my journey": set phase to 1.
- [x] Implement event handler for "Start my journey": set progress to 10%.
- [x] Implement event handler for "Start my journey": trigger router push to `/eligibility`.

## Phase 3: Screen 2 - Eligibility Wizard
- [x] Create `pages/Eligibility.jsx` template.
- [x] Create `components/eligibility/WizardStepper.jsx`.
- [x] Build visual UI for "Age" step indicator.
- [x] Build visual UI for "Citizenship" step indicator.
- [x] Build visual UI for "Residence" step indicator.
- [x] Build visual UI for "Already registered?" step indicator.
- [x] Create `components/eligibility/QuestionCard.jsx`.
- [x] Add dynamic title and description props mapping to `QuestionCard`.
- [x] Create "Did you know?" snippet sub-section within `QuestionCard`.
- [x] Create `components/eligibility/AnswerOptionButton.jsx` ensuring a large, tappable area.
- [x] Instantiate "Yes", "No", "Not sure" variants of `AnswerOptionButton`.
- [x] Create `components/eligibility/HintToggle.jsx` ("Why does this matter?" trigger).
- [x] Create `components/eligibility/HintPanel.jsx` (collapsible text area).
- [x] Place "Ask AI" button inside `HintPanel`.
- [x] Implement logic to open `AIAssistantPanel` passing current context when "Ask AI" is clicked.
- [x] Create `components/eligibility/ResultCard.jsx`.
- [x] Implement conditional rendering to show success or learning outcome in `ResultCard`.
- [x] Wire up local React state to track current active wizard step (1 to 4).
- [x] Implement progress bar store updates per step (10% -> 25% -> 40% -> 55%).
- [x] Add final "Continue to residence & constituency" router link to `/residence`.

## Phase 4: Screen 3 - Residence & Maps
- [x] Create `pages/ResidenceMaps.jsx` template.
- [x] Create `components/residence/ResidenceExplainerCarousel.jsx`.
- [x] Build carousel slide: "What is ordinary residence?".
- [x] Build carousel slide: "What if you study in a hostel?".
- [x] Build carousel slide: "What if you moved recently?".
- [x] Create `components/residence/LocalitySearch.jsx`.
- [x] Add text input field with placeholder for area/pin code.
- [x] Add search submit button/icon.
- [x] Create mock JSON data file containing sample Delhi pin codes and AERO locations.
- [x] Implement search handler to filter mock JSON data based on input.
- [x] Create `components/maps/MapPanel.jsx`.
- [x] Integrate map library (e.g., Google Maps iframe, Leaflet, or Mapbox).
- [x] Implement dynamic marker rendering based on searched locality data.
- [x] Create `components/maps/LocationDetailSheet.jsx`.
- [x] Display Centre Name and Address props in `LocationDetailSheet`.
- [x] Display Phone Number and Call/Directions CTA buttons in `LocationDetailSheet`.
- [x] Create `components/residence/ResidenceQuizCard.jsx`.
- [x] Add scenario question text and multiple-choice buttons.
- [x] Build conditional UI showing success/error feedback + ECI rule explanation upon selection.
- [x] Implement routing to `/checklist` and progress update to 70% upon completion.

## Phase 5: Screen 4 - Document Checklist
- [x] Create `pages/DocumentChecklist.jsx` template.
- [x] Create `components/checklist/ChecklistSection.jsx` wrapper component.
- [x] Instantiate section for "Personal details".
- [x] Instantiate section for "Age proof".
- [x] Instantiate section for "Address proof".
- [x] Instantiate section for "Other details".
- [x] Create `components/checklist/ChecklistItemCard.jsx`.
- [x] Map title, subtitle, and bulleted document examples into `ChecklistItemCard`.
- [x] Build "I have this ready" interactive toggle switch/checkbox.
- [x] Create local component state to track total checked items versus required items.
- [x] Create `components/checklist/ChecklistProgressMeter.jsx`.
- [x] Implement math to calculate percentage of ticked items and visually render the meter.
- [x] Create `components/checklist/FAQAccordion.jsx`.
- [x] Add default Q/A item: "Is Aadhaar mandatory?".
- [x] Add "Ask AI about documents" button below the accordion.
- [x] Install `canvas-confetti` (or similar) for celebration effects.
- [x] Trigger confetti animation when 100% of required checklist items are toggled.
- [x] Add Next button linking to `/walkthrough` and updating global progress to 80%.

## Phase 6: Screen 5 - Registration Walkthrough
- [x] Create `pages/RegistrationWalkthrough.jsx` template.
- [x] Create `components/walkthrough/StepNavList.jsx` for vertical navigation.
- [x] Map official portal steps (1 to 6) in the `StepNavList` component.
- [x] Create `components/walkthrough/MockPortalView.jsx`.
- [x] Design placeholder UI blocks representing Step 1 (Create Account).
- [x] Design placeholder UI blocks representing Step 2 (Choose Form 6).
- [x] Design placeholder UI blocks representing Step 3 (Personal Details).
- [x] Design placeholder UI blocks representing Step 4 (Residence Details).
- [x] Design placeholder UI blocks representing Step 5 (Upload Documents).
- [x] Design placeholder UI blocks representing Step 6 (Preview & Submit).
- [x] Create `components/walkthrough/StepExplanationPanel.jsx`.
- [x] Render dynamic "What this step does" text based on active step.
- [x] Render dynamic "Watch for common errors" text based on active step.
- [x] Create `components/walkthrough/AIHelpPanel.jsx`.
- [x] Map pre-built quick question chips relevant to the active walkthrough step.
- [x] Create `components/walkthrough/OpenOfficialPortalCard.jsx`.
- [x] Build primary CTA button that opens `voters.eci.gov.in` in a new tab.
- [x] Build secondary CTA button linking to Voter Helpline app instructions.
- [x] Implement Next Step handler to cycle through steps internally.
- [x] Implement final Next Step handler to push route to `/status` and update progress to 90%.

## Phase 7: Screen 6 - Status & Next Steps
- [x] Create `pages/StatusNextSteps.jsx` template.
- [x] Create `components/status/StatusTimeline.jsx`.
- [x] Build visual node for "Submitted".
- [x] Build visual node for "Under Verification".
- [x] Build visual node for "Accepted".
- [x] Build visual node for "EPIC/e-EPIC issued".
- [x] Create `components/status/StatusSimulatorInput.jsx`.
- [x] Add text input field specifically for a mock reference number.
- [x] Add submit button for the simulator.
- [x] Implement cycling logic: each submit click advances the active `StatusTimeline` node.
- [x] Create `components/status/NextStepsList.jsx`.
- [x] Add styled link item for "How to check voter list".
- [x] Add styled link item for "How to download e-EPIC".
- [x] Add styled text block for local contact info.
- [x] Build final Continue button, route to `/quiz`, update progress to 95%.

## Phase 8: Screen 7 - Quiz & Badges
- [x] Create `pages/QuizBadges.jsx` template.
- [x] Create `components/quiz/QuizQuestionCard.jsx`.
- [x] Store 5-10 mock quiz questions with correct answers and rule explanations in a local JSON array.
- [x] Implement logic to display 1 question at a time.
- [x] Implement UI to reveal the explanation block and a "Next Question" button post-answer.
- [x] Create `components/quiz/ScoreTracker.jsx` to render current score (X/Y).
- [x] Create `components/quiz/BadgeUnlockModal.jsx`.
- [x] Design/source SVG graphic for "Form 6 Pro" badge.
- [x] Design/source SVG graphic for "Residence Ranger" badge.
- [x] Design/source SVG graphic for "Portal Navigator" badge.
- [x] Implement state logic to trigger `BadgeUnlockModal` when specific score thresholds are met.
- [x] Create `components/quiz/ShareCard.jsx`.
- [x] Implement "Copy to Clipboard" functionality for the generated share statement.
- [x] Update global progress to 100%.

## Phase 9: Screen 8 - Help & Sources
- [x] Create `pages/HelpSources.jsx` template.
- [x] Create `components/help/SourcesAccordion.jsx`.
- [x] Format and add external anchor links to ECI Guidelines.
- [x] Format and add external anchor link to Form 6 PDF.
- [x] Format and add external anchor link to CEO Delhi site.
- [x] Create `components/help/LegalDisclaimerCard.jsx`.
- [x] Add boilerplate text explicitly clarifying ECI's authority over the process.
- [x] Create `components/help/ContactHelpCard.jsx`.
- [x] Display formatted local electoral authority phone numbers and helpline data.

## Phase 10: Global UX Polish & API Integration
- [x] Create `services/api.js` (or `.ts`) to centralize backend fetch requests.
- [x] Implement async function `sendChatMessage(prompt, context)` targeting backend AI endpoints.
- [x] Implement async function `fetchDocumentSnippet(query)` for contextual file search.
- [x] Add `isLoading` and `isPending` state variables across components requiring data fetching.
- [x] Build and integrate Skeleton loader components for the AI panel text.
- [x] Build and integrate Skeleton loader components for Map data.
- [x] Create generic `components/ui/EmptyState.jsx` for missing data handling.
- [x] Create `components/layout/ErrorBoundary.jsx` to catch React render crashes gracefully.
- [x] Conduct Mobile touch-target audit: ensure all interactive elements are at least 44x44px.
- [x] Conduct Accessibility audit: run Lighthouse or axe-core checks for WCAG color contrast.
- [x] Add consistent focus rings via Tailwind (`focus:ring-2 focus:ring-teal-500 focus:outline-none`) to all buttons/inputs.
- [x] Install `framer-motion` library.
- [x] Apply subtle page transition animations between React Router route changes.
- [x] Apply micro-animations (`hover:scale-105 transition-transform`) to primary buttons, chips, and quiz answers.
- [x] Do a final end-to-end user flow test in the browser to ensure no dead-ends exist.

## Backend Phase 1: Project Setup & Core Configuration
- [x] Initialize Python project structure with `venv` and `requirements.txt`.
- [x] Install core dependencies (`fastapi`, `uvicorn`, `pydantic`, `pydantic-settings`, `python-dotenv`).
- [x] Install Google API clients (`google-genai`, `googlemaps`).
- [x] Configure `black` and `flake8` for code formatting.
- [x] Create `src/main.py` as the main FastAPI app entry point.
- [x] Implement FastAPI server initialization with configurable `PORT` from `.env`.
- [x] Implement `CORSMiddleware` for frontend-backend communication.
- [x] JSON payload parsing is handled natively by FastAPI/Pydantic.
- [x] Create `.env.example` file with placeholder variables (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`).
- [x] Set up a centralized `src/core/config.py` using Pydantic Settings to validate env vars.
- [x] Implement a global exception handler middleware in `src/core/exceptions.py`.
- [x] Implement structured request logging via Python `logging` module.
- [x] Set up directory structure: `src/api/routes`, `src/schemas`, `src/services`, `src/utils`, `src/data`.
- [x] Create a simple `GET /health` endpoint to verify the server is running.

## Backend Phase 2: Document Acquisition & Gemini File Search Ingestion
- [x] Create a `src/data/raw/` folder to store downloaded PDFs and sources.
- [ ] Download "Form 6 (national) PDF" from ECI website to `src/data/raw/Form_6_English.pdf`.
- [ ] Download "Guidelines for Form 6" from ECI website to `src/data/raw/Form-6_en.pdf`.
- [ ] Download "Delhi-specific Form 6 PDF" to `src/data/raw/Delhi_FORM6.pdf`.
- [ ] Download "Delhi Form 6 guide PDF" to `src/data/raw/Delhi_form6_Guide.pdf`.
- [x] Create a text document `src/data/raw/NVSP_Portal_Description.txt` detailing NVSP/Online Services.
- [x] Create a text document `src/data/raw/Voter_Helpline_App.txt` outlining the app's features and FAQs.
- [x] Gemini API is enabled and `GEMINI_KEY` is configured in `.env`.
- [x] Write ingestion script `scripts/ingest_documents.py` to upload files to Gemini File API.
- [x] Implement upload function with deduplication (skips already-uploaded files).
- [x] Run `python -m scripts.ingest_documents` after placing docs in `src/data/raw/`.

## Backend Phase 3: Core Eligibility API (`/api/eligibility/check`)
- [x] Create route file `src/api/routes/eligibility.py` and mount it to `/api/eligibility`.
- [x] Create Pydantic schemas `EligibilityCheckRequest` and `EligibilityCheckResponse` in `src/schemas/eligibility.py`.
- [x] Extract `ageYears`, `citizen`, `residentInIndia`, `currentlyRegistered`, `state`, `city` from request body with alias support.
- [x] Add input validation via Pydantic (type checks, `ge=0`, `le=150` for age, required fields).
- [x] Implement core ECI rule: check if `ageYears >= 18`.
- [x] Implement core ECI rule: check if `citizen == True`.
- [x] Implement core ECI rule: check if `residentInIndia == True`.
- [x] Compute overall `eligible` boolean based on the three conditions above.
- [x] Determine the `phase`: `"new_form6"` if eligible, `"learn_only"` otherwise.
- [x] Construct the `reasons` array with info/warn objects for age, citizenship, residency.
- [x] Construct the `links` array with objects pointing to NVSP, ECI, and Voter Helpline App.
- [x] Implement logic to generate the `summary` string dynamically based on the checks.
- [x] Send the finalized JSON response (`{eligible, phase, summary, reasons, links}`).
- [x] Tested with both eligible and ineligible inputs — verified correct.

## Backend Phase 4: AI Answer Engine (`/api/ai/answer`)
- [x] Create route file `src/api/routes/ai.py` and mount it to `/api/ai`.
- [x] Create Pydantic schemas `AIAnswerRequest` and `AIAnswerResponse` in `src/schemas/ai.py`.
- [x] Extract `question` (string), `phase` (Literal), and `context` (optional dict) from request body.
- [x] Add input validation: ensure `question` is not empty (min_length=1) and `phase` is one of the valid phases.
- [x] Initialize the Gemini API client (`google.genai`) using the configured API key.
- [x] Construct phase-specific `systemInstruction` for Gemini with 5 distinct prompts (eligibility, residence, documents, registration, status).
- [x] Inject the user's `phase` and `context` (e.g., city/state) into the system prompt.
- [x] Configure the model (`gemini-2.5-flash`) with all uploaded files for grounded answers.
- [x] Call the Gemini `generateContent` API passing the user's question with file references.
- [x] Parse the API response to extract the generated text.
- [x] Map uploaded file references to a frontend-friendly `sources` array (containing `title` and `url`).
- [x] Format the final response payload: `{answer, sources}`.
- [x] Add error handling for Gemini API failures (rate limits, timeouts) and return a fallback message.
- [x] Tested with a hostel residence question — verified correct grounded answer.

## Backend Phase 5: Residence & Delhi Maps Dataset Preparation
- [x] Created `src/data/delhi_centres.json` with 12 sample voter centres across Delhi ACs.
- [x] Each centre has AC Number, AC Name, Centre Name, Address, Phone, Email, and lat/lng.
- [x] Data is clean, normalized, and ready for distance calculations.
- [x] Created `src/data/delhi_ac_list.json` with all 70 Delhi Assembly Constituencies.
- [x] Created `src/data/residence_examples.json` with 5 curated examples (hostel, rental, recent move, cross-state work, temporary stay).

## Backend Phase 6: Residence & Maps APIs (`/api/residence/*`)
- [x] Create route file `src/api/routes/residence.py` and mount it to `/api/residence`.
- [x] Create Pydantic schemas in `src/schemas/residence.py` (ResidenceExample, VoterCentre, responses).
- [x] Implement `GET /api/residence/examples` — returns curated examples with optional state/city filter.
- [x] Implement `GET /api/residence/delhi-centres` — supports `ac` and `q` query params.
- [x] Add input validation: ensure at least one of `ac` or `q` is provided.
- [x] Initialize Google Maps client via `googlemaps` Python library in `src/services/maps_service.py`.
- [x] Implement AC-based filtering: match `acNo` or `acName` against `delhi_centres.json`.
- [x] Implement locality geocoding: call Google Maps Geocoding API for `q` parameter.
- [x] Implement Haversine distance calculation in `src/services/maps_service.py`.
- [x] Sort centres by distance and return top 5 nearest.
- [x] Add error handling for Geocoding failures with graceful fallback.
- [x] Tested with `ac=2` (Burari) — verified correct.

## Backend Phase 7: Document Checklist API (`/api/documents/checklist`)
- [x] Create `src/data/document_checklist.json` with 4 sections, 18 items mapped from Form 6.
- [x] Define "Personal Details" section with 5 mandatory items.
- [x] Define "Age Proof" section with 6 acceptable documents (Birth cert, Class 10, Aadhaar, PAN, Passport, DL).
- [x] Define "Address Proof" section with 7 acceptable documents (Aadhaar, Bank, Ration Card, Passport, Utility bill, Rent agreement, Govt letter).
- [x] Create route file `src/api/routes/documents.py` and mount it to `/api/documents`.
- [x] Create Pydantic schemas in `src/schemas/documents.py`.
- [x] Accept optional `state` and `ageBand` query params for future filtering.
- [x] Return the `{sections: [...]}` JSON response — tested and verified.

## Backend Phase 8: Registration Walkthrough API (`/api/registration/steps`)
- [x] Create `src/data/registration_steps.json` with both `portal` (6 steps) and `app` (5 steps) channels.
- [x] Each step includes title, description, tips, commonErrors, and optional videoUrl.
- [x] Create route file `src/api/routes/registration.py` and mount it to `/api/registration`.
- [x] Create Pydantic schemas in `src/schemas/registration.py`.
- [x] Extract `channel` query param (defaulting to `portal`).
- [x] Validate channel is one of `portal` or `app`.
- [x] Return the structured step-by-step walkthrough JSON — tested and verified.

## Backend Phase 9: Status & Next Steps API (`/api/status/stages`)
- [x] Create `src/data/status_stages.json` with 4 lifecycle stages (Submitted, Verification, Accepted, EPIC).
- [x] Create route file `src/api/routes/status.py` and mount it to `/api/status`.
- [x] Create Pydantic schemas in `src/schemas/status.py`.
- [x] Return `{stages: [...]}` with labels, descriptions, estimated wait times, and where to check — tested and verified.

## Backend Phase 10: Quiz Engine APIs (`/api/quiz/*`)
- [x] Create `src/data/quiz_questions.json` with 10 questions across `residence`, `documents`, and `forms` topics.
- [x] Each question has id, topic, question text, 4 options, correctAnswer, and explanation.
- [x] Create cached JSON loader `src/utils/data_loader.py` (used by quiz and all data endpoints).
- [x] Create route file `src/api/routes/quiz.py` and mount it to `/api/quiz`.
- [x] Create Pydantic schemas in `src/schemas/quiz.py` (QuizQuestion, QuizGradeRequest, QuizGradeResponse).
- [x] Implement `GET /api/quiz/questions` — fetches questions, filters by `topic`, strips `correctAnswer` and `explanation`.
- [x] Implement `POST /api/quiz/grade` — validates array lengths, compares answers, calculates score.
- [x] Return `{score, maxScore, detailed}` including per-question explanations — tested with 3/3 correct.

## Backend Phase 11: Sources & Help API (`/api/sources`)
- [x] Create `src/data/official_sources.json` with 10 official ECI/Delhi sources (forms, guidelines, portals, app).
- [x] Create route file `src/api/routes/sources.py` and mount it to `/api/sources`.
- [x] Create Pydantic schemas in `src/schemas/sources.py`.
- [x] Return the `{documents: [...]}` JSON array — tested and verified.

## Backend Phase 12: Testing & Deployment Prep
- [x] Manually tested all 11 endpoints via curl — all returning correct responses.
- [x] Write unit tests for the core logic inside the `checkEligibility` service.
- [x] Write unit tests verifying Haversine distance calculation logic.
- [x] Write unit tests for the Quiz grading logic (`score` and `detailed` explanations).
- [x] Verified CORS middleware is configured for frontend communication.
- [x] Prepared `Dockerfile` for containerizing the backend service.
- [x] Documented API contracts in `backend/README.md` with architecture, quick start, and endpoint table.
- [x] Auto-generated OpenAPI/Swagger docs available at `/docs` and `/redoc`.

## Frontend Phase 10: Bug Fixes & E2E Verification
- [x] Fix React crash in Residence Scenario Quiz (missing imports for `CheckCircle2`/`XCircle`).
- [x] Fix React crash in Document Checklist (missing `AnimatePresence` import).
- [x] Connect "Ask AI" buttons to trigger `AIAssistantPanel` via global store.
- [x] Update Eligibility logic to handle "Not Eligible" cases (Return Home option).
- [x] Remove strict Phase Route Guards to allow free review of all pages.
- [x] Conduct full E2E verification of all 8 frontend pages with browser subagent.
- [x] Rebuild and redeploy stable frontend container (v1.1.0).
