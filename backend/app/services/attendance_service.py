from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import AttendanceRecord, AttendanceSession, AttendanceStatus, Course, Student
from app.schemas import AttendanceRecordCreate, AttendanceRecordUpdate, AttendanceSessionCreate, AttendanceSessionUpdate


def ensure_course(db: Session, course_id: int) -> Course:
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


def ensure_student(db: Session, student_id: int | None) -> Student | None:
    if student_id is None:
        return None
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


def list_sessions(db: Session, course_id: int | None = None):
    query = db.query(AttendanceSession)
    if course_id:
        query = query.filter(AttendanceSession.course_id == course_id)
    return query


def create_session(db: Session, payload: AttendanceSessionCreate) -> AttendanceSession:
    ensure_course(db, payload.course_id)
    session = AttendanceSession(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def update_session(db: Session, session_id: int, payload: AttendanceSessionUpdate) -> AttendanceSession:
    session = db.get(AttendanceSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(session, field, value)
    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, session_id: int) -> None:
    session = db.get(AttendanceSession, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    db.delete(session)
    db.commit()


def list_records(db: Session, session_id: int | None = None):
    query = db.query(AttendanceRecord)
    if session_id:
        query = query.filter(AttendanceRecord.session_id == session_id)
    return query


def create_record(db: Session, payload: AttendanceRecordCreate) -> AttendanceRecord:
    ensure_student(db, payload.student_id)
    record = AttendanceRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def update_record(db: Session, record_id: int, payload: AttendanceRecordUpdate) -> AttendanceRecord:
    record = db.get(AttendanceRecord, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


def mark_face_attendance(
    db: Session,
    course_id: int,
    student_id: int | None,
    confidence: float,
    session_id: int | None = None,
    notes: str | None = None,
    snapshot_url: str | None = None,
) -> AttendanceRecord:
    ensure_course(db, course_id)

    if session_id:
        session = db.get(AttendanceSession, session_id)
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    else:
        session = AttendanceSession(course_id=course_id, started_at=datetime.utcnow())
        db.add(session)
        db.flush()

    record = AttendanceRecord(
        session_id=session.id,
        student_id=student_id,
        status=AttendanceStatus.present if student_id else AttendanceStatus.unknown,
        confidence=confidence,
        payload=notes,
        snapshot_url=snapshot_url,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
