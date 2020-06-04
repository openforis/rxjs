"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('sampleTime operator', function () {
    asDiagram('sampleTime(70)')('should get samples on a delay', function () {
        var e1 = marble_testing_1.hot('a---b-c---------d--e---f-g-h--|');
        var e1subs = '^                             !';
        var expected = '-------c-------------e------h-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(70, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should sample nothing if new value has not arrived', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c--------------f----|');
        var e1subs = '^                           !';
        var expected = '-----------c----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(110, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should sample if new value has arrived, even if it is the same value', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----------c---f----|');
        var e1subs = '^                           !';
        var expected = '-----------c----------c-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(110, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should sample nothing if source has not nexted by time of sample', function () {
        var e1 = marble_testing_1.hot('----a-^-------------b-------------|');
        var e1subs = '^                           !';
        var expected = '----------------------b-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(110, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source raises error', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----#');
        var e1subs = '^                 !';
        var expected = '-----------c------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(110, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----e----f----|');
        var unsub = '                !            ';
        var e1subs = '^               !            ';
        var expected = '-----------c-----            ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(110, rxTestScheduler)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----e----f----|');
        var e1subs = '^               !            ';
        var expected = '-----------c-----            ';
        var unsub = '                !            ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.sampleTime(110, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should completes if source does not emits', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(60, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source throws immediately', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(60, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes if source does not complete', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sampleTime(60, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=sampleTime-spec.js.map