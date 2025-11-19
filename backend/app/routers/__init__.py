from fastapi import APIRouter

from app.config import settings
from . import attendance, auth, courses, health, ml, students, teachers

api_router = APIRouter(prefix=settings.api_prefix)
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(teachers.router)
api_router.include_router(courses.router)
api_router.include_router(attendance.router)
api_router.include_router(ml.router)

__all__ = ["api_router"]
