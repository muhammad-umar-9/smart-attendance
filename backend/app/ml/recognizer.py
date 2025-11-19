from __future__ import annotations

import base64
from pathlib import Path
from typing import Optional

from loguru import logger

from app.config import settings
from app.schemas import IdentifyResult


class ModelNotLoadedError(RuntimeError):
    pass


class DummyModel:
    """Fallback when the actual face recognition artifact is not yet supplied."""

    def predict(self, image_bytes: bytes) -> IdentifyResult:
        logger.warning("DummyModel used for /ml/identify; no real predictions are produced")
        return IdentifyResult(matched=False, student_id=None, confidence=0.0, payload=None)


class FaceRecognitionService:
    def __init__(self, model_path: Path, threshold: float = 0.65):
        self.model_path = model_path
        self.threshold = threshold
        self.model = self._load_model(model_path)

    def _load_model(self, model_path: Path):
        if model_path.exists():
            try:
                import joblib

                logger.info("Loading face model from %s", model_path)
                return joblib.load(model_path)
            except Exception as exc:  # pragma: no cover - depends on custom artifact
                logger.error("Failed to load face model: %s", exc)
                raise ModelNotLoadedError("Unable to load provided face model") from exc
        logger.warning("Face model not found at %s; using dummy recognizer", model_path)
        return DummyModel()

    def identify(self, image_bytes: bytes) -> IdentifyResult:
        if not image_bytes:
            raise ValueError("Image payload is empty")

        # The actual model is expected to expose a `.predict` API returning
        # `{matched: bool, student_id: Optional[int], confidence: float, payload: Optional[str]}`.
        raw_result = self.model.predict(image_bytes)

        if isinstance(raw_result, IdentifyResult):
            return raw_result

        # Adapt dict-based payloads coming from user-provided model wrappers.
        if isinstance(raw_result, dict):
            return IdentifyResult(
                matched=bool(raw_result.get("matched")),
                student_id=raw_result.get("student_id"),
                confidence=float(raw_result.get("confidence", 0.0)),
                payload=raw_result.get("payload"),
            )

        # Fallback when custom model returns tuple or other primitives.
        matched = bool(raw_result[0]) if isinstance(raw_result, (list, tuple)) and raw_result else False
        confidence = float(raw_result[2] if len(raw_result) > 2 else raw_result[1]) if matched else 0.0
        student_id = raw_result[1] if matched else None
        return IdentifyResult(matched=matched, student_id=student_id, confidence=confidence)


def decode_base64_image(value: str | None) -> Optional[bytes]:
    if not value:
        return None
    parts = value.split(",", 1)
    payload = parts[1] if len(parts) == 2 else parts[0]
    return base64.b64decode(payload)


recognizer = FaceRecognitionService(settings.face_model_path, threshold=settings.face_match_threshold)
