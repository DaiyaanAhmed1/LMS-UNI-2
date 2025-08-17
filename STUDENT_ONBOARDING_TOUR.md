# Student Onboarding Tour (Essentials Only)

Purpose: Give first‑time students a 60–120s guided intro to the LMS. This doc is the single source of truth for scope, copy, assets, and implementation status.

## Goals
- Help students complete core tasks quickly (find courses, see assignments, check schedule, discover Sage AI)
- Keep it short (6 steps), localized (EN/AR), RTL-aware, accessible, and skippable
- Persist completion; allow replay from Help

## Flow (Redesigned)
1) Trigger: Start Tour icon in sidebar (student only). Always available; resumes if a queue exists.
2) Dashboard tour runs (overview of key sections: sidebar, status, academic performance, study stats, upcoming assmts, quick links, deadlines, messages).
3) On completion, auto-advance to the next section in queue (default: Courses → Assignments → Schedule → Sage AI). Users can restart at any time from the sidebar.
4) Final step: show “Tour complete” tooltip with a short message (“You’re all set”) and dismiss.

- Resume: If a tour is interrupted, clicking the icon offers Resume or Restart.
- Not first-run: No modal overlays are needed; the icon is the consistent entry point.

## Framework & Architecture
- Framework: React Joyride (or Shepherd.js). Recommendation: Joyride
- `TourProvider` (context):
  - API: `startTour(id)`, `stopTour()`, `restartTour(id)`, `setSteps(id, steps)`
  - Persistence: `localStorage['tour:student:v1']` → `completed|skipped|inProgress`
  - First‑run gate: Prompt on first student login
- Restart entry: “Help → Replay Tour” (Student)

## 6-Step Essentials Tour
Keep copy ≤ 2 lines. Placement should respect LTR/RTL.

1) Sidebar navigation
- Target selector: `#sidebar-nav`
- i18n keys: `student.tour.sidebar.title`, `student.tour.sidebar.desc`
- Example (EN): “Navigation — Access all sections here”
- Placement: right

2) Dashboard status cards
- Target: `#stat-cards`
- Keys: `student.tour.dashboard.cards.title`, `.desc`
- Example: “Your status — See progress, assignments, and next class at a glance”
- Placement: bottom

3) My Courses: search + open details
- Target: `#courses-search` (input) or `#courses-list`
- Keys: `student.tour.courses.title`, `.desc`
- Media (micro-clip): `public/tour/courses-search.mp4` (4–6s)
- Placement: right

4) Assignments: due list + open submit
- Target: `#assignments-list`
- Keys: `student.tour.assignments.title`, `.desc`
- Media: `public/tour/assignments-open.mp4`
- Placement: left

5) Schedule: views + Hijri/Gregorian toggle
- Target: `#schedule-view-toggle` (Weekly/Monthly) and `#date-system-toggle`
- Keys: `student.tour.schedule.title`, `.desc`
- Media: `public/tour/schedule-toggle.mp4` (optional)
- Placement: bottom

6) Sage AI: intro & PRO context
- Target: `#sage-ai-entry` (sidebar or page hero)
- Keys: `student.tour.sage.title`, `.desc`
- Placement: right

### Optional CTA (end of tour)
- Prompt: “Try it now?”
- Primary action: Go to `/student/courses`, auto‑open first course details modal (or a sample course)
- Secondary: Finish (close tour)

## Visual Assets (Micro‑illustrations)
- Format: MP4/WebM, 4–6s, mute, loop, 560×320 (or smaller), <300 KB preferred
- Placeholder files:
  - `public/tour/courses-search.mp4`
  - `public/tour/assignments-open.mp4`
  - `public/tour/schedule-toggle.mp4` (optional)

## i18n Keys (EN/AR)
Add under `student.tour.*` in `src/i18n/locales/en.json` and `ar.json`.

Example (EN):
```json
"student": {
  "tour": {
    "startPrompt": {
      "title": "Quick tour?",
      "desc": "Learn the basics in under 2 minutes."
    },
    "sidebar": {
      "title": "Navigation",
      "desc": "Access all sections from here."
    },
    "dashboard": {
      "cards": {
        "title": "Your status",
        "desc": "Progress, assignments, and next class."
      }
    },
    "courses": { "title": "My Courses", "desc": "Search and open a course to view details." },
    "assignments": { "title": "Assignments", "desc": "See due work and open to submit." },
    "schedule": { "title": "Schedule", "desc": "Switch views or toggle Hijri/Gregorian." },
    "sage": { "title": "Sage AI", "desc": "Ask questions and see PRO features." },
    "cta": { "try": "Try it now", "finish": "Finish" }
  }
}
```