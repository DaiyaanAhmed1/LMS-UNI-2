## Arabic Localization Priorities (Quick Reference)

Purpose: Fast, at-a-glance order of pages to localize, ranked by effort (fastest → slowest).

### Global First
- Auth: Login Page (toggle done; localize visible strings)

### Student (fastest → slowest)
1. Course PDF Viewer
2. Course Video Viewer
3. eCollab
4. Notifications
5. Student Dashboard
6. Materials
7. Courses
8. Grades
9. Assignments
10. Messages
11. Schedule
12. Profile

### Instructor (fastest → slowest)
1. My Courses
2. Notifications
3. Instructor Dashboard
4. Course Materials
5. Student Messages
6. Grades
7. Assignments
8. Students Management
9. Teaching Schedule
10. Profile

### Admin (fastest → slowest)
1. Profile
2. Data Retention Policy
3. Admin Dashboard
4. Document Management
5. Notifications
6. Academic Calendar
7. Department Dashboard
8. Program Management
9. Course Management
10. Instructor Management
11. Students Management
12. User Management
13. Reports
14. System Settings

Suggested implementation flow
- Start: Login → Student/Instructor Viewers → My Courses → Dashboards → Notifications
- Next: Materials, Courses, Grades
- Then: Assignments, Messages, Schedules, Profiles
- Admin last: Document/Calendar → Management suites → Reports → System Settings

Status shorthand
- ✅ Done, 🔄 In Progress, ⬜ Pending 