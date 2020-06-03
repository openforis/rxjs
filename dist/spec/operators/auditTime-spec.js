"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('auditTime operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit the last value in each time window', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a-x-y----b---x-cx---|');
            var subs = '    ^--------------------!';
            var expected = '------y--------x-----|';
            var result = e1.pipe(operators_1.auditTime(5, testScheduler));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should auditTime events by 5 time units', function (done) {
        rxjs_1.of(1, 2, 3).pipe(operators_1.auditTime(5)).subscribe(function (x) {
            done(new Error('should not be called'));
        }, null, function () {
            done();
        });
    });
    it('should auditTime events multiple times', function () {
        var expected = ['1-2', '2-2'];
        rxjs_1.concat(rxjs_1.timer(0, 10, testScheduler).pipe(operators_1.take(3), operators_1.map(function (x) { return '1-' + x; })), rxjs_1.timer(80, 10, testScheduler).pipe(operators_1.take(5), operators_1.map(function (x) { return '2-' + x; }))).pipe(operators_1.auditTime(50, testScheduler)).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        });
        testScheduler.flush();
    });
    it('should delay the source if values are not emitted often enough', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a--------b-----c----|');
            var subs = '    ^--------------------!';
            var expected = '------a--------b-----|';
            expectObservable(e1.pipe(operators_1.auditTime(5, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a busy producer emitting a regular repeating sequence', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdefabcdefabcdefa|');
            var subs = '    ^------------------------!';
            var expected = '-----f-----f-----f-----f-|';
            expectObservable(e1.pipe(operators_1.auditTime(5, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should complete when source does not emit', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -----|');
            var subs = '    ^----!';
            var expected = '-----|';
            expectObservable(e1.pipe(operators_1.auditTime(5, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should raise error when source does not emit and raises error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -----#');
            var subs = '    ^----!';
            var expected = '-----#';
            expectObservable(e1.pipe(operators_1.auditTime(1, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle an empty source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var subs = '    (^!)';
            var expected = '|';
            expectObservable(e1.pipe(operators_1.auditTime(3, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a never source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' -');
            var subs = '    ^';
            var expected = '-';
            expectObservable(e1.pipe(operators_1.auditTime(3, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a throw source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var subs = '    (^!)';
            var expected = '#';
            expectObservable(e1.pipe(operators_1.auditTime(3, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not complete when source does not complete', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a--(bc)-------d----------------');
            var unsub = '   -------------------------------!';
            var subs = '    ^------------------------------!';
            var expected = '------c-------------d-----------';
            expectObservable(e1.pipe(operators_1.auditTime(5, testScheduler)), unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a--(bc)-------d----------------');
            var subs = '    ^------------------------------!';
            var expected = '------c-------------d-----------';
            var unsub = '   -------------------------------!';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.auditTime(5, testScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should auditTime values until source raises error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a--(bc)-------d---------------#');
            var subs = '    ^------------------------------!';
            var expected = '------c-------------d----------#';
            expectObservable(e1.pipe(operators_1.auditTime(5, testScheduler))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
});
//# sourceMappingURL=auditTime-spec.js.map