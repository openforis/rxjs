"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var test_helper_1 = require("../helpers/test-helper");
describe('concat operator', function () {
    var rxTest;
    beforeEach(function () {
        rxTest = new testing_1.TestScheduler(test_helper_1.assertDeepEquals);
    });
    it('should concatenate two cold observables', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' --a--b-|');
            var e2 = cold('        --x---y--|');
            var expected = '--a--b---x---y--|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
        });
    });
    it('should work properly with scalar observables', function (done) {
        var results = [];
        var s1 = new rxjs_1.Observable(function (observer) {
            setTimeout(function () {
                observer.next(1);
                observer.complete();
            });
        }).pipe(operators_1.concatWith(rxjs_1.of(2)));
        s1.subscribe(function (x) {
            results.push('Next: ' + x);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            results.push('Completed');
            chai_1.expect(results).to.deep.equal(['Next: 1', 'Next: 2', 'Completed']);
            done();
        });
    });
    it('should complete without emit if both sources are empty', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --|');
            var e1subs = '  ^-!';
            var e2 = cold('   ----|');
            var e2subs = '  --^---!';
            var expected = '------|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if first source does not completes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---');
            var e1subs = '  ^--';
            var e2 = cold('    --|');
            var e2subs = test_helper_1.NO_SUBS;
            var expected = '---';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if second source does not completes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --|');
            var e1subs = '  ^-!';
            var e2 = cold('   ---');
            var e2subs = '  --^--';
            var expected = '-----';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if both sources do not complete', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---');
            var e1subs = '  ^--';
            var e2 = cold('    ---');
            var e2subs = test_helper_1.NO_SUBS;
            var expected = '---';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error when first source is empty, second source raises error', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --|');
            var e1subs = '  ^-!';
            var e2 = cold('   ----#');
            var e2subs = '  --^---!';
            var expected = '------#';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error when first source raises error, second source is empty', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---#');
            var e1subs = '  ^--!';
            var e2 = cold('    ----|');
            var expected = '---#';
            var e2subs = test_helper_1.NO_SUBS;
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise first error when both source raise error', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---#');
            var e1subs = '  ^--!';
            var e2 = cold('    ------#');
            var expected = '---#';
            var e2subs = test_helper_1.NO_SUBS;
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should concat if first source emits once, second source is empty', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a--|');
            var e1subs = '  ^----!';
            var e2 = cold('      --------|');
            var e2subs = '  -----^-------!';
            var expected = '--a----------|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should concat if first source is empty, second source emits once', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --|');
            var e1subs = '  ^-!';
            var e2 = cold('   --a--|');
            var e2subs = '  --^----!';
            var expected = '----a--|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit element from first source, and should not complete if second ' + 'source does not completes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a--|');
            var e1subs = '  ^----!';
            var e2 = cold('      ---');
            var e2subs = '  -----^--';
            var expected = '--a-----';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if first source does not complete', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---');
            var e1subs = '  ^--';
            var e2 = cold('    --a--|');
            var e2subs = test_helper_1.NO_SUBS;
            var expected = '---';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit elements from each source when source emit once', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---a|');
            var e1subs = '  ^---!';
            var e2 = cold('     -----b--|');
            var e2subs = '  ----^-------!';
            var expected = '---a-----b--|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should unsubscribe to inner source if outer is unsubscribed early', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a-a--a|            ');
            var e1subs = '   ^--------!            ';
            var e2 = cold('           -----b-b--b-|');
            var e2subs = '   ---------^-------!';
            var unsub = '    -----------------!  ';
            var expected = ' ---a-a--a-----b-b     ';
            expectObservable(e1.pipe(operators_1.concatWith(e2)), unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---a-a--a|            ');
            var e1subs = '  ^--------!            ';
            var e2 = cold('          -----b-b--b-|');
            var e2subs = '  ---------^--------!    ';
            var expected = '---a-a--a-----b-b-    ';
            var unsub = '   ------------------!    ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.concatWith(e2), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error from first source and does not emit from second source', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --#');
            var e1subs = '  ^-!';
            var e2 = cold('   ----a--|');
            var e2subs = test_helper_1.NO_SUBS;
            var expected = '--#';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit element from first source then raise error from second source', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a--|');
            var e1subs = '  ^----!';
            var e2 = cold('      -------#');
            var e2subs = '  -----^------!';
            var expected = '--a---------#';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit all elements from both hot observable sources if first source ' +
        'completes before second source starts emit', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b-|');
            var e1subs = '  ^------!';
            var e2 = hot('  --------x--y--|');
            var e2subs = '  -------^------!';
            var expected = '--a--b--x--y--|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit elements from second source regardless of completion time ' + 'when second source is cold observable', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c---|');
            var e1subs = '  ^-----------!';
            var e2 = cold('           -x-y-z-|');
            var e2subs = '  ------------^------!';
            var expected = '--a--b--c----x-y-z-|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not emit collapsing element from second source', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----------!';
            var e2 = hot('  --------x--y--z--|');
            var e2subs = '  -----------^-----!';
            var expected = '--a--b--c--y--z--|';
            expectObservable(e1.pipe(operators_1.concatWith(e2))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit self without parameters', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' ---a-|');
            var e1subs = '  ^----!';
            var expected = '---a-|';
            expectObservable(e1.pipe(operators_1.concatWith())).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
});
//# sourceMappingURL=concatWith-spec.js.map