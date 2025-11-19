from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_session
from app.models import Teacher
from app.schemas import CurrentUser
from app.utils.security import decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_prefix}/auth/login")


def get_current_teacher(
    db: Session = Depends(get_session), token: str = Depends(oauth2_scheme)
) -> CurrentUser:
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    teacher = db.query(Teacher).filter(Teacher.email == payload.get("sub")).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return CurrentUser.model_validate(teacher)
