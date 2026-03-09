/* ===== App Controller ===== */

const App = {
    homeScreen: null,
    gameScreen: null,

    init() {
        this.homeScreen = document.getElementById('home-screen');
        this.gameScreen = document.getElementById('game-screen');

        Home.init();
        Game.init();
    },

    startGame() {
        this.homeScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        Game.start(Home.isStarWarsEnabled(), Home.isDinoEnabled());
    },

    showHome() {
        Game.stop();
        this.gameScreen.classList.remove('active');
        this.homeScreen.classList.add('active');
    },
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
