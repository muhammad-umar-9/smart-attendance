from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class TimestampModel(BaseModel):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    total: int
    items: list
