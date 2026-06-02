# RIGGR — Giant Truss

Job control for **Giant Truss**. A React + Vite PWA you can run on phone, tablet, or PC and install to the home screen.

Version **3.0.0** — see `CHANGELOG.md`.

---

## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed. Then, in this folder:

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). On the login screen:

- **Aashish (owner)** — PIN `1234`
- **Ravi / Rigging** — `1111`
- **Suresh / Fabrication** — `3333`
- **Manoj / Powder Coat** — `4444`
- **Karan / Rental** (forced PIN reset on first login) — `9999`

To test the network, open the dev URL on your phone (same Wi-Fi) — Vite prints a `Network:` address you can use.

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `npx vercel` from here).
2. In Vercel, **import the repo**. It auto-detects Vite — framework preset **Vite**, build command `npm run build`, output dir `dist`. `vercel.json` is already set up for SPA + PWA routing.
3. Deploy. You get a URL like `riggr.vercel.app`.
4. On a phone, open that URL → browser menu → **Add to Home Screen**. It installs as an app (RIGGR icon, no browser chrome).

---

## Data — important

Right now the app uses **preview data that lives in the browser** (seeded sample jobs, projects, crew). Each device has its own copy; nothing is shared between devices yet, and clearing the browser wipes it.

The data layer is deliberately isolated in **`src/data/store.js`** so going live later is a small change: swap the bodies of `store.load()` and `store.save()` to `fetch()` calls against a Google Apps Script Web App URL (backed by a Google Sheet in Aashish's account). Nothing else in the app needs to change.

That backend (Apps Script + Sheet template + the 6 PM end-of-day nudge) is the next phase.

---

## Project layout

```
src/
  main.jsx            app entry
  App.jsx             orchestrator: state, auth gates, nav, ops
  styles.js           the full stylesheet (theme via CSS variables)
  data/
    constants.js      statuses, priorities, accents, version, changelog
    seed.js           preview/sample data
    store.js          load/save — SWAP THIS for the Sheets backend
    exportXlsx.js     .xlsx export
  lib/
    helpers.js        dates, id/pin gen, visualizer bucket math
    theme.js          light/dark + accent → CSS variables
    icons.js          lucide icon re-exports
  components/         Visualizer, CalendarModal, NotifPanel, JobCard, Bits
  screens/            AdminHome, Jobs, Projects, Stock, Team, UserHome, Settings
  forms/Modals.jsx    every create/edit/request/review form
  auth/Login.jsx      PIN login, request access, forced PIN reset
```
