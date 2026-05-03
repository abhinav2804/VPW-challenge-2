"""Utility helpers for loading JSON data fixtures from src/data/."""

import json
import os
import logging
from functools import lru_cache
from typing import Any

logger = logging.getLogger(__name__)

_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


@lru_cache(maxsize=32)
def load_json(filename: str) -> Any:
    """Load and cache a JSON file from the data directory.

    Args:
        filename: The JSON filename relative to ``src/data/``.

    Returns:
        The parsed JSON content.

    Raises:
        FileNotFoundError: If the data file does not exist.
    """
    filepath = os.path.join(_DATA_DIR, filename)
    if not os.path.isfile(filepath):
        raise FileNotFoundError(f"Data file not found: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    logger.info("Loaded data file: %s", filename)
    return data
