from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int
    iat: int | None = None


class CurrentUser(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    department: str | None = None
    last_login: datetime | None = None

    class Config:
        from_attributes = True
