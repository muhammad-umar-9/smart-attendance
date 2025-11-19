from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..utils.base import Base
from . import TimestampMixin


class Student(TimestampMixin, Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    roll_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str | None] = mapped_column(String(120))
    program: Mapped[str | None] = mapped_column(String(120))
    semester: Mapped[str | None] = mapped_column(String(64))
    batch: Mapped[str | None] = mapped_column(String(32))
    email: Mapped[str | None] = mapped_column(String(255))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    notes: Mapped[str | None] = mapped_column(String(1000))

    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student")
