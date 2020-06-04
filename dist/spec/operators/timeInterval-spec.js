"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var timeInterval_1 = require("rxjs/internal/operators/timeInterval");
describe('timeInterval operator', function () {
    asDiagram('timeInterval')('should record the time interval between source elements', function () {
        var e1 = marble_testing_1.hot('--a--^b-c-----d--e--|');
        var e1subs = '^              !';
        var expected = '-w-x-----y--z--|';
        var expectedValue = { w: 10, x: 20, y: 60, z: 30 };
        var result = e1.pipe(operators_1.timeInterval(rxTestScheduler), operators_1.map(function (x) { return x.interval; }));
        marble_testing_1.expectObservable(result).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should record interval if source emit elements', function () {
        var e1 = marble_testing_1.hot('--a--^b--c----d---e--|');
        var e1subs = '^               !';
        var expected = '-w--x----y---z--|';
        var expectedValue = {
            w: new timeInterval_1.TimeInterval('b', 10),
            x: new timeInterval_1.TimeInterval('c', 30),
            y: new timeInterval_1.TimeInterval('d', 50),
            z: new timeInterval_1.TimeInterval('e', 40)
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should completes without record interval if source does not emits', function () {
        var e1 = marble_testing_1.hot('---------|');
        var e1subs = '^        !';
        var expected = '---------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete immediately if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should record interval then does not completes if source emits but not completes', function () {
        var e1 = marble_testing_1.hot('-a--b--');
        var e1subs = '^      ';
        var expected = '-y--z--';
        var expectedValue = {
            y: new timeInterval_1.TimeInterval('a', 10),
            z: new timeInterval_1.TimeInterval('b', 30)
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('-a--b-----c---d---|');
        var unsub = '       !           ';
        var e1subs = '^      !           ';
        var expected = '-y--z---           ';
        var expectedValue = {
            y: new timeInterval_1.TimeInterval('a', 10),
            z: new timeInterval_1.TimeInterval('b', 30)
        };
        var result = e1.pipe(operators_1.timeInterval(rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('-a--b-----c---d---|');
        var e1subs = '^      !           ';
        var expected = '-y--z---           ';
        var unsub = '       !           ';
        var expectedValue = {
            y: new timeInterval_1.TimeInterval('a', 10),
            z: new timeInterval_1.TimeInterval('b', 30)
        };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.timeInterval(rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('raise error if source raises error', function () {
        var e1 = marble_testing_1.hot('---#');
        var e1subs = '^  !';
        var expected = '---#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should record interval then raise error if source raises error after emit', function () {
        var e1 = marble_testing_1.hot('-a--b--#');
        var e1subs = '^      !';
        var expected = '-y--z--#';
        var expectedValue = {
            y: new timeInterval_1.TimeInterval('a', 10),
            z: new timeInterval_1.TimeInterval('b', 30)
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected, expectedValue);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source immediately throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeInterval(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=timeInterval-spec.js.map