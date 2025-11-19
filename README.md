# Smart Attendance (FastAPI + React Native)

This repository hosts the next-generation version of **smart-attendance**, now powered by a FastAPI backend, PostgreSQL persistence, JWT authentication, and a React Native (Expo) mobile client. The legacy Flutter implementation is preserved under `frontend_flutter/` for reference, while the new React Native app lives in `frontend/`.

## Project map

```
backend/            FastAPI application, SQLAlchemy models, ML integration
frontend/           React Native (Expo) app with Redux Toolkit + expo-camera
frontend_flutter/   Original Flutter codebase (read-only)
docs/               Specs, setup notes, legacy feature inventory
```

## Backend (FastAPI)

### Features
- JWT login via `/api/auth/login` using teacher credentials stored in PostgreSQL.
- CRUD routers for students, teachers, courses.
- Attendance session + record management endpoints.
- `/api/ml/identify` for piping captured frames into the existing face-recognition model artifact placed in `backend/app/ml/model/`.
- `/api/attendance/mark-face` accepts multipart or base64 frames, calls the ML endpoint, and stores attendance records.
- `.env` driven configuration (`backend/.env.example`).
- Dockerfile + docker-compose stack with PostgreSQL 15.

### Running locally

```powershell
cd backend
copy .env.example .env   # adjust DATABASE_URL / FACE_MODEL_PATH
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Docker compose

```powershell
cd d:\smart_attendance\smart-attendance
copy backend\.env.example backend\.env
# Update backend/.env FACE_MODEL_PATH if your model file has a different name
# Place the trained artifact under backend/app/ml/model/
docker compose up --build
```

### Testing

Lightweight pytest smoke tests live in `backend/tests/`. After installing requirements you can run:

```powershell
cd backend
pytest -q
```

> **Note**: The automated test run inside this environment failed earlier because `pytest` was not installed globally. Installing dependencies via `pip install -r backend/requirements.txt` resolves it.

## Frontend (React Native / Expo)

### Features
- Secure login screen that persists JWT tokens via `expo-secure-store`.
- Dashboard with KPI cards for students, courses, and attendance records.
- CRUD consumption screens for student/course rosters.
- Attendance history list.
- Face Attendance screen powered by `expo-camera` that:
  1. captures frames every ~2.5s,
  2. calls `/api/ml/identify` via axios,
  3. if matched, sends `/api/attendance/mark-face` to register the event,
  4. displays the latest identification result inline.

### Running the Expo app

```powershell
cd frontend
npm install
# Point the mobile client to your backend over LAN
$Env:EXPO_PUBLIC_API_URL="http://<your-ip>:8000/api"
npm run start
```

Then scan the QR code with the Expo Go app or launch an emulator via `npm run android` / `npm run ios`.

### Camera/model integration tips
- Update `FACE_MODEL_PATH` in `backend/.env` so `FaceRecognitionService` can load your serialized model (Joblib, Pickle, ONNX, etc.). The service only calls the provided `predict(image_bytes)` method and never retrains.
- For on-device capture, ensure the device and backend share the same network and that the API URL uses the machine’s LAN IP (not `localhost`).
- Tune `CAMERA_CAPTURE_INTERVAL_MS` inside `frontend/src/config/env.ts` if you need faster/slower scanning.

## Documentation & next steps
- `docs/legacy_features.md` captures every flow from the Flutter release to make parity checks easy.
- Consider adding Alembic migrations and CI lint/test workflows once the schemas stabilize.
- For production you’ll likely back `/static` assets with S3 or Azure Blob; the FastAPI service currently returns raw URLs so you can wire any CDN later.
