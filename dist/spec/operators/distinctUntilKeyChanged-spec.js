"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('distinctUntilKeyChanged operator', function () {
    it('should distinguish between values', function () {
        var values = { a: { k: 1 }, b: { k: 2 }, c: { k: 3 } };
        var e1 = marble_testing_1.hot('-a--b-b----a-c-|', values);
        var expected = '-a--b------a-c-|';
        var result = e1.pipe(operators_1.distinctUntilKeyChanged('k'));
        marble_testing_1.expectObservable(result).toBe(expected, values);
    });
    it('should distinguish between values', function () {
        var values = { a: { val: 1 }, b: { val: 2 } };
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a--|', values);
        var e1subs = '^                   !';
        var expected = '--a--------b-----a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish between values and does not completes', function () {
        var values = { a: { val: 1 }, b: { val: 2 } };
        var e1 = marble_testing_1.hot('--a--a--a--b--b--a-', values);
        var e1subs = '^                  ';
        var expected = '--a--------b-----a-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish between values with key', function () {
        var values = { a: { val: 1 }, b: { valOther: 1 }, c: { valOther: 3 }, d: { val: 1 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^                !';
        var expected = '--a--b-----d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not compare if source does not have element with key', function () {
        var values = { a: { valOther: 1 }, b: { valOther: 1 }, c: { valOther: 3 }, d: { valOther: 1 }, e: { valOther: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^                !';
        var expected = '--a--------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete if source does not emit', function () {
        var e1 = marble_testing_1.hot('------|');
        var e1subs = '^     !';
        var expected = '------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source emits single element only', function () {
        var values = { a: { val: 1 } };
        var e1 = marble_testing_1.hot('--a--|', values);
        var e1subs = '^    !';
        var expected = '--a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit if source is scalar', function () {
        var values = { a: { val: 1 } };
        var e1 = rxjs_1.of(values.a);
        var expected = '(a|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
    });
    it('should raises error if source raises error', function () {
        var values = { a: { val: 1 } };
        var e1 = marble_testing_1.hot('--a--a--#', values);
        var e1subs = '^       !';
        var expected = '--a-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not omit if source elements are all different', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^                !';
        var expected = '--a--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--b--d--a--e--|', values);
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.distinctUntilKeyChanged('val'));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--b--d--a--e--|', values);
        var e1subs = '^         !          ';
        var expected = '--a--b-----          ';
        var unsub = '          !          ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.distinctUntilKeyChanged('val'), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit once if source elements are all same', function () {
        var values = { a: { val: 1 } };
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--|', values);
        var e1subs = '^                   !';
        var expected = '--a-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val'))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit once if comparer returns true always regardless of source emits', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^                !';
        var expected = '--a--------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val', function () { return true; }))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit all if comparer returns false always regardless of source emits', function () {
        var values = { a: { val: 1 } };
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--|', values);
        var e1subs = '^                   !';
        var expected = '--a--a--a--a--a--a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val', function () { return false; }))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should distinguish values by selector', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^                !';
        var expected = '--a-----c-----e--|';
        var selector = function (x, y) { return y % 2 === 0; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val', selector))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error when comparer throws', function () {
        var values = { a: { val: 1 }, b: { val: 2 }, c: { val: 3 }, d: { val: 4 }, e: { val: 5 } };
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|', values);
        var e1subs = '^          !      ';
        var expected = '--a--b--c--#      ';
        var selector = function (x, y) {
            if (y === 4) {
                throw 'error';
            }
            return x === y;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.distinctUntilKeyChanged('val', selector))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=distinctUntilKeyChanged-spec.js.map