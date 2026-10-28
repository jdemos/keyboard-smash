const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadObject(file, objectName, context = {}) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const sandbox = { ...context };
    vm.runInNewContext(`${source}\nglobalThis.loadedObject = ${objectName};`, sandbox);
    return sandbox.loadedObject;
}

test('enabling space disables and persists every other theme', () => {
    const Home = loadObject('js/home.js', 'Home');
    const applied = [];
    const stored = [];
    const home = Object.create(Home);

    home.spaceToggle = { checked: true };
    home.starwarsToggle = { checked: true };
    home.dinoToggle = { checked: true };
    home.transportToggle = { checked: true };
    home._applyStarWars = value => applied.push(['starwars', value]);
    home._applyDino = value => applied.push(['dino', value]);
    home._applyTransport = value => applied.push(['transport', value]);
    home._applySpace = value => applied.push(['space', value]);
    home._setStoredBoolean = (key, value) => stored.push([key, value]);

    home._onSpaceChange();

    assert.equal(home.starwarsToggle.checked, false);
    assert.equal(home.dinoToggle.checked, false);
    assert.equal(home.transportToggle.checked, false);
    assert.deepEqual(applied, [
        ['starwars', false],
        ['dino', false],
        ['transport', false],
        ['space', true],
    ]);
    assert.deepEqual(stored, [
        ['keyboard-smash-starwars', false],
        ['keyboard-smash-dino', false],
        ['keyboard-smash-transport', false],
        ['keyboard-smash-space', true],
    ]);
});

test('game routes space input and audio to space mode', () => {
    const spaceEngine = { name: 'space' };
    const Game = loadObject('js/game.js', 'Game', {
        SpaceEffects: spaceEngine,
    });
    const state = {
        spaceMode: true,
        starWarsMode: false,
        dinoMode: false,
        transportMode: false,
    };

    assert.equal(Game._getEffectEngine.call(state).name, 'space');
    assert.equal(Game._getMode.call(state), 'space');
});

test('space theme creates planets and stars and removes its backdrop', () => {
    const elements = [];
    const layer = {
        appendChild(element) {
            elements.push(element);
        },
        querySelectorAll(selector) {
            assert.equal(selector, '.space-bg-element');
            return elements;
        },
    };
    const Utils = {
        randomFloat(min) {
            return min;
        },
        randomInt(min) {
            return min;
        },
        pick(values) {
            return values[0];
        },
    };
    const SpaceEffects = loadObject('js/space.js', 'SpaceEffects', {
        document: {
            createElement() {
                return {
                    className: '',
                    style: {},
                    remove() {
                        this.removed = true;
                    },
                };
            },
        },
        Utils,
    });

    SpaceEffects.init(layer);
    SpaceEffects.createCosmos();

    assert.equal(elements.length, 94);
    assert.equal(elements.filter(el => el.className.includes('space-star')).length, 90);
    assert.equal(elements.filter(el => el.className.includes('space-distant-planet')).length, 4);

    SpaceEffects.removeCosmos();

    assert.equal(SpaceEffects.cosmosCreated, false);
    assert.ok(elements.every(el => el.removed));
});

test('space effects include planets, astronauts, and rocket travel with cleanup durations', () => {
    const created = [];
    const Utils = {
        createEffect(className, styles, layer, duration) {
            const element = { className, styles, layer, duration, textContent: '' };
            created.push(element);
            return element;
        },
        randomFloat(min) {
            return min;
        },
        randomInt(min) {
            return min;
        },
        pick(values) {
            return values[0];
        },
    };
    const SpaceEffects = loadObject('js/space.js', 'SpaceEffects', {
        Math,
        Utils,
        window: { innerWidth: 1200, innerHeight: 800 },
    });
    SpaceEffects.init({});

    SpaceEffects.planetPop('', { x: 100, y: 100 });
    SpaceEffects.astronautFloat('', { x: 200, y: 200 });
    SpaceEffects.rocketFlight('', { x: 300, y: 300 });

    assert.ok(created.some(effect => effect.textContent === '🪐'));
    assert.ok(created.some(effect => effect.textContent === '👨‍🚀'));
    assert.ok(created.some(effect => effect.textContent === '🚀'));
    assert.ok(created.every(effect => Number.isFinite(effect.duration) && effect.duration > 0));
});
