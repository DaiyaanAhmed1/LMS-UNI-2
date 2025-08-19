## Arabic Localization Progress Tracker

### Summary by Role

| Role       | Total Pages | Localized Pages | % Complete |
|------------|-------------|-----------------|------------|
| Student    | 12          | 12              | 100%       |
| Instructor | 10          | 10              | 100%       |
| Admin      | 14          | 14              | 100%       |
| Auth       | 1           | 1               | 100%       |

### Status Legend

- ✅ Done: All visible strings localized; RTL/LTR verified; QA passed
- 🔄 In Progress: Work started; partial translations or pending review
- ⬜ Pending: Not started yet

---

## Auth

| Page       | Components needing localization                                                                 | Status | Notes                          |
|------------|---------------------------------------------------------------------------------------------------|--------|--------------------------------|
| Login Page | Hero text; title; subtitle; Email; Password; Submit; error messages; banner alt texts; footer     | ✅     | RTL/LTR toggle done; texts localized |

---

## Student

| Page | Components needing localization | Status | Notes |
|------|----------------------------------|--------|-------|
| Student Dashboard | Page title; KPI/stat cards; quick links; recent activity; announcements | ✅ | |
| Profile | Section titles; form field labels/placeholders/help; buttons; success/error toasts | ✅ | Keep email fields LTR |
| Courses | Page title; course cards (title, instructor, tags); filters/sorts; empty state; pagination | ✅ | |
| Assignments | Table headers (title, due, status, grade); filters; details modal; submit buttons; statuses | ✅ | |
| Grades | Table headers; grade scale; summary widget; export button; empty state | ✅ | |
| Schedule | Calendar controls (today, next/prev, views); event labels; legend | ✅ | |
| Materials | Tabs; resource types; download/view buttons; empty state | ✅ | |
| Messages | Thread list; composer placeholders; send button; system notices; empty state | ✅ | |
| Notifications | Filters; notification titles/bodies; mark-as-read; empty state | ✅ | |
| eCollab | Page title; room names; actions (join, leave); chat system messages | ✅ | |
| Course PDF Viewer | Viewer controls (zoom, page X/Y); loading indicators; error messages; download | ✅ | |
| Course Video Viewer | Player controls (captions/transcript toggle); speed selector; quality; transcript headings | ✅ | |

---

## Instructor

| Page | Components needing localization | Status | Notes |
|------|----------------------------------|--------|-------|
| Instructor Dashboard | Page title; KPIs; recent activity; action shortcuts | ✅ | |
| Profile | Section titles; form labels/placeholders/help; buttons; toasts | ✅ | Keep email fields LTR |
| My Courses | Titles; course cards; filters/sorts; empty state | ✅ | |
| Students Management | Table headers (name, id, status); search/filter; bulk actions; import/export; empty state | ✅ | |
| Assignments | Create/edit forms (titles, dates, instructions); table headers; publish buttons; statuses | ✅ | |
| Grades | Gradebook headers; filters; export; edit dialogs; validation errors | ✅ | |
| Teaching Schedule | Calendar controls; event labels | ✅ | |
| Course Materials | Upload forms; file type labels; actions; empty state | ✅ | |
| Student Messages | Thread list; composer placeholders; send button; notices | ✅ | |
| Notifications | Creation form labels; notification titles; filters; actions | ✅ | |

---

## Admin

| Page | Components needing localization | Status | Notes |
|------|----------------------------------|--------|-------|
| Admin Dashboard | Overview titles; KPI cards; charts (titles/legends/axes); quick links | ✅ | |
| Profile | Section titles; form labels/placeholders/help; buttons; toasts | ✅ | Keep email fields LTR |
| Program Management | List table headers; create/edit forms; filters/sorts; empty state; actions | ✅ | |
| Instructor Management | Table headers; filters/search; details modal; actions; import/export | ✅ | |
| Students Management | Table headers; filters/search; enrollment status labels; actions; import/export | ✅ | |
| Course Management | Course table headers; create/edit forms; tags; actions; empty state | ✅ | |
| Document Management | Upload forms; document types; actions; table headers; empty state | ✅ | |
| Academic Calendar | Calendar controls; event labels; create/edit event dialogs; recurrence labels | ✅ | |
| Notifications | Compose form; audience filters; delivery statuses; history table | ✅ | |
| Reports | Report titles; filters/date ranges; chart legends/axes; export; empty states | ✅ | |
| User Management | Table headers (name, role, status); filters; invite dialogs; role labels; actions | ✅ | |
| System Settings | Section headers; toggles; descriptions; save/reset buttons; validation errors | ✅ | |
| Department Dashboard | Titles; department lists; KPIs; filters; charts | ✅ | |
| Data Retention Policy | Headings; policy text blocks; toggles/options; save/confirm dialogs | ✅ | |

---

## Global Components

| Component | Scope | Status | Notes |
|-----------|-------|--------|-------|
| Sidebar | Nav item labels; theme toggle labels; logout; tooltips | ⬜ | |
| Accessibility Bar | Headings; option labels; statuses | ⬜ | |
| Sage AI Summary Panel | Headings; buttons; summaries | ⬜ | |
| Shared UI Patterns | Page titles; section headers; breadcrumbs; buttons; form labels/placeholders/help texts/errors; table headers/empty states/pagination; filters/sorts; tabs; chips/status; modals/dialogs; toasts/alerts; tooltips; chart legends/axes | ⬜ | Reference via namespaced keys |

---

## Misc

| Page | Components needing localization | Status | Notes |
|------|----------------------------------|--------|-------|
| Unauthorized | Title; description; back-to-login button | ⬜ | |

---

### Update History

| Date       | Changes Made                                                   | Updated By |
|------------|-----------------------------------------------------------------|------------|
| 2025-08-12 | Initialized tracker and listed all pages/components             | Assistant  |
| 2025-08-12 | Added Global Components and Misc sections                       | Assistant  |
| 2025-08-12 | Added Auth section with Login Page; updated Summary table       | Assistant  | 
| 2025-08-12 | Marked Student role pages as ✅ and Login Page as ✅; updated counts | Assistant  |
| 2025-08-12 | Marked Instructor role pages as ✅; updated counts              | Assistant  | 
| 2025-08-12 | Marked Admin role pages as ✅; updated counts                   | Assistant  | 