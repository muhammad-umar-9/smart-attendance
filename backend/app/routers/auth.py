from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_session
from app.schemas import LoginRequest, Token
from app.services.auth_service import authenticate_teacher
from app.utils.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_session)) -> Token:
    teacher = authenticate_teacher(db, payload)
    token = create_access_token(subject=teacher.email)
    return Token(access_token=token)
