# Testing Plan

## Backend
- **Unit**: pytest suites for services (students, courses, attendance). Replace DB calls with an in-memory SQLite database during tests.
- **Integration**: FastAPI `TestClient` to hit `/api/auth/login`, `/api/students`, `/api/ml/identify` (using the dummy recognizer).
- **Contract**: OpenAPI schema snapshot used with Dredd or Schemathesis to prevent breaking changes.

## Frontend
- **State slices**: add Jest tests for Redux reducers (`auth`, `courses`, `students`, `attendance`).
- **Component**: React Native Testing Library for login form validation, course list rendering, and `AttendanceResultCard` states.
- **End-to-end**: Detox or Maestro covering login → dashboard → camera flow once physical devices/emulators are wired into CI.

## ML Integration
- Provide a `FakeRecognizer` fixture returning deterministic matches for test frames. This keeps tests fast and avoids bundling large models.
- Add a smoke test verifying `/api/attendance/mark-face` writes a record when the fake recognizer matches.

## Tooling
- Use GitHub Actions (future) to run `pytest` + `npm test` on pull requests.
- Add `pre-commit` hooks for formatting (ruff/black for backend, prettier/eslint for frontend).
