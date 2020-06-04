"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('timer', function () {
    asDiagram('timer(3000, 1000)')('should create an observable emitting periodically', function () {
        var e1 = rxjs_1.timer(60, 20, rxTestScheduler).pipe(operators_1.take(4), operators_1.concat(rxjs_1.NEVER));
        var expected = '------a-b-c-d-';
        var values = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
    it('should schedule a value of 0 then complete', function () {
        var dueTime = marble_testing_1.time('-----|');
        var expected = '-----(x|)';
        var source = rxjs_1.timer(dueTime, undefined, rxTestScheduler);
        marble_testing_1.expectObservable(source).toBe(expected, { x: 0 });
    });
    it('should emit a single value immediately', function () {
        var dueTime = marble_testing_1.time('|');
        var expected = '(x|)';
        var source = rxjs_1.timer(dueTime, rxTestScheduler);
        marble_testing_1.expectObservable(source).toBe(expected, { x: 0 });
    });
    it('should start after delay and periodically emit values', function () {
        var dueTime = marble_testing_1.time('----|');
        var period = marble_testing_1.time('--|');
        var expected = '----a-b-c-d-(e|)';
        var source = rxjs_1.timer(dueTime, period, rxTestScheduler).pipe(operators_1.take(5));
        var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        marble_testing_1.expectObservable(source).toBe(expected, values);
    });
    it('should start immediately and periodically emit values', function () {
        var dueTime = marble_testing_1.time('|');
        var period = marble_testing_1.time('---|');
        var expected = 'a--b--c--d--(e|)';
        var source = rxjs_1.timer(dueTime, period, rxTestScheduler).pipe(operators_1.take(5));
        var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        marble_testing_1.expectObservable(source).toBe(expected, values);
    });
    it('should stop emiting values when subscription is done', function () {
        var dueTime = marble_testing_1.time('|');
        var period = marble_testing_1.time('---|');
        var expected = 'a--b--c--d--e';
        var unsub = '^            !';
        var source = rxjs_1.timer(dueTime, period, rxTestScheduler);
        var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
    });
    it('should schedule a value at a specified Date', function () {
        var offset = marble_testing_1.time('----|');
        var expected = '----(a|)';
        var dueTime = new Date(rxTestScheduler.now() + offset);
        var source = rxjs_1.timer(dueTime, null, rxTestScheduler);
        marble_testing_1.expectObservable(source).toBe(expected, { a: 0 });
    });
    it('should start after delay and periodically emit values', function () {
        var offset = marble_testing_1.time('----|');
        var period = marble_testing_1.time('--|');
        var expected = '----a-b-c-d-(e|)';
        var dueTime = new Date(rxTestScheduler.now() + offset);
        var source = rxjs_1.timer(dueTime, period, rxTestScheduler).pipe(operators_1.take(5));
        var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        marble_testing_1.expectObservable(source).toBe(expected, values);
    });
    it('should still target the same date if a date is provided even for the ' +
        'second subscription', function () {
        var offset = marble_testing_1.time('----|    ');
        var t1 = marble_testing_1.cold('a|       ');
        var t2 = marble_testing_1.cold('--a|     ');
        var expected = '----(aa|)';
        var dueTime = new Date(rxTestScheduler.now() + offset);
        var source = rxjs_1.timer(dueTime, null, rxTestScheduler);
        var testSource = rxjs_1.merge(t1, t2).pipe(operators_1.mergeMap(function () { return source; }));
        marble_testing_1.expectObservable(testSource).toBe(expected, { a: 0 });
    });
});
//# sourceMappingURL=timer-spec.js.map