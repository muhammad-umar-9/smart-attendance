"""Declarative base shared by all SQLAlchemy models."""
from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase, declared_attr


class Base(DeclarativeBase):
    """Adds automatic snake_case table naming and timestamp mixins."""

    @declared_attr.directive
    def __tablename__(cls) -> str:  # type: ignore[misc]
        return cls.__name__.lower()
