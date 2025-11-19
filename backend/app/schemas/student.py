from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, EmailStr

from .common import TimestampModel


class StudentBase(BaseModel):
    roll_number: str
    first_name: str
    last_name: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[str] = None
    batch: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    notes: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[str] = None
    batch: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    notes: Optional[str] = None


class StudentOut(StudentBase, TimestampModel):
    id: int

    class Config:
        from_attributes = True
