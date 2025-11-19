# Legacy Flutter Feature Inventory

This document captures the user flows implemented in the original Flutter + Python version of **smart-attendance**. Paths reference the Flutter sources living under `frontend/lib/`.

## App shell & navigation
- `screens/onboarding_page.dart`: marketing-style onboarding page describing the project, team credits, and a "Faculty Login" CTA.
- `screens/login.dart`: basic email/password form with a "remember me" checkbox; on success it routes to `navigation/app_navigation.dart` without calling a backend.
- `navigation/app_navigation.dart`: root bottom navigation with two tabs—"My Courses" (home) and "Add Course".
- `navigation/attendance_Navigation.dart`: secondary bottom navigation launched after picking a course; tabs toggle between the mark-attendance workflow and student registration form.

## Course & class management
- `screens/home_page.dart`: shows "My Courses" cards sourced from `providers/course_provider.dart`; tapping a card persists the selected department/program/semester/class/batch and opens attendance tools.
- `screens/add_course_page.dart`: multistep form (department → program → semester → class) backed by static data inside `CourseProvider`; adds the chosen class to `myCourses`.
- `providers/course_provider.dart`: stores hard-coded department/program/class tree, two seed courses, and the currently selected cohort metadata. Also exposes an `ipAddress` base URL used by networking code.

## Student registration
- `screens/register_student_page.dart`: form that collects name/roll number and uploads multiple photos via `dio` to `/register`. The backend expects `name`, `rollno`, `batch_number`, `program`, plus the image files.

## Attendance capture workflow
- `screens/mark_attendance.dart`: toggles between live camera capture (using `camera` plugin) and a "past attendance" list. Camera mode lets staff switch lenses, snap a photo, or pick from gallery before sending to the backend.
- `screens/preview_attendance_page.dart`: preview of the captured image with a "Mark Attendance" button. Posts multipart form data (`dept`, `program`, `sem`, `class_`, `batch_number`, `file`) to `/mark-attendance`. Expects annotated image URL plus recognized student list in the response.
- `screens/annotatedimagepage.dart`: displays backend-generated annotated image, lists recognized students, copies the roster text to clipboard, and downloads the annotated image locally.

## Visual assets & styling
- Assets folder includes institution branding (logo, watermark, leadership photos) referenced throughout onboarding and app bars.
- Fonts and colors are centralized via Flutter's `ThemeData` & Google Fonts usage per screen.

### Key Data & API expectations
- The Flutter client assumes API endpoints: `/register` and `/mark-attendance` accepting multipart uploads.
- Course metadata (department/program/class tree) is currently static but treated as if it would come from the backend later.
- Attendance API responds with `annotated_image_url`, `recognized_students[]`, and a free-form `attendance_meta` string.

These insights inform the feature parity targets for the FastAPI + React Native rewrite.