/* ===== Space Theme Effects ===== */

const SpaceEffects = {
    layer: null,
    cosmosCreated: false,

    init(layer) {
        this.layer = layer;
    },

    spaceColors: ['#5ce1e6', '#7f5af0', '#ff70a6', '#ffd166', '#80ffdb', '#ffffff'],
    planets: ['🪐', '🌍', '🌎', '🌏', '🌕', '🌑'],
    spaceObjects: ['🚀', '🛸', '☄️', '🌟', '✨'],
    keyEffects: ['planetPop', 'astronautFloat', 'rocketFlight', 'meteorShower'],
    clickEffects: ['planetPop', 'astronautFloat', 'rocketFlight', 'starBurst'],

    onKey(e) {
        if (e.key === ' ') {
            Utils.spacebarLEO(this.layer, 'space');
            return;
        }

        const char = Utils.keyToDisplay(e);
        const pos = Utils.randomPosition();
        this.spaceLetter(char, pos);

        if (e.key === 'r' || e.key === 'R') {
            Utils.robotEmoji(pos, this.layer);
        }

        this[Utils.pick(this.keyEffects)](char, pos);
    },

    onClick(x, y) {
        this[Utils.pick(this.clickEffects)]('', { x, y });
    },

    onMove(x, y) {
        this.starTrail(x, y);
    },

    createCosmos() {
        if (this.cosmosCreated) return;
        this.cosmosCreated = true;

        for (let i = 0; i < 90; i++) {
            const star = document.createElement('div');
            star.className = 'space-bg-element space-star';
            star.style.left = Utils.randomFloat(0, 100) + '%';
            star.style.top = Utils.randomFloat(0, 100) + '%';
            star.style.width = Utils.randomInt(1, 4) + 'px';
            star.style.height = star.style.width;
            star.style.animationDelay = Utils.randomFloat(0, 3) + 's';
            this.layer.appendChild(star);
        }

        for (let i = 0; i < 4; i++) {
            const planet = document.createElement('div');
            planet.className = 'space-bg-element space-distant-planet';
            planet.textContent = Utils.pick(this.planets);
            planet.style.left = Utils.randomFloat(5, 90) + '%';
            planet.style.top = Utils.randomFloat(8, 75) + '%';
            planet.style.fontSize = Utils.randomInt(45, 85) + 'px';
            planet.style.animationDelay = Utils.randomFloat(-8, 0) + 's';
            this.layer.appendChild(planet);
        }
    },

    removeCosmos() {
        if (!this.cosmosCreated) return;
        this.cosmosCreated = false;
        this.layer.querySelectorAll('.space-bg-element').forEach(el => el.remove());
    },

    spaceLetter(char, pos) {
        const color = Utils.pick(this.spaceColors);
        const el = Utils.createEffect('effect-space-key', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            color: color,
            textShadow: `0 0 16px ${color}, 0 0 40px ${color}`,
        }, this.layer, 1400);
        el.textContent = char;
    },

    planetPop(char, pos) {
        const duration = Utils.randomFloat(1.4, 2);
        const el = Utils.createEffect('effect-space-planet', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            '--duration': duration + 's',
            '--spin': Utils.randomInt(-45, 45) + 'deg',
        }, this.layer, duration * 1000);
        el.textContent = Utils.pick(this.planets);
    },

    astronautFloat(char, pos) {
        const duration = Utils.randomFloat(2.2, 3.2);
        const goingRight = Math.random() > 0.5;
        const el = Utils.createEffect('effect-space-astronaut', {
            left: goingRight ? '-100px' : (window.innerWidth + 100) + 'px',
            top: Math.max(60, pos.y) + 'px',
            '--travel-x': goingRight ? (window.innerWidth + 200) + 'px' : -(window.innerWidth + 200) + 'px',
            '--drift-y': Utils.randomInt(-140, 140) + 'px',
            '--direction': goingRight ? '1' : '-1',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '👨‍🚀';
    },

    rocketFlight(char, pos) {
        const duration = Utils.randomFloat(1.5, 2.3);
        const el = Utils.createEffect('effect-space-rocket', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            '--travel-x': Utils.randomInt(-300, 300) + 'px',
            '--travel-y': -(window.innerHeight + 160) + 'px',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '🚀';

        for (let i = 0; i < 8; i++) {
            const particleDuration = Utils.randomFloat(0.5, 0.9);
            Utils.createEffect('effect-space-exhaust', {
                left: pos.x + Utils.randomInt(-12, 12) + 'px',
                top: pos.y + Utils.randomInt(20, 55) + 'px',
                background: Utils.pick(['#ffd166', '#ff7b00', '#ff4d6d']),
                '--tx': Utils.randomInt(-35, 35) + 'px',
                '--ty': Utils.randomInt(35, 95) + 'px',
                '--duration': particleDuration + 's',
                animationDelay: (i * 0.04) + 's',
            }, this.layer, particleDuration * 1000 + i * 40);
        }
    },

    meteorShower() {
        for (let i = 0; i < 8; i++) {
            const duration = Utils.randomFloat(0.8, 1.5);
            const el = Utils.createEffect('effect-space-meteor', {
                left: Utils.randomInt(-100, window.innerWidth) + 'px',
                top: Utils.randomInt(-180, 20) + 'px',
                '--travel-x': Utils.randomInt(180, 420) + 'px',
                '--travel-y': Utils.randomInt(350, 700) + 'px',
                '--duration': duration + 's',
                animationDelay: (i * 0.08) + 's',
            }, this.layer, duration * 1000 + i * 80);
            el.textContent = '☄️';
        }
    },

    starBurst(char, pos) {
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const distance = Utils.randomInt(70, 180);
            const duration = Utils.randomFloat(0.7, 1.2);
            const el = Utils.createEffect('effect-space-burst', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                color: Utils.pick(this.spaceColors),
                '--tx': Math.cos(angle) * distance + 'px',
                '--ty': Math.sin(angle) * distance + 'px',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
            el.textContent = Utils.pick(['★', '✦', '✧']);
        }
    },

    starTrail(x, y) {
        const size = Utils.randomInt(8, 20);
        Utils.createEffect('effect-space-trail', {
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            background: Utils.pick(this.spaceColors),
        }, this.layer, 900);
    },
};
