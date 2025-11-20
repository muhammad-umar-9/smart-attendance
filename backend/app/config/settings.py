from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
APP_DIR = BASE_DIR / "backend" / "app"


class Settings(BaseSettings):
    """Application configuration sourced from environment variables or `.env`."""

    model_config = SettingsConfigDict(env_file=(BASE_DIR / ".env"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Smart Attendance API"
    api_prefix: str = "/api"
    database_url: str = Field(
        default=f"sqlite:///{(BASE_DIR / 'smart_attendance.db').as_posix()}",
        description="SQLAlchemy database URL",
    )
    secret_key: str = Field(default="CHANGE_ME", description="JWT secret key")
    algorithm: str = Field(default="HS256", description="JWT signing algorithm")
    access_token_expire_minutes: int = Field(default=60, description="JWT expiry in minutes")
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:19006", "http://localhost:8081", "*"])
    face_model_path: Path = Field(default=APP_DIR / "ml" / "model" / "face_recognition.bin")
    face_match_threshold: float = Field(default=0.65)
    media_root: Path = Field(default=BASE_DIR / "storage" / "media")
    media_url: str = Field(default="/media")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
