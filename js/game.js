/* ===== Core Game Engine ===== */

const Game = {
    active: false,
    starWarsMode: false,
    dinoMode: false,
    transportMode: false,
    effectsLayer: null,
    canvas: null,
    ctx: null,
    moveThrottle: 0,

    init() {
        this.effectsLayer = document.getElementById('effects-layer');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        Effects.init(this.effectsLayer);
        StarWarsEffects.init(this.effectsLayer);
        DinosaurEffects.init(this.effectsLayer);
        TransportationEffects.init(this.effectsLayer);
        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());
    },

    _resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    start(starWarsMode, dinoMode, transportMode) {
        this.active = true;
        this.starWarsMode = starWarsMode;
        this.dinoMode = dinoMode;
        this.transportMode = transportMode;
        this._enterFullscreen();
        this._bindEvents();

        if (starWarsMode) {
            StarWarsEffects.createStarfield();
        } else if (dinoMode) {
            DinosaurEffects.createJungle();
        } else if (transportMode) {
            TransportationEffects.createRoad();
        }
    },

    stop() {
        this.active = false;
        this._unbindEvents();
        this._exitFullscreen();
        this._cleanup();

        if (this.starWarsMode) {
            StarWarsEffects.removeStarfield();
        } else if (this.dinoMode) {
            DinosaurEffects.removeJungle();
        } else if (this.transportMode) {
            TransportationEffects.removeRoad();
        }
    },

    _cleanup() {
        // Remove all effect elements except persistent backgrounds (handled separately)
        const effects = this.effectsLayer.querySelectorAll(':not(.starfield-star):not(.jungle-bg-element):not(.road-bg-element)');
        effects.forEach(el => el.remove());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    _enterFullscreen() {
        const el = document.documentElement;
        const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) {
            rfs.call(el).catch(() => {
                // Fullscreen may fail on some browsers, game still works
            });
        }
    },

    _exitFullscreen() {
        const efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (efs && document.fullscreenElement) {
            efs.call(document).catch(() => {});
        }
    },

    // Re-enter fullscreen if toddler accidentally exits (e.g., hits Escape)
    _handleFullscreenChange() {
        if (this.active && !document.fullscreenElement) {
            // Small delay then re-enter
            setTimeout(() => {
                if (this.active) this._enterFullscreen();
            }, 300);
        }
    },

    _getEffectEngine() {
        if (this.starWarsMode) return StarWarsEffects;
        if (this.dinoMode) return DinosaurEffects;
        if (this.transportMode) return TransportationEffects;
        return Effects;
    },

    _getMode() {
        if (this.starWarsMode) return 'starwars';
        if (this.dinoMode) return 'dino';
        if (this.transportMode) return 'transport';
        return 'default';
    },

    // ===== Event Handlers =====

    _onKeyDown(e) {
        if (!this.active) return;

        // Parent exit: Ctrl+Shift+Escape
        if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
            e.preventDefault();
            App.showHome();
            return;
        }

        // Prevent all default browser/OS actions (e.g. Spotlight, browser shortcuts)
        e.preventDefault();
        e.stopPropagation();

        Audio.init();
        Audio.playKey(this._getMode());
        this._getEffectEngine().onKey(e);
    },

    _onKeyUp(e) {
        if (!this.active) return;

        // Allow parent exit shortcut to pass through
        if (e.ctrlKey && e.shiftKey && e.key === 'Escape') return;

        // Prevent OS/browser shortcuts that activate on key release
        e.preventDefault();
        e.stopPropagation();
    },

    _onMouseDown(e) {
        if (!this.active) return;
        e.preventDefault();
        Audio.init();
        Audio.playClick(this._getMode());
        this._getEffectEngine().onClick(e.clientX, e.clientY);
    },

    _onMouseMove(e) {
        if (!this.active) return;

        // Throttle move effects to ~30fps
        const now = Date.now();
        if (now - this.moveThrottle < 33) return;
        this.moveThrottle = now;

        Audio.init();
        Audio.playMove(this._getMode());
        this._getEffectEngine().onMove(e.clientX, e.clientY);
    },

    _onWheel(e) {
        if (!this.active) return;
        e.preventDefault();
        // Trigger a click effect at center on scroll
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        this._getEffectEngine().onClick(cx, cy);
    },

    _onContextMenu(e) {
        if (this.active) e.preventDefault();
    },

    _onTouchStart(e) {
        if (!this.active) return;
        e.preventDefault();
        Audio.init();
        Audio.playClick(this._getMode());
        // Trigger a click effect for each finger
        for (const touch of e.changedTouches) {
            this._getEffectEngine().onClick(touch.clientX, touch.clientY);
        }
    },

    _onTouchMove(e) {
        if (!this.active) return;
        e.preventDefault();

        const now = Date.now();
        if (now - this.moveThrottle < 33) return;
        this.moveThrottle = now;

        Audio.init();
        Audio.playMove(this._getMode());
        // Trail effect for each active finger
        for (const touch of e.touches) {
            this._getEffectEngine().onMove(touch.clientX, touch.clientY);
        }
    },

    _onTouchEnd(e) {
        if (!this.active) return;
        e.preventDefault();
    },

    // ===== Event Binding =====

    _boundHandlers: {},

    // Events registered without capture (pointer/touch/misc)
    _pointerEvents: ['mousedown', 'mousemove', 'wheel', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'fullscreenchange'],

    _bindEvents() {
        this._boundHandlers = {
            keydown: (e) => this._onKeyDown(e),
            keyup: (e) => this._onKeyUp(e),
            mousedown: (e) => this._onMouseDown(e),
            mousemove: (e) => this._onMouseMove(e),
            wheel: (e) => this._onWheel(e),
            contextmenu: (e) => this._onContextMenu(e),
            touchstart: (e) => this._onTouchStart(e),
            touchmove: (e) => this._onTouchMove(e),
            touchend: (e) => this._onTouchEnd(e),
            fullscreenchange: () => this._handleFullscreenChange(),
        };

        // Key events use capture:true so our handler fires before the browser's own
        // shortcut processing, blocking OS-level shortcuts like Spotlight (Cmd+Space)
        document.addEventListener('keydown', this._boundHandlers.keydown, { capture: true, passive: false });
        document.addEventListener('keyup', this._boundHandlers.keyup, { capture: true, passive: false });

        this._pointerEvents.forEach(event => {
            document.addEventListener(event, this._boundHandlers[event], { passive: false });
        });
    },

    _unbindEvents() {
        // Key events were registered with capture:true — must match on removal
        document.removeEventListener('keydown', this._boundHandlers.keydown, { capture: true });
        document.removeEventListener('keyup', this._boundHandlers.keyup, { capture: true });

        this._pointerEvents.forEach(event => {
            document.removeEventListener(event, this._boundHandlers[event]);
        });

        this._boundHandlers = {};
    },
};
