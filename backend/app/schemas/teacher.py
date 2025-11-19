from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, EmailStr

from .common import TimestampModel


class TeacherBase(BaseModel):
    full_name: str
    email: EmailStr
    department: Optional[str] = None
    is_active: Optional[bool] = True


class TeacherCreate(TeacherBase):
    password: str


class TeacherUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class TeacherOut(TeacherBase, TimestampModel):
    id: int

    class Config:
        from_attributes = True
