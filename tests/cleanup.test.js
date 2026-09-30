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

test('createEffect marks every effect for cleanup without replacing its visual classes', () => {
    const appended = [];
    const timers = [];
    const element = {
        className: '',
        style: {},
        classList: {
            add(className) {
                element.className += ` ${className}`;
            },
        },
        remove() {},
    };
    const Utils = loadObject('js/utils.js', 'Utils', {
        document: {
            createElement() {
                return element;
            },
        },
        setTimeout(callback, duration) {
            timers.push({ callback, duration });
        },
    });

    const effect = Utils.createEffect(
        'animation-burst special-effect',
        { color: 'red' },
        { appendChild: child => appended.push(child) },
        750,
    );

    assert.deepEqual(new Set(effect.className.trim().split(/\s+/)), new Set([
        'animation-burst',
        'special-effect',
        'js-effect',
    ]));
    assert.equal(effect.style.color, 'red');
    assert.deepEqual(appended, [effect]);
    assert.equal(timers[0].duration, 750);
});

test('cleanup removes only marked effects and clears the canvas', () => {
    const removed = [];
    const selectors = [];
    const clearCalls = [];
    const Game = loadObject('js/game.js', 'Game');
    const game = {
        effectsLayer: {
            querySelectorAll(selector) {
                selectors.push(selector);
                return [
                    { remove: () => removed.push('first') },
                    { remove: () => removed.push('second') },
                ];
            },
        },
        ctx: {
            clearRect(...args) {
                clearCalls.push(args);
            },
        },
        canvas: { width: 800, height: 600 },
    };

    Game._cleanup.call(game);

    assert.deepEqual(selectors, ['.js-effect']);
    assert.deepEqual(removed, ['first', 'second']);
    assert.deepEqual(clearCalls, [[0, 0, 800, 600]]);
});
