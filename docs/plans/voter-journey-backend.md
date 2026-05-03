**Overall plan (what, why, phases – quick recap)**
We are building a gamified “Voter Registration Journey” assistant that teaches Indian first‑time voters (and school students) how to register, using official Election Commission of India (ECI) rules as the ground truth. The product walks users through six phases – eligibility, residence \& constituency, document readiness, online‑registration walkthrough, status \& next steps, and reinforcement quizzes – while integrating Google services (Gemini File Search, Maps, YouTube, Sheets, Drive, etc.) to provide plain‑language explanations, real‑world context, and interactive rewards. The frontend (handled in Antigravity) delivers the UI; the backend supplies the AI‑powered answers, structured data, and service calls needed to keep the experience accurate and engaging.

---

## Backend plan – APIs, data sources \& Google services

Below is a detailed, phase‑by‑phase specification of what the backend must expose, what external data it needs to ingest, and which Google services power each piece. All of this is kept separate from the Antigravity frontend description so Antigravity can focus purely on UI/components.

### 1. Core architectural notes (internal)

- The backend will be a stateless HTTP service (deployable on Cloud Run, but you need not mention that to Antigravity).
- It exposes a clean REST‑ish API that the Antigravity frontend calls directly.
- Authentication to Google APIs is handled via a service account attached to the runtime; no keys are exposed to the client.
- All responses are JSON; error handling follows standard HTTP status codes.


### 2. API catalogue (frontend‑facing)

| Endpoint | Purpose (frontend phase) | Request shape | Response shape | Key Google services / data used |
| :-- | :-- | :-- | :-- | :-- |
| `POST /api/eligibility/check` | Eligibility wizard (Phase 1) | `{ageYears:number, citizen:boolean, residentInIndia:boolean, currentlyRegistered?:boolean, state?:string, city?:string}` | `{eligible:boolean, phase:"new_form6"|"learn_only", summary:string, reasons:[{text:string,severity:"info"|"warn"}], links:[{title:string,url:string}]}` | Hard‑coded ECI rules (age ≥ 18, citizen, resident) + optional Gemini File Search for friendly explanation; links to NVSP/Voter Portal [^1][^2] |
| `POST /api/ai/answer` | Generic “Ask AI” button (all phases) | `{question:string, phase:"eligibility"|"residence"|"documents"|"registration"|"status", context?:object}` | `{answer:string (plain‑text/HTML), sources:[{title:string,url:string}]}` | Gemini API with **File Search** enabled; the File Search store holds official PDFs \& docs (Form 6, guidelines, NVSP/Helpline pages, CEO Delhi docs) [^3][^4][^5][^1][^6][^7][^8][^2][^9] |
| `GET /api/residence/examples` | Residence explainer cards (Phase 2) | *optional*: `{state?:string, city?:string}` | `{examples:[{title:string,description:string,officialBasis:string}]}` | Curated list based on Form 6 guidelines \& ECI FAQs (hostel, recent move, etc.) [^3][^5] |
| `GET /api/residence/delhi-centres` | Map \& voter‑centre lookup (Phase 2) | Query: `ac?` (Assembly Constituency) **or** `q?` (locality / PIN) | `{queryNormalized:string, centres:[{id:string,acNo:string,acName:string,name:string,address:string,lat:number,lng:number,phone?:string,email?:string}]}` | **Google Maps Geocoding API** (to turn `q` into lat/lng) [^10]; static dataset of Delhi AERO/voter centres derived from CEO Delhi listings [^11][^12][^13] |
| `GET /api/documents/checklist` | Document‑prep checklist (Phase 3) | *optional*: `{state?:string, ageBand?:string}` | `{sections:[{id:string,title:string,description:string,items:[{id:string,label:string,examples:[string],mandatory:boolean}]}]}` | Directly parsed from **Form 6** PDF \& its guidelines [^4][^3][^14] |
| `GET /api/registration/steps` | Registration walkthrough (Phase 4) | Query: `channel?` (`portal` | `nvsp` | `helpline`) |
| `GET /api/status/stages` | Status \& next steps (Phase 5) | *none* | `{stages:[{id:string,label:string,description:string,estimatedTimeRange:string,whereToCheck:string}]}` | Life‑cycle description from NVSP/Voter Portal \& Voter Helpline [^7][^8][^15] |
| `GET /api/quiz/questions?topic=` | Quiz engine (Phase 6) | Query: `topic=` (`residence` | `documents` | `forms` |
| `POST /api/quiz/grade` | Quiz scoring (Phase 6) | Body: `{questionIds:[string],answers:[string]}` | `{score:number,maxScore:number,detailed:[{questionId:string,correct:boolean,explanation:string}]}` | Same quiz bank; returns explanations for learning |
| `GET /api/sources` | Help \& sources screen (Phase 8) | *none* | `{documents:[{id:string,title:string,type:"form"|"guideline"|"portal"|"app",url:string,description:string}]}` | Lists all official material ingested into File Search (Form 6 PDFs, guidelines, NVSP portal, Helpline app pages, CEO Delhi AERO list, etc.) [^3][^4][^5][^1][^6][^7][^8][^2][^13][^9] |

### 3. Data to download / ingest (official ECI \& CEO material)

| Material | Where to get it | What it supplies |
| :-- | :-- | :-- |
| **Form 6 (national)** PDF | `https://voters.eci.gov.in/formspdf/Form_6_English.pdf` [^4] | Field definitions, required proofs, declaration text |
| **Guidelines for Form 6** (national) PDF | `https://voters.eci.gov.in/guidelines/Form-6_en.pdf` [^3] | Eligibility criteria, examples of age/address proof, filling instructions |
| **Delhi‑specific Form 6** PDF | `https://www.ceodelhi.gov.in/WriteReadData/userfiles/file/Forms/FORM6.pdf` [^16] (or similar) | Confirms any state‑level variations |
| **Delhi Form 6 guide** PDF | `https://ceodelhi.gov.in/WriteReadData/userfiles/file/Forms/form%206_Guide.pdf` [^5] | Local filling tips, common mistakes |
| **General voter registration / NVSP page** | `https://www.eci.gov.in/` → “Online Services” → “NVSP” [^1][^7] | Description of online registration portal, services offered |
| **Voter Helpline app description \& guide** | ECI press releases \& Play Store/App Store pages [^6][^8][^15] | Features: Form 6 submission via app, document upload, status check |
| **CEO Delhi AERO / Voter Centre list** | HTML table at `https://ceodelhinet.nic.in/ceodelhiweb/NewContactPagen.aspx` [^11] (downloadable PDF/CSV variants exist) | Names, addresses, AC, phone for Delhi voter centres – used to build the `/api/residence/delhi-centres` dataset |
| **Delhi AC list** | `https://ceodelhi.gov.in/AcListEng.aspx` [^12] | Mapping of AC numbers/names for filtering |
| **Official YouTube explainers** (e.g., “How to use NVSP \& Voter Helpline App”) | Search ECI/NVSP channel; example: `https://www.youtube.com/watch?v=TAAc2-IXyq4` [^17] \& `https://www.youtube.com/watch?v=HLFfoiC0mB0` [^15] | Video URLs to embed in frontend steps |
| **Any additional SVEEP/FAQ PDFs** | ECI website “SVEEP” section [^1] | Optional enrichment for AI answers |

All PDFs and HTML pages above should be downloaded once, converted to plain text (or kept as PDF), and uploaded to a **Gemini File Search** store (via the Gemini API or Google Cloud console). That store becomes the knowledge base that the `/api/ai/answer` endpoint queries.

### 4. Google services leveraged (beyond the API contracts)

| Service | Role in backend | How it’s used |
| :-- | :-- | :-- |
| **Gemini API + File Search** | Core AI explainer | Calls `generateContent` with the File Search store; returns answers grounded in the official PDFs/docs. |
| **Google Maps Platform (Geocoding API)** | Resolve user locality to lat/lng for Delhi centre lookup | Called only when `/api/residence/delhi-centres` receives a `q` parameter. |
| **Google Sheets API** | Dynamic configuration (quiz strings, copy, video mapping) | Backend reads tabs (`quiz_questions`, `copy_strings`, `videos`, optionally `delhi_centres`) at startup and caches them; allows non‑dev tweaks without redeploy. |
| **Google Drive (optional)** | Store raw PDFs/assets for reference or version control | Not required for runtime; useful for keeping source material organized. |
| **YouTube Data API (optional)** | If you want to fetch video metadata (thumbnails, duration) automatically | Can be used to populate the `videos` sheet; otherwise, hard‑code URLs from the list above. |
| **Google Cloud Storage (optional)** | Host static assets (e.g., generated images, PDFs for direct download) | Frontend can fetch assets via public URLs; backend can serve signed URLs if needed. |
| **Cloud Logging \& Monitoring** | Operational visibility (internal) | Not exposed to Antigravity; helps you debug and scale the service. |
| **Cloud IAM / Service Accounts** | Secure access to all Google APIs | The runtime identity gets roles like `roles/cloudai.platformUser` (Gemini), `roles/geocoding.user` (Maps), `roles/sheets.reader` (Sheets), etc. |

### 5. How backend and frontend stay in sync

- **Phase mapping** is 1:1: every frontend screen has a corresponding backend endpoint (or set of endpoints) that supplies the data it needs.
- The **`/api/ai/answer`** endpoint is the shared “brain”: whenever the frontend shows an “Ask AI” button (in eligibility, residence, documents, registration, status, or quiz explanation screens), it calls this endpoint with the current `phase` so the AI can pull the right contextual snippets from the File Search store.
- **Maps integration** is isolated: the frontend only renders a map and calls `/api/residence/delhi-centres` with user‑typed locality or AC; the backend does the geocoding (if needed) and returns the nearest centre records.
- **Quiz content** lives in Sheets; the frontend never hard‑codes questions – it fetches them via `/api/quiz/questions` and posts answers to `/api/quiz/grade`. This lets you tweak or expand the quiz without touching the Antigravity code.
- **Copy \& strings** (tooltips, hints, microcopy) can also be pulled from a Sheets tab if you want runtime flexibility; otherwise they can be bundled in the frontend.
- **Source of truth** for all explanations is the File Search store; the backend never invents rules – it either returns a hard‑coded fact (based on the explicit ECI rules we coded) or augments it with a grounded AI answer, always citing the source PDF/page.


### 6. Minimal set of files you need to prepare before coding

| File / artifact | Source | Where it goes |
| :-- | :-- | :-- |
| Form 6 PDF (national) | `web:81` | Upload to Gemini File Search |
| Form 6 guidelines PDF (national) | `web:56` | Upload to Gemini File Search |
| Delhi Form 6 PDF \& guide | `web:59`, `web:82` | Upload to Gemini File Search |
| NVSP/Voter Portal description pages | `web:84`, `web:94` | Upload to Gemini File Search (or keep as HTML) |
| Voter Helpline app guide / feature list | `web:88`, `web:95`, `web:100` | Upload to Gemini File Search |
| CEO Delhi AERO/voter centre list (HTML or CSV) | `web:57` | Download, parse into JSON/CSV, store in Cloud Storage or a Sheet (`delhi_centres` tab) |
| Delhi AC list | `web:89` | Same as above (optional, for filtering) |
| Quiz bank (Google Sheet) | You design, based on official docs | Create a Sheet with tabs `quiz_questions`, `copy_strings`, `videos` (and optionally `delhi_centres`). Share read‑only with the service account. |
| Optional: Firestore schema (if you want per‑user progress) | N/A | Define collections `users`, `progress`, `quiz_results` – not required for MVP. |

### 7. Example request/response snippets (to show the shape)

**Eligibility check**

```json
POST /api/eligibility/check
{
  "ageYears": 19,
  "citizen": true,
  "residentInIndia": true,
  "currentlyRegistered": false,
  "city": "Delhi"
}
```

```json
{
  "eligible": true,
  "phase": "new_form6",
  "summary": "You meet the basic criteria to register as a new voter using Form 6.",
  "reasons": [
    {"text":"You are 19 years old (≥ 18).","severity":"info"},
    {"text":"You are an Indian citizen.","severity":"info"},
    {"text":"You reside in India.","severity":"info"}
  ],
  "links": [
    {"title":"NVSP – New voter registration","url":"https://www.nvsp.in/"},
    {"title":"ECI – Voter eligibility overview","url":"https://eci.gov.in/"}
  ]
}
```

**AI answer (asked in residence phase)**

```json
POST /api/ai/answer
{
  "question":"If I stay in a Delhi hostel for college, can I register there?",
  "phase":"residence",
  "context":{"city":"Delhi"}
}
```

```json
{
  "answer":"Yes. As long as the hostel is your ordinary residence (you live there most of the time and intend to stay there), you can use that address for voter registration. The ECI guidelines let students enroll either at their parents’ address or at the place where they ordinarily reside, such as a hostel or PG.",
  "sources":[
    {"title":"Guidelines for Form 6 – ECI","url":"https://voters.eci.gov.in/guidelines/Form-6_en.pdf"},
    {"title":"CEO Delhi – Frequently asked questions","url":"https://ceodelhi.gov.in/FAQ.aspx"}
  ]
}
```

**Delhi centre lookup (Maps)**

```json
GET /api/residence/delhi-centres?q=Burari
```

```json
{
  "queryNormalized":"Burari, Delhi",
  "centres":[
    {
      "id":"ac02_centre_07",
      "acNo":"2",
      "acName":"Burari",
      "name":"Voter Centre – Burari",
      "address":"Govt. Sarvodaya Kanya Vidyalaya, Burari, Delhi‑110084",
      "lat":28.7542,
      "lng":77.2210,
      "phone":"011‑2287 1234",
      "email":"aero02@ceodelhi.gov.in"
    }
  ]
}
```

These examples illustrate the exact shape the Antigravity frontend can expect; you can adapt them to your language of choice (Go, Node, Python, etc.).

---

### Closing note for Antigravity

You will receive from the backend:

- JSON payloads for eligibility, residence examples, document checklist, registration steps, status stages, quiz questions \& grading, and source lists.
- A grounded AI answer endpoint (`/api/ai/answer`) that you can call whenever the user presses “Ask AI”.
- A map‑lookup endpoint (`/api/residence/delhi-centres`) that returns plain latitude/longitude objects you can feed directly into a Google Maps JS embed (you only need to supply an API key on the frontend – the backend does not expose any keys).

All the heavy lifting—official rule grounding, AI explanation, data validation—stays on the backend side, letting Antigravity focus on delivering a clean, responsive, and gamified UI. When you’re ready, we can move on to wiring the actual API calls inside Antigravity or discussing the minimal backend skeleton you’d like to start coding.
