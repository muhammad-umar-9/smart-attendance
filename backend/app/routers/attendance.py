from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db import get_session
from app.schemas import (
    AttendanceRecordCreate,
    AttendanceRecordOut,
    AttendanceRecordUpdate,
    AttendanceSessionCreate,
    AttendanceSessionOut,
    AttendanceSessionUpdate,
    IdentifyRequest,
    MarkFaceAttendanceRequest,
)
from app.services import attendance_service
from app.services.ml_integration import identify_from_inputs
from app.utils.dependencies import get_current_teacher
from app.utils.file_storage import save_snapshot

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("/sessions", response_model=List[AttendanceSessionOut])
def list_sessions(
    course_id: int | None = None,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    query = attendance_service.list_sessions(db, course_id)
    return query.all()


@router.post("/sessions", response_model=AttendanceSessionOut, status_code=201)
def create_session(
    payload: AttendanceSessionCreate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return attendance_service.create_session(db, payload)


@router.put("/sessions/{session_id}", response_model=AttendanceSessionOut)
def update_session(
    session_id: int,
    payload: AttendanceSessionUpdate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return attendance_service.update_session(db, session_id, payload)


@router.delete("/sessions/{session_id}", status_code=204)
def delete_session(session_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    attendance_service.delete_session(db, session_id)
    return None


@router.get("/records", response_model=List[AttendanceRecordOut])
def list_records(
    session_id: int | None = None,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    query = attendance_service.list_records(db, session_id)
    return query.all()


@router.post("/records", response_model=AttendanceRecordOut, status_code=201)
def create_record(
    payload: AttendanceRecordCreate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return attendance_service.create_record(db, payload)


@router.put("/records/{record_id}", response_model=AttendanceRecordOut)
def update_record(
    record_id: int,
    payload: AttendanceRecordUpdate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return attendance_service.update_record(db, record_id, payload)


@router.post("/mark-face", response_model=AttendanceRecordOut)
async def mark_face_attendance(
    payload: MarkFaceAttendanceRequest = Depends(MarkFaceAttendanceRequest.as_form),
    image_file: UploadFile | None = File(None),
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    identify_request = IdentifyRequest(image_base64=payload.image_base64)
    identification = await identify_from_inputs(identify_request, image_file)
    snapshot_url = None
    if image_file is not None:
        snapshot_url = save_snapshot(payload.course_id, image_file, payload.session_id)
    record = attendance_service.mark_face_attendance(
        db=db,
        course_id=payload.course_id,
        student_id=identification.student_id if identification.matched else None,
        confidence=identification.confidence,
        session_id=payload.session_id,
        notes=payload.notes,
        snapshot_url=snapshot_url,
    )
    return record
