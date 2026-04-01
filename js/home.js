/* ===== Home Screen Logic ===== */

const Home = {
    themeToggle: null,
    starwarsToggle: null,
    dinoToggle: null,
    muteToggle: null,
    themeIcon: null,
    muteIcon: null,
    startBtn: null,

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.starwarsToggle = document.getElementById('starwars-toggle');
        this.dinoToggle = document.getElementById('dino-toggle');
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
        this.muteToggle.addEventListener('change', () => this._onMuteChange());
        this.startBtn.addEventListener('click', () => App.startGame());
    },

    _loadPreferences() {
        const darkMode = localStorage.getItem('keyboard-smash-dark') === 'true';
        const starWars = localStorage.getItem('keyboard-smash-starwars') === 'true';
        const dino = localStorage.getItem('keyboard-smash-dino') === 'true';

        this.themeToggle.checked = darkMode;
        // Only one game theme at a time; dino takes precedence if both saved
        if (dino) {
            this.dinoToggle.checked = true;
            this.starwarsToggle.checked = false;
        } else {
            this.starwarsToggle.checked = starWars;
            this.dinoToggle.checked = false;
        }
        this._applyTheme(darkMode);
        this._applyStarWars(this.starwarsToggle.checked);
        this._applyDino(this.dinoToggle.checked);

        // Load mute preference (toggle ON = sound enabled, so muted = !checked)
        const muted = Audio.loadMutePreference();
        this.muteToggle.checked = !muted;
        this._applyMute(muted);
    },

    _onThemeChange() {
        const dark = this.themeToggle.checked;
        this._applyTheme(dark);
        localStorage.setItem('keyboard-smash-dark', dark);
    },

    _onStarWarsChange() {
        const sw = this.starwarsToggle.checked;
        if (sw) {
            this.dinoToggle.checked = false;
            this._applyDino(false);
            localStorage.setItem('keyboard-smash-dino', false);
        }
        this._applyStarWars(sw);
        localStorage.setItem('keyboard-smash-starwars', sw);
    },

    _onDinoChange() {
        const dino = this.dinoToggle.checked;
        if (dino) {
            this.starwarsToggle.checked = false;
            this._applyStarWars(false);
            localStorage.setItem('keyboard-smash-starwars', false);
        }
        this._applyDino(dino);
        localStorage.setItem('keyboard-smash-dino', dino);
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

    _applyMute(muted) {
        this.muteIcon.textContent = muted ? '🔇' : '🔊';
    },

    isStarWarsEnabled() {
        return this.starwarsToggle.checked;
    },

    isDinoEnabled() {
        return this.dinoToggle.checked;
    },
};
