"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('bufferTime operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit buffers at intervals', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c---d---e---f---g-----|   ');
            var subs = '    ^--------------------------------!   ';
            var t = time('  ----------|                          ');
            var expected = '----------w---------x---------y--(z|)';
            var values = {
                w: ['a', 'b'],
                x: ['c', 'd', 'e'],
                y: ['f', 'g'],
                z: []
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should emit buffers at intervals test 2', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable;
            var e1 = hot('  ---------a---------b---------c---------d---------e---------g--------|   ');
            var t = time('  --------------------------------|                                       ');
            var expected = '--------------------------------x-------------------------------y---(z|)';
            var values = {
                x: ['a', 'b', 'c'],
                y: ['d', 'e', 'g'],
                z: []
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should emit buffers at intervals or when the buffer is full', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c---d---e---f---g-----|   ');
            var subs = '    ^--------------------------------!   ';
            var t = time('  ----------|                          ');
            var expected = '-------w-------x-------y---------(z|)';
            var values = {
                w: ['a', 'b'],
                x: ['c', 'd'],
                y: ['e', 'f'],
                z: ['g']
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, 2, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should emit buffers at intervals or when the buffer is full test 2', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c---d---e---f---g-----|   ');
            var subs = '    ^--------------------------------!   ';
            var t = time('  ----------|                          ');
            var expected = '----------w--------x---------y---(z|)';
            var values = {
                w: ['a', 'b'],
                x: ['c', 'd', 'e'],
                y: ['f', 'g'],
                z: []
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, 3, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should emit buffers that have been created at intervals and close after the specified delay', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable;
            var e1 = hot('       ---a---b---c----d----e----f----g----h----i----(k|)');
            var t = time('       ---------------------|                            ');
            var interval = time('--------------------|                             ');
            var expected = '     ---------------------x-------------------y----(z|)';
            var values = {
                x: ['a', 'b', 'c', 'd', 'e'],
                y: ['e', 'f', 'g', 'h', 'i'],
                z: ['i', 'k']
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should emit buffers that have been created at intervals and close after the specified delay ' +
        'or when the buffer is full', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable;
            var e1 = hot('  ---a---b---c----d----e----f----g----h----i----(k|)');
            var t = time('  ---------------------|                            ');
            var interval = time('                --------------------|        ');
            var expected = '----------------x-------------------y---------(z|)';
            var values = {
                x: ['a', 'b', 'c', 'd'],
                y: ['e', 'f', 'g', 'h'],
                z: ['i', 'k']
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, 4, testScheduler));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should emit buffers with timeSpan 10 and creationInterval 7', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--1--^2--3---4---5--6--7---8----9------------|   ');
            var e1subs = '     ^---------------------------------------!   ';
            var t = time('     ----------|');
            var interval = time('        -------|');
            var expected = '   ----------a------b------c------d------e-(f|)';
            var values = {
                a: ['2', '3', '4'],
                b: ['4', '5', '6'],
                c: ['6', '7', '8'],
                d: ['8', '9'],
                e: [],
                f: []
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should emit buffers but handle source ending with an error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable;
            var e1 = hot('--1--^2--3---4---5--6--7---8----9------------#');
            var t = time('     ----------|');
            var interval = time('        -------|');
            var expected = '   ----------a------b------c------d------e-#';
            var values = {
                a: ['2', '3', '4'],
                b: ['4', '5', '6'],
                c: ['6', '7', '8'],
                d: ['8', '9'],
                e: []
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should emit buffers and allow result to unsubscribed early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--1--^2--3---4---5--6--7---8----9------------|');
            var unsub = '      -----------------!                       ';
            var subs = '       ^----------------!                       ';
            var t = time('     ----------|                              ');
            var interval = time('        -------|                       ');
            var expected = '   ----------a------                        ';
            var values = {
                a: ['2', '3', '4']
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, Infinity, testScheduler));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--1--^2--3---4---5--6--7---8----9------------|');
            var subs = '       ^---------------!                        ';
            var t = time('     ----------|');
            var interval = time('        -------|');
            var expected = '   ----------a------                        ';
            var unsub = '      ----------------!                        ';
            var values = {
                a: ['2', '3', '4']
            };
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.bufferTime(t, interval, Infinity, testScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)';
            var expected = '(b|)';
            var values = { b: [] };
            var t = time('----------|');
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should handle never', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, time = _a.time, expectObservable = _a.expectObservable;
            var e1 = cold('-');
            var unsub = '   --------------------------------------------!';
            var t = time('  ----------|                                  ');
            var expected = '----------a---------a---------a---------a----';
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result, unsub).toBe(expected, { a: [] });
        });
    });
    it('should handle throw', function () {
        testScheduler.run(function (_a) {
            var time = _a.time, expectObservable = _a.expectObservable;
            var e1 = rxjs_1.throwError(new Error('haha'));
            var expected = '#';
            var t = time('----------|');
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result).toBe(expected, undefined, new Error('haha'));
        });
    });
    it('should handle errors', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c---#');
            var e1subs = '  ^--------------!';
            var t = time('  ----------|');
            var expected = '----------w----#';
            var values = {
                w: ['a', 'b']
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should emit buffers that have been created at intervals and close after ' +
        'the specified delay with errors', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c----d----e----f----g----h----i--#');
            var e1subs = '  ^-------------------------------------------!';
            var t = time('  ---------------------|                       ');
            var interval = time('                --------------------|   ');
            var expected = '---------------------x-------------------y--#';
            var values = {
                x: ['a', 'b', 'c', 'd', 'e'],
                y: ['e', 'f', 'g', 'h', 'i']
            };
            var result = e1.pipe(operators_1.bufferTime(t, interval, Infinity, testScheduler));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not throw when subscription synchronously unsubscribed after emit', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, time = _a.time, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---c---d---e---f---g-----|');
            var subs = '    ^-------------------!             ';
            var t = time('  ----------|                       ');
            var expected = '----------w---------(x|)          ';
            var values = {
                w: ['a', 'b'],
                x: ['c', 'd', 'e']
            };
            var result = e1.pipe(operators_1.bufferTime(t, null, Infinity, testScheduler), operators_1.take(2));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not have errors when take follows and maxBufferSize is provided', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var tick = 1;
            var buffTime = 5;
            var expected = '-----a----b----c----d----(e|)';
            var values = {
                a: [0, 1, 2, 3],
                b: [4, 5, 6, 7, 8],
                c: [9, 10, 11, 12, 13],
                d: [14, 15, 16, 17, 18],
                e: [19, 20, 21, 22, 23]
            };
            var source = rxjs_1.interval(tick, testScheduler).pipe(operators_1.bufferTime(buffTime, null, 10, testScheduler), operators_1.take(5));
            expectObservable(source).toBe(expected, values);
        });
    });
});
//# sourceMappingURL=bufferTime-spec.js.map