# ZenTime

A gentle Pomodoro-style timer with a minimalist wave theme. Sessions and breaks are configurable, persisted locally, and backed by accessible controls.

## Features
- Session and break length controls with clear labels and keyboard-friendly focus styles.
- Start/pause toggle, reset, and automatic break/session transitions with audible cues.
- Preset buttons (25/5, 50/10, 15/3) to quickly switch routines.
- Preferences saved to your browser so lengths persist between visits.

## Getting started
Open `docs/index.html` in a modern browser. The app uses CDN-hosted React, so no build step is required.
Open `dist/index.html` in a modern browser. The app uses CDN-hosted React, so no build step is required.

## Usage tips
- Adjust session/break lengths before starting. Length controls are disabled while the timer runs to prevent accidental changes.
- Click a preset to load new durations; playback will pause and the timer returns to the session state with the new values.
- Use **Reset** to restore defaults (25-minute session / 5-minute break) and stop any playing audio.

## Development
The core logic lives in `src/script.js` and styles in `src/style.css`. After making changes, open `docs/index.html` to verify behavior in the browser.

## Publishing on GitHub Pages
GitHub Pages exposes only the repository root or a `/docs` folder. To publish this app:

1. Keep the built files in the `docs/` directory (already included in the repo).
2. In your repository’s **Settings → Pages**, choose the default branch and set the folder to `/docs`.
3. Save the configuration—GitHub Pages will serve `docs/index.html` as the entry point.
The core logic lives in `src/script.js` and styles in `src/style.css`. After making changes, open `dist/index.html` to verify behavior in the browser.
