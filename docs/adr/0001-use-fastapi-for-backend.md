# 1. Use FastAPI for Backend

Date: 2026-05-03

## Status
Accepted

## Context
We needed a backend framework capable of high concurrency to handle AI streaming and multiple Google API requests simultaneously. The framework also needed strict schema validation to interface cleanly with the frontend.

## Decision
We decided to use FastAPI with Python 3.12.

## Consequences
- **Positive:** Automatic OpenAPI documentation (`/docs`), excellent async support, and out-of-the-box data validation using Pydantic, which significantly reduced our validation code.
- **Negative:** Requires deeper understanding of `asyncio` to avoid blocking the event loop when integrating synchronous SDKs.
