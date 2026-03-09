/* ===== Home Screen Logic ===== */

const Home = {
    themeToggle: null,
    starwarsToggle: null,
    themeIcon: null,
    startBtn: null,

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.starwarsToggle = document.getElementById('starwars-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.startBtn = document.getElementById('start-btn');

        // Load saved preferences
        this._loadPreferences();

        // Bind events
        this.themeToggle.addEventListener('change', () => this._onThemeChange());
        this.starwarsToggle.addEventListener('change', () => this._onStarWarsChange());
        this.startBtn.addEventListener('click', () => App.startGame());
    },

    _loadPreferences() {
        const darkMode = localStorage.getItem('keyboard-smash-dark') === 'true';
        const starWars = localStorage.getItem('keyboard-smash-starwars') === 'true';

        this.themeToggle.checked = darkMode;
        this.starwarsToggle.checked = starWars;
        this._applyTheme(darkMode);
        this._applyStarWars(starWars);
    },

    _onThemeChange() {
        const dark = this.themeToggle.checked;
        this._applyTheme(dark);
        localStorage.setItem('keyboard-smash-dark', dark);
    },

    _onStarWarsChange() {
        const sw = this.starwarsToggle.checked;
        this._applyStarWars(sw);
        localStorage.setItem('keyboard-smash-starwars', sw);
    },

    _applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        this.themeIcon.textContent = dark ? '🌙' : '☀️';
    },

    _applyStarWars(enabled) {
        document.documentElement.setAttribute('data-starwars', enabled);
    },

    isStarWarsEnabled() {
        return this.starwarsToggle.checked;
    },
};
