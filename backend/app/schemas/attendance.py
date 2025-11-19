from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from fastapi import Form
from pydantic import BaseModel

from app.models.attendance import AttendanceStatus
from .common import TimestampModel


class AttendanceSessionBase(BaseModel):
    course_id: int
    session_date: Optional[date] = None
    started_at: Optional[datetime] = None
    notes: Optional[str] = None


class AttendanceSessionCreate(AttendanceSessionBase):
    pass


class AttendanceSessionUpdate(BaseModel):
    session_date: Optional[date] = None
    started_at: Optional[datetime] = None
    notes: Optional[str] = None


class AttendanceSessionOut(AttendanceSessionBase, TimestampModel):
    id: int

    class Config:
        from_attributes = True


class AttendanceRecordBase(BaseModel):
    session_id: int
    student_id: Optional[int] = None
    status: AttendanceStatus = AttendanceStatus.present
    confidence: Optional[float] = None
    payload: Optional[str] = None
    snapshot_url: Optional[str] = None


class AttendanceRecordCreate(AttendanceRecordBase):
    pass


class AttendanceRecordUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None
    confidence: Optional[float] = None
    payload: Optional[str] = None
    snapshot_url: Optional[str] = None


class AttendanceRecordOut(AttendanceRecordBase, TimestampModel):
    id: int

    class Config:
        from_attributes = True


class IdentifyResponse(BaseModel):
    matched: bool
    student_id: Optional[int]
    confidence: float


class IdentifyResult(IdentifyResponse):
    payload: Optional[str] = None


class IdentifyRequest(BaseModel):
    image_base64: Optional[str] = None

    @classmethod
    def as_form(cls, image_base64: Optional[str] = Form(None)) -> "IdentifyRequest":
        return cls(image_base64=image_base64)


class MarkFaceAttendanceRequest(BaseModel):
    course_id: int
    session_id: Optional[int] = None
    image_base64: Optional[str] = None
    notes: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        course_id: int = Form(...),
        session_id: Optional[int] = Form(None),
        image_base64: Optional[str] = Form(None),
        notes: Optional[str] = Form(None),
    ) -> "MarkFaceAttendanceRequest":
        return cls(
            course_id=course_id,
            session_id=session_id,
            image_base64=image_base64,
            notes=notes,
        )
