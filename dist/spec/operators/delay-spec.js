"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var sinon = require("sinon");
var chai_1 = require("chai");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('delay operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should delay by specified timeframe', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---a--b--|');
            var t = 2;
            var expected = '-----a--b|';
            var subs = '^--------!';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should delay by absolute time period', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--|   ');
            var t = 3;
            var expected = '-----a--(b|)';
            var subs = '    ^-------!   ';
            var absoluteDelay = new Date(testScheduler.now() + t);
            var result = e1.pipe(operators_1.delay(absoluteDelay, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should delay by absolute time period after subscription', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---^--a--b--|   ');
            var t = 3;
            var expected = '   ------a--(b|)';
            var subs = '       ^--------!   ';
            var absoluteDelay = new Date(testScheduler.now() + t);
            var result = e1.pipe(operators_1.delay(absoluteDelay, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should raise error when source raises error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---#');
            var t = 3;
            var expected = '------a---b#';
            var subs = '    ^----------!';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should raise error when source raises error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#');
            var t = 3;
            var expected = '-----a--#';
            var subs = '    ^-------!';
            var absoluteDelay = new Date(testScheduler.now() + t);
            var result = e1.pipe(operators_1.delay(absoluteDelay, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should raise error when source raises error after subscription', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---^---a---b---#');
            var t = 3;
            var expected = '   -------a---b#';
            var e1Sub = '      ^-----------!';
            var absoluteDelay = new Date(testScheduler.now() + t);
            var result = e1.pipe(operators_1.delay(absoluteDelay, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1Sub);
        });
    });
    it('should delay when source does not emits', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ----|   ');
            var t = 3;
            var expected = '----|';
            var subs = '    ^---!   ';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not delay when source is empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold('|');
            var t = 3;
            var expected = '|';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
        });
    });
    it('should delay complete when a value is scheduled', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold('-a-|');
            var t = 3;
            var expected = '----(a|)';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
        });
    });
    it('should not complete when source does not completes', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b---------');
            var t = 3;
            var expected = '------a---b------';
            var unsub = '   ----------------!';
            var subs = '    ^---------------!';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a---b----');
            var t = 3;
            var e1subs = '  ^-------!   ';
            var expected = '------a--   ';
            var unsub = '   --------!   ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.delay(t, testScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not complete when source never completes', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' -');
            var t = 3;
            var expected = '-';
            var result = e1.pipe(operators_1.delay(t, testScheduler));
            expectObservable(result).toBe(expected);
        });
    });
    it('should unsubscribe scheduled actions after execution', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var subscribeSpy = null;
            var counts = [];
            var e1 = cold('      a|');
            var expected = '     --a-(a|)';
            var duration = 1;
            var result = e1.pipe(operators_1.repeatWhen(function (notifications) {
                var delayed = notifications.pipe(operators_1.delay(duration, testScheduler));
                subscribeSpy = sinon.spy(delayed['source'], 'subscribe');
                return delayed;
            }), operators_1.skip(1), operators_1.take(2), operators_1.tap({
                next: function () {
                    var subscriber = subscribeSpy.args[0][0];
                    counts.push(subscriber._subscriptions.length);
                },
                complete: function () {
                    chai_1.expect(counts).to.deep.equal([1, 1]);
                }
            }));
            expectObservable(result).toBe(expected);
        });
    });
    it('should be possible to delay complete by composition', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---a--b--|');
            var t = 2;
            var expected = '-----a--b--|';
            var subs = '    ^--------!';
            var result = rxjs_1.concat(e1.pipe(operators_1.delay(t, testScheduler)), rxjs_1.of(undefined).pipe(operators_1.delay(t, testScheduler), operators_1.ignoreElements()));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
});
//# sourceMappingURL=delay-spec.js.map