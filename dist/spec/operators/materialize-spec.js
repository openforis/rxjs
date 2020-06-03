"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('materialize operator', function () {
    it('should materialize an Observable', function () {
        var e1 = marble_testing_1.hot('--x--y--z--|');
        var expected = '--a--b--c--(d|)';
        var values = { a: '{x}', b: '{y}', c: '{z}', d: '|' };
        var result = e1.pipe(operators_1.materialize(), operators_1.map(function (x) {
            if (x.kind === 'C') {
                return '|';
            }
            else {
                return '{' + x.value + '}';
            }
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
    });
    it('should materialize a happy stream', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var expected = '--w--x--y--(z|)';
        var expectedValue = {
            w: rxjs_1.Notification.createNext('a'),
            x: rxjs_1.Notification.createNext('b'),
            y: rxjs_1.Notification.createNext('c'),
            z: rxjs_1.Notification.createComplete()
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize a sad stream', function () {
        var e1 = marble_testing_1.hot('--a--b--c--#');
        var e1subs = '^          !';
        var expected = '--w--x--y--(z|)';
        var expectedValue = {
            w: rxjs_1.Notification.createNext('a'),
            x: rxjs_1.Notification.createNext('b'),
            y: rxjs_1.Notification.createNext('c'),
            z: rxjs_1.Notification.createError('error')
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var unsub = '      !     ';
        var e1subs = '^     !     ';
        var expected = '--w--x-     ';
        var expectedValue = {
            w: rxjs_1.Notification.createNext('a'),
            x: rxjs_1.Notification.createNext('b')
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize()), unsub).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^     !     ';
        var expected = '--w--x-     ';
        var unsub = '      !     ';
        var expectedValue = {
            w: rxjs_1.Notification.createNext('a'),
            x: rxjs_1.Notification.createNext('b')
        };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.materialize(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize stream does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize stream never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize stream does not emit', function () {
        var e1 = marble_testing_1.hot('----|');
        var e1subs = '^   !';
        var expected = '----(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, { x: rxjs_1.Notification.createComplete() });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize empty stream', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, { x: rxjs_1.Notification.createComplete() });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should materialize stream throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, { x: rxjs_1.Notification.createError('error') });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=materialize-spec.js.map