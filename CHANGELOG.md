# RIGGR — Changelog

Job control for **Giant Truss**. Truss, rigging & event-production job tracking.

---

## v3.0.0 — "Giant Truss" · 2026
The full redesign — rebuilt around the Conneq-style floating-panel aesthetic and branded for Giant Truss.

### Added
- **RIGGR brand** — new name, bar-cluster logo (reads as a truss elevation, an EQ, and the job-volume graph at once).
- **Aashish — universal admin.** Seeded as permanent admin; cannot be demoted, deactivated, or deleted.
- **Job-volume visualizer (signature feature).** SoundCloud-style centered vertical bars, one per time bucket, height = number of jobs. Scrolls left/right with center-snap, tap-to-select, and Day / Week / Month modes. Bars up to the selected bucket are accent-coloured ("played"), future buckets olive. Shown for the admin (all jobs) and every crew member (their jobs). Selecting a bucket filters the jobs below.
- **Projects.** Group jobs that span multiple departments under a named project (client, project head, location). Per-project stats page and a dashboard project filter.
- **Rental department + rental projects.** Track inventory dispatched vs returned vs still on-site, site location, and site manager — all logged against the project in the movement ledger.
- **Theme system.** Light / dark toggle + accent-colour picker (lime default, plus orange / blue / violet / coral) in Settings. Per-device.
- **Settings screen** with theme controls, change-PIN, About + this changelog, and logout.

### Changed
- Visual language rebuilt to match the reference: cream canvas, white floating cards, chartreuse-lime spotlight, muted-olive secondary, oversized grotesque numerals, panels-within-panels.
- Demo data re-themed to event production (rigging, fabrication, welding, powder coat, assembly, logistics, rental).
- Bar-timeline replaces the previous week date-strip as the dashboard hero (calendar month-grid still available).

---

## v2.0.0 — "Conneq CRM" (internal)
- Rebuilt as a mobile CRM: light canvas, dark hero cards, lime accent, bottom nav, FAB.
- Added inventory management (raw / final / rental, stock in-out), employee management (auto-username + temp PIN + forced first-login reset), self-registration approval queue, editable departments.
- Added timeline date-strip + month calendar, status donut, department-load bars, 7-day completed trend.

## v1.0.0 — "Control Room" (internal)
- First build. Industrial dark theme, PIN login, role-split admin/operator views.
- Six-state job lifecycle (Pending → Running → On Hold → Awaiting Approval → Completed → Terminated) with admin approve / reactivate / terminate.
- Two-way notifications, recharts dashboard, native .xlsx export in the original sheet column format.
- Browser persistence with an isolated data layer ready to swap for a Google Sheets backend.
