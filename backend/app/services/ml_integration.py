from __future__ import annotations

from fastapi import HTTPException, UploadFile, status

from app.ml import decode_base64_image, recognizer
from app.schemas import IdentifyRequest, IdentifyResult


async def identify_from_inputs(
    request: IdentifyRequest | None = None,
    upload: UploadFile | None = None,
) -> IdentifyResult:
    image_bytes: bytes | None = None

    if request and request.image_base64:
        image_bytes = decode_base64_image(request.image_base64)

    if not image_bytes and upload is not None:
        image_bytes = await upload.read()

    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image data missing")

    result = recognizer.identify(image_bytes)
    return result
