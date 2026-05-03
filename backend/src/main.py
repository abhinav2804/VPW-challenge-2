"""Voter Registration Journey — Backend API.

A production-grade FastAPI application powering the gamified voter
registration assistant. All routes are mounted under ``/api/*`` and
the service exposes a ``/health`` endpoint for readiness probes.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import get_settings
from src.core.exceptions import global_exception_handler
from src.api.routes.eligibility import router as eligibility_router
from src.api.routes.ai import router as ai_router
from src.api.routes.residence import router as residence_router
from src.api.routes.documents import router as documents_router
from src.api.routes.registration import router as registration_router
from src.api.routes.status import router as status_router
from src.api.routes.quiz import router as quiz_router
from src.api.routes.sources import router as sources_router
from src.api.routes.google_services import router as google_services_router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------
settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend API for the gamified Voter Registration Journey assistant.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------
app.add_exception_handler(Exception, global_exception_handler)

# ---------------------------------------------------------------------------
# Route registration
# ---------------------------------------------------------------------------
app.include_router(eligibility_router)
app.include_router(ai_router)
app.include_router(residence_router)
app.include_router(documents_router)
app.include_router(registration_router)
app.include_router(status_router)
app.include_router(quiz_router)
app.include_router(sources_router)
app.include_router(google_services_router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    """Simple liveness / readiness probe."""
    return {"status": "ok", "service": settings.PROJECT_NAME}


# ---------------------------------------------------------------------------
# Entrypoint (development)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
