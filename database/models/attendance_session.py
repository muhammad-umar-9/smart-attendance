from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..utils.base import Base
from . import TimestampMixin


class AttendanceSession(TimestampMixin, Base):
    __tablename__ = "attendance_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    session_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)

    course = relationship("Course", back_populates="sessions")
    records = relationship("AttendanceRecord", back_populates="session", cascade="all, delete-orphan")
