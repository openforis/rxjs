"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('combineAll operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should combine events from two observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var x = cold('                  -a-----b---|');
            var y = cold('                  --1-2-|     ');
            var outer = hot('-x----y--------|           ', { x: x, y: y });
            var expected = ' -----------------A-B--C---|';
            var result = outer.pipe(operators_1.combineAll(function (a, b) { return String(a) + String(b); }));
            expectObservable(result).toBe(expected, { A: 'a1', B: 'a2', C: 'b2' });
        });
    });
    it('should work with two nevers', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' -');
            var e1subs = '  ^';
            var e2 = cold(' -');
            var e2subs = '  ^';
            var expected = '-';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with never and empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' -');
            var e1subs = '  ^';
            var e2 = cold(' |');
            var e2subs = '  (^!)';
            var expected = '-';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with empty and never', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)';
            var e2 = cold(' -');
            var e2subs = '  ^';
            var expected = '-';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with empty and empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e1subs = '  (^!)';
            var e2 = cold(' |');
            var e2subs = '  (^!)';
            var expected = '|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-empty and hot-single', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^-|');
            var e1subs = '   ^-!';
            var e2 = hot('-b-^-c-|');
            var e2subs = '   ^---!';
            var expected = ' ----|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-single and hot-empty', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^-|');
            var e1subs = '   ^-!';
            var e2 = hot('-b-^-c-|');
            var e2subs = '   ^---!';
            var expected = ' ----|';
            var result = rxjs_1.of(e2, e1).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-single and never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^-|');
            var e1subs = '   ^-!';
            var e2 = hot('------');
            var e2subs = '   ^--';
            var expected = ' ---';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with never and hot-single', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--------');
            var e1subs = '   ^----';
            var e2 = hot('-a-^-b-|');
            var e2subs = '   ^---!';
            var expected = ' -----';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot and hot', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|');
            var e1subs = '     ^--------!';
            var e2 = hot('---e-^---f--g--|');
            var e2subs = '     ^---------!';
            var expected = '   ----x-yz--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'bf', y: 'cf', z: 'cg' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should allow unsubscribing early and explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c---d-| ');
            var e1subs = '     ^--------!    ';
            var e2 = hot('---e-^---f--g---h-|');
            var e2subs = '     ^--------!    ';
            var expected = '   ----x-yz--    ';
            var unsub = '      ---------!    ';
            var values = { x: 'bf', y: 'cf', z: 'cg' };
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--^--b--c---d-| ');
            var e1subs = '       ^--------!    ';
            var e2 = hot('  ---e-^---f--g---h-|');
            var e2subs = '       ^--------!    ';
            var expected = '     ----x-yz--    ';
            var unsub = '        ---------!    ';
            var values = { x: 'bf', y: 'cf', z: 'cg' };
            var result = rxjs_1.of(e1, e2).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.combineAll(function (x, y) { return x + y; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should combine 3 observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|');
            var e1subs = '     ^--------!';
            var e2 = hot('---e-^---f--g--|');
            var e2subs = '     ^---------!';
            var e3 = hot('---h-^----i--j-|');
            var e3subs = '     ^---------!';
            var expected = '   -----wxyz-|';
            var result = rxjs_1.of(e1, e2, e3).pipe(operators_1.combineAll(function (x, y, z) { return x + y + z; }));
            expectObservable(result).toBe(expected, { w: 'bfi', x: 'cfi', y: 'cgi', z: 'cgj' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    it('should work with empty and error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ----------|');
            var e1subs = '  ^-----!';
            var e2 = hot('  ------#', undefined, 'shazbot!');
            var e2subs = '  ^-----!';
            var expected = '------#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'shazbot!');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with error and empty', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--^---#', undefined, 'too bad, honk');
            var e1subs = '  ^---!';
            var e2 = hot('--^--------|');
            var e2subs = '  ^---!';
            var expected = '----#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'too bad, honk');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^--b--c--|');
            var e1subs = '   ^-!';
            var e2 = hot('---^-#', undefined, 'bazinga');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bazinga');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and hot', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^-#', undefined, 'bazinga');
            var e1subs = '   ^-!';
            var e2 = hot('-a-^--b--c--|');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bazinga');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^----#', undefined, 'jenga');
            var e1subs = '   ^-!';
            var e2 = hot('---^-#', undefined, 'bazinga');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bazinga');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with error and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^--b--#', undefined, 'wokka wokka');
            var e1subs = '   ^-!';
            var e2 = hot('---^-#', undefined, 'flurp');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'flurp');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^-#', undefined, 'flurp');
            var e1subs = '   ^-!';
            var e2 = hot('-a-^--b--#', undefined, 'wokka wokka');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'flurp');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with never and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^-----------');
            var e1subs = '   ^-----!';
            var e2 = hot('---^-----#', undefined, 'wokka wokka');
            var e2subs = '   ^-----!';
            var expected = ' ------#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('   ---^----#', undefined, 'wokka wokka');
            var e1subs = '      ^----!';
            var e2 = hot('   ---^-----------');
            var e2subs = '      ^----!';
            var expected = '    -----#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with some and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^----a---b--|');
            var e1subs = '   ^--!';
            var e2 = hot('---^--#', undefined, 'wokka wokka');
            var e2subs = '   ^--!';
            var expected = ' ---#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and some', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^--#', undefined, 'wokka wokka');
            var e1subs = '   ^--!';
            var e2 = hot('---^----a---b--|');
            var e2subs = '   ^--!';
            var expected = ' ---#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle throw after complete left', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b---|');
            var leftSubs = '      ^------!';
            var right = hot('-----^--------#', undefined, 'bad things');
            var rightSubs = '     ^--------!';
            var expected = '      ---------#';
            var result = rxjs_1.of(left, right).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bad things');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle throw after complete right', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot('  -----^--------#', undefined, 'bad things');
            var leftSubs = '       ^--------!';
            var right = hot('--a--^--b---|');
            var rightSubs = '      ^------!';
            var expected = '       ---------#';
            var result = rxjs_1.of(left, right).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bad things');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle interleaved with tail', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a--^--b---c---|');
            var e1subs = '    ^----------!';
            var e2 = hot('--d-^----e---f--|');
            var e2subs = '    ^-----------!';
            var expected = '  -----x-y-z--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'be', y: 'ce', z: 'cf' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle two consecutive hot observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|');
            var e1subs = '     ^--------!';
            var e2 = hot('-----^----------d--e--f--|');
            var e2subs = '     ^-------------------!';
            var expected = '   -----------x--y--z--|';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle two consecutive hot observables with error left', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b--c--#', undefined, 'jenga');
            var leftSubs = '      ^--------!';
            var right = hot('-----^----------d--e--f--|');
            var rightSubs = '     ^--------!';
            var expected = '      ---------#';
            var result = rxjs_1.of(left, right).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'jenga');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle two consecutive hot observables with error right', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b--c--|');
            var leftSubs = '      ^--------!';
            var right = hot('-----^----------d--e--f--#', undefined, 'dun dun dun');
            var rightSubs = '     ^-------------------!';
            var expected = '      -----------x--y--z--#';
            var result = rxjs_1.of(left, right).pipe(operators_1.combineAll(function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' }, 'dun dun dun');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle selector throwing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--|');
            var e1subs = '     ^--!';
            var e2 = hot('--c--^--d--|');
            var e2subs = '     ^--!';
            var expected = '   ---#';
            var result = rxjs_1.of(e1, e2).pipe(operators_1.combineAll(function (x, y) { throw 'ha ha ' + x + ', ' + y; }));
            expectObservable(result).toBe(expected, null, 'ha ha b, d');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should combine two observables', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var b = rxjs_1.of(4, 5, 6, 7, 8);
        var expected = [[3, 4], [3, 5], [3, 6], [3, 7], [3, 8]];
        rxjs_1.of(a, b).pipe(operators_1.combineAll()).subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should combine two immediately-scheduled observables', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [[1, 4], [2, 4], [2, 5], [3, 5], [3, 6], [3, 7], [3, 8]];
        rxjs_1.of(a, b, rxjs_1.queueScheduler).pipe(operators_1.combineAll())
            .subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r.shift());
        }, null, function () {
            chai_1.expect(r.length).to.equal(0);
            done();
        });
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3).pipe(operators_1.combineAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
});
//# sourceMappingURL=combineAll-spec.js.map