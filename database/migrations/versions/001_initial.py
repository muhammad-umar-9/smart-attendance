"""Initial schema for Smart Attendance System (integer-based)."""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def _timestamp_columns() -> tuple[sa.Column, sa.Column]:
    created = sa.Column(
        "created_at",
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        nullable=False,
    )
    updated = sa.Column(
        "updated_at",
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
        onupdate=sa.func.now(),
        nullable=False,
    )
    return created, updated


def upgrade() -> None:
    created, updated = _timestamp_columns()
    op.create_table(
        "teachers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("department", sa.String(length=120)),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        created.copy(),
        updated.copy(),
    )

    created, updated = _timestamp_columns()
    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("roll_number", sa.String(length=64), nullable=False, unique=True),
        sa.Column("first_name", sa.String(length=120), nullable=False),
        sa.Column("last_name", sa.String(length=120)),
        sa.Column("program", sa.String(length=120)),
        sa.Column("semester", sa.String(length=64)),
        sa.Column("batch", sa.String(length=32)),
        sa.Column("email", sa.String(length=255)),
        sa.Column("avatar_url", sa.String(length=500)),
        sa.Column("notes", sa.String(length=1000)),
        created.copy(),
        updated.copy(),
    )

    created, updated = _timestamp_columns()
    op.create_table(
        "courses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("department", sa.String(length=120)),
        sa.Column("program", sa.String(length=120)),
        sa.Column("semester", sa.String(length=120)),
        sa.Column("section", sa.String(length=50)),
        sa.Column("teacher_id", sa.Integer(), sa.ForeignKey("teachers.id", ondelete="SET NULL")),
        created.copy(),
        updated.copy(),
        sa.UniqueConstraint("code", "section", name="uq_course_code_section"),
    )

    created, updated = _timestamp_columns()
    op.create_table(
        "enrollments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False),
        sa.Column("course_id", sa.Integer(), sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        created.copy(),
        updated.copy(),
        sa.UniqueConstraint("student_id", "course_id", name="uq_student_course"),
    )

    created, updated = _timestamp_columns()
    op.create_table(
        "attendance_sessions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("course_id", sa.Integer(), sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_date", sa.Date(), nullable=False, server_default=sa.text("CURRENT_DATE")),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("notes", sa.Text()),
        created.copy(),
        updated.copy(),
    )

    attendance_status = sa.Enum(
        "present",
        "absent",
        "unknown",
        name="attendance_status",
    )

    created, updated = _timestamp_columns()
    op.create_table(
        "attendance_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("session_id", sa.Integer(), sa.ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id", ondelete="SET NULL")),
        sa.Column("status", attendance_status, nullable=False, server_default="present"),
        sa.Column("confidence", sa.Numeric(5, 4)),
        sa.Column("payload", sa.Text()),
        sa.Column("snapshot_url", sa.String(length=500)),
        created.copy(),
        updated.copy(),
    )


def downgrade() -> None:
    op.drop_table("attendance_records")
    op.drop_table("attendance_sessions")
    op.drop_table("enrollments")
    op.drop_table("courses")
    op.drop_table("students")
    op.drop_table("teachers")
    attendance_status = sa.Enum("present", "absent", "unknown", name="attendance_status")
    attendance_status.drop(op.get_bind(), checkfirst=True)
