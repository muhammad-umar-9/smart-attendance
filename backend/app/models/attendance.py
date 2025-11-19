from __future__ import annotations

from datetime import date, datetime
from enum import Enum as PyEnum

from sqlalchemy import Date, DateTime, Enum as SAEnum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.mixins import TimestampMixin


class AttendanceStatus(str, PyEnum):
    present = "present"
    absent = "absent"
    unknown = "unknown"


class AttendanceSession(TimestampMixin, Base):
    __tablename__ = "attendance_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    session_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    course = relationship("Course", back_populates="sessions")
    records = relationship("AttendanceRecord", back_populates="session", cascade="all, delete-orphan")


class AttendanceRecord(TimestampMixin, Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("attendance_sessions.id", ondelete="CASCADE"))
    student_id: Mapped[int | None] = mapped_column(ForeignKey("students.id", ondelete="SET NULL"))
    status: Mapped[AttendanceStatus] = mapped_column(SAEnum(AttendanceStatus, name="attendance_status"), default=AttendanceStatus.present)
    confidence: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)
    payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    snapshot_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    session = relationship("AttendanceSession", back_populates="records")
    student = relationship("Student", back_populates="attendance_records")
