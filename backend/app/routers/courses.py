from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_session
from app.schemas import CourseCreate, CourseOut, CourseUpdate
from app.services import course_service
from app.utils.dependencies import get_current_teacher

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=List[CourseOut])
def list_courses(
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    query = course_service.list_courses(db)
    return query.offset((page - 1) * page_size).limit(page_size).all()


@router.post("/", response_model=CourseOut, status_code=201)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return course_service.create_course(db, payload)


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    return course_service.get_course_or_404(db, course_id)


@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return course_service.update_course(db, course_id, payload)


@router.delete("/{course_id}", status_code=204)
def delete_course(course_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    course_service.delete_course(db, course_id)
    return None
