# Face model placeholder

Place your trained face recognition artifact in this directory and update `FACE_MODEL_PATH` inside `.env` if the filename differs. The `FaceRecognitionService` expects the object returned by `joblib.load` (or your custom loader) to expose a `predict(image_bytes: bytes)` method that yields a dict like:

```python
{
  "matched": True,
  "student_id": 42,
  "confidence": 0.83,
  "payload": "extra metadata"
}
```

No training or embedding code lives in this repository—only runtime inference wiring.
