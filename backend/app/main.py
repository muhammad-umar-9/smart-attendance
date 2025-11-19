from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import Base, engine
from app.routers import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    openapi_url=f"{settings.api_prefix}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", tags=["root"])
def root() -> dict[str, str]:
    return {"message": "Smart Attendance API", "docs_url": f"{settings.api_prefix}/docs"}
