from __future__ import annotations

import random
from datetime import date, datetime, timedelta, timezone
from typing import Sequence

from passlib.context import CryptContext

from database.connection import session_scope
from database.models import (
    AttendanceRecord,
    AttendanceSession,
    AttendanceStatus,
    Course,
    Enrollment,
    Student,
    Teacher,
)

random.seed(42)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def reset_tables(session) -> None:
    session.execute(AttendanceRecord.__table__.delete())
    session.execute(AttendanceSession.__table__.delete())
    session.execute(Enrollment.__table__.delete())
    session.execute(Course.__table__.delete())
    session.execute(Teacher.__table__.delete())
    session.execute(Student.__table__.delete())


def create_teachers(session) -> list[Teacher]:
    teacher_defs = [
        ("Alice Johnson", "alice.teacher@example.com", "Computer Science"),
        ("Bob Smith", "bob.teacher@example.com", "Data Science"),
        ("Carol Perez", "carol.teacher@example.com", "AI Research"),
    ]
    teachers: list[Teacher] = []
    for name, email, dept in teacher_defs:
        teacher = Teacher(
            full_name=name,
            email=email,
            hashed_password=hash_password("TeacherPass123"),
            department=dept,
        )
        session.add(teacher)
        teachers.append(teacher)
    session.flush()
    return teachers


def create_students(session) -> list[Student]:
    students: list[Student] = []
    for idx in range(1, 11):
        student = Student(
            roll_number=f"STU{idx:03d}",
            first_name=f"Student{idx}",
            last_name="Test",
            program="BS Computer Science",
            semester="Fall",
            batch="2025",
            email=f"student{idx}@example.com",
        )
        session.add(student)
        students.append(student)
    session.flush()
    return students


def create_courses(session, teachers: Sequence[Teacher]) -> list[Course]:
    course_defs = [
        ("AI101", "Intro to AI", "CS", "CS", "Fall", "A", teachers[0].id),
        ("DS201", "Data Science", "Data", "IT", "Fall", "A", teachers[1].id),
        ("CV301", "Computer Vision", "AI", "CS", "Spring", "B", teachers[2].id),
    ]
    courses: list[Course] = []
    for code, title, dept, program, semester, section, teacher_id in course_defs:
        course = Course(
            code=code,
            title=title,
            department=dept,
            program=program,
            semester=semester,
            section=section,
            teacher_id=teacher_id,
        )
        session.add(course)
        courses.append(course)
    session.flush()
    return courses


def create_enrollments(session, courses: Sequence[Course], students: Sequence[Student]) -> None:
    enrollments: list[Enrollment] = []
    for idx, student in enumerate(students):
        course = courses[idx % len(courses)]
        enrollment = Enrollment(student_id=student.id, course_id=course.id)
        enrollments.append(enrollment)
    session.add_all(enrollments)
    session.flush()


def create_sessions(session, courses: Sequence[Course]) -> list[AttendanceSession]:
    base_date = date.today()
    sessions: list[AttendanceSession] = []
    for idx in range(5):
        course = courses[idx % len(courses)]
        session_obj = AttendanceSession(
            course_id=course.id,
            session_date=base_date - timedelta(days=idx),
            started_at=datetime.now(timezone.utc) - timedelta(hours=idx),
            notes=f"Session {idx + 1} focus",
        )
        session.add(session_obj)
        sessions.append(session_obj)
    session.flush()
    return sessions


def create_records(
    session,
    sessions: Sequence[AttendanceSession],
    students: Sequence[Student],
    count: int = 20,
) -> None:
    statuses = list(AttendanceStatus)
    possible_pairs = [(sess, student) for sess in sessions for student in students]
    random.shuffle(possible_pairs)
    selected_pairs = possible_pairs[: min(count, len(possible_pairs))]

    records: list[AttendanceRecord] = []
    for idx, (sess, student) in enumerate(selected_pairs):
        records.append(
            AttendanceRecord(
                session_id=sess.id,
                student_id=student.id,
                status=random.choice(statuses),
                confidence=round(random.uniform(0.7, 0.99), 4),
                payload=f"Auto-marked #{idx}",
            )
        )
    session.add_all(records)


def main() -> None:
    with session_scope() as session:
        reset_tables(session)
        teachers = create_teachers(session)
        students = create_students(session)
        courses = create_courses(session, teachers)
        create_enrollments(session, courses, students)
        sessions = create_sessions(session, courses)
        create_records(session, sessions, students)
        print("Seeded database with demo data.")


if __name__ == "__main__":
    main()
