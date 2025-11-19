from __future__ import annotations

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.mixins import TimestampMixin


class Course(TimestampMixin, Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("code", "section", name="uq_course_code_section"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(120), nullable=True)
    program: Mapped[str] = mapped_column(String(120), nullable=True)
    semester: Mapped[str] = mapped_column(String(120), nullable=True)
    section: Mapped[str] = mapped_column(String(50), nullable=True)
    teacher_id: Mapped[int | None] = mapped_column(ForeignKey("teachers.id", ondelete="SET NULL"))

    teacher = relationship("Teacher", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    sessions = relationship("AttendanceSession", back_populates="course", cascade="all, delete-orphan")


class Enrollment(TimestampMixin, Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("student_id", "course_id", name="uq_student_course"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")