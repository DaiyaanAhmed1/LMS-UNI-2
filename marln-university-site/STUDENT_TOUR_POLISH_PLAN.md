## Student Onboarding Tour — Polishing Plan (Cursor-Ready)

This is a focused checklist to refine and stabilize the Student onboarding tour (React Joyride) with full Arabic/English localization and RTL support.

### Scope
- Keep full tour flow for Student; exclude `/student/sage-ai`.
- Smooth animations, stable placements, no layout shifts or extra scrollbars.
- Ensure clean start (Dashboard) and clean finish (eCollab completion modal).
- Ensure all strings localized in en/ar; RTL placements reviewed.

## Routes and flow (Student)
- Start at `/student/dashboard`
- Full tour queue: `/student/courses` → `/student/assignments` → `/student/grades` → `/student/materials` → `/student/schedule` → `/student/messages` → `/student/notifications` → `/student/ecollab`
- Exclude `/student/sage-ai` from any queue/sanitization
- Single-page tour: finish silently

## Joyride config (stable)
- continuous, showSkipButton, disableBeacon
- scrollToFirstStep=true, scrollOffset≈120, scrollDuration≈800
- disableOverlayClose, disableCloseOnEsc, hideCloseButton
- spotlightPadding=12
- floaterProps: { strategy: 'fixed', placement: isRTL ? 'left' : 'right' }
- styles.tooltip/spotlight/overlay: ease-out transitions; tooltip width≈350

## CSS overlay rules (no layout shift)
- Ensure in `src/index.css` these are in place:
  - `[data-react-joyride]`, `.__react_joyride__tooltip`, `.__react_joyride__overlay`, `.__floater` containers use `position: fixed !important`, `z-index` high, no extra scrollbars

## Per-page selectors and step outlines
- Dashboard (`/student/dashboard`):
  - `#sidebar-nav [data-tour="sidebar-link-dashboard"]` — Navigation
  - `#stat-cards` — Your Status
  - `[data-tour="academic-performance"]` — Academic Performance
  - `[data-tour="study-stats"]` — Study Progress
  - `#upcoming-assignments` — Upcoming Assignments
  - `#quick-links` — Quick Links
  - `[data-tour="deadlines"]` — Important Deadlines
  - `[data-tour="messages"]` — Messages
- Courses (`/student/courses`):
  - `[data-tour="courses-grid"]` — Course Overview (placement: top-start)
  - `#courses-search` — Search (placement: left-start)
  - `[data-tour="view-details-btn"]` — View Details (placement: top)
- Assignments (`/student/assignments`):
  - `#assignments-search` — Search (placement: left)
  - `#assignments-status-filter` — Status Filter (placement: left)
  - `[data-tour="assignments-list"]` — Overview (if present)
- Grades (`/student/grades`):
  - `[data-tour="grades-filters"]` — Filters/Semesters (placement: top)
  - `[data-tour="grades-overview"]` — Overview (placement: top)
  - `[data-tour="grades-table"]` — Table (placement: top)
- Materials (`/student/materials`):
  - `#materials-search` — Search (placement: left)
  - `[data-tour="materials-filters"]` — Filters (placement: left)
  - `[data-tour="materials-list"]` — Library (placement: top)
- Schedule (`/student/schedule`):
  - `[data-tour="schedule-view-toggle"]` — Weekly/Monthly (placement: bottom)
  - `[data-tour="schedule-date-system"]` — Gregorian/Hijri (placement: bottom)
  - `[data-tour="schedule-today"]` — Today’s Classes (placement: top)
  - `[data-tour="schedule-actions"]` — Quick Actions (placement: left)
- Messages (`/student/messages`):
  - `#messages-search` — Search (placement: right)
  - `[data-tour="open-conversation"]` — Open Chat (placement: right)
- Notifications (`/student/notifications`):
  - `[data-tour="notifications-filters"]` — Filters (placement: top-start)
  - `[data-tour="notifications-list"]` — Feed (placement: top)
- eCollab (`/student/ecollab`):
  - `[data-tour="ecollab-what-is"]` — What is eCollab (placement: top)
  - `[data-tour="ecollab-editor"]` — Post Editor (placement: left)
  - `[data-tour="ecollab-feed"]` — Feed (placement: top)
  - `[data-tour="ecollab-quick-links"]` — Quick Links/Highlights (placement: left)

Note: If any selector is missing in JSX, add the `data-tour` attribute minimally without changing layout.

## i18n and RTL
- Ensure keys exist in `en.json` and `ar.json`:
  - `student.tour.nextPrompt.*`, `student.tour.complete.*`, `student.tour.cta.*`, `student.tour.full`, `student.tour.pageOnly`
  - Per-page: `student.tour.courses.*`, `student.tour.assignments.*`, `student.tour.materials.*`, `student.tour.grades.*`, `student.tour.schedule.*`, `student.tour.messages.*`, `student.tour.notifications.*`, `student.tour.ecollab.*`
- Verify English does not show key names; Arabic strings render; use `*-start` placements for RTL-friendly positions

## Behaviors
- Start full tour from Dashboard regardless of current path
- Page transitions: delay 100–200ms after navigation before starting steps
- Verify each step target exists; filter missing steps before starting
- Completion modal at eCollab with localized copy (Close/Restart); no Sage AI
- Single-page mode ends silently without prompts

## Implementation order
- [ ] Verify/patch `data-tour` selectors on each student page
- [ ] Review per-page step placements (avoid covering inputs)
- [ ] Confirm Joyride config and CSS fixed-overlay rules
- [ ] Audit i18n keys; fill missing en/ar; test for key-strings
- [ ] Ensure queue sanitization excludes `/student/sage-ai`
- [ ] Add completion modal copy at eCollab; restart to Dashboard
- [ ] QA: LTR and RTL, no flicker/scrollbars, clean end

## QA checklist
- Starts at `/student/dashboard`; full queue follows order; Sage AI excluded
- Tooltips do not cause layout shift or add scrollbars
- Steps are visible and readable in both en/ar; placements good in RTL
- Single-page tours end quietly; full tour ends at eCollab with modal

## Troubleshooting
- Tooltip covers form fields: switch to `top-start`/`left-start`; increase `scrollOffset`
- Flicker on step change: avoid manual stepIndex; keep `animation: none` for spotlight
- Tour doesn’t start after navigation: add short timeout, verify selectors exist

## Done criteria
- Full student tour runs smoothly end-to-end, ending at eCollab
- No layout shifts; no extra scrollbars; localized with RTL reviewed
- Clean, restartable completion modal; Sage AI excluded 