from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from app.schemas import IdentifyRequest, IdentifyResponse
from app.services.ml_integration import identify_from_inputs
from app.utils.dependencies import get_current_teacher

router = APIRouter(prefix="/ml", tags=["ml"])


@router.post("/identify", response_model=IdentifyResponse)
async def identify_face(
    payload: IdentifyRequest = Depends(IdentifyRequest.as_form),
    image_file: UploadFile | None = File(None),
    current_user=Depends(get_current_teacher),
) -> IdentifyResponse:
    result = await identify_from_inputs(payload, image_file)
    return IdentifyResponse(matched=result.matched, student_id=result.student_id, confidence=result.confidence)
