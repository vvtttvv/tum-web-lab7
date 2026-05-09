# Focus Flow - Lab 6 Front-end

Client-side Pomodoro dashboard built with React, TypeScript, Tailwind CSS, and custom CSS variables.

## Current Stage

Initial project skeleton with:
- Vite + React + TypeScript setup
- Tailwind integrated through the Vite plugin
- custom dark/light themes via CSS variables
- feature-based architecture (projects feature split into model/components)
- dynamic project creation UI inspired by the provided mockup
- browser persistence via repository layer (IndexedDB for projects, localStorage for theme)

## Topic

Pomodoro productivity app for planning and tracking focus sessions.

## Planned Entities

- Session (title, elapsed, total duration, progress)
- Day plan (date + list of sessions)
- Filter state (All, Due, Completed)

## Main Flows

1. User opens the app and sees today's sessions.
2. User switches theme between dark and light.
3. User creates a new project through the modal form.
4. Created projects are restored from IndexedDB after refresh.
5. Next iterations: start/pause/reset timer and track progress live.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- CSS variables for theming
- IndexedDB repository abstraction (ready to swap to API)

## Local Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```
