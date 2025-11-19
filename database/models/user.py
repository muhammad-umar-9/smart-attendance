from __future__ import annotations

import uuid

from sqlalchemy import CheckConstraint, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..utils.base import Base
from . import TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), nullable=False)

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'teacher')", name="ck_users_role"),
    )

    teacher_profile = relationship(
        "Teacher",
        back_populates="user_account",
        uselist=False,
    )
