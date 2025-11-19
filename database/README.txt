Smart Attendance System — Database Layer
=======================================

This module contains the standalone PostgreSQL data layer for the Smart Attendance System. It ships with SQLAlchemy ORM models, Alembic migrations, and deterministic seed data for local development.

Project Structure
-----------------
config.py                # central settings (DATABASE_URL, SQL echo)
connection.py            # engine + session helpers
utils/base.py            # Declarative base definition
models/                  # ORM entities (users, students, teachers, etc.)
seeds/seed_data.py       # demo dataset generator
migrations/              # Alembic environment, templates, and revisions
alembic.ini              # Alembic CLI configuration

Requirements
------------
1. PostgreSQL 13+ with the uuid-ossp extension enabled.
2. Python 3.11+ with SQLAlchemy, Alembic, and psycopg2 installed.

Setup
-----
1. Create and migrate the schema:

```
cd database
alembic upgrade head
```

2. (Optional) make changes via autogenerate:

```
cd database
alembic revision --autogenerate -m "changes"
```

3. Seed the database:

```
cd database
python -m seeds.seed_data
```

Configuration
-------------
Set the DATABASE_URL environment variable if you need non-default credentials or hostnames. Example:

```
set DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/smart_attendance
```

The Alembic CLI reads the same setting automatically through `database/config.py`.
