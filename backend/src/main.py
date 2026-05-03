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

import structlog
from typing import Dict, Any
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from src.core.limiter import limiter

from src.services.gemini_service import _get_client as get_gemini_client
from src.services.storage_service import _get_storage_client
from src.services.sheets_service import _get_sheets_service

# ---------------------------------------------------------------------------
# Structured Logging
# ---------------------------------------------------------------------------
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.dev.set_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
    cache_logger_on_first_use=True,
)
logger = structlog.get_logger(__name__)

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
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://voter-portal.web.app",  # Example production URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
async def health_check() -> Dict[str, Any]:
    """Robust health check verifying connectivity to downstream Google services."""
    dependencies: Dict[str, str] = {
        "gemini": "unknown",
        "storage": "unknown",
        "sheets": "unknown"
    }
    status = "ok"
    
    # Check Gemini (lightweight probe)
    try:
        if get_gemini_client():
            dependencies["gemini"] = "up"
    except Exception:
        dependencies["gemini"] = "down"
        status = "degraded"

    # Check Storage
    try:
        if _get_storage_client():
            dependencies["storage"] = "up"
    except Exception:
        dependencies["storage"] = "down"
        status = "degraded"

    # Check Sheets
    try:
        if _get_sheets_service():
            dependencies["sheets"] = "up"
    except Exception:
        dependencies["sheets"] = "down"
        status = "degraded"

    return {
        "status": status,
        "service": settings.PROJECT_NAME,
        "dependencies": dependencies
    }


# ---------------------------------------------------------------------------
# Entrypoint (development)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
