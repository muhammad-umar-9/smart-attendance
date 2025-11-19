"""Application-wide configuration for the Smart Attendance database layer."""
from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import os


@dataclass
class Settings:
    """Centralized configuration with sensible defaults for local development."""

    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/smart_attendance",
    )
    echo_sql: bool = os.getenv("SQL_ECHO", "0") == "1"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
