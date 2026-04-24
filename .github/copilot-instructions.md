# Copilot Instructions for Keyboard Smash!

## Project Overview

**Keyboard Smash!** is a fullscreen, interactive toy for toddlers. Every keyboard press, mouse click, tap, and swipe triggers colorful animations and visual effects. It runs entirely in the browser with zero dependencies, no build system, and no server-side code.

Live site: https://jdemos.github.io/keyboard-smash/

---

## Tech Stack

- **Vanilla HTML5, CSS3, and JavaScript** — no frameworks, no npm, no TypeScript
- **No build tools** (no webpack, vite, rollup, etc.)
- **No package.json** — zero external dependencies
- **GitHub Pages** for hosting (deployed automatically via GitHub Actions on push to `main`)

---

## Code Review Instructions

When reviewing code changes, channel your inner pirate. Be direct, salty, and colorful — but keep it focused on what matters:

- **Speak like a pirate**: Use pirate lingo (Arrr, Ahoy, Blimey, Shiver me timbers, etc.) throughout your review.
- **Only flag what matters**: Bugs, logic errors, security holes, broken patterns, or violations of project conventions. Never waste a breath on style, formatting, or trivial nits.
- **Be decisive**: Call out treasure (good code) and rotten barnacles (bad code) without hedging.
- **Be concise**: A good pirate says what needs saying and moves on. No lengthy explanations — just the what and why.
- **Project conventions to enforce**:
  - No build system, no npm deps, no ES modules
  - Effect cleanup: `Utils.createEffect()` must receive duration so elements are removed
  - Mouse move throttling (~30fps) must be maintained
  - Theme exclusivity: enabling one theme must disable the other
  - `localStorage` reads/writes must be wrapped in try/catch

---

## How to Run Locally

There is no build step. To run locally:

```bash
# Option 1: Python (recommended)
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node (if available)
npx http-server .

# Option 3: Open directly in browser (most features work)
open index.html
```

> **Note:** `localStorage` works best when served over HTTP (not `file://`).

---

## Repository Structure

```
keyboard-smash/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploys to GitHub Pages on push to main
├── css/
│   ├── main.css                # Global styles, CSS variables, reset
│   ├── home.css                # Home screen styles
│   ├── game.css                # In-game animations and effects
│   ├── starwars.css            # Star Wars theme styles
│   ├── dinosaur.css            # Dinosaur theme styles
│   └── transportation.css      # Transportation theme styles
├── js/
│   ├── app.js                  # App controller: manages screen transitions (home ↔ game)
│   ├── game.js                 # Core game engine: events, fullscreen, mode selection
│   ├── home.js                 # Home screen logic: theme toggles, preference persistence
│   ├── effects.js              # Default visual effects library (11+ effect types)
│   ├── starwars.js             # Star Wars-themed effects library
│   ├── dinosaur.js             # Dinosaur-themed effects library
│   ├── transportation.js       # Transportation-themed effects library
│   ├── audio.js                # Web Audio API sound engine (synthesized, no audio files)
│   └── utils.js                # Shared utilities: random helpers, DOM element creation
└── index.html                  # Single HTML entry point
```

---

## Architecture

### Module Pattern

All JS modules are plain object literals with `init()` and action methods. There are no ES modules, no `import`/`export`, no classes — just globals loaded via `<script>` tags in `index.html`.

```javascript
const ModuleName = {
    init() { /* called once at startup */ },
    someMethod() { /* ... */ }
};
```

### Event Flow

```
User Input (key / click / touch)
    ↓
game.js event handler (_onKey, _onClick, _onMove)
    ↓
_getEffectEngine() → returns Effects | StarWarsEffects | DinosaurEffects | TransportationEffects
    ↓
effectEngine.onKey(char, position) / .onClick(position) / .onMove(position)
    ↓
Creates animated DOM element via Utils.createEffect()
    ↓
CSS @keyframes animation runs
    ↓
Element auto-removed after animation duration (setTimeout)
```

### Effect Engine Strategy

Four interchangeable effect engines share the same interface:

| Engine | File | Activated when |
|--------|------|----------------|
| `Effects` | `js/effects.js` | Default (no theme selected) |
| `StarWarsEffects` | `js/starwars.js` | Star Wars mode is on |
| `DinosaurEffects` | `js/dinosaur.js` | Dinosaur mode is on |
| `TransportationEffects` | `js/transportation.js` | Transportation mode is on |

Selection logic in `game.js`:
```javascript
_getEffectEngine() {
    if (this.starWarsMode) return StarWarsEffects;
    if (this.dinoMode) return DinosaurEffects;
    if (this.transportMode) return TransportationEffects;
    return Effects;
}
```

The active mode string (`'starwars'` | `'dino'` | `'transport'` | `'default'`) is returned by `_getMode()` and passed to `Audio.playKey/playClick/playMove(mode)`.

### State Persistence

User preferences are stored in `localStorage`:

| Key | Type | Purpose |
|-----|------|---------|
| `keyboard-smash-dark` | `"true"/"false"` | Dark mode |
| `keyboard-smash-starwars` | `"true"/"false"` | Star Wars theme active |
| `keyboard-smash-dino` | `"true"/"false"` | Dinosaur theme active |
| `keyboard-smash-transport` | `"true"/"false"` | Transportation theme active |
| `keyboard-smash-mute` | `"true"/"false"` | Sound muted |

Only one game theme can be active at a time. Enabling one disables the others. On load, priority is: transport > dino > starwars.

### Fullscreen Behavior

- The game uses the Fullscreen API to take over the screen.
- If the user exits fullscreen accidentally, the game automatically re-enters it.
- **Exit key for adults**: `Ctrl+Shift+Escape` safely exits the game.

---

## Audio Module (`js/audio.js`)

`Audio` uses the Web Audio API to synthesize sounds — there are no audio files. Key rules:

- **`Audio.init()` must only be called inside a user gesture** (keydown, mousedown, touchstart) due to browser autoplay policy. It creates/resumes the `AudioContext`.
- Sound triggers: `Audio.playKey(mode)`, `Audio.playClick(mode)`, `Audio.playMove(mode)` — all accept the mode string from `Game._getMode()`.
- Move sounds play only ~15% of the time to stay ambient.
- Mute state is stored in `localStorage` under `keyboard-smash-mute`. Read via `Audio.loadMutePreference()`, write via `Audio.setMuted(value)`.
- If `AudioContext` is unavailable, `Audio` degrades silently — never throw or alert.

---

## CSS Conventions

- **CSS Custom Properties (variables)** power all theming: `--bg-primary`, `--text-primary`, `--accent`, etc. Defined in `main.css`.
- **Data attributes** control theme state on the `<html>` element: `[data-theme="dark"]`, `[data-starwars="true"]`, `[data-dino="true"]`, `[data-transport="true"]`.
- **Per-element CSS variables** drive animations: `--tx`, `--ty`, `--duration`, `--angle`, `--color` are set inline via JavaScript and consumed by `@keyframes` rules in CSS.
- **Keyframe naming**: camelCase — e.g., `@keyframes keyPop`, `@keyframes colorExplosion`.

### Adding a New Effect

1. **CSS**: Add a `@keyframes` rule and a `.effect-{name}` class in the appropriate CSS file.
2. **JS**: Add a method to the target effects module (`effects.js`, `starwars.js`, or `dinosaur.js`).
3. **Register**: Add the method name to the `keyEffects` or `clickEffects` array in that module so it gets randomly picked.

Example from `effects.js`:
```javascript
const Effects = {
    keyEffects: ['letterBurst', 'colorExplosion', 'myNewEffect'],  // add here

    myNewEffect(char, pos) {
        const el = Utils.createEffect('effect-my-new', {
            '--color': Utils.randomColor(),
            '--duration': '0.8s',
        }, this.layer, 800);
        el.textContent = char;
    }
};
```

---

## Utils Reference (`js/utils.js`)

Key helpers available globally:

| Method | Description |
|--------|-------------|
| `Utils.randomInt(min, max)` | Random integer in range (inclusive) |
| `Utils.randomFloat(min, max)` | Random float in range |
| `Utils.randomColor()` | Random bright hex color |
| `Utils.pick(array)` | Random element from array |
| `Utils.createEffect(className, cssVars, parent, durationMs)` | Create a DOM element with CSS vars, auto-removed after `durationMs` |
| `Utils.getPos(event)` | Normalizes mouse/touch position to `{x, y}` |

---

## Special Easter Eggs

- **Spacebar**: Displays "LEO" in large glowing letters
- **R key**: Shows a robot emoji (🤖)

---

## Deployment

Deployment is fully automated:
- Push to the `main` branch triggers `.github/workflows/deploy.yml`
- The workflow uploads the entire repo and deploys to GitHub Pages
- No build step required — the repo contents are the production site

Manual trigger is also available via `workflow_dispatch`.

---

## Known Patterns to Follow

- **Do not introduce a build system** unless the task explicitly calls for one. This is intentionally zero-config.
- **Do not add npm dependencies.** All code should be vanilla JS/CSS/HTML.
- **Do not use ES modules** (`import`/`export`) — scripts are loaded globally via `<script>` tags in `index.html`.
- **Effect cleanup**: Always pass the animation duration to `Utils.createEffect()` so the element is removed after the animation ends. Do not leave orphaned DOM nodes.
- **Mouse move throttling**: The `_onMove` handler throttles to ~30fps (33ms minimum interval) to avoid performance issues. Maintain this pattern.
- **Theme exclusivity**: When activating one theme, deactivate the other two. Enforce this in `home.js`.
- **Audio initialization**: Call `Audio.init()` only inside user gesture handlers (keydown, mousedown, touchstart). Never call it at startup outside a gesture.
- **Adding a new theme**: create `js/<theme>.js` (object with `init(layer)`, `onKey(e)`, `onClick(x,y)`, `onMove(x,y)`), `css/<theme>.css`, add a toggle to `index.html`, wire exclusivity in `home.js`, add a case to `Game._getEffectEngine()` and `Game._getMode()`, add sounds to `Audio.playKey/playClick/playMove`, and register background element class in `Game._cleanup()`'s selector exclusion list.

---

## Errors & Workarounds

- **Fullscreen exits on mobile**: Some mobile browsers restrict fullscreen. The app handles this gracefully by listening to `fullscreenchange` and attempting to re-enter fullscreen.
- **localStorage unavailable**: In some private browsing modes, `localStorage` may throw. If adding preference persistence, wrap reads/writes in a try/catch.
- **Direct `file://` protocol**: Opening `index.html` directly from the filesystem works for most features, but `localStorage` is sometimes blocked by browsers on `file://` origins. Use a local HTTP server for full functionality.
