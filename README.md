# Accessibility Testing Challenge

An interactive accessibility QA game with two optional, independent modes.
Play either one, in any order, skip or replay anything, and leave whenever
you like — nothing is required to finish.

This is an original, standalone project. It is a clean-room recreation
inspired only by the general format of "interaction exercises + scenario
game." All scenarios, copy, and code in this repository are original and
generic. No internal company material, branding, real product names,
datasets, or proprietary policy language are included anywhere in this
project.

## The two games

- **Accessibility Challenge.** Five modes share one target-selection
  engine: Standard (a baseline), Low Vision (blur, low contrast, a smaller
  target), Color Vision (a color-vision filter with decoy shapes), Motor
  Tremor (an unpredictable, drifting target), and Switch Access (keyboard-
  only, Tab to move focus, Enter or Space to select). Each mode is eight
  targets in a row, with its own fixed difficulty — not a curve. A short
  info button next to each mode name gives brief, optional context on the
  barrier it isolates.
- **Spot the Accessibility Bug.** Eight game-screen scenarios, randomly
  sampled and shuffled from a pool of fifteen (color-only status, crowded
  controls, low-contrast text, subtitle readability, rapid flashing,
  missing focus indicators, unlabeled icons, quick-time event timing,
  audio-only cues, HUD/text scaling, camera shake, control remapping,
  audio settings with no independent volume controls, unreliable manual
  saving, and menu changes that aren't announced to screen readers). Each
  scenario is a real mini interface to inspect, three answer choices, and
  one line of feedback. The run's timer only counts active investigation
  time — reading feedback, paused time, and time in a background tab are
  all excluded.

Personal bests are shown on a standalone "Your Results" screen, stored
only in this browser's local storage — never a shared or public
leaderboard, and name entry is optional.

A short "Carry this lens forward" card appears after finishing either game
and on the Your Results screen — a brief, always-visible takeaway on what
accessibility testing looks for in general, not a required stage or a gate
on anything. Deeper material (the full testing checklist, tools, and a
finding-reporting process) belongs outside this app, in a linked
portfolio case study.

## Running locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

## Building for independent hosting

```bash
npm run build
```

This produces a static `dist/` folder. It can be uploaded to any static
host (for example, a static file bucket, a static-site host, or your own
web server). No server-side code, database, or environment variables are
required.

```bash
npm run preview   # optional: preview the production build locally
```

## Privacy & data handling

- No authentication or accounts.
- No analytics or tracking scripts of any kind.
- No personal information is collected or transmitted.
- No external database or network calls are made by the app.
- Results are stored only in the browser's local storage, on the visitor's
  own device. If local storage is unavailable (blocked, private browsing,
  full), the game still works — progress just won't persist past that
  session, and a single, honest note says so on the Your Results screen.

## Accessibility notes

- Semantic HTML landmarks throughout (header, nav, main, footer).
- Full keyboard navigation, with visible focus states on every control.
- Switch Access is operated entirely with Tab, Enter, and Space — no
  mouse required, and Space never scrolls the page while playing.
- Every challenge mode and Spot the Bug have a small, keyboard- and
  screen-reader-accessible info popover (click, Enter/Space, or hover to
  open; Escape or outside-click to close; focus always returns to the
  button that opened it).
- Pause, Restart, and Exit are available throughout both games. Exiting a
  round in progress asks a single, non-judgmental "Exit this round?"
  confirmation; "Keep playing" resumes exactly where you left off.
- No countdown timers force failure anywhere in the app. Using keyboard
  navigation, reduced motion, or extra time never costs points.
- Screen-reader labels and `aria-live` announcements for dynamic state
  changes (round results, scoring, feedback).
- Respects `prefers-reduced-motion`, and also offers an in-app
  reduced-motion toggle independent of OS settings. The one scenario that
  depicts rapid flashing stays static whenever the game is paused, the
  browser tab isn't visible, or either reduced-motion setting is on — and
  even while animating, its rate is capped safely under commonly-cited
  photosensitive-seizure thresholds.
- Touch targets sized for comfortable use on mobile.

## Project structure

```
src/
  components/
    Game/
      TargetChallenge/   Accessibility Challenge: mode hub, engine, results
      SpotTheBug/        Spot the Bug: scenario flow, cards, mockups
      GameStages.tsx     Routes between the Challenge and Spot the Bug
    Home/                Homepage
    YourResults/         Standalone personal-bests screen
    About/               About This Project
    layout/              Header, footer, skip link
    common/              Shared accessible primitives (info popover, exit
                         confirmation dialog, live region, error boundary,
                         "Carry this lens forward" takeaway card)
  context/               AppStateContext (reduced-motion preference) +
                         ChallengeStateContext (game progress), both
                         localStorage-backed with a safe in-memory fallback
  data/                  Challenge mode copy/parameters, Spot the Bug pool
  hooks/                 useLocalStorageState, useAnnouncer
  styles/                Global design tokens and base styles
  types.ts               Shared TypeScript types
  routing.ts             Hash-based routing (no external router library)
  App.tsx                Top-level screen router
  main.tsx               Entry point
```

## License / attribution

Created by C. Lin.
