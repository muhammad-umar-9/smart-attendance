from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_session
from app.schemas import StudentCreate, StudentOut, StudentUpdate
from app.services import student_service
from app.utils.dependencies import get_current_teacher

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/", response_model=List[StudentOut])
def list_students(
    *, db: Session = Depends(get_session), current_user=Depends(get_current_teacher), page: int = Query(1, ge=1), page_size: int = Query(50, ge=1, le=200)
):
    query = student_service.list_students(db)
    return query.offset((page - 1) * page_size).limit(page_size).all()


@router.post("/", response_model=StudentOut, status_code=201)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return student_service.create_student(db, payload)


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    return student_service.get_student_or_404(db, student_id)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return student_service.update_student(db, student_id, payload)


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    student_service.delete_student(db, student_id)
    return None
