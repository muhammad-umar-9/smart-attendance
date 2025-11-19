from __future__ import annotations

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.mixins import TimestampMixin


class Student(TimestampMixin, Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    roll_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=True)
    program: Mapped[str] = mapped_column(String(120), nullable=True)
    semester: Mapped[str] = mapped_column(String(64), nullable=True)
    batch: Mapped[str] = mapped_column(String(32), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student")
