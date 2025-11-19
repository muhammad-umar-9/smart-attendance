from __future__ import annotations

from typing import Optional

from pydantic import BaseModel

from .common import TimestampModel


class CourseBase(BaseModel):
    code: str
    title: str
    department: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[str] = None
    section: Optional[str] = None
    teacher_id: Optional[int] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[str] = None
    section: Optional[str] = None
    teacher_id: Optional[int] = None


class CourseOut(CourseBase, TimestampModel):
    id: int

    class Config:
        from_attributes = True
