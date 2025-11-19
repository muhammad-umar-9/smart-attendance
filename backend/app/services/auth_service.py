from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Teacher
from app.schemas import LoginRequest, TeacherCreate
from app.utils.security import hash_password, verify_password


def authenticate_teacher(db: Session, credentials: LoginRequest) -> Teacher:
    teacher = db.query(Teacher).filter(Teacher.email == credentials.email).first()
    if not teacher or not verify_password(credentials.password, teacher.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not teacher.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teacher is disabled")
    return teacher


def create_teacher(db: Session, payload: TeacherCreate) -> Teacher:
    teacher = Teacher(
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
        hashed_password=hash_password(payload.password),
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher
