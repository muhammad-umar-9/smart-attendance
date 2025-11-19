from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(tags=["health"], prefix="/health")


@router.get("/live")
def live() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
def ready() -> dict[str, str]:
    return {"status": "ready"}
