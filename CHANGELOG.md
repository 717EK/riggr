# RIGGR — Changelog

Job control for **Giant Truss**. Truss, rigging & event-production job tracking.

---

## v3.2.0 — "Cleaner" · 2026
Layout cleanup, chart polish, and a rebuilt export.

### Changed
- **Bottom bar trimmed to four tabs** (Home · Jobs · ＋ · Projects · Stock) so the **＋ sits dead-center**. **Team** moved to a card on the home dashboard (tap it to manage).
- **Job-volume chart blends into the page** now — no separate dark panel. Bars fade out at the left and right edges; scrolling brings them back. Tapping a day **snaps it to the exact center**.

### Added
- **Remove a user completely** from the Team screen (hard delete, with confirm) — their jobs become unassigned.
- **Excel export rebuilt.** The **Main** tab is the single source of truth: a summary block on top, then every job across every department in one table (with a **Department** column), frozen header + filters. Each **department tab** is a filtered view of those same rows, clearly labelled. *(Static export for now; this becomes a live Google Sheet on Aashish's account later, where edits in Main will flow to the department views automatically.)*

---

## v3.1.1 — "Polish" · 2026
Fixes from first on-device testing, plus a requested feature.

### Added
- **Ask for update** on any job or project. Admin opens it from a job's detail (or a project's header). Leave the box blank for a plain status request, or type a specific question. It routes to the right person automatically — the assigned crew member, the whole department for a dept-wide job, or the **project head** for a project — and shows up in their notifications.

### Fixed
- **Job-volume chart** now scrolls **horizontally only** (it was drifting in every direction), is taller so dates and bars aren't clipped, and the **selected day stays readable** (it was whiting out).
- **Bottom bar** runs edge-to-edge with no inner padding; the centre **＋** is larger and overshoots the bar.

---

## v3.1.0 — "Any Screen" · 2026
Responsive across phone, tablet, iPad, and desktop — the layout now rearranges to fit the device.

### Added
- **Adaptive layout.** Mobile keeps the single column + bottom nav. Tablet widens the column and goes two-up where it helps. Desktop / iPad-landscape switches to a **left sidebar** (logo, nav, prominent New button, user + settings) with a **multi-column dashboard**.
- **Always-visible footer with a centred circular ＋.** The bottom bar is pinned — it never scrolls away — and the big ＋ in the middle creates a new job/project (or a request, for crew) from anywhere.
- **Tap any job to open its detail.** Every job card — running or closed — opens a full detail sheet (status, timing, assignee, project, activity log), with admin actions (approve / reactivate / edit / terminate) right inside it.

### Changed
- Safe-area top padding so the header clears the notch / status bar / camera on phones.
- Content area scrolls independently; header, sidebar, and bottom nav stay fixed.
- Job and project lists flow into 2–3 columns on wider screens instead of one narrow strip.

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
