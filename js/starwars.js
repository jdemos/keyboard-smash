/* ===== Star Wars Theme Effects ===== */

const StarWarsEffects = {
    layer: null,
    starfieldCreated: false,

    init(layer) {
        this.layer = layer;
    },

    saberColors: ['#4fc3f7', '#ff1744', '#76ff03', '#7c4dff', '#ffff00', '#ff9100'],

    keyEffects: [
        'lightsaberSlash', 'hyperspaceJump', 'blasterBolts',
        'characterSilhouette', 'deathStarBeam', 'forcePush'
    ],

    clickEffects: [
        'forcePush', 'blasterBolts', 'lightsaberSlash'
    ],

    moveEffects: ['blasterTrail'],

    characters: ['⚔️', '🤖', '👽', '🛸', '💀', '🌑', '👾', '🧙'],

    ships: ['🚀', '✈️', '🛸', '🛩️'],

    // Dispatch a random key effect
    onKey(e) {
        // Spacebar Easter egg: display "LEO" in big glowing letters
        if (e.key === ' ') {
            Utils.spacebarLEO(this.layer, 'starwars');
            return;
        }

        const char = Utils.keyToDisplay(e);
        const pos = Utils.randomPosition();

        // Always show the glowing character
        this.glowingLetter(char, pos);

        // R key Easter egg: always show the robot emoji
        if (e.key === 'r' || e.key === 'R') {
            Utils.robotEmoji(pos, this.layer);
        }

        // Plus a random Star Wars effect
        const effect = Utils.pick(this.keyEffects);
        this[effect](char, pos);
    },

    onClick(x, y) {
        const effect = Utils.pick(this.clickEffects);
        this[effect]('', { x, y });
    },

    onMove(x, y) {
        this.blasterTrail(x, y);
    },

    // Create starfield background if not already done
    createStarfield() {
        if (this.starfieldCreated) return;
        this.starfieldCreated = true;

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Utils.randomFloat(1, 3);
            const duration = Utils.randomFloat(2, 5);
            const opacity = Utils.randomFloat(0.3, 0.8);

            const star = document.createElement('div');
            star.className = 'starfield-star';
            star.style.left = x + '%';
            star.style.top = y + '%';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.setProperty('--duration', duration + 's');
            star.style.setProperty('--base-opacity', opacity);
            star.style.animationDelay = Utils.randomFloat(0, 3) + 's';
            this.layer.appendChild(star);
        }
    },

    removeStarfield() {
        if (!this.starfieldCreated) return;
        this.starfieldCreated = false;
        this.layer.querySelectorAll('.starfield-star').forEach(s => s.remove());
    },

    // ===== Individual Effects =====

    glowingLetter(char, pos) {
        const color = Utils.pick(this.saberColors);
        const el = Utils.createEffect('effect-sw-key', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            color: color,
            '--saber-color': color,
            transform: 'translate(-50%, -50%)',
        }, this.layer, 1200);
        el.textContent = char;
    },

    lightsaberSlash(char, pos) {
        const color = Utils.pick(this.saberColors);
        const angle = Utils.randomInt(-60, 60);
        const height = Utils.randomInt(200, 400);

        Utils.createEffect('effect-saber', {
            left: pos.x + 'px',
            top: (pos.y - height / 2) + 'px',
            height: height + 'px',
            background: color,
            '--saber-color': color,
            '--saber-angle': angle + 'deg',
            transformOrigin: 'center center',
        }, this.layer, 600);
    },

    hyperspaceJump() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const lineCount = 80;

        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            const startDist = Utils.randomInt(20, 100);
            const x = cx + Math.cos(angle) * startDist;
            const y = cy + Math.sin(angle) * startDist;
            const duration = Utils.randomFloat(0.4, 1);
            const angleDeg = (angle * 180 / Math.PI);

            Utils.createEffect('effect-hyperspace-line', {
                left: x + 'px',
                top: y + 'px',
                height: '2px',
                transform: `rotate(${angleDeg}deg)`,
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.2) + 's',
            }, this.layer, duration * 1000 + 200);
        }
    },

    shipFlyby() {
        const ship = Utils.pick(this.ships);
        const y = Utils.randomInt(50, window.innerHeight - 50);
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(1, 2);

        const el = Utils.createEffect('effect-ship', {
            left: goingRight ? '-80px' : (window.innerWidth + 80) + 'px',
            top: y + 'px',
            '--start-x': '0px',
            '--end-x': goingRight ? (window.innerWidth + 160) + 'px' : -(window.innerWidth + 160) + 'px',
            '--ship-angle': goingRight ? '0deg' : '180deg',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = ship;
    },

    forcePush(char, pos) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                Utils.createEffect('effect-force-ring', {
                    left: pos.x + 'px',
                    top: pos.y + 'px',
                }, this.layer, 800);
            }, i * 100);
        }
    },

    deathStarBeam() {
        const y = Utils.randomInt(50, window.innerHeight - 50);
        Utils.createEffect('effect-deathstar-beam', {
            left: '0',
            top: y + 'px',
        }, this.layer, 800);

        // Green flash
        Utils.createEffect('effect-flash', {
            background: 'rgba(0, 255, 0, 0.15)',
        }, this.layer, 300);
    },

    characterSilhouette(char, pos) {
        const character = Utils.pick(this.characters);
        const el = Utils.createEffect('effect-character', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            transform: 'translate(-50%, -50%)',
        }, this.layer, 2000);
        el.textContent = character;
    },

    blasterBolts(char, pos) {
        const boltColors = ['#ff1744', '#76ff03', '#4fc3f7'];
        for (let i = 0; i < 6; i++) {
            const angle = Utils.randomFloat(0, Math.PI * 2);
            const distance = Utils.randomInt(200, 600);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const color = Utils.pick(boltColors);
            const duration = Utils.randomFloat(0.3, 0.6);
            const angleDeg = angle * 180 / Math.PI;

            Utils.createEffect('effect-blaster', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                background: color,
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
                transform: `rotate(${angleDeg}deg)`,
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
        }
    },

    blasterTrail(x, y) {
        const colors = ['#ff1744', '#76ff03', '#4fc3f7'];
        const color = Utils.pick(colors);
        const size = Utils.randomInt(3, 6);

        Utils.createEffect('effect-rainbow-dot', {
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            background: color,
            boxShadow: `0 0 6px ${color}`,
            transform: 'translate(-50%, -50%)',
        }, this.layer, 800);
    },
};
