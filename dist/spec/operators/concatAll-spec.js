"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('concatAll operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    asDiagram('concatAll')('should concat an observable of observables', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable;
            var x = cold('    ----a------b------|                 ');
            var y = cold('                      ---c-d---|        ');
            var z = cold('                               ---e--f-|');
            var outer = hot('-x---y----z------|', { x: x, y: y, z: z });
            var expected = ' -----a------b---------c-d------e--f-|';
            var result = outer.pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
        });
    });
    it('should concat sources from promise', function (done) {
        this.timeout(2000);
        var sources = rxjs_1.from([
            new Promise(function (res) {
                res(0);
            }),
            new Promise(function (res) {
                res(1);
            }),
            new Promise(function (res) {
                res(2);
            }),
            new Promise(function (res) {
                res(3);
            })
        ]).pipe(operators_1.take(10));
        var res = [];
        sources.pipe(operators_1.concatAll()).subscribe(function (x) {
            res.push(x);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(res).to.deep.equal([0, 1, 2, 3]);
            done();
        });
    });
    it('should concat and raise error from promise', function (done) {
        this.timeout(2000);
        var sources = rxjs_1.from([
            new Promise(function (res) {
                res(0);
            }),
            new Promise(function (res, rej) {
                rej(1);
            }),
            new Promise(function (res) {
                res(2);
            }),
            new Promise(function (res) {
                res(3);
            })
        ]).pipe(operators_1.take(10));
        var res = [];
        sources.pipe(operators_1.concatAll()).subscribe(function (x) {
            res.push(x);
        }, function (err) {
            chai_1.expect(res.length).to.equal(1);
            chai_1.expect(err).to.equal(1);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should concat all observables in an observable', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var e1 = rxjs_1.from([rxjs_1.of('a'), rxjs_1.of('b'), rxjs_1.of('c')]).pipe(operators_1.take(10));
            var expected = '(abc|)';
            expectObservable(e1.pipe(operators_1.concatAll())).toBe(expected);
        });
    });
    it('should throw if any child observable throws', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var e1 = rxjs_1.from([rxjs_1.of('a'), rxjs_1.throwError('error'), rxjs_1.of('c')]).pipe(operators_1.take(10));
            var expected = '(a#)';
            expectObservable(e1.pipe(operators_1.concatAll())).toBe(expected);
        });
    });
    it('should concat merging a hot observable of non-overlapped observables', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable;
            var values = {
                x: cold('       a-b---------|'),
                y: cold('                 c-d-e-f-|'),
                z: cold('                          g-h-i-j-k-|')
            };
            var e1 = hot('  --x---------y--------z--------|', values);
            var expected = '--a-b---------c-d-e-f-g-h-i-j-k-|';
            expectObservable(e1.pipe(operators_1.concatAll())).toBe(expected);
        });
    });
    it('should raise error if inner observable raises error', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable;
            var values = {
                x: cold('       a-b---------|'),
                y: cold('                 c-d-e-f-#'),
                z: cold('                         g-h-i-j-k-|')
            };
            var e1 = hot('  --x---------y--------z--------|', values);
            var expected = '--a-b---------c-d-e-f-#';
            expectObservable(e1.pipe(operators_1.concatAll())).toBe(expected);
        });
    });
    it('should raise error if outer observable raises error', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable;
            var values = {
                y: cold('       a-b---------|'),
                z: cold('                 c-d-e-f-|')
            };
            var e1 = hot('  --y---------z---#    ', values);
            var expected = '--a-b---------c-#';
            expectObservable(e1.pipe(operators_1.concatAll())).toBe(expected);
        });
    });
    it('should complete without emit if both sources are empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --|');
            var e1subs = '   ^-!';
            var e2 = cold('    ----|');
            var e2subs = '   --^---!';
            var expected = ' ------|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if first source does not completes', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  -');
            var e1subs = '   ^';
            var e2 = cold('  --|');
            var e2subs = [];
            var expected = ' -';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if second source does not completes', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --|');
            var e1subs = '   ^-!';
            var e2 = cold('  ---');
            var e2subs = '   --^';
            var expected = ' ---';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if both sources do not complete', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  -');
            var e1subs = '   ^';
            var e2 = cold('  -');
            var e2subs = [];
            var expected = ' -';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error when first source is empty, second source raises error', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --|');
            var e1subs = '   ^-!';
            var e2 = cold('    ----#');
            var e2subs = '   --^---!';
            var expected = ' ------#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error when first source raises error, second source is empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---#');
            var e1subs = '   ^--!';
            var e2 = cold('  ----|');
            var e2subs = [];
            var expected = ' ---#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise first error when both source raise error', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---#');
            var e1subs = '   ^--!';
            var e2 = cold('  ------#');
            var e2subs = [];
            var expected = ' ---#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should concat if first source emits once, second source is empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --a--|');
            var e1subs = '   ^----!';
            var e2 = cold('       --------|');
            var e2subs = '   -----^-------!';
            var expected = ' --a----------|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should concat if first source is empty, second source emits once', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --|');
            var e1subs = '   ^-!';
            var e2 = cold('    --a--|');
            var e2subs = '   --^----!';
            var expected = ' ----a--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit element from first source, and should not complete if second ' +
        'source does not completes', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --a--|');
            var e1subs = '   ^----!';
            var e2 = cold('       -');
            var e2subs = '   -----^';
            var expected = ' --a---';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not complete if first source does not complete', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  -');
            var e1subs = '   ^';
            var e2 = cold('  --a--|');
            var e2subs = [];
            var expected = ' -';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit elements from each source when source emit once', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a|');
            var e1subs = '   ^---!';
            var e2 = cold('      -----b--|');
            var e2subs = '   ----^-------!';
            var expected = ' ---a-----b--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should unsubscribe to inner source if outer is unsubscribed early', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a-a--a|            ');
            var e1subs = '   ^--------!            ';
            var e2 = cold('           -----b-b--b-|');
            var e2subs = '   ---------^-------!    ';
            var unsub = '    -----------------!    ';
            var expected = ' ---a-a--a-----b-b     ';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a-a--a|            ');
            var e1subs = '   ^--------!            ';
            var e2 = cold('           -----b-b--b-|');
            var e2subs = '   ---------^-------!    ';
            var expected = ' ---a-a--a-----b-b-    ';
            var unsub = '    -----------------!    ';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.concatAll(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error from first source and does not emit from second source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --#');
            var e1subs = '   ^-!';
            var e2 = cold('  ----a--|');
            var e2subs = [];
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit element from first source then raise error from second source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  --a--|');
            var e1subs = '   ^----!';
            var e2 = cold('       -------#');
            var e2subs = '   -----^------!';
            var expected = ' --a---------#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit all elements from both hot observable sources if first source ' +
        'completes before second source starts emit', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b-|');
            var e1subs = '  ^------!';
            var e2 = hot('  --------x--y--|');
            var e2subs = '  -------^------!';
            var expected = '--a--b--x--y--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit elements from second source regardless of completion time ' +
        'when second source is cold observable', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c---|');
            var e1subs = '  ^-----------!';
            var e2 = cold(' -x-y-z-|');
            var e2subs = '  ------------^------!';
            var expected = '--a--b--c----x-y-z-|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not emit collapsing element from second source', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----------!';
            var e2 = hot('  --------x--y--z--|');
            var e2subs = '  -----------^-----!';
            var expected = '--a--b--c--y--z--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should be able to work on a different scheduler', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a|');
            var e1subs = '   ^---!';
            var e2 = cold('      ---b--|');
            var e2subs = '   ----^-----!';
            var e3 = cold('            ---c--|');
            var e3subs = '   ----------^-----!';
            var expected = ' ---a---b-----c--|';
            var result = rxjs_1.of(e1, e2, e3, rxTestScheduler).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    it('should concatAll a nested observable with a single inner observable', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a-|');
            var e1subs = '   ^----!';
            var expected = ' ---a-|';
            var result = rxjs_1.of(e1).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should concatAll a nested observable with a single inner observable, and a scheduler', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('  ---a-|');
            var e1subs = '   ^----!';
            var expected = ' ---a-|';
            var result = rxjs_1.of(e1, rxTestScheduler).pipe(operators_1.concatAll());
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.concatAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.concatAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.concatAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.concatAll());
    });
});
//# sourceMappingURL=concatAll-spec.js.map