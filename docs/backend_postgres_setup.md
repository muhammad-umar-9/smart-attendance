# Super Simple Backend + Database Checklist

Imagine we are cooking with two pots: one pot is **PostgreSQL** (already full of tables/food), the other pot is the **FastAPI backend**. We only have to light the stove in the correct order and then taste the soup (endpoints). Follow these steps exactly, even if they feel basic.

---
## 0. What you must already have
- PostgreSQL is running and the database `smart_attendance` already contains all the tables/data you want (you confirmed this in pgAdmin4).
- The project folder is `d:\smart_attendance\smart-attendance` and you have PowerShell available.
- The Python virtual environment lives in `backend/venv` and already has `pip install -r backend/requirements.txt` applied (do that once if not).

---
## 1. Open a fresh PowerShell window
```powershell
cd d:\smart_attendance\smart-attendance
```
Keep this window open for the server.

---
## 2. Tell the app which database to use
This environment variable connects the backend to your Postgres instance. Run it every time you open a new shell (unless you place it inside `.env`).
```powershell
$env:DATABASE_URL = 'postgresql+psycopg2://postgres:admin@localhost:5432/smart_attendance'
```
> Replace username, password, or port only if your Postgres uses different credentials.

### (Optional) create/update `.env`
If you prefer the backend to pick up the URL automatically, add this line to `.env` at the repo root:
```
DATABASE_URL=postgresql+psycopg2://postgres:admin@localhost:5432/smart_attendance
```

---
## 3. (Optional) run migrations or seeds if you need fresh data
Only do this when you want to reset the DB. Skip if pgAdmin already shows the data you want.
```powershell
$env:PYTHONPATH = 'd:\smart_attendance\smart-attendance'
D:/smart_attendance/smart-attendance/backend/venv/Scripts/python.exe -m alembic upgrade head
D:/smart_attendance/smart-attendance/backend/venv/Scripts/python.exe -m database.seeds.seed_data
```
If Passlib complains about bcrypt, install it inside the venv once:
```powershell
D:/smart_attendance/smart-attendance/backend/venv/Scripts/pip.exe install bcrypt==4.0.1
```

---
## 4. Start the backend server
Stay inside the repo root PowerShell window.
```powershell
cd backend
..\backend\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- Leave this window alone; the server must stay running.
- If you need to run it in the background, use `Start-Process` and later stop it with `Stop-Process -Id <pid>`.
- Seeing `WARNING | app.ml.recognizer... using dummy recognizer` is normal if the ML model file is missing.

---
## 5. Check that everything works
Open a **second** PowerShell window (so the first one keeps the server alive) and run the tests below.

### 5.1 Live health endpoint
```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/health/live | Select-Object -ExpandProperty Content
```
Expected text:
```json
{"status":"ok"}
```
If you see anything else, the server is either off or cannot reach the database.

### 5.2 Login endpoint
Use the teacher credentials you seeded (all use password `TeacherPass123`).
```powershell
Invoke-WebRequest -Method Post -ContentType 'application/json' `
    -Body '{"email":"alice.teacher@example.com","password":"TeacherPass123"}' `
    -Uri http://127.0.0.1:8000/api/auth/login |
    Select-Object -ExpandProperty Content
```
You should get back JSON with an `access_token` and `token_type`. Copy the token if you want to test other endpoints that require auth.

### 5.3 (Optional) confirm data really comes from Postgres
```powershell
D:/smart_attendance/smart-attendance/backend/venv/Scripts/python.exe -c "from sqlalchemy import create_engine, text; engine = create_engine('postgresql+psycopg2://postgres:admin@localhost:5432/smart_attendance'); with engine.connect() as conn: print(conn.execute(text('SELECT COUNT(*) FROM students')).scalar())"
```
A number > 0 proves the DB contains student rows.

---
## 6. If something goes wrong
| Problem you see | What to try |
| --- | --- |
| `ModuleNotFoundError: No module named 'database'` during Alembic commands | Run `set PYTHONPATH` like in step 3 before calling Alembic. |
| `psycopg2.errors.DuplicateObject: type "attendance_status" already exists` | Drop the enum via the reset snippet in step 3, then rerun migrations. |
| `passlib` errors about bcrypt or password length | Install `bcrypt==4.0.1` in the venv and keep plaintext passwords shorter than 72 characters. |
| Health or login calls return 500/401 unexpectedly | Double-check the server window for stack traces, confirm `DATABASE_URL` is correct, and rerun the seed script to restore baseline accounts. |
| `Invoke-WebRequest` errors out | Make sure the server window still shows `Uvicorn running on http://0.0.0.0:8000`. |

---
## 7. Quick recap (child-level)
1. **Open PowerShell → cd into the project.**
2. **Set `DATABASE_URL`.**
3. **(Maybe) run migrations + seeds** if you need new data.
4. **Start the server** (`uvicorn ...`). Keep that window open.
5. **In another window, hit `/api/health/live` and `/api/auth/login`.**
6. **If they answer, you are done.** If not, read the table above.

That’s all—repeat these steps anytime you want to see the backend talking to your PostgreSQL database.
