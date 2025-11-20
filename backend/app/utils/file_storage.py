from __future__ import annotations

from pathlib import Path
from typing import Optional
from uuid import uuid4
import shutil

from fastapi import UploadFile

from app.config import settings


def save_snapshot(course_id: int, upload: UploadFile, session_id: Optional[int] = None) -> str:
    """Persist an uploaded snapshot under the media root and return a public URL."""
    media_root: Path = settings.media_root
    media_root.mkdir(parents=True, exist_ok=True)

    course_dir = media_root / f"course_{course_id}"
    if session_id:
        target_dir = course_dir / f"session_{session_id}"
    else:
        target_dir = course_dir / "unassigned"
    target_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(upload.filename or "").suffix or ".jpg"
    file_name = f"{uuid4().hex}{suffix}"
    destination = target_dir / file_name

    upload.file.seek(0)
    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    relative_path = destination.relative_to(media_root)
    return f"{settings.media_url}/{relative_path.as_posix()}"
