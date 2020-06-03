"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var test_helper_1 = require("../helpers/test-helper");
describe('takeLast operator', function () {
    var rxTest;
    beforeEach(function () {
        rxTest = new testing_1.TestScheduler(test_helper_1.assertDeepEquals);
    });
    it('should error for invalid arguments', function () {
        chai_1.expect(function () {
            rxjs_1.of(1, 2, 3).pipe(operators_1.takeLast());
        }).to.throw(TypeError, "'count' is not a number");
        chai_1.expect(function () {
            rxjs_1.of(1, 2, 3).pipe(operators_1.takeLast('banana'));
        }).to.throw(TypeError, "'count' is not a number");
        chai_1.expect(function () {
            rxjs_1.of(1, 2, 3).pipe(operators_1.takeLast('3'));
        }).not.to.throw();
    });
    it('should take two values of an observable with many values', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('--a-----b----c---d--|    ');
            var e1subs = ' ^-------------------!    ';
            var expected = '--------------------(cd|)';
            expectObservable(e1.pipe(operators_1.takeLast(2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take last three values', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a-----b----c---d--|    ');
            var e1subs = '  ^-------------------!    ';
            var expected = '--------------------(bcd|)';
            expectObservable(e1.pipe(operators_1.takeLast(3))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take all element when try to take larger then source', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a-----b----c---d--|    ');
            var e1subs = '  ^-------------------!    ';
            var expected = '--------------------(abcd|)';
            expectObservable(e1.pipe(operators_1.takeLast(5))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take all element when try to take exact', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a-----b----c---d--|    ');
            var e1subs = '  ^-------------------!    ';
            var expected = '--------------------(abcd|)';
            expectObservable(e1.pipe(operators_1.takeLast(4))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not take any values', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' --a-----b----c---d--|');
            var expected = '|';
            expectObservable(e1.pipe(operators_1.takeLast(0))).toBe(expected);
        });
    });
    it('should work with empty', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)';
            var expected = '|';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should go on forever on never', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' -');
            var e1subs = '  ^';
            var expected = '-';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should be empty on takeLast(0)', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b----c---d--|');
            var expected = '   |';
            var e1subs = [];
            expectObservable(e1.pipe(operators_1.takeLast(0))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take one value from an observable with one value', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---(a|)');
            var e1subs = '  ^--!   ';
            var expected = '---(a|)';
            expectObservable(e1.pipe(operators_1.takeLast(1))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should take one value from an observable with many values', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b----c---d--|   ');
            var e1subs = '     ^--------------!   ';
            var expected = '   ---------------(d|)';
            expectObservable(e1.pipe(operators_1.takeLast(1))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should error on empty', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^----|');
            var e1subs = '     ^----!';
            var expected = '   -----|';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should propagate error from the source observable', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^---#', undefined, 'too bad');
            var e1subs = '   ^---!';
            var expected = ' ----#';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected, null, 'too bad');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should propagate error from an observable with values', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b--#');
            var e1subs = '   ^--------!';
            var expected = ' ---------#';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b-----c--d--e--|');
            var unsub = '    ---------!            ';
            var e1subs = '   ^--------!            ';
            var expected = ' ----------------------';
            expectObservable(e1.pipe(operators_1.takeLast(42)), unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should work with throw', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var e1subs = '  (^!)';
            var expected = '#';
            expectObservable(e1.pipe(operators_1.takeLast(42))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should throw if total is less than zero', function () {
        chai_1.expect(function () {
            rxjs_1.range(0, 10).pipe(operators_1.takeLast(-1));
        }).to.throw(rxjs_1.ArgumentOutOfRangeError);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--a--b-----c--d--e--|');
            var unsub = '    ---------!            ';
            var e1subs = '   ^--------!            ';
            var expected = ' ----------------------';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.takeLast(42), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
});
//# sourceMappingURL=takeLast-spec.js.map