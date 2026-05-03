"""Document ingestion script for the Gemini File API.

This script uploads all documents from ``src/data/raw/`` to the Google
Gemini File API so they can be used for grounded AI answers at runtime.

Usage:
    cd backend
    python -m scripts.ingest_documents

The script prints the file name (ID) for each upload. These IDs are
automatically discovered at runtime by ``gemini_service.py`` via
``client.files.list()``, so no manual .env update is needed.
"""

import os
import sys
import glob

from dotenv import load_dotenv
from google import genai

# Load env from the backend directory or the project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_KEY")
if not api_key:
    print("ERROR: Neither GEMINI_API_KEY nor GEMINI_KEY found in environment.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "raw")

SUPPORTED_EXTENSIONS = (".pdf", ".txt", ".md", ".html", ".csv")


def list_raw_files() -> list[str]:
    """Find all uploadable files in the raw data directory."""
    files = []
    for ext in SUPPORTED_EXTENSIONS:
        files.extend(glob.glob(os.path.join(RAW_DIR, f"*{ext}")))
    return sorted(files)


def upload_file(filepath: str) -> str:
    """Upload a single file to the Gemini File API and return its name/ID."""
    filename = os.path.basename(filepath)
    print(f"  Uploading '{filename}' ...", end=" ", flush=True)
    uploaded = client.files.upload(path=filepath)
    print(f"✓  → {uploaded.name}")
    return uploaded.name


def list_existing_files() -> set[str]:
    """Return display names of files already uploaded."""
    try:
        existing = set()
        for f in client.files.list():
            display = getattr(f, "display_name", None)
            if display:
                existing.add(display)
        return existing
    except Exception:
        return set()


def main():
    files = list_raw_files()
    if not files:
        print(f"No files found in {RAW_DIR}")
        print("Please add your PDF/TXT documents to src/data/raw/ before running this script.")
        sys.exit(0)

    existing = list_existing_files()
    print(f"Found {len(files)} file(s) to process. {len(existing)} already uploaded.\n")

    uploaded_names = []
    for filepath in files:
        basename = os.path.basename(filepath)
        if basename in existing:
            print(f"  Skipping '{basename}' (already uploaded)")
            continue
        name = upload_file(filepath)
        uploaded_names.append(name)

    print(f"\nDone. {len(uploaded_names)} new file(s) uploaded.")
    if uploaded_names:
        print("\nUploaded file IDs:")
        for n in uploaded_names:
            print(f"  - {n}")
    print("\nThese files will be auto-discovered by the AI service at runtime.")


if __name__ == "__main__":
    main()
