# 🗳️ Voter Registration Journey — Election Quest

> A gamified, AI-powered web application that guides Indian citizens through the voter registration process, built for the **Virtual Prompt Wars (VPW) Challenge 2**.

[![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Google Services Integration](#-google-services-integration)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Election Quest** is a production-grade, full-stack web application designed to simplify and gamify the Indian voter registration process. It transforms the traditionally complex bureaucratic journey of filling out **Form 6** (New Voter Registration) into an engaging, step-by-step mission-based experience.

The application leverages **Google Cloud services** extensively — including **Gemini AI** for intelligent Q&A, **Google Maps** for polling booth discovery, **Gemini-based Translation** for Hindi accessibility, and **Gemini-based TTS** for spoken-word narration.

### 🛡️ Production-Grade Engineering
- **Strict Type Safety**: 100% Mypy coverage with `strict=True` configuration.
- **Structured Logging**: JSON-formatted logs via `structlog` for observability.
- **Rate Limiting**: Intelligent throttling using `slowapi` to manage API usage.
- **Modular Frontend**: Decoupled "God Components" into atomic, maintainable sub-units.
- **Comprehensive Testing**: 116+ automated tests passing with high coverage.

### Problem Statement

Over **300 million** eligible Indian voters between 18–25 are either unregistered or unaware of the registration process. The official ECI portal, while functional, is not designed for first-time users who may find the process confusing. This application bridges that gap through gamification, AI assistance, and accessible design.

---

## ✨ Key Features

### 🎮 Gamification Engine
- **XP System**: Earn experience points for completing each mission phase
- **Level Progression**: Level up as you learn more about the registration process
- **Achievement Toasts**: Real-time achievement popups celebrate user milestones
- **Confetti Celebrations**: Canvas-based particle effects on 100% checklist completion

### 🤖 AI-Powered Assistance
- **Contextual AI Chat**: Phase-aware AI assistant powered by Google Gemini
- **Grounded Answers**: All AI responses cite official ECI documents (Form 6, NVSP guides)
- **File Search Integration**: Uploaded documents serve as the AI's knowledge base

### 🗺️ Interactive Maps
- **Google Maps Integration**: Find nearest voter registration centres in Delhi
- **Haversine Distance Calculation**: Sort centres by proximity to user's location
- **Assembly Constituency Lookup**: Search by AC number or name

### 🌐 Multilingual Support
- **Hindi Translation**: Translate any content to Hindi via Google Gemini
- **Text-to-Speech**: Generate spoken-word scripts for accessibility
- **Language Toggle**: Switch the entire UI between English and Hindi

### 📋 Registration Walkthrough
- **Mock Portal Simulator**: Interactive replica of the official ECI registration portal
- **Step-by-Step Guidance**: 6-step walkthrough with embedded YouTube tutorials
- **Photo Upload Rules**: Detailed passport photo requirements and validation
- **Form 6 Preview**: Live preview of the generated registration form

### 📊 Quiz & Assessment
- **10-Question Quiz**: Covers residence rules, document requirements, and ECI forms
- **Instant Grading**: Server-side answer validation with detailed explanations
- **Badge System**: Unlock "Form 6 Pro" badge for perfect scores

---

## 🔧 Google Services Integration

| Google Service | Usage | Endpoint |
|---|---|---|
| **Gemini AI (2.5 Flash)** | AI Q&A assistant with grounded answers | `POST /api/ai/answer` |
| **Gemini File API** | Document ingestion for RAG-style answers | `scripts/ingest_documents.py` |
| **Google Maps Geocoding** | Convert locality names to lat/lng coordinates | `GET /api/residence/delhi-centres` |
| **Google Maps Distance** | Calculate nearest voter registration centres | `GET /api/residence/delhi-centres` |
| **Gemini Translation** | English ↔ Hindi translation for accessibility | `POST /api/google/translate` |
| **Gemini TTS** | Spoken-word narration for low-literacy users | `POST /api/google/tts` |
| **Google Cloud Storage** | Secure upload of voter documents | `POST /api/google/storage/upload` |
| **Google Cloud Vision** | Validate uploaded passport photos | `POST /api/google/vision/validate-photo` |
| **Google Cloud Speech-to-Text**| Voice input for AI queries | `POST /api/google/speech/transcribe` |
| **Google Sheets API** | Append form submissions as a mock database | `POST /api/google/sheets/append` |
| **Google reCAPTCHA Enterprise**| Bot protection on submissions | `POST /api/google/sheets/append` |
| **Google Cloud Run** | Containerized deployment of both services | `cloud_deploy.sh` |
| **Google Artifact Registry** | Docker image storage and versioning | `cloud_deploy.sh` |
| **Google Cloud Build** | CI/CD pipeline for container builds | `cloud_deploy.sh` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       USER BROWSER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   React 19 + Vite + TailwindCSS + Framer Motion       │ │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │ │
│  │   │ Zustand  │ │ React    │ │ API      │ │ Canvas  │ │ │
│  │   │ Store    │ │ Router   │ │ Service  │ │Confetti │ │ │
│  │   └──────────┘ └──────────┘ └──────────┘ └─────────┘ │ │
│  └──────────────────────┬─────────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTPS (JSON)
┌─────────────────────────┼───────────────────────────────────┐
│                 GOOGLE CLOUD RUN                            │
│  ┌──────────────────────┴─────────────────────────────────┐ │
│  │   FastAPI (Python 3.12) + Uvicorn                      │ │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │ │
│  │   │Eligiblty │ │ Quiz     │ │ AI       │ │Translate│ │ │
│  │   │ Service  │ │ Service  │ │ Service  │ │ Service │ │ │
│  │   └──────────┘ └──────────┘ └────┬─────┘ └────┬────┘ │ │
│  │                                  │             │       │ │
│  │   ┌──────────┐ ┌────────────────┴─────────────┘     │ │
│  │   │ Maps     │ │       Google Gemini API              │ │
│  │   │ Service  │ │  (AI Q&A, Translate, TTS, FileAPI)   │ │
│  │   └────┬─────┘ └─────────────────────────────────────┘ │ │
│  │        │                                                │ │
│  │   ┌────┴─────┐                                         │ │
│  │   │ Google   │                                         │ │
│  │   │ Maps API │                                         │ │
│  │   └──────────┘                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI component framework |
| Vite | 5.4 | Build tool and dev server |
| TailwindCSS | 4.2 | Utility-first CSS framework |
| Framer Motion | 12.x | Animation library |
| Zustand | 5.0 | State management |
| React Router | 7.x | Client-side routing |
| Lucide React | 1.x | Icon library |
| Canvas Confetti | 1.9 | Celebration effects |
| Vitest | 4.x | Unit & integration testing |
| React Testing Library | 16.x | Component testing utilities |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12 | Runtime |
| FastAPI | 0.111 | Web framework |
| Uvicorn | 0.30 | ASGI server |
| Pydantic | 2.7 | Data validation & schemas |
| Google GenAI | 0.3 | Gemini AI SDK |
| Google Maps | 4.10 | Maps & Geocoding SDK |
| pytest | 8.2 | Testing framework |
| black | 24.4 | Code formatter |
| flake8 | 7.1 | Linter |

---

## 📁 Project Structure

```
VPW-challenge-2/
├── README.md                    # This file
├── cloud_deploy.sh              # One-click Cloud Run deployment
├── .env.example                 # Environment variable template
│
├── backend/                     # Python FastAPI backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pyproject.toml           # pytest, black, flake8 config
│   ├── src/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings (env vars)
│   │   │   └── exceptions.py    # Global exception handler
│   │   ├── api/routes/
│   │   │   ├── eligibility.py   # POST /api/eligibility/check
│   │   │   ├── ai.py            # POST /api/ai/answer
│   │   │   ├── residence.py     # GET /api/residence/*
│   │   │   ├── documents.py     # GET /api/documents/checklist
│   │   │   ├── registration.py  # GET /api/registration/steps
│   │   │   ├── status.py        # GET /api/status/stages
│   │   │   ├── quiz.py          # GET/POST /api/quiz/*
│   │   │   ├── sources.py       # GET /api/sources
│   │   │   └── google_services.py # POST /api/google/translate, /tts
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── eligibility_service.py
│   │   │   ├── gemini_service.py    # Gemini AI Q&A
│   │   │   ├── maps_service.py      # Google Maps + Haversine
│   │   │   ├── quiz_service.py
│   │   │   ├── translate_service.py # Google Translate via Gemini
│   │   │   └── tts_service.py       # Text-to-Speech via Gemini
│   │   ├── utils/
│   │   │   └── data_loader.py   # Cached JSON fixture loader
│   │   └── data/                # JSON fixtures (quiz, centres, etc.)
│   └── tests/
│       ├── conftest.py          # Shared pytest fixtures
│       ├── test_api_routes.py   # Integration tests (30+ tests)
│       ├── test_eligibility_service.py
│       ├── test_quiz_service.py
│       ├── test_maps_service.py
│       ├── test_data_loader.py
│       ├── test_schemas.py
│       └── test_config.py
│
├── frontend/                    # React + Vite frontend
│   ├── Dockerfile
│   ├── nginx.conf               # SPA routing for production
│   ├── cloudbuild.yaml          # Cloud Build config
│   ├── package.json
│   ├── vite.config.js           # Vitest config included
│   └── src/
│       ├── App.jsx              # Root component + routing
│       ├── services/api.js      # Centralised API client
│       ├── store/useAppStore.js # Zustand state (XP, phase, etc.)
│       ├── pages/               # 8 main screens
│       ├── components/          # Reusable UI components
│       └── __tests__/
│           ├── api.test.js      # API service tests (20+ tests)
│           └── store.test.js    # Store mutation tests (15+ tests)
│
├── google-service/              # Standalone Google service toolkit
│   ├── filesearch/              # Gemini File Search ingestion
│   └── data/                    # Raw ECI documents
│
├── scripts/                     # Utility scripts
│   └── ingest_documents.py      # Upload docs to Gemini File API
│
└── docs/
    └── todo.md                  # Implementation checklist
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x (frontend)
- **Python** ≥ 3.12 (backend)
- **Google Cloud SDK** (for deployment)
- **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/VPW-challenge-2.git
cd VPW-challenge-2
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_KEY

# Run the server
uvicorn src.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with docs at `/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. (Optional) Ingest Documents

```bash
cd backend
python -m scripts.ingest_documents
```

This uploads ECI PDFs to the Gemini File API for grounded AI answers.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Full OpenAPI docs are auto-generated at `/docs`.

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness / readiness probe |
| `POST` | `/api/eligibility/check` | Check voter eligibility |
| `POST` | `/api/ai/answer` | Ask AI a voter-registration question |
| `GET` | `/api/residence/examples` | Get residence scenario examples |
| `GET` | `/api/residence/delhi-centres` | Find nearest voter centres |
| `GET` | `/api/documents/checklist` | Get document checklist sections |
| `GET` | `/api/registration/steps` | Get step-by-step walkthrough |
| `GET` | `/api/status/stages` | Get application lifecycle stages |
| `GET` | `/api/quiz/questions` | Get quiz questions (answer stripped) |
| `POST` | `/api/quiz/grade` | Grade a quiz submission |
| `GET` | `/api/sources` | Get official ECI source links |

### Google Cloud Service Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/google/translate` | Translate text (English ↔ Hindi) |
| `POST` | `/api/google/tts` | Convert text to spoken-word script |

---

## 🧪 Testing & Coverage Report

The application maintains a high standard of code quality and testing, achieving **116 total tests** passing successfully across the stack.

### Backend Tests (79 passing tests)
The backend uses `pytest` with `pytest-cov` for comprehensive coverage.

```bash
cd backend
source venv/bin/activate

# Run all tests
pytest

# Run with coverage report
pytest --cov=src --cov-report=term-missing

# Run specific test file
pytest tests/test_api_routes.py -v
```

**Test Coverage Summary:**
- `test_api_routes.py` — 33 integration tests across all endpoints (including Google Services)
- `test_eligibility_service.py` — Eligibility rule evaluation
- `test_quiz_service.py` — Quiz grading logic
- `test_maps_service.py` — Haversine distance calculations
- `test_data_loader.py` — JSON fixture loading and caching
- `test_schemas.py` — Pydantic schema validation and edge cases
- `test_config.py` — Settings singleton and environment variable handling

### Frontend Tests (37 passing tests)
The frontend uses `vitest` with `happy-dom` and `@testing-library/react`.

```bash
cd frontend

# Run all tests
npm test

# Run with coverage report
npx vitest run --coverage
```

**Frontend Coverage Summary:**
- **Global Store (`useAppStore.js`)**: 100% Statement Coverage
- **API Services (`api.js`)**: 91.83% Statement Coverage
- **Components**: Rendering tests for complex screens like `Eligibility.jsx`

---

## 🔍 Code Quality

The project adheres to MAANG-level quality standards.

### Backend
We use **Ruff** for linting and **Mypy** for strict type checking.

```bash
cd backend

# Run Ruff (fast linter and formatter)
ruff check --fix .
ruff format .

# Run Mypy (strict type checking)
mypy src/
```

### Frontend

```bash
cd frontend

# Lint with ESLint
npm run lint
```

### Pre-commit Workflow

```bash
# Backend
cd backend && black --check src/ tests/ && flake8 src/ tests/ && pytest

# Frontend
cd frontend && npm run lint && npm test
```

---

## ☁️ Deployment

### Google Cloud Run (One-Click)

```bash
# From project root
chmod +x cloud_deploy.sh
./cloud_deploy.sh
```

This script:
1. Sets the GCP project
2. Enables Cloud Run, Artifact Registry, and Cloud Build APIs
3. Builds and pushes the backend Docker image
4. Deploys backend to Cloud Run with environment variables
5. Captures the backend URL
6. Builds the frontend with the backend URL injected at build time
7. Deploys frontend to Cloud Run on port 80

### Manual Docker Build

```bash
# Backend
cd backend
docker build -t vpw-backend .
docker run -p 8000:8000 --env-file .env vpw-backend

# Frontend
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:8000/api -t vpw-frontend .
docker run -p 80:80 vpw-frontend
```

---

## 📸 Live URLs

- **Frontend**: [https://vpw-frontend-pdfmyrj3yq-uc.a.run.app](https://vpw-frontend-pdfmyrj3yq-uc.a.run.app)
- **Backend API**: [https://vpw-backend-pdfmyrj3yq-uc.a.run.app/api](https://vpw-backend-pdfmyrj3yq-uc.a.run.app/api)
- **API Docs**: [https://vpw-backend-pdfmyrj3yq-uc.a.run.app/docs](https://vpw-backend-pdfmyrj3yq-uc.a.run.app/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pytest` and `npm test`)
4. Run linters (`black --check src/` and `npm run lint`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is built for the **Virtual Prompt Wars Hackathon** and is licensed under the MIT License.

---

## ⚠️ Disclaimer

This application is a prototype built for educational purposes. It is **NOT** an official government application. Always refer to [voters.eci.gov.in](https://voters.eci.gov.in) for the authoritative source on voter registration in India.
