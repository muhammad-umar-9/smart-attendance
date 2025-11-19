from __future__ import annotations

from enum import Enum as PyEnum

from sqlalchemy import Enum as SAEnum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..utils.base import Base
from . import TimestampMixin


class AttendanceStatus(str, PyEnum):
    present = "present"
    absent = "absent"
    unknown = "unknown"


class AttendanceRecord(TimestampMixin, Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("attendance_sessions.id", ondelete="CASCADE"))
    student_id: Mapped[int | None] = mapped_column(ForeignKey("students.id", ondelete="SET NULL"))
    status: Mapped[AttendanceStatus] = mapped_column(SAEnum(AttendanceStatus, name="attendance_status"), default=AttendanceStatus.present)
    confidence: Mapped[float | None] = mapped_column(Numeric(5, 4))
    payload: Mapped[str | None] = mapped_column(Text)
    snapshot_url: Mapped[str | None] = mapped_column(String(500))

    session = relationship("AttendanceSession", back_populates="records")
    student = relationship("Student", back_populates="attendance_records")
