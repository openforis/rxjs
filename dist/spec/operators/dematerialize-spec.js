"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var NO_VALUES = {};
describe('dematerialize operator', function () {
    asDiagram('dematerialize')('should dematerialize an Observable', function () {
        var values = {
            a: '{x}',
            b: '{y}',
            c: '{z}',
            d: '|'
        };
        var e1 = marble_testing_1.hot('--a--b--c--d-|', values);
        var expected = '--x--y--z--|';
        var result = e1.pipe(operators_1.map(function (x) {
            if (x === '|') {
                return rxjs_1.Notification.createComplete();
            }
            else {
                return rxjs_1.Notification.createNext(x.replace('{', '').replace('}', ''));
            }
        }), operators_1.dematerialize());
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should dematerialize a happy stream', function () {
        var values = {
            a: rxjs_1.Notification.createNext('w'),
            b: rxjs_1.Notification.createNext('x'),
            c: rxjs_1.Notification.createNext('y'),
            d: rxjs_1.Notification.createComplete()
        };
        var e1 = marble_testing_1.hot('--a--b--c--d--|', values);
        var e1subs = '^          !';
        var expected = '--w--x--y--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize a sad stream', function () {
        var values = {
            a: rxjs_1.Notification.createNext('w'),
            b: rxjs_1.Notification.createNext('x'),
            c: rxjs_1.Notification.createNext('y'),
            d: rxjs_1.Notification.createError('error')
        };
        var e1 = marble_testing_1.hot('--a--b--c--d--|', values);
        var e1subs = '^          !';
        var expected = '--w--x--y--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize stream does not completes', function () {
        var e1 = marble_testing_1.hot('------', NO_VALUES);
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize stream never completes', function () {
        var e1 = marble_testing_1.cold('-', NO_VALUES);
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize stream does not emit', function () {
        var e1 = marble_testing_1.hot('----|', NO_VALUES);
        var e1subs = '^   !';
        var expected = '----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize empty stream', function () {
        var e1 = marble_testing_1.cold('|', NO_VALUES);
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize stream throws', function () {
        var error = 'error';
        var e1 = marble_testing_1.hot('(x|)', { x: rxjs_1.Notification.createError(error) });
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected, null, error);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var values = {
            a: rxjs_1.Notification.createNext('w'),
            b: rxjs_1.Notification.createNext('x')
        };
        var e1 = marble_testing_1.hot('--a--b--c--d--|', values);
        var e1subs = '^      !       ';
        var expected = '--w--x--       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.dematerialize());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var values = {
            a: rxjs_1.Notification.createNext('w'),
            b: rxjs_1.Notification.createNext('x')
        };
        var e1 = marble_testing_1.hot('--a--b--c--d--|', values);
        var e1subs = '^      !       ';
        var expected = '--w--x--       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.dematerialize(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize and completes when stream compltes with complete notification', function () {
        var e1 = marble_testing_1.hot('----(a|)', { a: rxjs_1.Notification.createComplete() });
        var e1subs = '^   !';
        var expected = '----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should dematerialize and completes when stream emits complete notification', function () {
        var e1 = marble_testing_1.hot('----a--|', { a: rxjs_1.Notification.createComplete() });
        var e1subs = '^   !';
        var expected = '----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=dematerialize-spec.js.map