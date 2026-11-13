const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadObject(file, objectName) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const sandbox = {};
    vm.runInNewContext(`${source}\nglobalThis.loadedObject = ${objectName};`, sandbox);
    return sandbox.loadedObject;
}

test('all registered effects have method implementations', () => {
    const engines = [
        ['js/effects.js', 'Effects'],
        ['js/starwars.js', 'StarWarsEffects'],
        ['js/dinosaur.js', 'DinosaurEffects'],
        ['js/transportation.js', 'TransportationEffects'],
    ];

    for (const [file, name] of engines) {
        const engine = loadObject(file, name);
        const registeredEffects = [
            ...engine.keyEffects,
            ...engine.clickEffects,
            ...engine.moveEffects,
        ];

        for (const effect of registeredEffects) {
            assert.equal(typeof engine[effect], 'function', `${name}.${effect} must be implemented`);
        }
    }
});

test('bouncing balls and ship flyby are registered with matching animations', () => {
    const effects = loadObject('js/effects.js', 'Effects');
    const starWarsEffects = loadObject('js/starwars.js', 'StarWarsEffects');
    const gameCss = fs.readFileSync(path.join(__dirname, '..', 'css/game.css'), 'utf8');
    const starWarsCss = fs.readFileSync(path.join(__dirname, '..', 'css/starwars.css'), 'utf8');

    assert.ok(effects.clickEffects.includes('bouncingBalls'));
    assert.match(gameCss, /\.effect-ball\s*\{/);
    assert.match(gameCss, /@keyframes\s+ballBounce\s*\{/);

    assert.ok(starWarsEffects.keyEffects.includes('shipFlyby'));
    assert.match(starWarsCss, /\.effect-ship\s*\{/);
    assert.match(starWarsCss, /@keyframes\s+shipFly\s*\{/);
});
