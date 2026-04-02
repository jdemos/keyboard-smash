/* ===== Dinosaur Theme Effects ===== */

const DinosaurEffects = {
    layer: null,
    jungleCreated: false,

    init(layer) {
        this.layer = layer;
    },

    dinoColors: ['#4caf50', '#8bc34a', '#ff9800', '#795548', '#ff5722', '#cddc39', '#2e7d32'],

    dinos: ['🦕', '🦖', '🐊', '🐉', '🦎'],
    babies: ['🐣', '🐥', '🐢', '🐊'],
    foliage: ['🌿', '🍃', '🌴', '🍀', '☘️', '🌱', '🪴', '🎋', '🌾'],
    fossils: ['🦴', '💀', '🦷'],

    keyEffects: [
        'dinoStomp', 'volcanoEruption', 'dinoCharge',
        'eggHatch', 'fossilDig', 'jungleLeafRain', 'pterodactylFlyby',
        'dinoRoar', 'dinoHerd', 'swampBubble'
    ],

    clickEffects: [
        'meteorStrike', 'fossilDig', 'dinoStomp', 'volcanoEruption',
        'dinoRoar', 'swampBubble'
    ],

    moveEffects: ['footprintTrail'],

    onKey(e) {
        // Spacebar Easter egg: display "LEO"
        if (e.key === ' ') {
            Utils.spacebarLEO(this.layer, 'dino');
            return;
        }

        const char = Utils.keyToDisplay(e);
        const pos = Utils.randomPosition();

        // Always show the dino-styled character
        this.dinoLetter(char, pos);

        // R key Easter egg: always show the robot emoji
        if (e.key === 'r' || e.key === 'R') {
            Utils.robotEmoji(pos, this.layer);
        }

        // Plus a random dino effect
        const effect = Utils.pick(this.keyEffects);
        this[effect](char, pos);
    },

    onClick(x, y) {
        const effect = Utils.pick(this.clickEffects);
        this[effect]('', { x, y });
    },

    onMove(x, y) {
        this.footprintTrail(x, y);
    },

    createJungle() {
        if (this.jungleCreated) return;
        this.jungleCreated = true;

        const plants = ['🌿', '🌴', '🪴', '🌱', '🍃'];
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.className = 'jungle-bg-element';
            el.textContent = Utils.pick(plants);
            el.style.left = Utils.randomFloat(0, 100) + '%';
            el.style.top = Utils.randomFloat(60, 95) + '%';
            el.style.fontSize = Utils.randomInt(40, 100) + 'px';
            el.style.opacity = Utils.randomFloat(0.08, 0.2);
            this.layer.appendChild(el);
        }
    },

    removeJungle() {
        if (!this.jungleCreated) return;
        this.jungleCreated = false;
        this.layer.querySelectorAll('.jungle-bg-element').forEach(el => el.remove());
    },

    // ===== Individual Effects =====

    dinoLetter(char, pos) {
        const color = Utils.pick(this.dinoColors);
        const el = Utils.createEffect('effect-dino-key', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            color: color,
            textShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
            transform: 'translate(-50%, -50%)',
        }, this.layer, 1200);
        el.textContent = char;
    },

    dinoStomp(char, pos) {
        // Screen shake
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.remove('dino-shake');
        void gameScreen.offsetWidth; // force reflow
        gameScreen.classList.add('dino-shake');
        setTimeout(() => gameScreen.classList.remove('dino-shake'), 500);

        // Footprint
        const angle = Utils.randomInt(-30, 30);
        const el = Utils.createEffect('effect-footprint', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            transform: 'translate(-50%, -50%)',
            '--foot-angle': angle + 'deg',
        }, this.layer, 1500);
        el.textContent = '🐾';
    },

    volcanoEruption(char, pos) {
        // Volcano emoji
        const el = Utils.createEffect('effect-volcano', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            transform: 'translate(-50%, -50%)',
        }, this.layer, 2000);
        el.textContent = '🌋';

        // Lava particles
        const lavaColors = ['#ff4500', '#ff6600', '#ff8c00', '#ffd700', '#ff0000', '#cc3300'];
        for (let i = 0; i < 25; i++) {
            const angle = Utils.randomFloat(-Math.PI * 0.8, -Math.PI * 0.2);
            const distance = Utils.randomInt(100, 300);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const size = Utils.randomInt(6, 16);
            const color = Utils.pick(lavaColors);
            const duration = Utils.randomFloat(0.8, 1.8);

            Utils.createEffect('effect-lava-particle', {
                left: pos.x + 'px',
                top: (pos.y - 30) + 'px',
                width: size + 'px',
                height: size + 'px',
                background: `radial-gradient(circle, ${color}, #8b0000)`,
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.3) + 's',
            }, this.layer, duration * 1000 + 300);
        }
    },

    dinoCharge(char, pos) {
        const dino = Utils.pick(this.dinos);
        const y = Utils.randomInt(100, window.innerHeight - 100);
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(1.2, 2.5);

        const el = Utils.createEffect('effect-dino-charge', {
            left: goingRight ? '-120px' : (window.innerWidth + 120) + 'px',
            top: y + 'px',
            '--start-x': '0px',
            '--end-x': goingRight ? (window.innerWidth + 240) + 'px' : -(window.innerWidth + 240) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = dino;
    },

    eggHatch(char, pos) {
        for (let i = 0; i < 3; i++) {
            const offsetX = Utils.randomInt(-80, 80);
            const offsetY = Utils.randomInt(-40, 40);

            const egg = Utils.createEffect('effect-dino-egg', {
                left: (pos.x + offsetX) + 'px',
                top: (pos.y + offsetY) + 'px',
                transform: 'translate(-50%, -50%)',
            }, this.layer, 2000);
            egg.textContent = '🥚';

            // Baby dino appears after egg animation
            setTimeout(() => {
                const baby = Utils.createEffect('effect-dino-egg', {
                    left: (pos.x + offsetX) + 'px',
                    top: (pos.y + offsetY) + 'px',
                    transform: 'translate(-50%, -50%)',
                }, this.layer, 1500);
                baby.textContent = Utils.pick(this.babies);
            }, 1200);
        }
    },

    meteorStrike(char, pos) {
        for (let i = 0; i < 5; i++) {
            const startTx = Utils.randomInt(100, 400);
            const startTy = Utils.randomInt(-400, -150);
            const duration = Utils.randomFloat(0.5, 1.2);

            const meteor = Utils.createEffect('effect-meteor', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                '--start-tx': startTx + 'px',
                '--start-ty': startTy + 'px',
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.3) + 's',
            }, this.layer, duration * 1000 + 300);
            meteor.textContent = '☄️';
        }

        // Impact flash
        setTimeout(() => {
            Utils.createEffect('effect-flash', {
                background: 'rgba(255, 100, 0, 0.2)',
            }, this.layer, 400);
        }, 600);
    },

    fossilDig(char, pos) {
        for (let i = 0; i < 8; i++) {
            const angle = Utils.randomFloat(0, Math.PI * 2);
            const distance = Utils.randomInt(60, 180);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rotation = Utils.randomInt(0, 720);
            const duration = Utils.randomFloat(0.8, 1.5);

            const fossil = Utils.createEffect('effect-fossil', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--rot': rotation + 'deg',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
            fossil.textContent = Utils.pick(this.fossils);
        }
    },

    jungleLeafRain() {
        for (let i = 0; i < 12; i++) {
            const x = Utils.randomInt(0, window.innerWidth);
            const leaf = Utils.pick(this.foliage);
            const duration = Utils.randomFloat(2, 4);
            const sway = Utils.randomInt(-80, 80);
            const size = Utils.randomInt(30, 60);

            const el = Utils.createEffect('effect-leaf', {
                left: x + 'px',
                top: '-80px',
                fontSize: size + 'px',
                '--duration': duration + 's',
                '--sway': sway + 'px',
                animationDelay: Utils.randomFloat(0, 0.5) + 's',
            }, this.layer, duration * 1000 + 500);
            el.textContent = leaf;
        }
    },

    pterodactylFlyby() {
        const y = Utils.randomInt(30, window.innerHeight * 0.4);
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(2, 4);
        const drift = Utils.randomInt(-80, 80);

        const el = Utils.createEffect('effect-pterodactyl', {
            left: goingRight ? '-80px' : (window.innerWidth + 80) + 'px',
            top: y + 'px',
            '--start-tx': '0px',
            '--end-tx': goingRight ? (window.innerWidth + 160) + 'px' : -(window.innerWidth + 160) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--drift': drift + 'px',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '🦅';
    },

    footprintTrail(x, y) {
        const angle = Utils.randomInt(-20, 20);
        const el = Utils.createEffect('effect-paw-trail', {
            left: x + 'px',
            top: y + 'px',
            transform: 'translate(-50%, -50%)',
            '--paw-angle': angle + 'deg',
        }, this.layer, 1200);
        el.textContent = '🐾';
    },

    dinoRoar(char, pos) {
        // Big dinosaur roars with expanding sound-wave rings
        const roarer = Utils.pick(['🦖', '🦕', '🐉']);
        const el = Utils.createEffect('effect-dino-roar', {
            left: pos.x + 'px',
            top: pos.y + 'px',
        }, this.layer, 2000);
        el.textContent = roarer;

        for (let i = 0; i < 4; i++) {
            const wave = Utils.createEffect('effect-roar-wave', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                animationDelay: (i * 0.18) + 's',
            }, this.layer, 1800);
            wave.style.borderColor = Utils.pick(['rgba(255,150,0,0.7)', 'rgba(255,80,0,0.6)', 'rgba(139,90,43,0.6)']);
        }
    },

    dinoHerd(char, pos) {
        // A stampede of dinos charges across the screen
        const count = Utils.randomInt(3, 6);
        const goingRight = Math.random() > 0.5;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const dino = Utils.pick(this.dinos);
                const y = Utils.randomInt(
                    Math.floor(window.innerHeight * 0.25),
                    Math.floor(window.innerHeight * 0.80)
                );
                const duration = Utils.randomFloat(1.2, 2.2);

                const el = Utils.createEffect('effect-dino-charge', {
                    left: goingRight ? '-120px' : (window.innerWidth + 120) + 'px',
                    top: y + 'px',
                    '--start-x': '0px',
                    '--end-x': goingRight
                        ? (window.innerWidth + 240) + 'px'
                        : -(window.innerWidth + 240) + 'px',
                    '--dir': goingRight ? '1' : '-1',
                    '--duration': duration + 's',
                }, this.layer, duration * 1000);
                el.textContent = dino;
            }, i * 220);
        }
    },

    swampBubble() {
        // Prehistoric bubbles rise from the bottom, some carrying creatures
        const swampCreatures = ['🐊', '🦎', '🐸', '🦕', '🐢', '🐉'];
        for (let i = 0; i < 8; i++) {
            const x = Utils.randomInt(40, window.innerWidth - 40);
            const size = Utils.randomInt(24, 56);
            const duration = Utils.randomFloat(1.8, 3.8);
            const useCreature = Math.random() > 0.45;

            const el = Utils.createEffect('effect-swamp-bubble', {
                left: x + 'px',
                top: window.innerHeight + 'px',
                width: size + 'px',
                height: size + 'px',
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.9) + 's',
            }, this.layer, (duration + 0.9) * 1000 + 200);

            if (useCreature) {
                el.style.fontSize = Math.max(14, Math.floor(size * 0.75)) + 'px';
                el.textContent = Utils.pick(swampCreatures);
            }
        }
    },

};
