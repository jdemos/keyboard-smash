/* ===== Utility Functions ===== */

const Utils = {
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomColor() {
        const colors = [
            '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff',
            '#5f27cd', '#01a3a4', '#f368e0', '#ff6348', '#7bed9f',
            '#70a1ff', '#ffa502', '#ff4757', '#2ed573', '#1e90ff',
            '#ff6b81', '#7158e2', '#3ae374', '#ffaf40', '#17c0eb'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    randomBrightColor() {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 90%, 60%)`;
    },

    randomPosition() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };
    },

    // Create a DOM element for an effect and auto-remove it after duration
    createEffect(className, styles, parent, duration = 2000) {
        const el = document.createElement('div');
        el.className = className;
        Object.assign(el.style, styles);
        parent.appendChild(el);
        setTimeout(() => el.remove(), duration);
        return el;
    },

    // Get display character for a key event
    keyToDisplay(e) {
        if (e.key.length === 1) return e.key.toUpperCase();
        const special = {
            'Space': '␣', 'Enter': '⏎', 'Backspace': '⌫', 'Tab': '⇥',
            'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
            'Shift': '⇧', 'Control': '⌃', 'Alt': '⌥', 'Meta': '⌘',
            'CapsLock': '⇪', 'Delete': '⌦', 'Escape': '⎋',
            'F1': 'F1', 'F2': 'F2', 'F3': 'F3', 'F4': 'F4',
            'F5': 'F5', 'F6': 'F6', 'F7': 'F7', 'F8': 'F8',
            'F9': 'F9', 'F10': 'F10', 'F11': 'F11', 'F12': 'F12',
        };
        return special[e.key] || e.key;
    },

    // Pick a random item from an array
    pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // SVG star shape
    starSVG(size, color) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/>
        </svg>`;
    },

    // SVG triangle
    triangleSVG(size, color) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <polygon points="12,2 22,22 2,22"/>
        </svg>`;
    },

    // SVG heart
    heartSVG(size, color) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`;
    },

    emojis: ['🌟', '🎉', '🦄', '🌈', '🎈', '🍕', '🚀', '🎸', '🦋', '🌻', '🐱', '🐶', '🎪', '🍭', '🧸', '🎠', '🌊', '⭐', '💫', '🔥'],

    flowers: ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼', '🏵️'],

    // Easter egg: display "LEO" in big animated letters
    // theme: 'default' | 'starwars' | 'dino' | 'transport'
    spacebarLEO(layer, theme = 'default') {
        const letters = ['L', 'E', 'O'];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const xPositions = [vw * 0.2, vw * 0.5, vw * 0.8];
        const saberColors = ['#4fc3f7', '#ff1744', '#76ff03', '#7c4dff', '#ffff00', '#ff9100'];
        const dinoColors = ['#4caf50', '#ff9800', '#ff5722'];
        const transportColors = ['#ff6b35', '#004e89', '#1a936f'];
        const className = theme === 'starwars'
            ? 'effect-leo-letter effect-leo-letter-sw'
            : 'effect-leo-letter';

        letters.forEach((letter, i) => {
            const color = theme === 'starwars'   ? Utils.pick(saberColors)
                        : theme === 'dino'       ? dinoColors[i]
                        : theme === 'transport'  ? transportColors[i % transportColors.length]
                        : Utils.randomBrightColor();

            setTimeout(() => {
                const styles = {
                    left: xPositions[i] + 'px',
                    top: (vh / 2) + 'px',
                    color: color,
                };
                if (theme === 'starwars') {
                    styles['--saber-color'] = color;
                } else if (theme === 'dino') {
                    styles.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
                } else if (theme === 'transport') {
                    styles.textShadow = `0 4px 12px rgba(0,0,0,0.4), 0 0 24px ${color}`;
                }
                const el = Utils.createEffect(className, styles, layer, 2500);
                el.textContent = letter;
            }, i * 200);
        });
    },

    // Easter egg: display the robot emoji at a given position
    robotEmoji(pos, layer) {
        const el = Utils.createEffect('effect-robot', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            transform: 'translate(-50%, -50%)',
        }, layer, 2000);
        el.textContent = '🤖';
    },
};
