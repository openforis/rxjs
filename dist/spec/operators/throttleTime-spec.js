"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('throttleTime operator', function () {
    asDiagram('throttleTime(50)')('should immediately emit the first value in each time window', function () {
        var e1 = marble_testing_1.hot('-a-x-y----b---x-cx---|');
        var subs = '^                    !';
        var expected = '-a--------b-----c----|';
        var result = e1.pipe(operators_1.throttleTime(50, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should throttle events by 50 time units', function (done) {
        rxjs_1.of(1, 2, 3).pipe(operators_1.throttleTime(50))
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(1);
        }, null, done);
    });
    it('should throttle events multiple times', function () {
        var expected = ['1-0', '2-0'];
        rxjs_1.concat(rxjs_1.timer(0, 10, rxTestScheduler).pipe(operators_1.take(3), operators_1.map(function (x) { return '1-' + x; })), rxjs_1.timer(80, 10, rxTestScheduler).pipe(operators_1.take(5), operators_1.map(function (x) { return '2-' + x; }))).pipe(operators_1.throttleTime(50, rxTestScheduler)).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        });
        rxTestScheduler.flush();
    });
    it('should simply mirror the source if values are not emitted often enough', function () {
        var e1 = marble_testing_1.hot('-a--------b-----c----|');
        var subs = '^                    !';
        var expected = '-a--------b-----c----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle a busy producer emitting a regular repeating sequence', function () {
        var e1 = marble_testing_1.hot('abcdefabcdefabcdefabcdefa|');
        var subs = '^                        !';
        var expected = 'a-----a-----a-----a-----a|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.hot('-----|');
        var subs = '^    !';
        var expected = '-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should raise error when source does not emit and raises error', function () {
        var e1 = marble_testing_1.hot('-----#');
        var subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle an empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(30, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle a never source', function () {
        var e1 = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(30, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle a throw source', function () {
        var e1 = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(30, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should throttle and does not complete when source does not completes', function () {
        var e1 = marble_testing_1.hot('-a--(bc)-------d----------------');
        var unsub = '                               !';
        var subs = '^                              !';
        var expected = '-a-------------d----------------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(50, rxTestScheduler)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('-a--(bc)-------d----------------');
        var subs = '^                              !';
        var expected = '-a-------------d----------------';
        var unsub = '                               !';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.throttleTime(50, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should throttle values until source raises error', function () {
        var e1 = marble_testing_1.hot('-a--(bc)-------d---------------#');
        var subs = '^                              !';
        var expected = '-a-------------d---------------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttleTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    describe('throttleTime(fn, { leading: true, trailing: true })', function () {
        asDiagram('throttleTime(fn, { leading: true, trailing: true })')('should immediately emit the first and last values in each time window', function () {
            var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx--|');
            var e1subs = '^                     !';
            var t = marble_testing_1.time('----|                  ');
            var expected = '-a---y----b---x-c---x-|';
            var result = e1.pipe(operators_1.throttleTime(t, rxTestScheduler, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should emit the value if only a single one is given', function () {
            var e1 = marble_testing_1.hot('-a--------------------|');
            var t = marble_testing_1.time('----|                  ');
            var expected = '-a--------------------|';
            var result = e1.pipe(operators_1.throttleTime(t, rxTestScheduler, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
        });
    });
    describe('throttleTime(fn, { leading: false, trailing: true })', function () {
        asDiagram('throttleTime(fn, { leading: false, trailing: true })')('should immediately emit the last value in each time window', function () {
            var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx--|');
            var e1subs = '^                     !';
            var t = marble_testing_1.time('----|                  ');
            var expected = '-----y--------x-----x-|';
            var result = e1.pipe(operators_1.throttleTime(t, rxTestScheduler, { leading: false, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should emit the last throttled value when complete', function () {
            var e1 = marble_testing_1.hot('-a-xy-----b--x--cxx|');
            var e1subs = '^                  !';
            var t = marble_testing_1.time('----|               ');
            var expected = '-----y--------x----(x|)';
            var result = e1.pipe(operators_1.throttleTime(t, rxTestScheduler, { leading: false, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should emit the value if only a single one is given', function () {
            var e1 = marble_testing_1.hot('-a--------------------|');
            var t = marble_testing_1.time('----|                  ');
            var expected = '-----a----------------|';
            var result = e1.pipe(operators_1.throttleTime(t, rxTestScheduler, { leading: false, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
        });
    });
});
//# sourceMappingURL=throttleTime-spec.js.map