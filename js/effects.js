/* ===== Default Visual Effects Library ===== */

const Effects = {
    layer: null,

    init(layer) {
        this.layer = layer;
    },

    // All available default effects
    keyEffects: [
        'letterBurst', 'colorExplosion', 'confettiCannon', 'fireworks',
        'spiralPattern', 'lightningBolt', 'screenFlash', 'spinningStars',
        'shapeRain', 'emojiRain', 'growingFlower'
    ],

    clickEffects: [
        'colorExplosion', 'rippleWave', 'confettiCannon', 'growingFlower',
        'spiralPattern', 'bubblePop'
    ],

    moveEffects: ['rainbowTrail'],

    // Dispatch a random key effect
    onKey(e) {
        // Spacebar Easter egg: display "LEO" in big animated letters
        if (e.key === ' ') {
            Utils.spacebarLEO(this.layer);
            return;
        }

        const char = Utils.keyToDisplay(e);
        const pos = Utils.randomPosition();

        // Always show the character
        this.letterBurst(char, pos);

        // R key Easter egg: always show the robot emoji
        if (e.key === 'r' || e.key === 'R') {
            Utils.robotEmoji(pos, this.layer);
        }

        // Plus a random additional effect
        const effect = Utils.pick(this.keyEffects);
        if (effect !== 'letterBurst') {
            this[effect](char, pos);
        }
    },

    // Dispatch a click effect
    onClick(x, y) {
        const effect = Utils.pick(this.clickEffects);
        this[effect]('', { x, y });
    },

    // Dispatch a move effect
    onMove(x, y) {
        this.rainbowTrail(x, y);
    },

    // ===== Individual Effects =====

    letterBurst(char, pos) {
        const color = Utils.randomBrightColor();
        Utils.createEffect('effect-key', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            color: color,
            transform: 'translate(-50%, -50%)',
        }, this.layer, 1200);
        const el = this.layer.lastChild;
        el.textContent = char;
    },

    colorExplosion(char, pos) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = Utils.randomInt(80, 200);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const size = Utils.randomInt(6, 14);
            const color = Utils.randomBrightColor();
            const duration = Utils.randomFloat(0.6, 1.2);

            Utils.createEffect('effect-particle', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                width: size + 'px',
                height: size + 'px',
                background: color,
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
        }
    },

    shapeRain() {
        const shapes = ['●', '■', '▲', '◆', '★', '♥'];
        for (let i = 0; i < 15; i++) {
            const x = Utils.randomInt(0, window.innerWidth);
            const duration = Utils.randomFloat(1.5, 3);
            const size = Utils.randomInt(20, 50);
            const color = Utils.randomBrightColor();

            const el = Utils.createEffect('effect-shape', {
                left: x + 'px',
                top: '-60px',
                fontSize: size + 'px',
                color: color,
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
            el.textContent = Utils.pick(shapes);
        }
    },

    rippleWave(char, pos) {
        const colors = [Utils.randomBrightColor(), Utils.randomBrightColor(), Utils.randomBrightColor()];
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                Utils.createEffect('effect-ripple', {
                    left: pos.x + 'px',
                    top: pos.y + 'px',
                    color: colors[i],
                    borderWidth: (4 - i) + 'px',
                }, this.layer, 1000);
            }, i * 150);
        }
    },

    confettiCannon(char, pos) {
        const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#2ed573', '#ff6348'];
        for (let i = 0; i < 40; i++) {
            const tx = Utils.randomInt(-300, 300);
            const ty = Utils.randomInt(-400, 100);
            const color = Utils.pick(confettiColors);
            const duration = Utils.randomFloat(1, 2);
            const rotation = Utils.randomInt(0, 360);
            const w = Utils.randomInt(6, 14);
            const h = Utils.randomInt(4, 10);

            Utils.createEffect('effect-confetti', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                width: w + 'px',
                height: h + 'px',
                background: color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${rotation}deg)`,
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
        }
    },

    fireworks() {
        const x = Utils.randomInt(100, window.innerWidth - 100);
        const burstY = Utils.randomInt(100, window.innerHeight / 2);

        // Rising trail
        Utils.createEffect('effect-firework-trail', {
            left: x + 'px',
            top: window.innerHeight + 'px',
            '--rise': -(window.innerHeight - burstY) + 'px',
        }, this.layer, 600);

        // Burst after rise
        setTimeout(() => {
            this.colorExplosion('', { x, y: burstY });
        }, 500);
    },

    bubblePop(char, pos) {
        for (let i = 0; i < 8; i++) {
            const x = pos.x + Utils.randomInt(-100, 100);
            const size = Utils.randomInt(20, 60);
            const color = Utils.randomBrightColor();
            const duration = Utils.randomFloat(2, 4);

            Utils.createEffect('effect-bubble', {
                left: x + 'px',
                top: pos.y + 'px',
                width: size + 'px',
                height: size + 'px',
                borderColor: color,
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
        }
    },

    spiralPattern(char, pos) {
        const spiralColor = Utils.randomBrightColor();
        const count = 30;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 6;
            const radius = i * 8;
            const tx = Math.cos(angle) * radius;
            const ty = Math.sin(angle) * radius;
            const duration = Utils.randomFloat(1, 2);

            Utils.createEffect('effect-spiral-dot', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                width: '8px',
                height: '8px',
                background: spiralColor,
                borderRadius: '50%',
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--duration': duration + 's',
                animationDelay: (i * 0.03) + 's',
            }, this.layer, duration * 1000 + count * 30);
        }
    },

    lightningBolt() {
        const startX = Utils.randomInt(0, window.innerWidth);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'effect-lightning');
        svg.style.position = 'absolute';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';

        let path = `M ${startX} 0`;
        let x = startX;
        let y = 0;
        const segments = 15;
        const segHeight = window.innerHeight / segments;

        for (let i = 0; i < segments; i++) {
            x += Utils.randomInt(-80, 80);
            y += segHeight;
            path += ` L ${x} ${y}`;
        }

        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', path);
        pathEl.setAttribute('stroke', '#fff');
        pathEl.setAttribute('stroke-width', '3');
        pathEl.setAttribute('fill', 'none');
        pathEl.setAttribute('filter', 'drop-shadow(0 0 10px #7df)');
        svg.appendChild(pathEl);

        // Glow path
        const glowPath = pathEl.cloneNode();
        glowPath.setAttribute('stroke', '#7df');
        glowPath.setAttribute('stroke-width', '8');
        glowPath.setAttribute('opacity', '0.4');
        svg.insertBefore(glowPath, pathEl);

        this.layer.appendChild(svg);
        setTimeout(() => svg.remove(), 500);
    },

    emojiRain() {
        for (let i = 0; i < 12; i++) {
            const x = Utils.randomInt(0, window.innerWidth);
            const emoji = Utils.pick(Utils.emojis);
            const duration = Utils.randomFloat(1.5, 3.5);
            const size = Utils.randomInt(30, 70);

            const el = Utils.createEffect('effect-emoji', {
                left: x + 'px',
                top: '-80px',
                fontSize: size + 'px',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
            el.textContent = emoji;
        }
    },

    screenFlash() {
        const color = Utils.randomBrightColor();
        Utils.createEffect('effect-flash', {
            background: color,
        }, this.layer, 400);
    },

    growingFlower(char, pos) {
        const flower = Utils.pick(Utils.flowers);
        const el = Utils.createEffect('effect-flower', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            transform: 'translate(-50%, -50%)',
        }, this.layer, 2000);
        el.textContent = flower;
    },

    spinningStars() {
        for (let i = 0; i < 8; i++) {
            const pos = Utils.randomPosition();
            const size = Utils.randomInt(30, 60);
            const color = Utils.randomBrightColor();
            const duration = Utils.randomFloat(1, 2);

            const el = Utils.createEffect('effect-star', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                transform: 'translate(-50%, -50%)',
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
            el.innerHTML = Utils.starSVG(size, color);
        }
    },

    rainbowTrail(x, y) {
        const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0077ff', '#8800ff'];
        const color = colors[Math.floor(Date.now() / 50) % colors.length];
        const size = Utils.randomInt(8, 16);

        Utils.createEffect('effect-rainbow-dot', {
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            background: color,
            transform: 'translate(-50%, -50%)',
        }, this.layer, 1000);
    },

    bouncingBalls(char, pos) {
        for (let i = 0; i < 5; i++) {
            const size = Utils.randomInt(20, 50);
            const color = Utils.randomBrightColor();
            const x = pos.x + Utils.randomInt(-100, 100);
            const duration = Utils.randomFloat(2, 4);

            Utils.createEffect('effect-ball', {
                left: x + 'px',
                top: pos.y + 'px',
                width: size + 'px',
                height: size + 'px',
                background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
                '--duration': duration + 's',
            }, this.layer, duration * 1000);
        }
    },
};
