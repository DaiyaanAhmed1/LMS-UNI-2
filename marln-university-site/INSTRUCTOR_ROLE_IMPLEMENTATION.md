## Instructor Role — Implementation Guide (Cursor-Ready)

This guide defines exactly what to implement for the Instructor role, how the onboarding tour should behave (excluding Sage AI), what to localize, and how to validate it. Keep it simple, fast, and stable.

### Scope
- Build and polish Instructor pages (already present) and their onboarding tour.
- Exclude Sage AI from the tour entirely.
- Localize everything (en/ar), support RTL.
- Teaching Schedule: 2025 data, CRUD, Hijri/Gregorian, Prayer panel, Jumu’ah conflict indicator.
- Sage AI gating: video summary unlocked; PDF summary PRO; Instructor Insights: 10s first preview then permanently lock.

## Routes (Instructor)
- `/instructor/dashboard`
- `/instructor/courses`
- `/instructor/students-management`
- `/instructor/assignments`
- `/instructor/grades`
- `/instructor/teaching-schedule`
- `/instructor/materials`
- `/instructor/messages`
- `/instructor/notifications`
- `/instructor/profile`
- Excluded from tour: `/instructor/sage-ai`

## Files to touch (anchors)
- Tour core: `src/context/TourContext.jsx`, `src/components/TourLauncher.jsx`
- Global styles for Joyride: `src/index.css`
- i18n: `src/i18n/locales/en.json`, `src/i18n/locales/ar.json`
- Instructor pages: `src/pages/instructor/*.jsx`
- Calendar data (reference): `src/data/calendar.js`
- AI Summary panel: `src/components/SageAISummaryPanel.jsx`

## Onboarding Tour (Instructor)
- Always start full tour at `/instructor/dashboard`.
- Exclude `/instructor/sage-ai` from any queue.
- Queue order (default):
  1. Dashboard → 2. Courses → 3. Students Management → 4. Assignments → 5. Grades → 6. Teaching Schedule → 7. Materials → 8. Messages → 9. Notifications → 10. Profile
- Storage keys:
  - `tour:mode` in {`full`, `single`}
  - `tour:queue` string[] of routes
  - `tour:launch` e.g. `instructor-full`
  - Per-page autostart flags as needed: `tour:instructor:<page>:auto`
- Queue sanitization: always filter out `/instructor/sage-ai` before use.
- Single-page tours: finish cleanly without prompting next page.

### Joyride setup (stable, smooth)
- Use fixed overlays to avoid layout shifts and extra scrollbars.
- Suggested props (already aligned in Student flow):
  - `continuous`, `showSkipButton`, `disableBeacon`
  - `scrollToFirstStep={true}`, `scrollOffset={~120}`, `scrollDuration={~800}`
  - `disableOverlayClose`, `disableCloseOnEsc`, `hideCloseButton`
  - `spotlightPadding={12}`
  - `floaterProps={{ strategy: 'fixed', placement: isRTL ? 'left' : 'right' }}`
  - `styles.tooltip/spotlight/overlay` with `ease-out` transitions
- CSS in `src/index.css` must keep Joyride containers `position: fixed !important` and not affect document flow.
- Use stable `data-tour="..."` attributes for targets. Avoid dynamic/conditionally-mounted elements.
- RTL: prefer placements like `top-start`, `left-start`, etc., that read well in both directions.

### Per-page minimal step schema (example)
- Dashboard:
  - `[data-tour="instructor-sidebar"]` — explain navigation
  - `[data-tour="instructor-stats"]` — quick stats
  - `[data-tour="instructor-recent"]` — recent activity
- Courses:
  - `#instructor-courses-search` — search
  - `[data-tour="instructor-courses-grid"]` — course cards
  - `[data-tour="instructor-course-details"]` — view details
- Students Management:
  - `[data-tour="instructor-students-table"]` — roster/table
  - `[data-tour="instructor-ai-insight"]` — explain preview then PRO lock
- Assignments:
  - `[data-tour="instructor-assignments-list"]`
  - `[data-tour="instructor-assignments-filter"]`
- Grades:
  - `[data-tour="instructor-grades-table"]`
  - `[data-tour="instructor-grades-edit"]` (demo modal)
- Teaching Schedule:
  - `[data-tour="instructor-calendar-nav"]`
  - `[data-tour="instructor-calendar-grid"]`
  - `[data-tour="instructor-calendar-add"]`
  - `[data-tour="instructor-calendar-hijri-toggle"]`
  - `[data-tour="instructor-calendar-prayer-panel"]`
- Materials:
  - `[data-tour="instructor-materials-upload"]`
  - `[data-tour="instructor-materials-list"]`
- Messages:
  - `[data-tour="instructor-messages-list"]`
  - `[data-tour="instructor-messages-chat"]`
- Notifications:
  - `[data-tour="instructor-notifications-filter"]`
  - `[data-tour="instructor-notifications-list"]`
- Profile:
  - `[data-tour="instructor-profile-actions"]`

Add these `data-tour` hooks to the corresponding JSX if missing.

## Localization (en/ar) and RTL
- Ensure all tour strings live under `instructor.tour.*` per page, e.g.:
  - `instructor.tour.dashboard.sidebar.title`, `.desc`
  - `instructor.tour.courses.search.title`, `.desc`
  - `instructor.tour.students.aiInsight.title`, `.desc`
  - Repeat for assignments, grades, teachingSchedule, materials, messages, notifications, profile
- Common button keys already used by Joyride:
  - `common.back`, `common.next`, `common.finish`, `common.skip`, `common.close`
- Teaching Schedule keys:
  - `instructor.teachingSchedule.modal.actions.delete`
  - `instructor.teachingSchedule.prayer.title`
  - `instructor.teachingSchedule.prayer.fajr|dhuhr|asr|maghrib|isha`
  - `instructor.teachingSchedule.prayer.conflictWarning`
- Verify Arabic text and JSON nesting; direction-aware placements.

## Teaching Schedule (2025, CRUD, KSA-ready)
- Events: replace or enrich with 2025 dates. Include KSA holidays and dense August 2025 examples.
- CRUD: add, edit, delete event modal flows.
- Hijri/Gregorian: ensure `gregorianToHijri` utility is used consistently and shows correct year.
- Prayer panel (demo): localized labels; static times are acceptable for demo; show conflict icon for Jumu’ah.
- Jumu’ah conflict: highlight events on Friday that overlap 12:00–13:30 (demo window); surface an icon and tooltip/text.

## PRO Gating (Instructor)
- Video summarization: unlocked. `SageAISummaryPanel` with transcript summary and copy button.
- PDF summarization: locked. Pass `proLock={true}`.
- Students Management insights:
  - First click: show full summary, start 10s timer, then switch to PRO lock and persist in state (`previewUsed = true`).
  - All others: open locked.
  - If needed later, persist `previewUsed` in `localStorage` scoped to instructor/session.

## Selectors to add (quick list)
- Sidebar: `data-tour="instructor-sidebar"`
- Dashboard stats: `data-tour="instructor-stats"`
- Calendar:
  - `data-tour="instructor-calendar-nav"`
  - `data-tour="instructor-calendar-grid"`
  - `data-tour="instructor-calendar-add"`
  - `data-tour="instructor-calendar-hijri-toggle"`
  - `data-tour="instructor-calendar-prayer-panel"`
- Students table: `data-tour="instructor-students-table"`
- AI Insight button: `data-tour="instructor-ai-insight"`
- Messages list/chat: `data-tour="instructor-messages-list"`, `data-tour="instructor-messages-chat"`

## Implementation order (checklist)
- [ ] Add/verify `data-tour` hooks across instructor pages
- [ ] Define `instructor.tour.*` i18n keys in `en.json` and `ar.json`
- [ ] Sanitize tour queues (remove `/instructor/sage-ai`) and ensure start-at-dashboard
- [ ] Implement per-page steps and auto-start on `tour:launch`
- [ ] Teaching Schedule: seed 2025 events (+ KSA holidays), CRUD works
- [ ] Hijri/Gregorian toggle and correct conversion
- [ ] Prayer panel (demo) + Jumu’ah conflict indicators
- [ ] Students Management: 10s preview-then-lock logic final
- [ ] PDF summary locked; Video summary unlocked
- [ ] RTL placements verified; Arabic translations reviewed
- [ ] Full run QA

## QA checklist
- Tour
  - [ ] Starts from `/instructor/dashboard` always (full tour)
  - [ ] No external close button; internal dialog works
  - [ ] No layout shift, no new scrollbars, no flicker
  - [ ] Steps placed correctly; spotlight and tooltip are stable
  - [ ] Ends cleanly on `/instructor/profile` with completion prompt
- Teaching Schedule
  - [ ] 2025 events visible; August dense; KSA holidays present
  - [ ] Add/Edit/Delete works
  - [ ] Hijri conversion matches expected dates (demo tolerance)
  - [ ] Prayer panel localized; Jumu’ah conflicts flagged
- Gating
  - [ ] Video summary shows full content + copy button
  - [ ] PDF summary shows PRO upsell
  - [ ] First AI Insight preview shows, locks after 10s permanently
- Localization
  - [ ] All tour text translated; English not showing keys
  - [ ] RTL ok; placements readable

## Troubleshooting tips
- Tooltip covers content or shifts layout:
  - Ensure Joyride containers are `position: fixed !important` in `src/index.css`
  - Prefer `placement: 'top-start' | 'left-start' | 'right-start'`
  - Increase `scrollOffset` a bit (e.g., 120) and keep `scrollToFirstStep=true`
- Flicker/shake between steps:
  - Avoid custom step index state; rely on Joyride internal state
  - Keep transitions `ease-out` and spotlight `animation: none`
- Tour doesn’t start after navigation:
  - Delay start with a short `setTimeout(100–400ms)` on page mount when `tour:launch` is present
  - Verify target selectors exist before starting (filter missing)

## Done criteria
- Instructor full tour runs end-to-end, excludes Sage AI, smooth with no layout breakage.
- Calendar is 2025-ready, CRUD works, Hijri/prayer features present.
- Gating model matches spec (video ok, PDF PRO, insights preview→lock).
- All text localized in en/ar; RTL verified. 