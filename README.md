# Progress Tracker

A clean weekly learning/work tracker built with React, Redux Toolkit, React Router, Tailwind CSS v4, and Vite.

## Run locally
```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Features
- Create a 7-day tracker from any selected start date (date defaults to today).
- Customize the task list for each generated week.
- Previous weekly trackers appear on the home screen.
- Check/uncheck tasks independently for each day.
- Rename, remove, or add a task for a specific day.
- “Others” / “Other” tasks expose a small text field for a daily note.
- Weekly completion overview.
- Data persists in browser `localStorage`; refresh does not erase it.

## Note
Data is stored in the browser on the same device and browser profile. Clearing site data or switching browsers/devices will not carry the data over. Cloud sync and authentication are not included in this starter.
