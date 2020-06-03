"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('skipLast operator', function () {
    it('should skip two values of an observable with many values', function () {
        var e1 = marble_testing_1.cold('--a-----b----c---d--|');
        var e1subs = '^                   !';
        var expected = '-------------a---b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip last three values', function () {
        var e1 = marble_testing_1.cold('--a-----b----c---d--|');
        var e1subs = '^                   !';
        var expected = '-----------------a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all values when trying to take larger then source', function () {
        var e1 = marble_testing_1.cold('--a-----b----c---d--|');
        var e1subs = '^                   !';
        var expected = '--------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(5))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all element when try to take exact', function () {
        var e1 = marble_testing_1.cold('--a-----b----c---d--|');
        var e1subs = '^                   !';
        var expected = '--------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(4))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not skip any values', function () {
        var e1 = marble_testing_1.cold('--a-----b----c---d--|');
        var e1subs = '^                   !';
        var expected = '--a-----b----c---d--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should go on forever on never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip one value from an observable with one value', function () {
        var e1 = marble_testing_1.hot('---(a|)');
        var e1subs = '^  !   ';
        var expected = '---|   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip one value from an observable with many values', function () {
        var e1 = marble_testing_1.hot('--a--^--b----c---d--|');
        var e1subs = '^              !';
        var expected = '--------b---c--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with empty and early emission', function () {
        var e1 = marble_testing_1.hot('--a--^----|');
        var e1subs = '^    !';
        var expected = '-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should propagate error from the source observable', function () {
        var e1 = marble_testing_1.hot('---^---#', undefined, 'too bad');
        var e1subs = '^   !';
        var expected = '----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should propagate error from an observable with values', function () {
        var e1 = marble_testing_1.hot('---^--a--b--#');
        var e1subs = '^        !';
        var expected = '---------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('---^--a--b-----c--d--e--|');
        var unsub = '         !            ';
        var e1subs = '^        !            ';
        var expected = '----------            ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should throw if total is less than zero', function () {
        chai_1.expect(function () { rxjs_1.range(0, 10).pipe(operators_1.skipLast(-1)); })
            .to.throw(rxjs_1.ArgumentOutOfRangeError);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('---^--a--b-----c--d--e--|');
        var unsub = '         !            ';
        var e1subs = '^        !            ';
        var expected = '----------            ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.skipLast(42), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=skipLast-spec.js.map