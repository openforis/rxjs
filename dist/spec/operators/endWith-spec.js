"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
describe('endWith operator', function () {
    var defaultStartValue = 'x';
    asDiagram('endWith(s)')('should append to a cold Observable', function () {
        var e1 = marble_testing_1.cold('---a--b--c--|');
        var e1subs = '^           !';
        var expected = '---a--b--c--(s|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith('s'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should append numbers to a cold Observable', function () {
        var values = { a: 1, b: 2, c: 3, s: 4 };
        var e1 = marble_testing_1.cold('---a--b--c--|', values);
        var e1subs = '^           !';
        var expected = '---a--b--c--(s|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(values.s))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should end an observable with given value', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = '--a--(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not end with given value if source does not complete', function () {
        var e1 = marble_testing_1.hot('----a-');
        var e1subs = '^     ';
        var expected = '----a-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not end with given value if source never emits and does not completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should end with given value if source does not emit but does complete', function () {
        var e1 = marble_testing_1.hot('---|');
        var e1subs = '^  !';
        var expected = '---(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit given value and complete immediately if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should end with given value and source both if source emits single value', function () {
        var e1 = marble_testing_1.cold('(a|)');
        var e1subs = '(^!)';
        var expected = '(ax|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should end with given values when given more than one value', function () {
        var e1 = marble_testing_1.hot('-----a--|');
        var e1subs = '^       !';
        var expected = '-----a--(yz|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith('y', 'z'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error and not end with given value if source raises error', function () {
        var e1 = marble_testing_1.hot('--#');
        var e1subs = '^ !';
        var expected = '--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected, defaultStartValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error immediately and not end with given value if source throws error immediately', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue))).toBe(expected, defaultStartValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('---a--b----c--d--|');
        var unsub = '         !        ';
        var e1subs = '^        !        ';
        var expected = '---a--b---';
        var result = e1.pipe(operators_1.endWith('s', rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('---a--b----c--d--|');
        var e1subs = '^        !        ';
        var expected = '---a--b---        ';
        var unsub = '         !        ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.endWith('s', rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should end with empty if given value is not specified', function () {
        var e1 = marble_testing_1.hot('-a-|');
        var e1subs = '^  !';
        var expected = '-a-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should accept scheduler as last argument with single value', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = '--a--(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith(defaultStartValue, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should accept scheduler as last argument with multiple value', function () {
        var e1 = marble_testing_1.hot('-----a--|');
        var e1subs = '^       !';
        var expected = '-----a--(yz|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.endWith('y', 'z', rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=endWith-spec.js.map