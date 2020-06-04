"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('skip operator', function () {
    asDiagram('skip(3)')('should skip values before a total', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var subs = '^                !';
        var expected = '-----------d--e--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should skip all values without error if total is more than actual number of values', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var subs = '^                !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(6))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should skip all values without error if total is same as actual number of values', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var subs = '^                !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(5))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not skip if count is zero', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var subs = '^                !';
        var expected = '--a--b--c--d--e--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var unsub = '          !       ';
        var subs = '^         !       ';
        var expected = '--------c--       ';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(2)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var subs = '^         !       ';
        var expected = '--------c--       ';
        var unsub = '          !       ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.skip(2), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if skip count is more than actual number of emits and source raises error', function () {
        var source = marble_testing_1.hot('--a--b--c--d--#');
        var subs = '^             !';
        var expected = '--------------#';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(6))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if skip count is same as emits of source and source raises error', function () {
        var source = marble_testing_1.hot('--a--b--c--d--#');
        var subs = '^             !';
        var expected = '--------------#';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(4))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should skip values before a total and raises error if source raises error', function () {
        var source = marble_testing_1.hot('--a--b--c--d--#');
        var subs = '^             !';
        var expected = '-----------d--#';
        marble_testing_1.expectObservable(source.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should complete regardless of skip count if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete if source never completes without emit', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip values before total and never completes if source emits and does not complete', function () {
        var e1 = marble_testing_1.hot('--a--b--c-');
        var e1subs = '^         ';
        var expected = '-----b--c-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all values and never completes if total is more than numbers of value and source does not complete', function () {
        var e1 = marble_testing_1.hot('--a--b--c-');
        var e1subs = '^         ';
        var expected = '----------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(6))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all values and never completes if total is same asnumbers of value and source does not complete', function () {
        var e1 = marble_testing_1.hot('--a--b--c-');
        var e1subs = '^         ';
        var expected = '----------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=skip-spec.js.map