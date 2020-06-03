"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('distinct operator', function () {
    it('should distinguish between values', function () {
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a--|');
        var e1subs = '^                   !';
        var expected = '--a--------b--------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish between values and does not completes', function () {
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a-');
        var e1subs = '^                  ';
        var expected = '--a--------b-------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source does not emit', function () {
        var e1 = marble_testing_1.hot('------|');
        var e1subs = '^     !';
        var expected = '------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source emits single element only', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = '--a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source is scalar', function () {
        var e1 = rxjs_1.of('a');
        var expected = '(a|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
    });
    it('should raises error if source raises error', function () {
        var e1 = marble_testing_1.hot('--a--a--#');
        var e1subs = '^       !';
        var expected = '--a-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not omit if source elements are all different', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^                   !';
        var expected = '--a--b--c--d--e--f--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--b--d--a--f--|');
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.distinct());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--b--d--a--f--|');
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.distinct(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit once if source elements are all same', function () {
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--|');
        var e1subs = '^                   !';
        var expected = '--a-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish values by key', function () {
        var values = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|', values);
        var e1subs = '^                   !';
        var expected = '--a--b--c-----------|';
        var selector = function (value) { return value % 3; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(selector))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error when selector throws', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var e1subs = '^          !         ';
        var expected = '--a--b--c--#         ';
        var selector = function (value) {
            if (value === 'd') {
                throw new Error('d is for dumb');
            }
            return value;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(selector))).toBe(expected, undefined, new Error('d is for dumb'));
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support a flushing stream', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--a--b--|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.hot('-----------x--------|');
        var e2subs = '^                   !';
        var expected = '--a--b--------a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(null, e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error if flush raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--a--b--|');
        var e1subs = '^            !';
        var e2 = marble_testing_1.hot('-----------x-#');
        var e2subs = '^            !';
        var expected = '--a--b-------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(null, e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should unsubscribe from the flushing stream when the main stream is unsubbed', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--a--b--|');
        var e1subs = '^          !         ';
        var e2 = marble_testing_1.hot('-----------x--------|');
        var e2subs = '^          !         ';
        var unsub = '           !         ';
        var expected = '--a--b------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(null, e2)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should allow opting in to default comparator with flush', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--a--b--|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.hot('-----------x--------|');
        var e2subs = '^                   !';
        var expected = '--a--b--------a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinct(null, e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=distinct-spec.js.map