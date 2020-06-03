"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('distinctUntilChanged operator', function () {
    it('should distinguish between values', function () {
        var e1 = marble_testing_1.hot('-1--2-2----1-3-|');
        var expected = '-1--2------1-3-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
    });
    it('should distinguish between values', function () {
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a--|');
        var e1subs = '^                   !';
        var expected = '--a--------b-----a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish between values and does not completes', function () {
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a-');
        var e1subs = '^                  ';
        var expected = '--a--------b-----a-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source does not emit', function () {
        var e1 = marble_testing_1.hot('------|');
        var e1subs = '^     !';
        var expected = '------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source emits single element only', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = '--a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source is scalar', function () {
        var e1 = rxjs_1.of('a');
        var expected = '(a|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
    });
    it('should raises error if source raises error', function () {
        var e1 = marble_testing_1.hot('--a--a--#');
        var e1subs = '^       !';
        var expected = '--a-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not omit if source elements are all different', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^                   !';
        var expected = '--a--b--c--d--e--f--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--b--d--a--f--|');
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.distinctUntilChanged());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--b--d--a--f--|');
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.distinctUntilChanged(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit once if source elements are all same', function () {
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--|');
        var e1subs = '^                   !';
        var expected = '--a-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit once if comparator returns true always regardless of source emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^                   !';
        var expected = '--a-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit all if comparator returns false always regardless of source emits', function () {
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--|');
        var e1subs = '^                   !';
        var expected = '--a--a--a--a--a--a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(function () { return false; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish values by comparator', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
        var e1subs = '^                   !';
        var expected = '--a-----c-----e-----|';
        var comparator = function (x, y) { return y % 2 === 0; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(comparator))).toBe(expected, { a: 1, c: 3, e: 5 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error when comparator throws', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^          !         ';
        var expected = '--a--b--c--#         ';
        var comparator = function (x, y) {
            if (y === 'd') {
                throw 'error';
            }
            return x === y;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(comparator))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should use the keySelector to pick comparator values', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
        var e1subs = '^                   !';
        var expected = '--a--b-----d-----f--|';
        var comparator = function (x, y) { return y % 2 === 1; };
        var keySelector = function (x) { return x % 2; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(comparator, keySelector))).toBe(expected, { a: 1, b: 2, d: 4, f: 6 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error when keySelector throws', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^          !         ';
        var expected = '--a--b--c--#         ';
        var keySelector = function (x) {
            if (x === 'd') {
                throw 'error';
            }
            return x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilChanged(null, keySelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=distinctUntilChanged-spec.js.map