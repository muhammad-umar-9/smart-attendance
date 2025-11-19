from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Teacher
from app.schemas import TeacherCreate, TeacherUpdate
from app.utils.security import hash_password


def list_teachers(db: Session):
    return db.query(Teacher)


def get_teacher_or_404(db: Session, teacher_id: int) -> Teacher:
    teacher = db.get(Teacher, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")
    return teacher


def create_teacher(db: Session, payload: TeacherCreate) -> Teacher:
    teacher = Teacher(
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
        hashed_password=hash_password(payload.password),
        is_active=payload.is_active if payload.is_active is not None else True,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def update_teacher(db: Session, teacher_id: int, payload: TeacherUpdate) -> Teacher:
    teacher = get_teacher_or_404(db, teacher_id)
    update_data = payload.model_dump(exclude_unset=True)
    if "password" in update_data:
        teacher.hashed_password = hash_password(update_data.pop("password"))
    for field, value in update_data.items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete_teacher(db: Session, teacher_id: int) -> None:
    teacher = get_teacher_or_404(db, teacher_id)
    db.delete(teacher)
    db.commit()
