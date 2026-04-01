/* ===== Web Audio API Sound Engine ===== */

const Audio = {
    ctx: null,
    muted: false,

    // Call inside a user gesture to create/resume AudioContext (browser autoplay policy)
    init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            // Web Audio API not supported — degrade silently
        }
    },

    _isReady() {
        return !!(this.ctx && !this.muted);
    },

    // ===== Public sound triggers =====

    // Called on every key press; mode is 'starwars' | 'dino' | 'default'
    playKey(mode) {
        if (!this._isReady()) return;
        if (mode === 'starwars') {
            this._playSaberHum();
        } else if (mode === 'dino') {
            this._playDinoStomp();
        } else {
            this._playBoing();
        }
    },

    // Called on mouse-down / tap
    playClick(mode) {
        if (!this._isReady()) return;
        if (mode === 'starwars') {
            this._playBlasterPew();
        } else if (mode === 'dino') {
            this._playDinoGrowl();
        } else {
            this._playPop();
        }
    },

    // Called on mouse/touch move — kept very subtle to avoid noise spam
    playMove(mode) {
        if (!this._isReady()) return;
        // Only play ~15% of the time so it stays ambient, not overwhelming
        if (Math.random() > 0.15) return;
        if (mode === 'starwars') {
            this._playHyperswish();
        } else if (mode === 'dino') {
            this._playFootstep();
        } else {
            this._playSwish();
        }
    },

    // ===== Mute helpers =====

    loadMutePreference() {
        try {
            this.muted = localStorage.getItem('keyboard-smash-mute') === 'true';
        } catch (e) {
            this.muted = false;
        }
        return this.muted;
    },

    setMuted(value) {
        this.muted = value;
        try {
            localStorage.setItem('keyboard-smash-mute', value);
        } catch (e) {}
    },

    // ===== Default theme sounds =====

    // Bright sine-wave boing, pitch randomised slightly each call
    _playBoing() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const baseFreq = 300 + Math.random() * 400; // 300–700 Hz

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.4);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
    },

    // Bubbly pop for clicks
    _playPop() {
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    },

    // Soft white-noise swish for move trail
    _playSwish() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 0.08;

        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(0.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    },

    // ===== Star Wars theme sounds =====

    // Lightsaber hum — sawtooth fundamental + harmonic
    _playSaberHum() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const baseFreq = 120 + Math.random() * 60; // 120–180 Hz

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.35);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 3, now);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 4, now + 0.35);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.start(now);
        osc1.stop(now + 0.6);
        osc2.start(now);
        osc2.stop(now + 0.6);
    },

    // Blaster pew — descending sawtooth
    _playBlasterPew() {
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
    },

    // Hyperspace whoosh — rising noise
    _playHyperswish() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 0.12;

        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    },

    // ===== Dinosaur theme sounds =====

    // Low stomp thud — deep sine decay
    _playDinoStomp() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const baseFreq = 120 + Math.random() * 60; // 120–180 Hz, low register

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
    },

    // Growl roar for click — filtered noise burst
    _playDinoGrowl() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 0.35;

        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    },

    // Footstep crunch — short filtered noise click
    _playFootstep() {
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 0.06;

        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(200, now);
        filter.gain.setValueAtTime(10, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    },
};
