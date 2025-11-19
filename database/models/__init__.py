"""SQLAlchemy models for the Smart Attendance System."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from ..utils.base import Base


class TimestampMixin:
    """Reusable created/updated timestamp columns."""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


# Import models for metadata registration
from .student import Student  # noqa: E402,F401
from .teacher import Teacher  # noqa: E402,F401
from .course import Course, Enrollment  # noqa: E402,F401
from .attendance_session import AttendanceSession  # noqa: E402,F401
from .attendance_record import AttendanceRecord, AttendanceStatus  # noqa: E402,F401

__all__ = [
    "TimestampMixin",
    "Student",
    "Teacher",
    "Course",
    "Enrollment",
    "AttendanceSession",
    "AttendanceRecord",
    "AttendanceStatus",
]
