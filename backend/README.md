# Voter Registration Journey — Backend API

A production-grade **FastAPI** backend powering the gamified Voter Registration Journey assistant. It provides AI-grounded answers (via Gemini), Delhi voter centre lookups (via Google Maps), and structured data endpoints for eligibility, documents, registration walkthroughs, quizzes, and official sources.

## Architecture

```
backend/
├── src/
│   ├── main.py                     # FastAPI app entry point
│   ├── core/
│   │   ├── config.py               # Pydantic Settings (env vars)
│   │   └── exceptions.py           # Global error handler
│   ├── api/routes/
│   │   ├── eligibility.py          # POST /api/eligibility/check
│   │   ├── ai.py                   # POST /api/ai/answer
│   │   ├── residence.py            # GET  /api/residence/examples & delhi-centres
│   │   ├── documents.py            # GET  /api/documents/checklist
│   │   ├── registration.py         # GET  /api/registration/steps
│   │   ├── status.py               # GET  /api/status/stages
│   │   ├── quiz.py                 # GET  /api/quiz/questions & POST /api/quiz/grade
│   │   └── sources.py              # GET  /api/sources
│   ├── schemas/                    # Pydantic request/response models
│   ├── services/
│   │   ├── gemini_service.py       # Gemini File API + AI answers
│   │   ├── maps_service.py         # Google Maps Geocoding + Haversine
│   │   └── eligibility_service.py  # Hard-coded ECI rules engine
│   ├── utils/
│   │   └── data_loader.py          # Cached JSON fixture loader
│   └── data/
│       ├── raw/                    # Place ECI PDFs/docs here for ingestion
│       ├── delhi_centres.json
│       ├── delhi_ac_list.json
│       ├── residence_examples.json
│       ├── document_checklist.json
│       ├── registration_steps.json
│       ├── status_stages.json
│       ├── quiz_questions.json
│       └── official_sources.json
├── scripts/
│   └── ingest_documents.py         # Upload raw docs to Gemini File API
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Quick Start

```bash
# 1. Create virtual environment
python3 -m venv venv && source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your GEMINI_KEY, GOOGLE_MAPS_API_KEY, etc.

# 4. (Optional) Ingest documents into Gemini
# Place PDFs in src/data/raw/, then:
python -m scripts.ingest_documents

# 5. Run the server
uvicorn src.main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Liveness probe |
| `POST` | `/api/eligibility/check` | ECI eligibility evaluation |
| `POST` | `/api/ai/answer` | Grounded AI Q&A via Gemini |
| `GET` | `/api/residence/examples` | Residence scenario cards |
| `GET` | `/api/residence/delhi-centres` | Delhi voter centre lookup |
| `GET` | `/api/documents/checklist` | Form 6 document checklist |
| `GET` | `/api/registration/steps` | Step-by-step walkthrough |
| `GET` | `/api/status/stages` | Registration lifecycle |
| `GET` | `/api/quiz/questions` | Quiz questions (answers stripped) |
| `POST` | `/api/quiz/grade` | Grade quiz answers |
| `GET` | `/api/sources` | Official ECI sources list |

## Interactive Docs

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Document Ingestion

Place ECI PDFs and text files in `src/data/raw/`, then run:

```bash
python -m scripts.ingest_documents
```

The script uploads files to the Gemini File API and skips already-uploaded documents. The AI service auto-discovers all uploaded files at runtime.

## Docker

```bash
docker build -t vpw-backend .
docker run -p 8000:8000 --env-file .env vpw-backend
```
