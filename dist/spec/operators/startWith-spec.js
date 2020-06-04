"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('startWith operator', function () {
    var defaultStartValue = 'x';
    asDiagram('startWith(s)')('should prepend to a cold Observable', function () {
        var e1 = marble_testing_1.cold('---a--b--c--|');
        var e1subs = '^           !';
        var expected = 's--a--b--c--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith('s'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start an observable with given value', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = 'x-a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and does not completes if source does not completes', function () {
        var e1 = marble_testing_1.hot('----a-');
        var e1subs = '^     ';
        var expected = 'x---a-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and does not completes if source never emits', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = 'x-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and completes if source does not emits', function () {
        var e1 = marble_testing_1.hot('---|');
        var e1subs = '^  !';
        var expected = 'x--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and complete immediately if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and source both if source emits single value', function () {
        var e1 = marble_testing_1.cold('(a|)');
        var e1subs = '(^!)';
        var expected = '(xa|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given values when given value is more than one', function () {
        var e1 = marble_testing_1.hot('-----a--|');
        var e1subs = '^       !';
        var expected = '(yz)-a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith('y', 'z'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and raises error if source raises error', function () {
        var e1 = marble_testing_1.hot('--#');
        var e1subs = '^ !';
        var expected = 'x-#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected, defaultStartValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with given value and raises error immediately if source throws error', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '(x#)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue))).toBe(expected, defaultStartValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('---a--b----c--d--|');
        var unsub = '         !        ';
        var e1subs = '^        !        ';
        var expected = 's--a--b---';
        var values = { s: 's', a: 'a', b: 'b' };
        var result = e1.pipe(operators_1.startWith('s', rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('---a--b----c--d--|');
        var e1subs = '^        !        ';
        var expected = 's--a--b---        ';
        var unsub = '         !        ';
        var values = { s: 's', a: 'a', b: 'b' };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.startWith('s', rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should start with empty if given value is not specified', function () {
        var e1 = marble_testing_1.hot('-a-|');
        var e1subs = '^  !';
        var expected = '-a-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should accept scheduler as last argument with single value', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = 'x-a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith(defaultStartValue, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should accept scheduler as last argument with multiple value', function () {
        var e1 = marble_testing_1.hot('-----a--|');
        var e1subs = '^       !';
        var expected = '(yz)-a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.startWith('y', 'z', rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=startWith-spec.js.map