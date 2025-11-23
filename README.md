# ZenTime

ZenTime is a focused Pomodoro-style timer built with React + Vite. It offers sensible defaults, adjustable session/break lengths, presets, and a clean UI optimized for both desktop and mobile.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server with hot reload:
   ```bash
   npm run dev
   ```
   Vite will print a localhost URL; open it in your browser to interact with the timer.
3. Build a production bundle (outputs to `docs/` for GitHub Pages):
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Features
- Start/pause toggle with automatic transitions between session and break phases.
- Adjustable lengths (1–180 minutes) plus quick presets (25/5, 50/10, 15/3).
- Local preference storage so your chosen lengths persist between visits.
- Audio chime when phases change.
- Responsive, accessible layout with keyboard-friendly controls.

## Usage tips
- Adjust session/break lengths while paused; values sync instantly to the timer display.
- Presets always pause playback, reset to the session phase, and apply the new durations.
- **Reset** restores the default 25 / 5 schedule and silences any playing chime.

## Deploying to GitHub Pages
The Vite config builds directly into `docs/`, which GitHub Pages can serve without extra tooling.

1. Run `npm run build` to generate the `docs/` folder.
2. Commit and push the changes.
3. In your repository, open **Settings → Pages** and select the default branch with the `/docs` folder as the source.
4. GitHub Pages will serve `docs/index.html` at `https://<user>.github.io/<repo>/`.

## Project structure
- `src/` – React components and styles.
- `index.html` – Vite entry file.
- `vite.config.js` – Vite configuration (builds to `docs/` and uses relative base for Pages).
- `docs/` – Generated production bundle after running `npm run build`.

## Resolving branch conflicts
If GitHub shows “This branch has conflicts that must be resolved,” sync with the default branch and reconcile the changes locally:

1. Fetch the latest default branch (replace `main` if your repo uses another name):
   ```bash
   git fetch origin
   ```
2. Update your working branch with the default branch history:
   ```bash
   git merge origin/main
   # or: git rebase origin/main
   ```
3. Run `git status` to list conflicted files, open each one, and edit the conflict markers to keep the intended code. Save the file, then mark it resolved:
   ```bash
   git add <file>
   ```
4. Once all conflicts are staged, confirm the app still works (e.g., `npm run build` or `npm run dev` locally), then complete the merge/rebase:
   ```bash
   git commit  # if merging
   # or: git rebase --continue
   ```
5. Push the branch:
   ```bash
   git push
   ```

If the merge touches UI or logic, rebuild the production bundle before pushing so `docs/` stays in sync:
```bash
npm run build
```

## License
MIT
