from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Student
from app.schemas import StudentCreate, StudentUpdate


def list_students(db: Session):
    return db.query(Student)


def create_student(db: Session, payload: StudentCreate) -> Student:
    if db.query(Student).filter(Student.roll_number == payload.roll_number).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Roll number already exists")
    student = Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_student_or_404(db: Session, student_id: int) -> Student:
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


def update_student(db: Session, student_id: int, payload: StudentUpdate) -> Student:
    student = get_student_or_404(db, student_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student_id: int) -> None:
    student = get_student_or_404(db, student_id)
    db.delete(student)
    db.commit()
