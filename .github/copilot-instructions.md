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
│   └── dinosaur.css            # Dinosaur theme styles
├── js/
│   ├── app.js                  # App controller: manages screen transitions (home ↔ game)
│   ├── game.js                 # Core game engine: events, fullscreen, mode selection
│   ├── home.js                 # Home screen logic: theme toggles, preference persistence
│   ├── effects.js              # Default visual effects library (11+ effect types)
│   ├── starwars.js             # Star Wars-themed effects library
│   ├── dinosaur.js             # Dinosaur-themed effects library
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
_getEffectEngine() → returns Effects | StarWarsEffects | DinosaurEffects
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

Three interchangeable effect engines share the same interface:

| Engine | File | Activated when |
|--------|------|----------------|
| `Effects` | `js/effects.js` | Default (no theme selected) |
| `StarWarsEffects` | `js/starwars.js` | Star Wars mode is on |
| `DinosaurEffects` | `js/dinosaur.js` | Dinosaur mode is on |

Selection logic in `game.js`:
```javascript
const effectEngine = this.starWarsMode ? StarWarsEffects
                   : this.dinoMode    ? DinosaurEffects
                   : Effects;
```

### State Persistence

User preferences are stored in `localStorage`:

| Key | Type | Purpose |
|-----|------|---------|
| `keyboard-smash-dark` | `"true"/"false"` | Dark mode |
| `keyboard-smash-starwars` | `"true"/"false"` | Star Wars theme active |
| `keyboard-smash-dino` | `"true"/"false"` | Dinosaur theme active |

Only one theme can be active at a time. Enabling one theme disables the other.

### Fullscreen Behavior

- The game uses the Fullscreen API to take over the screen.
- If the user exits fullscreen accidentally, the game automatically re-enters it.
- **Exit key for adults**: `Ctrl+Shift+Escape` safely exits the game.

---

## CSS Conventions

- **CSS Custom Properties (variables)** power all theming: `--bg-primary`, `--text-primary`, `--accent`, etc. Defined in `main.css`.
- **Data attributes** control theme state on the `<body>` or root element: `[data-theme="dark"]`, `[data-starwars="true"]`, `[data-dino="true"]`.
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
- **Theme exclusivity**: When activating one theme, deactivate the other. Enforce this in `home.js`.

---

## Errors & Workarounds

- **Fullscreen exits on mobile**: Some mobile browsers restrict fullscreen. The app handles this gracefully by listening to `fullscreenchange` and attempting to re-enter fullscreen.
- **localStorage unavailable**: In some private browsing modes, `localStorage` may throw. If adding preference persistence, wrap reads/writes in a try/catch.
- **Direct `file://` protocol**: Opening `index.html` directly from the filesystem works for most features, but `localStorage` is sometimes blocked by browsers on `file://` origins. Use a local HTTP server for full functionality.
