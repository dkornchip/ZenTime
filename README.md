# ZenTime

ZenTime is a lightweight, single-page Pomodoro timer that runs entirely in the browser. It features configurable session/break lengths, preset routines, persistent preferences, and a calm wave-inspired theme.

## Why this refactor?
The app now uses small, focused React components and custom hooks to keep timer logic predictable and easy to extend. Session/break lengths are clamped, stored, and synchronized with the active timer so adjustments cannot leave the UI in an inconsistent state.

## Quick start
1. Open the `docs/index.html` file in any modern browser. React is loaded from a CDN, so no build tooling is required.
2. Choose **Start** to begin a session, or pick a preset to load common durations (25/5, 50/10, 15/3).
3. Use **Reset** to return to the 25-minute session / 5-minute break defaults and stop the alert sound.

### Serve as a webpage
If you prefer to host the timer locally (or validate it before publishing), run a static server from the project root:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000/docs/](http://localhost:8000/docs/) in your browser.

For GitHub Pages, point the Pages source to the `/docs` folder—`docs/index.html` is the entry point.

## Project layout
- `src/` – Source HTML/CSS/JS used during development.
- `docs/` – Publish-ready files for static hosting (mirrors `src/`).
- `CHANGELOG.md` – Release notes.

## Technology choices
- **React via CDN** keeps the bundle simple and avoids a build step.
- **Custom hooks** manage persistence and timer transitions without duplicated logic.
- **Accessible controls** include explicit labels, ARIA live regions, and focus-visible states from the shared styles.
