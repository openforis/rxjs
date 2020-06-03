"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('windowTime operator', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit windows given windowTimeSpan and windowCreationInterval', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--1--2--^-a--b--c--d--e---f--g--h-|');
            var subs = '^-------------------------!';
            var expected = 'x---------y---------z-----|';
            var x = cold('--a--(b|)                  ');
            var y = cold('-d--e|           ');
            var z = cold('-g--h| ');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(5, 10, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should close windows after max count is reached', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--1--2--^--a--b--c--d--e--f--g-----|');
            var subs = '^--------------------------!';
            var timeSpan = time('----------|');
            var expected = 'x---------y---------z------|';
            var x = cold('---a--(b|)                  ');
            var y = cold('--d--(e|)         ');
            var z = cold('-g-----|');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(timeSpan, null, 2, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should close window after max count is reached with windowCreationInterval', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^-a--b--c--de-f---g--h--i-|');
            var subs = '^-------------------------!';
            var expected = 'x---------y---------z-----|';
            var x = cold('            --a--(b|)                 ');
            var y = cold('                      -de-(f|)         ');
            var z = cold('                                -h--i| ');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(5, 10, 3, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should emit windows given windowTimeSpan', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^--a--b--c--d--e--f--g--h--|');
            var subs = '^--------------------------!';
            var timeSpan = time('----------|');
            var expected = 'x---------y---------z------|';
            var x = cold('---a--b--c|                 ');
            var y = cold('--d--e--f-|       ');
            var z = cold('-g--h--|');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(timeSpan, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should emit windows given windowTimeSpan and windowCreationInterval', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, cold = _a.cold, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^--a--b--c--d--e--f--g--h--|');
            var subs = '^--------------------------!';
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var expected = 'x---------y---------z------|';
            var x = cold('---a-|                      ');
            var y = cold('--d--(e|)         ');
            var z = cold('-g--h|  ');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should return a single empty window if source is empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = cold('|');
            var subs = '(^!)';
            var expected = '(w|)';
            var w = cold('|');
            var expectedValues = { w: w };
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result).toBe(expected, expectedValues);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should split a Just source into a single window identical to source', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = cold('(a|)');
            var subs = '(^!)';
            var expected = '(w|)';
            var w = cold('(a|)');
            var expectedValues = { w: w };
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result).toBe(expected, expectedValues);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should be able to split a never Observable into timely empty windows', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('^----------');
            var subs = '^---------!';
            var expected = 'a--b--c--d-';
            var timeSpan = time('---|');
            var interval = time('---|');
            var a = cold('---|       ');
            var b = cold('---|    ');
            var c = cold('---| ');
            var d = cold('--');
            var unsub = '----------!';
            var expectedValues = { a: a, b: b, c: c, d: d };
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result, unsub).toBe(expected, expectedValues);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should emit an error-only window if outer is a simple throw-Observable', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = cold('#');
            var subs = '(^!)';
            var expected = '(w#)';
            var w = cold('#');
            var expectedValues = { w: w };
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result).toBe(expected, expectedValues);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should handle source Observable which eventually emits an error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^--a--b--c--d--e--f--g--h--#');
            var subs = '^--------------------------!';
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var expected = 'x---------y---------z------#';
            var x = cold('---a-|                      ');
            var y = cold('--d--(e|)         ');
            var z = cold('-g--h|  ');
            var values = { x: x, y: y, z: z };
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should emit windows given windowTimeSpan and windowCreationInterval, but outer is unsubscribed early', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^--a--b--c--d--e--f--g--h--|');
            var subs = '^----------!                ';
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var expected = 'x---------y-                ';
            var x = cold('---a-|                      ');
            var y = cold('--                ');
            var unsub = '-----------!                ';
            var values = { x: x, y: y };
            var result = source.pipe(operators_1.windowTime(timeSpan, interval, rxTestScheduler));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, time = _a.time, expectSubscriptions = _a.expectSubscriptions, expectObservable = _a.expectObservable;
            var source = hot('--1--2--^--a--b--c--d--e--f--g--h--|');
            var sourcesubs = '^-------------!             ';
            var timeSpan = time('-----|');
            var interval = time('----------|');
            var expected = 'x---------y----             ';
            var x = cold('---a-|                      ');
            var y = cold('--d--             ');
            var unsub = '--------------!             ';
            var values = { x: x, y: y };
            var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.windowTime(timeSpan, interval, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(source.subscriptions).toBe(sourcesubs);
        });
    });
    it('should not error if maxWindowSize is hit while nexting to other windows.', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectObservable = _a.expectObservable;
            var source = cold('                ----a---b---c---d---e---f---g---h---i---j---');
            var windowTimeSpan = time('        ------------|');
            var windowCreationInterval = time('--------|');
            var maxWindowSize = 4;
            var a = cold('                     ----a---b---|');
            var b = cold('                             b---c---d---(e|)');
            var c = cold('                                     ----e---f---(g|)');
            var d = cold('                                             ----g---h---(i|)');
            var e = cold('                                                     ----i---j--');
            var f = cold('                                                             ---');
            var expected = '                   a-------b-------c-------d-------e-------f---';
            var killSub = '                    ------------------------------------------!';
            var values = { a: a, b: b, c: c, d: d, e: e, f: f };
            var result = source.pipe(operators_1.windowTime(windowTimeSpan, windowCreationInterval, maxWindowSize, rxTestScheduler));
            expectObservable(result, killSub).toBe(expected, values);
        });
    });
});
//# sourceMappingURL=windowTime-spec.js.map