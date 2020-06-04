"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('merge operator', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should handle merging two hot observables', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a-----b-----c----|');
            var e1subs = '  ^------------------!';
            var e2 = hot('-----d-----e-----f---|');
            var e2subs = '  ^--------------------!';
            var expected = '--a--d--b--e--c--f---|';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge a source with a second', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var b = rxjs_1.of(4, 5, 6, 7, 8);
        var r = [1, 2, 3, 4, 5, 6, 7, 8];
        a.pipe(operators_1.mergeWith(b)).subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, function () {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should merge cold and cold', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---a-----b-----c----|');
            var e1subs = '  ^-------------------!';
            var e2 = cold(' ------x-----y-----z----|');
            var e2subs = '  ^----------------------!';
            var expected = '---a--x--b--y--c--z----|';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge hot and hot', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---a---^-b-----c----|');
            var e1subs = '       ^------------!';
            var e2 = hot('-----x-^----y-----z----|');
            var e2subs = '       ^---------------!';
            var expected = '     --b--y--c--z----|';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge hot and cold', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---a-^---b-----c----|');
            var e1subs = '     ^--------------!';
            var e2 = cold('    --x-----y-----z----|');
            var e2subs = '     ^------------------!';
            var expected = '   --x-b---y-c---z----|';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge parallel emissions', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a----b----c----|');
            var e1subs = '  ^-----------------!';
            var e2 = hot('  ---x----y----z----|');
            var e2subs = '  ^-----------------!';
            var expected = '---(ax)-(by)-(cz)-|';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a-----b-----c----|  ');
            var e1subs = '  ^---------!           ';
            var e2 = hot('  -----d-----e-----f---|');
            var e2subs = '  ^---------!           ';
            var expected = '--a--d--b--           ';
            var unsub = '   ----------!           ';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a-----b-----c----|  ');
            var e1subs = '  ^---------!           ';
            var e2 = hot('  -----d-----e-----f---|');
            var e2subs = '  ^---------!           ';
            var expected = '--a--d--b--           ';
            var unsub = '   ----------!           ';
            var result = e1.pipe(operators_1.map(function (x) { return x; }), operators_1.mergeWith(e2), operators_1.map(function (x) { return x; }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge empty and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('|   ');
            var e1subs = ' (^!)';
            var e2 = cold('|   ');
            var e2subs = ' (^!)';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('|');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge three empties', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('|');
            var e1subs = ' (^!)';
            var e2 = cold('|');
            var e2subs = ' (^!)';
            var e3 = cold('|');
            var e3subs = ' (^!)';
            var result = e1.pipe(operators_1.mergeWith(e2, e3));
            expectObservable(result).toBe('|');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    it('should merge never and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('-');
            var e1subs = ' ^';
            var e2 = cold('|');
            var e2subs = ' (^!)';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('-');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge never and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('-');
            var e1subs = ' ^';
            var e2 = cold('-');
            var e2subs = ' ^';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('-');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge empty and throw', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('|');
            var e1subs = ' (^!)';
            var e2 = cold('#');
            var e2subs = ' (^!)';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('#');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge hot and throw', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot(' --a--b--c--|');
            var e1subs = '(^!)';
            var e2 = cold('#');
            var e2subs = '(^!)';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('#');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge never and throw', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('-');
            var e1subs = ' (^!)';
            var e2 = cold('#');
            var e2subs = ' (^!)';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe('#');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge empty and eventual error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)    ';
            var e2 = hot('  -------#');
            var e2subs = '  ^------!';
            var expected = '-------#';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge hot and error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^------!    ';
            var e2 = hot('  -------#    ');
            var e2subs = '  ^------!    ';
            var expected = '--a--b-#    ';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should merge never and error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --------');
            var e1subs = '  ^------!';
            var e2 = hot('  -------#');
            var e2subs = '  ^------!';
            var expected = '-------#';
            var result = e1.pipe(operators_1.mergeWith(e2));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
});
describe('mergeAll operator', function () {
    it('should merge two observables', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var b = rxjs_1.of(4, 5, 6, 7, 8);
        var r = [1, 2, 3, 4, 5, 6, 7, 8];
        rxjs_1.of(a, b)
            .pipe(operators_1.mergeAll())
            .subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, null, done);
    });
    it('should merge two immediately-scheduled observables', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [1, 2, 4, 3, 5, 6, 7, 8];
        rxjs_1.of(a, b, rxjs_1.queueScheduler)
            .pipe(operators_1.mergeAll())
            .subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, null, done);
    });
});
//# sourceMappingURL=mergeWith-spec.js.map