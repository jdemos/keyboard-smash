/* ===== Home Screen Logic ===== */

const Home = {
    themeToggle: null,
    starwarsToggle: null,
    dinoToggle: null,
    transportToggle: null,
    muteToggle: null,
    themeIcon: null,
    muteIcon: null,
    startBtn: null,

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.starwarsToggle = document.getElementById('starwars-toggle');
        this.dinoToggle = document.getElementById('dino-toggle');
        this.transportToggle = document.getElementById('transport-toggle');
        this.muteToggle = document.getElementById('mute-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.muteIcon = document.getElementById('mute-icon');
        this.startBtn = document.getElementById('start-btn');

        // Load saved preferences
        this._loadPreferences();

        // Bind events
        this.themeToggle.addEventListener('change', () => this._onThemeChange());
        this.starwarsToggle.addEventListener('change', () => this._onStarWarsChange());
        this.dinoToggle.addEventListener('change', () => this._onDinoChange());
        this.transportToggle.addEventListener('change', () => this._onTransportChange());
        this.muteToggle.addEventListener('change', () => this._onMuteChange());
        this.startBtn.addEventListener('click', () => App.startGame());
    },

    _getStoredBoolean(key) {
        try {
            return localStorage.getItem(key) === 'true';
        } catch (e) {
            return false;
        }
    },

    _setStoredBoolean(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // localStorage unavailable; preference not persisted
        }
    },

    _loadPreferences() {
        const darkMode = this._getStoredBoolean('keyboard-smash-dark');
        const starWars = this._getStoredBoolean('keyboard-smash-starwars');
        const dino = this._getStoredBoolean('keyboard-smash-dino');
        const transport = this._getStoredBoolean('keyboard-smash-transport');

        this.themeToggle.checked = darkMode;

        // Only one game theme at a time; priority: transport > dino > starwars
        if (transport) {
            this.transportToggle.checked = true;
            this.dinoToggle.checked = false;
            this.starwarsToggle.checked = false;
        } else if (dino) {
            this.dinoToggle.checked = true;
            this.starwarsToggle.checked = false;
            this.transportToggle.checked = false;
        } else {
            this.starwarsToggle.checked = starWars;
            this.dinoToggle.checked = false;
            this.transportToggle.checked = false;
        }
        this._applyTheme(darkMode);
        this._applyStarWars(this.starwarsToggle.checked);
        this._applyDino(this.dinoToggle.checked);
        this._applyTransport(this.transportToggle.checked);

        // Load mute preference (toggle ON = sound enabled, so muted = !checked)
        const muted = Audio.loadMutePreference();
        this.muteToggle.checked = !muted;
        this._applyMute(muted);
    },

    _onThemeChange() {
        const dark = this.themeToggle.checked;
        this._applyTheme(dark);
        this._setStoredBoolean('keyboard-smash-dark', dark);
    },

    _onStarWarsChange() {
        const sw = this.starwarsToggle.checked;
        if (sw) {
            this.dinoToggle.checked = false;
            this._applyDino(false);
            this._setStoredBoolean('keyboard-smash-dino', false);
            this.transportToggle.checked = false;
            this._applyTransport(false);
            this._setStoredBoolean('keyboard-smash-transport', false);
        }
        this._applyStarWars(sw);
        this._setStoredBoolean('keyboard-smash-starwars', sw);
    },

    _onDinoChange() {
        const dino = this.dinoToggle.checked;
        if (dino) {
            this.starwarsToggle.checked = false;
            this._applyStarWars(false);
            this._setStoredBoolean('keyboard-smash-starwars', false);
            this.transportToggle.checked = false;
            this._applyTransport(false);
            this._setStoredBoolean('keyboard-smash-transport', false);
        }
        this._applyDino(dino);
        this._setStoredBoolean('keyboard-smash-dino', dino);
    },

    _onTransportChange() {
        const transport = this.transportToggle.checked;
        if (transport) {
            this.starwarsToggle.checked = false;
            this._applyStarWars(false);
            this._setStoredBoolean('keyboard-smash-starwars', false);
            this.dinoToggle.checked = false;
            this._applyDino(false);
            this._setStoredBoolean('keyboard-smash-dino', false);
        }
        this._applyTransport(transport);
        this._setStoredBoolean('keyboard-smash-transport', transport);
    },

    _onMuteChange() {
        // Toggle is ON when sound is enabled; muted is the inverse
        const muted = !this.muteToggle.checked;
        Audio.setMuted(muted);
        this._applyMute(muted);
    },

    _applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        this.themeIcon.textContent = dark ? '🌙' : '☀️';
    },

    _applyStarWars(enabled) {
        document.documentElement.setAttribute('data-starwars', enabled);
    },

    _applyDino(enabled) {
        document.documentElement.setAttribute('data-dino', enabled);
    },

    _applyTransport(enabled) {
        document.documentElement.setAttribute('data-transport', enabled);
    },

    _applyMute(muted) {
        this.muteIcon.textContent = muted ? '🔇' : '🔊';
    },

    isStarWarsEnabled() {
        return this.starwarsToggle.checked;
    },

    isDinoEnabled() {
        return this.dinoToggle.checked;
    },

    isTransportEnabled() {
        return this.transportToggle.checked;
    },
};
