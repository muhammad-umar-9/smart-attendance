# Setup & Operations Guide

## 1. Prerequisites
- Python 3.11+
- Node.js 18+ / npm 9+
- Docker Desktop (optional but recommended)
- A PostgreSQL instance (local Docker container provided via `docker-compose.yml`).

## 2. Environment variables
Copy `backend/.env.example` to `backend/.env` and tweak as needed:

```
DATABASE_URL=postgresql+psycopg2://smart_attendance:smart_attendance@db:5432/smart_attendance
SECRET_KEY=<long-random-string>
FACE_MODEL_PATH=app/ml/model/face_recognition.bin
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
```

Place your **already-trained** face-recognition artifact inside `backend/app/ml/model/` and make sure the `FACE_MODEL_PATH` value matches the filename.

For the React Native app, expose the backend URL via Expo public env vars:

```
setx EXPO_PUBLIC_API_URL http://<LAN-IP>:8000/api
```

(or export it temporarily inside your terminal session before `npm run start`).

## 3. Backend workflows

### Local FastAPI run
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Docker Compose (API + PostgreSQL)
```powershell
cd d:\smart_attendance\smart-attendance
copy backend\.env.example backend\.env
# drop your trained model under backend/app/ml/model/
docker compose up --build
```
This starts:
- `postgres:15` with a persistent `pgdata` volume.
- `backend` service running `uvicorn app.main:app`.

## 4. Frontend workflows (Expo)
```powershell
cd frontend
npm install
$Env:EXPO_PUBLIC_API_URL="http://<LAN-IP>:8000/api"
npm run start
```
Use Expo Go or an emulator to open the project. The Face Attendance screen auto-captures frames every 2.5s using `expo-camera`. Confirm that your device and backend are on the same network and that the API URL is reachable.

## 5. Deployment strategy
- **Backend**: build the Docker image (`backend/Dockerfile`) and deploy behind a reverse proxy (NGINX, Azure App Service, ECS, etc.). Mount or bake your trained model file within the container image.
- **Database**: managed PostgreSQL (RDS, Cloud SQL, Azure Database) or the provided compose service for smaller deployments. Run Alembic migrations (not yet included) before promoting new releases.
- **Frontend**: use Expo EAS build for native binaries or keep running as an Expo managed app. Update `EXPO_PUBLIC_API_URL` to point to the public API gateway.
- **Storage**: `/ml/identify` and `/attendance/mark-face` operate on in-memory bytes; if you plan to persist snapshots, integrate S3/Azure Blob via the `snapshot_url` field in `AttendanceRecord`.

## 6. Testing plan
- **Backend unit tests**: run `pytest backend/tests -q` after installing requirements. Add API contract tests for every router plus service-level tests for attendance + ML adapters.
- **Integration smoke**: use `httpx` or Postman collections to test the login → CRUD → attendance flow against a running Docker compose stack.
- **Frontend**: rely on Expo’s `expo start --tunnel` plus manual QA on devices. Add Jest + React Native Testing Library in a follow-up to cover slice reducers and UI flows.
- **ML integration**: add a lightweight `FakeRecognizer` during automated tests to avoid bundling real models; the current `DummyModel` stub serves as the default until a model file is present.
