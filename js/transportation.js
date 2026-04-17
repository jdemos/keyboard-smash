/* ===== Transportation Theme Effects ===== */

const TransportationEffects = {
    layer: null,
    roadCreated: false,

    init(layer) {
        this.layer = layer;
        this._boundOnResize = this._onResize.bind(this);
    },

    transportColors: ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a936f', '#c62a47', '#f4d35e', '#ee6c4d'],

    vehicles: ['🚗', '🚕', '🚙', '🚌', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻'],
    bigVehicles: ['🚛', '🚚', '🚜', '🚌'],
    trains: ['🚂', '🚃', '🚄', '🚅', '🚆', '🚇'],
    airVehicles: ['✈️', '🚁', '🛩️', '🛸'],
    waterVehicles: ['⛵', '🚢', '🛥️', '⛴️'],
    roadSigns: ['🚦', '🚧', '🛑', '⚠️', '🚏'],

    keyEffects: [
        'vehicleDrive', 'trainCharge', 'rocketLaunch', 'trafficLightPop',
        'carHonk', 'speedLines', 'helicopterFlyby', 'vehicleScatter',
        'airplaneFlyby', 'vehicleHerd'
    ],

    clickEffects: [
        'carHonk', 'vehicleScatter', 'trafficLightPop', 'vehicleDrive', 'speedLines'
    ],

    moveEffects: ['exhaustTrail'],

    onKey(e) {
        // Spacebar Easter egg: display "LEO"
        if (e.key === ' ') {
            Utils.spacebarLEO(this.layer, 'transport');
            return;
        }

        const char = Utils.keyToDisplay(e);
        const pos = Utils.randomPosition();

        // Always show the transport-styled character
        this.transportLetter(char, pos);

        // R key Easter egg: always show the robot emoji
        if (e.key === 'r' || e.key === 'R') {
            Utils.robotEmoji(pos, this.layer);
        }

        // Plus a random transport effect
        const effect = Utils.pick(this.keyEffects);
        this[effect](char, pos);
    },

    onClick(x, y) {
        const effect = Utils.pick(this.clickEffects);
        this[effect]('', { x, y });
    },

    onMove(x, y) {
        this.exhaustTrail(x, y);
    },

    createRoad() {
        if (this.roadCreated) return;
        this.roadCreated = true;
        this._buildRoadElements();
        window.addEventListener('resize', this._boundOnResize);
    },

    removeRoad() {
        if (!this.roadCreated) return;
        this.roadCreated = false;
        this.layer.querySelectorAll('.road-bg-element').forEach(el => el.remove());
        window.removeEventListener('resize', this._boundOnResize);
    },

    _onResize() {
        if (!this.roadCreated) return;
        this._buildRoadElements();
    },

    _buildRoadElements() {
        this.layer.querySelectorAll('.road-bg-element').forEach(el => el.remove());

        this._onResize = () => {
            if (this.roadCreated) {
                this.layer.querySelectorAll('.road-bg-element').forEach(el => el.remove());
                this._buildRoad();
            }
        };
        window.addEventListener('resize', this._onResize);
    },

    _buildRoad() {
        // Dashed center-line marks
        const dashCount = Math.ceil(window.innerWidth / 120) + 1;
        const roadY = window.innerHeight * 0.72;

        for (let i = 0; i < dashCount; i++) {
            const dash = document.createElement('div');
            dash.className = 'road-bg-element';
            dash.style.left = (i * 120) + 'px';
            dash.style.top = roadY + 'px';
            dash.style.width = '70px';
            dash.style.height = '8px';
            dash.style.background = '#fff';
            dash.style.borderRadius = '4px';
            dash.style.opacity = '0.55';
            this.layer.appendChild(dash);
        }

        // Road signs scattered on the road
        const signs = ['🚦', '🚏', '🚧'];
        for (let i = 0; i < 4; i++) {
            const el = document.createElement('div');
            el.className = 'road-bg-element';
            el.textContent = Utils.pick(signs);
            el.style.left = Utils.randomFloat(5, 90) + '%';
            el.style.top = Utils.randomFloat(62, 78) + '%';
            el.style.fontSize = Utils.randomInt(50, 80) + 'px';
            el.style.opacity = '0.12';
            this.layer.appendChild(el);
        }
    },

    // ===== Individual Effects =====

    transportLetter(char, pos) {
        const color = Utils.pick(this.transportColors);
        const el = Utils.createEffect('effect-transport-key', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            color: color,
            textShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 20px ${color}`,
        }, this.layer, 1200);
        el.textContent = char;
    },

    vehicleDrive(char, pos) {
        const vehicle = Utils.pick(this.vehicles);
        const y = Utils.randomInt(Math.floor(window.innerHeight * 0.55), Math.floor(window.innerHeight * 0.85));
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(1.4, 2.5);

        const el = Utils.createEffect('effect-vehicle-drive', {
            left: goingRight ? '-120px' : (window.innerWidth + 120) + 'px',
            top: y + 'px',
            '--start-x': '0px',
            '--end-x': goingRight ? (window.innerWidth + 240) + 'px' : -(window.innerWidth + 240) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = vehicle;
    },

    trainCharge(char, pos) {
        const train = Utils.pick(this.trains);
        const y = Utils.randomInt(Math.floor(window.innerHeight * 0.5), Math.floor(window.innerHeight * 0.8));
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(1.8, 3);

        // Screen rumble
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.remove('transport-rumble');
        void gameScreen.offsetWidth;
        gameScreen.classList.add('transport-rumble');
        setTimeout(() => gameScreen.classList.remove('transport-rumble'), 400);

        const el = Utils.createEffect('effect-train-ride', {
            left: goingRight ? '-160px' : (window.innerWidth + 160) + 'px',
            top: y + 'px',
            '--start-x': '0px',
            '--end-x': goingRight ? (window.innerWidth + 320) + 'px' : -(window.innerWidth + 320) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = train;
    },

    carHonk(char, pos) {
        // Vehicle emoji at tap position
        const vehicle = Utils.pick(this.vehicles);
        const vEl = Utils.createEffect('effect-traffic-light', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            fontSize: '60px',
        }, this.layer, 1500);
        vEl.textContent = vehicle;

        // Expanding honk rings
        for (let i = 0; i < 4; i++) {
            const wave = Utils.createEffect('effect-honk-wave', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                animationDelay: (i * 0.15) + 's',
            }, this.layer, 900 + i * 150);
            wave.style.borderColor = Utils.pick(['rgba(255,200,0,0.7)', 'rgba(255,120,0,0.6)', 'rgba(255,60,60,0.5)']);
        }
    },

    trafficLightPop(char, pos) {
        const light = Utils.createEffect('effect-traffic-light', {
            left: pos.x + 'px',
            top: pos.y + 'px',
        }, this.layer, 1500);
        light.textContent = '🚦';

        // A few cars stop around it
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const car = Utils.createEffect('effect-traffic-light', {
                    left: (pos.x + Utils.randomInt(-120, 120)) + 'px',
                    top: (pos.y + Utils.randomInt(60, 120)) + 'px',
                    fontSize: '45px',
                }, this.layer, 1000);
                car.textContent = Utils.pick(this.vehicles);
            }, i * 120);
        }
    },

    rocketLaunch(char, pos) {
        const duration = Utils.randomFloat(1.5, 2.5);

        const el = Utils.createEffect('effect-rocket-launch', {
            left: pos.x + 'px',
            top: pos.y + 'px',
            '--fly-y': -(window.innerHeight + 100) + 'px',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '🚀';

        // Exhaust particles trail
        for (let i = 0; i < 18; i++) {
            setTimeout(() => {
                const size = Utils.randomInt(8, 22);
                const tx = Utils.randomInt(-40, 40);
                const ty = Utils.randomInt(30, 90);
                const pDuration = Utils.randomFloat(0.6, 1.2);
                const gray = Utils.randomInt(140, 210);

                Utils.createEffect('effect-exhaust', {
                    left: pos.x + 'px',
                    top: pos.y + 'px',
                    width: size + 'px',
                    height: size + 'px',
                    background: `radial-gradient(circle, rgba(${gray},${gray},${gray},0.7), rgba(80,80,80,0))`,
                    '--tx': tx + 'px',
                    '--ty': ty + 'px',
                    '--duration': pDuration + 's',
                }, this.layer, pDuration * 1000);
            }, i * 80);
        }
    },

    speedLines(char, pos) {
        const lineColor = Utils.pick(this.transportColors);
        const count = 10;

        for (let i = 0; i < count; i++) {
            const angle = Utils.randomFloat(-20, 20);
            const length = Utils.randomInt(80, 220);
            const duration = Utils.randomFloat(0.3, 0.6);

            Utils.createEffect('effect-speed-line', {
                left: pos.x + 'px',
                top: (pos.y + Utils.randomInt(-50, 50)) + 'px',
                width: length + 'px',
                background: lineColor,
                opacity: Utils.randomFloat(0.6, 1),
                '--angle': angle + 'deg',
                '--tx': (window.innerWidth * 0.6) + 'px',
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.1) + 's',
            }, this.layer, duration * 1000 + 100);
        }
    },

    helicopterFlyby() {
        const y = Utils.randomInt(30, Math.floor(window.innerHeight * 0.5));
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(2.5, 4);
        const drift = Utils.randomInt(-60, 60);

        const el = Utils.createEffect('effect-helicopter', {
            left: goingRight ? '-80px' : (window.innerWidth + 80) + 'px',
            top: y + 'px',
            '--start-tx': '0px',
            '--end-tx': goingRight ? (window.innerWidth + 160) + 'px' : -(window.innerWidth + 160) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--drift': drift + 'px',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '🚁';
    },

    airplaneFlyby() {
        const y = Utils.randomInt(20, Math.floor(window.innerHeight * 0.4));
        const goingRight = Math.random() > 0.5;
        const duration = Utils.randomFloat(2, 3.5);
        const drift = Utils.randomInt(-40, 40);
        const tilt = goingRight ? Utils.randomInt(-8, -2) : Utils.randomInt(2, 8);

        const el = Utils.createEffect('effect-airplane', {
            left: goingRight ? '-100px' : (window.innerWidth + 100) + 'px',
            top: y + 'px',
            '--start-tx': '0px',
            '--end-tx': goingRight ? (window.innerWidth + 200) + 'px' : -(window.innerWidth + 200) + 'px',
            '--dir': goingRight ? '1' : '-1',
            '--drift': drift + 'px',
            '--tilt': tilt + 'deg',
            '--duration': duration + 's',
        }, this.layer, duration * 1000);
        el.textContent = '✈️';
    },

    vehicleScatter(char, pos) {
        const count = Utils.randomInt(6, 10);

        for (let i = 0; i < count; i++) {
            const angle = Utils.randomFloat(0, Math.PI * 2);
            const distance = Utils.randomInt(80, 220);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rot = Utils.randomInt(-360, 360);
            const duration = Utils.randomFloat(0.8, 1.5);

            const el = Utils.createEffect('effect-vehicle-particle', {
                left: pos.x + 'px',
                top: pos.y + 'px',
                '--tx': tx + 'px',
                '--ty': ty + 'px',
                '--rot': rot + 'deg',
                '--duration': duration + 's',
                animationDelay: Utils.randomFloat(0, 0.15) + 's',
            }, this.layer, duration * 1000 + 150);
            el.textContent = Utils.pick(this.vehicles);
        }
    },

    vehicleHerd(char, pos) {
        // A convoy of mixed vehicles across the screen
        const count = Utils.randomInt(4, 7);
        const goingRight = Math.random() > 0.5;
        const allVehicles = [...this.vehicles, ...this.bigVehicles];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const vehicle = Utils.pick(allVehicles);
                const y = Utils.randomInt(
                    Math.floor(window.innerHeight * 0.50),
                    Math.floor(window.innerHeight * 0.85)
                );
                const duration = Utils.randomFloat(1.4, 2.4);

                const el = Utils.createEffect('effect-vehicle-drive', {
                    left: goingRight ? '-120px' : (window.innerWidth + 120) + 'px',
                    top: y + 'px',
                    '--start-x': '0px',
                    '--end-x': goingRight
                        ? (window.innerWidth + 240) + 'px'
                        : -(window.innerWidth + 240) + 'px',
                    '--dir': goingRight ? '1' : '-1',
                    '--duration': duration + 's',
                }, this.layer, duration * 1000);
                el.textContent = vehicle;
            }, i * 250);
        }
    },

    exhaustTrail(x, y) {
        const size = Utils.randomInt(10, 22);
        Utils.createEffect('effect-exhaust-trail', {
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
        }, this.layer, 900);
    },
};
