from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_session
from app.schemas import TeacherCreate, TeacherOut, TeacherUpdate
from app.services import teacher_service
from app.utils.dependencies import get_current_teacher

router = APIRouter(prefix="/teachers", tags=["teachers"])


@router.get("/", response_model=List[TeacherOut])
def list_teachers(
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    query = teacher_service.list_teachers(db)
    return query.offset((page - 1) * page_size).limit(page_size).all()


@router.post("/", response_model=TeacherOut, status_code=201)
def create_teacher(
    payload: TeacherCreate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return teacher_service.create_teacher(db, payload)


@router.get("/{teacher_id}", response_model=TeacherOut)
def get_teacher(teacher_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    return teacher_service.get_teacher_or_404(db, teacher_id)


@router.put("/{teacher_id}", response_model=TeacherOut)
def update_teacher(
    teacher_id: int,
    payload: TeacherUpdate,
    db: Session = Depends(get_session),
    current_user=Depends(get_current_teacher),
):
    return teacher_service.update_teacher(db, teacher_id, payload)


@router.delete("/{teacher_id}", status_code=204)
def delete_teacher(teacher_id: int, db: Session = Depends(get_session), current_user=Depends(get_current_teacher)):
    teacher_service.delete_teacher(db, teacher_id)
    return None
