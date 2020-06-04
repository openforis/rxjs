"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('take operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    asDiagram('take(2)')('should take two values of an observable with many values', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a-----b----c---d--|');
            var e1subs = '  ^-------!------------';
            var expected = '--a-----(b|)         ';
            expectObservable(e1.pipe(operators_1.take(2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should work with empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)';
            var expected = '|';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should go on forever on never', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('-');
            var e1subs = '  ^';
            var expected = '-';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should be empty on take(0)', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b----c---d--|');
            var e1subs = [];
            var expected = '   |';
            expectObservable(e1.pipe(operators_1.take(0))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take one value of an observable with one value', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---(a|)');
            var e1subs = '  ^--!---';
            var expected = '---(a|)';
            expectObservable(e1.pipe(operators_1.take(1))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take one values of an observable with many values', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b----c---d--|');
            var e1subs = '     ^--!------------';
            var expected = '   ---(b|)         ';
            expectObservable(e1.pipe(operators_1.take(1))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should error on empty', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^----|');
            var e1subs = '     ^----!';
            var expected = '   -----|';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should propagate error from the source observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^---#', undefined, 'too bad');
            var e1subs = '   ^---!';
            var expected = ' ----#';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected, null, 'too bad');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should propagate error from an observable with values', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b--#');
            var e1subs = '   ^--------!';
            var expected = ' ---a--b--#';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b-----c--d--e--|');
            var unsub = '    ---------!------------';
            var e1subs = '   ^--------!------------';
            var expected = ' ---a--b---            ';
            expectObservable(e1.pipe(operators_1.take(42)), unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should work with throw', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var e1subs = '  (^!)';
            var expected = '#';
            expectObservable(e1.pipe(operators_1.take(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should throw if total is less than zero', function () {
        chai_1.expect(function () { rxjs_1.range(0, 10).pipe(operators_1.take(-1)); })
            .to.throw(rxjs_1.ArgumentOutOfRangeError);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b-----c--d--e--|');
            var unsub = '    ---------!            ';
            var e1subs = '   ^--------!            ';
            var expected = ' ---a--b---            ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.take(42), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should unsubscribe from the source when it reaches the limit', function () {
        var source = new rxjs_1.Observable(function (observer) {
            chai_1.expect(observer.closed).to.be.false;
            observer.next(42);
            chai_1.expect(observer.closed).to.be.true;
        }).pipe(operators_1.take(1));
        source.subscribe();
    });
    it('should complete when the source is reentrant', function () {
        var completed = false;
        var source = new rxjs_1.Subject();
        source.pipe(operators_1.take(5)).subscribe({
            next: function () {
                source.next();
            },
            complete: function () {
                completed = true;
            }
        });
        source.next();
        chai_1.expect(completed).to.be.true;
    });
});
//# sourceMappingURL=take-spec.js.map