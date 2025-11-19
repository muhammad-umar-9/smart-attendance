"""Utility to drop all objects created by the database layer.

This script is intended for local development only. It drops all tables and the
attendance_status enum if present, then exits. Use with caution.
"""
from __future__ import annotations

from sqlalchemy import text, inspect
from database.connection import engine

print("Dropping all tables and known types from target database...")
with engine.connect() as conn:
    # Drop all tables using reflected metadata
    inspector = inspect(conn)
    tables = inspector.get_table_names()
    if tables:
        print(f"Found tables: {tables}")
        conn.execute(text("SET session_replication_role = 'replica';"))
        for tbl in tables:
            print(f"Dropping table {tbl}")
            conn.execute(text(f"DROP TABLE IF EXISTS \"{tbl}\" CASCADE;"))
        conn.execute(text("SET session_replication_role = 'origin';"))
    else:
        print("No tables found.")

    # Drop enum type if exists
    try:
        print("Dropping type attendance_status if exists")
        conn.execute(text("DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN DROP TYPE attendance_status; END IF; END $$;"))
    except Exception as exc:
        print("Ignoring error dropping type:", exc)

print("Cleanup complete.")
