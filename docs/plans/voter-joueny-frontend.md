## 2. Frontend plan for Antigravity (UI/UX + component-level detail)

Assume a single-page React‑style app inside Antigravity, with stateful flows and Gemini calls proxied via your backend.

### 2.1 Design language \& UX philosophy

- Target user: 16–22 years, mobile first, short attention span.
- Tone: friendly, civic, non‑lecture, always clarifying that official decisions are by ECI.
- Visual direction:
    - Warm neutrals for backgrounds.
    - Single strong accent (civic teal/blue) for CTAs.
    - Occasional saffron/gold only for badges.
    - Clear typography; body text never below 16px.
- Layout:
    - Mobile first; one column on phones.
    - Two-panel layout on tablets/desktop for advanced screens (AI chat on side).
- States:
    - Every flow must have skeleton, error, empty, and success states.


### 2.2 High-level screens

Antigravity should plan at least these main screens:

1. **Home / Mission Landing**
2. **Eligibility Wizard**
3. **Residence \& Maps**
4. **Document Checklist**
5. **Registration Walkthrough**
6. **Status \& Next Steps**
7. **Quiz \& Badges**
8. **Help \& Sources**

Everything runs in one shell with a header + progress bar.

### 2.3 Shell and global components

**App Shell Layout**

- `HeaderBar`
    - Logo (simple SVG “VoteGuide”/“Election Quest” mark).
    - Title: “Voter Registration Journey”.
    - Language toggle (e.g., EN / HI).
    - Theme toggle (light/dark).
- `ProgressTracker`
    - Horizontal bar or stepper showing phases 1–6.
- `MainContent`
    - Current screen panel.
- `FloatingAIAssistantButton`
    - Bottom-right, opens AI side panel.
- `ToastContainer`
    - For brief notifications.
- `BottomStickyCTA`
    - Contextual (Next / Start / Open Portal).

**Styling details**

- Border radius: 12–16px on primary cards.
- Shadows: soft for main cards; no heavy drops.
- Spacing: 16–24px internal padding, 24–40px between sections.
- Focus states: visible outline; accessible color contrast.


### 2.4 Screen 1 – Home / Mission Landing

**Key UI components**

1. `HeroMissionCard`
    - Headline: “Learn how to register as a voter in India.”
    - Subtext: one‑line explanation referencing ECI rules.
    - Primary CTA: “Start my journey”.
    - Secondary CTA: “I’m under 18, just teach me.”
2. `AudienceSelectorChips`
    - Options: “Under 18”, “18–20”, “21+”.
    - Affects downstream copy and which steps are mandatory.
3. `MissionPreviewStrip`
    - Three mini cards with icons:
        - Eligibility
        - Forms \& documents
        - Online registration
4. `IntroVideoCard`
    - Embedded ECI/NVSP/Voter Helpline explainer video.[^4][^5][^3]
    - Watch badge: “Watched official guide”.

**Flow**

- User chooses audience.
- Presses “Start my journey.”
- State: phase set to 1, progress 0→10%.


### 2.5 Screen 2 – Eligibility Wizard

**Layout**

- One-column vertical wizard on mobile.
- Desktop: central card with stepper on left.

**Components**

1. `WizardStepper`
    - Steps:

2. Age
3. Citizenship
4. Residence
5. Already registered?
1. `QuestionCard`
    - Title, description, and maybe a “Did you know?” snippet.
    - Answer options as large buttons.
2. `AnswerOptionButton`
    - Big, tappable buttons: Yes/No/Not sure.
3. `HintToggle`
    - “Why does this matter?” → expands `HintPanel`.
4. `HintPanel`
    - Short explanation; “Ask AI” link which opens AI panel.
5. `ResultCard` (end of wizard)
    - Outcome summary:
        - “You seem eligible to register as a new voter with Form 6.”
        - Or “You’re under 18, here’s what you can still learn.”

**AI Integration**

- Clicking “Ask AI” passes the question + wizard context to backend (Cloud Run + Gemini File Search).
- Answer is shown in `AIAssistantPanel` with citations, but UI just shows a friendly answer.

**Flow**

- Each step: user answers.
- Progress: 10→25→40→55%.
- At end, “Continue to residence \& constituency”.


### 2.6 Screen 3 – Residence \& Maps

**Layout**

- On mobile:
    - Top: explanation cards.
    - Middle: map preview card with “Open map”.
    - Bottom: list of sample voter centres / AEROs for Delhi.
- On desktop:
    - Left: explanations + controls.
    - Right: embedded Google Map.

**Components**

1. `ResidenceExplainerCarousel`
    - Cards like:
        - “What is ordinary residence?”
        - “What if you study in a hostel?”
        - “What if you moved recently?”
    - Each card has “Learn more” → AI explanation backed by guidelines.[^8][^2]
2. `LocalitySearch`
    - Input with placeholder: “Enter area / pin code (e.g. Burari, 110084)”.
    - On submit, calls backend for sample mapping and AERO data (for Delhi).[^7][^6]
3. `MapPanel`
    - Google Maps embed showing:
        - User’s rough area.
        - Markers for “Voter centres / AEROs” from CEO Delhi table.[^6]
    - Clicking marker opens `LocationDetailSheet`.
4. `LocationDetailSheet`
    - Shows:
        - Centre name.
        - Address.
        - Office phone (from CEO Delhi).[^6]
        - “Call” and “Directions” CTAs (links).
5. `ResidenceQuizCard`
    - Scenario question: “Ravi studies in Delhi but home is in Jaipur; where can he register?”
    - Options; answer gives explanation from official rules.[^8][^2]

**Flow**

- User reads basic explanation.
- Searches locality (if Delhi).
- Sees approximate voter centre and understands physical aspect.
- Takes a quick residence quiz.
- Progress: 55→70%.


### 2.7 Screen 4 – Document Checklist

**Layout**

- Single-column list of collapsible cards.

**Components**

1. `ChecklistSection`
    - Sections:
        - Personal details.
        - Age proof.
        - Address proof.
        - Other details (relative info, declaration).[^2][^1]
2. `ChecklistItemCard`
    - Title: “Age proof”.
    - Subtitle: “Any one of these is usually accepted.”
    - Bullet list using official examples (e.g., birth certificate, Aadhaar, PAN, driving licence, Class X/XII certificate).[^1]
    - Toggle: “I have this ready.”
3. `ChecklistProgressMeter`
    - Shows percentage of items marked ready.
4. `FAQAccordion`
    - Q/A from ECI guidelines, e.g.:
        - “Is Aadhaar mandatory?” (explain nuance based on guidelines).[^2][^1]
    - “Ask AI about documents” button.

**Flow**

- User scans and marks items as ready.
- Once all essential items are ticked, show a small celebration animation.
- Progress: 70→80%.


### 2.8 Screen 5 – Registration Walkthrough

**Layout**

- Desktop:
    - Left: vertical navigation of steps.
    - Center: “mock portal screen” explaining what the user sees.
    - Right: AI helper for the current step.
- Mobile:
    - Top: Step indicator.
    - Middle: mock screen.
    - Bottom: AI helper collapsed into an expandable drawer.

**Components**

1. `StepNavList`
    - Steps:
        - Step 1: Create account / login.
        - Step 2: Choose Form 6 / New registration.[^4][^3]
        - Step 3: Fill personal details.[^1]
        - Step 4: Fill residence details.[^2][^1]
        - Step 5: Upload documents.[^1][^2]
        - Step 6: Preview \& submit.[^1]
2. `MockPortalView`
    - Simplified visual representation of official screen:
        - Generic blocks (placeholder forms) annotated with “Here you enter your name as in official records”, etc.[^2][^1]
    - Highlights context but does not copy UI exactly.
3. `StepExplanationPanel`
    - Plain-language text for the current step, including:
        - “What this step does”
        - “Watch for these common errors”
    - Derived from ECI guidelines.[^8][^2]
4. `AIHelpPanel`
    - Pre‑built quick questions (chips) like:
        - “What if my name spelling differs on Aadhaar?”
        - “Where do I mention that I shifted from another constituency?”
    - Clicking sends the context to Gemini File Search and shows answer.
5. `OpenOfficialPortalCard`
    - Buttons:
        - “Open Voter Portal (voters.eci.gov.in)”.[^3]
        - “See how to use Voter Helpline app” (link to video).[^5][^4]
    - Explanation that actual registration is done there.

**Flow**

- User walks through each step in simulation.
- At final step, show a summary card: “Now open the official portal and follow these steps.”
- Progress: 80→90%.


### 2.9 Screen 6 – Status \& Next Steps

**Layout**

- Single card with timeline.

**Components**

1. `StatusTimeline`
    - Steps:
        - Application submitted.
        - Under verification.
        - Accepted; name will appear in voter list.
        - Epic / e‑EPIC issued.[^10][^4]
2. `StatusSimulatorInput`
    - Allows user to paste a mock reference number (just for teaching).
    - Pressing “Check” cycles through statuses for demonstration.
3. `NextStepsList`
    - Items:
        - “How to check your name in voter list” (link to electoral search).[^3]
        - “How to download e‑EPIC when available.”[^10]
        - “Whom to contact if there’s an issue” (AERO/voter centre details for Delhi).[^7][^6]

**Flow**

- User sees what happens after submission.
- Understands that status is on official systems.
- Progress: 90→95%.


### 2.10 Screen 7 – Quiz \& Badges

**Layout**

- Quiz page with multiple rounds.

**Components**

1. `QuizQuestionCard`
    - Scenario-based MCQ; after each answer, show explanation citing rules.[^3][^2][^1]
2. `ScoreTracker`
    - Shows how many correct answers.
3. `BadgeUnlockModal`
    - When user passes threshold, they unlock:
        - Form 6 Pro (understands form fields).
        - Residence Ranger (understands ordinary residence).
        - Portal Navigator (knows Voter Portal/NVSP/Helpline).[^4][^3]
4. `ShareCard` (optional)
    - Generated statement: “I’ve learned how to register as a voter in India.”

**Flow**

- User plays through 5–10 questions.
- Gets badges and a completion summary.
- Progress: 95→100%.


### 2.11 Screen 8 – Help \& Sources

**Components**

1. `SourcesAccordion`
    - Links to:
        - Form 6 (PDF).[^11][^1]
        - Guidelines for Form 6.[^8][^2]
        - General voter registration page.[^3]
        - Voter Helpline app info.[^4]
        - CEO Delhi site / AERO listing.[^9][^7][^6]
2. `LegalDisclaimerCard`
    - Clarifies that official decisions rest with ECI and CEO offices.
3. `ContactHelpCard`
    - Explains how to reach local electoral authorities and helplines.[^9][^6][^4]

***
