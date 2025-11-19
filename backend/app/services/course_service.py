from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Course
from app.schemas import CourseCreate, CourseUpdate


def list_courses(db: Session):
    return db.query(Course)


def create_course(db: Session, payload: CourseCreate) -> Course:
    course = Course(**payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def get_course_or_404(db: Session, course_id: int) -> Course:
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


def update_course(db: Session, course_id: int, payload: CourseUpdate) -> Course:
    course = get_course_or_404(db, course_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> None:
    course = get_course_or_404(db, course_id)
    db.delete(course)
    db.commit()
