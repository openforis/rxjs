"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('combineLatest', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should combine events from two cold observables', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' -a--b-----c-d-e-|');
            var e2 = cold(' --1--2-3-4---|   ');
            var expected = '--A-BC-D-EF-G-H-|';
            var result = e1.pipe(operators_1.combineLatest(e2, function (a, b) { return String(a) + String(b); }));
            expectObservable(result).toBe(expected, {
                A: 'a1', B: 'b1', C: 'b2', D: 'b3', E: 'b4', F: 'c4', G: 'd4', H: 'e4'
            });
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-empty and hot-single', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var values = {
                a: 1,
                b: 2,
                c: 3,
                r: 1 + 3
            };
            var e1 = hot('-a-^-|', values);
            var e1subs = '   ^-!';
            var e2 = hot('-b-^-c-|', values);
            var e2subs = '   ^---!';
            var expected = ' ----|';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-single and hot-empty', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var values = {
                a: 1, b: 2, c: 3
            };
            var e1 = hot('-a-^-|', values);
            var e1subs = '   ^-!';
            var e2 = hot('-b-^-c-|', values);
            var e2subs = '   ^---!';
            var expected = ' ----|';
            var result = e2.pipe(operators_1.combineLatest(e1, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot-single and never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var values = {
                a: 1
            };
            var e1 = hot('-a-^-|', values);
            var e1subs = '   ^-!';
            var e2 = hot('------', values);
            var e2subs = '   ^--';
            var expected = ' ---';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with never and hot-single', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var values = {
                a: 1, b: 2
            };
            var e1 = hot('--------', values);
            var e1subs = '   ^    ';
            var e2 = hot('-a-^-b-|', values);
            var e2subs = '   ^---!';
            var expected = ' -----';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot and hot', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
            var e1subs = '     ^--------!';
            var e2 = hot('---e-^---f--g--|', { e: 'e', f: 'f', g: 'g' });
            var e2subs = '     ^---------!';
            var expected = '   ----x-yz--|';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'bf', y: 'cf', z: 'cg' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should accept array of observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|');
            var e1subs = '     ^--------!';
            var e2 = hot('---e-^---f--g--|');
            var e2subs = '     ^---------!';
            var e3 = hot('---h-^----i--j-|');
            var e3subs = '     ^---------!';
            var expected = '   -----wxyz-|';
            var result = e1.pipe(operators_1.combineLatest([e2, e3], function (x, y, z) { return x + y + z; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'too bad, honk');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with hot and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
            var e1subs = '   ^-!';
            var e2 = hot('---^-#', undefined, 'bazinga');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var e2 = hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bazinga');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with error and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
            var e1subs = '   ^-!';
            var e2 = hot('---^-#', undefined, 'flurp');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var e2 = hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
            var e2subs = '   ^-!';
            var expected = ' --#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with throw and never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('---^----#', undefined, 'wokka wokka');
            var e1subs = '   ^----!';
            var e2 = hot('---^-----------');
            var e2subs = '   ^----!';
            var expected = ' -----#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should work with some and throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('   ---^----a---b--|', { a: 1, b: 2 });
            var e1subs = '      ^--!';
            var e2 = hot('   ---^--#', undefined, 'wokka wokka');
            var e2subs = '      ^--!';
            var expected = '    ---#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
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
            var e2 = hot('---^----a---b--|', { a: 1, b: 2 });
            var e2subs = '   ^--!';
            var expected = ' ---#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle throw after complete left', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b---|', { a: 1, b: 2 });
            var leftSubs = '      ^------!';
            var right = hot('-----^--------#', undefined, 'bad things');
            var rightSubs = '     ^--------!';
            var expected = '      ---------#';
            var result = left.pipe(operators_1.combineLatest(right, function (x, y) { return x + y; }));
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
            var right = hot(' --a--^--b---|', { a: 1, b: 2 });
            var rightSubs = '      ^------!';
            var expected = '       ---------#';
            var result = left.pipe(operators_1.combineLatest(right, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'bad things');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle interleaved with tail', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('-a--^--b---c---|', { a: 'a', b: 'b', c: 'c' });
            var e1subs = '    ^----------!';
            var e2 = hot('--d-^----e---f--|', { d: 'd', e: 'e', f: 'f' });
            var e2subs = '    ^-----------!';
            var expected = '  -----x-y-z--|';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'be', y: 'ce', z: 'cf' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle two consecutive hot observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
            var e1subs = '     ^--------!';
            var e2 = hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
            var e2subs = '     ^-------------------!';
            var expected = '   -----------x--y--z--|';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle two consecutive hot observables with error left', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b--c--#', { a: 'a', b: 'b', c: 'c' }, 'jenga');
            var leftSubs = '      ^--------!';
            var right = hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
            var rightSubs = '     ^--------!';
            var expected = '      ---------#';
            var result = left.pipe(operators_1.combineLatest(right, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, null, 'jenga');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle two consecutive hot observables with error right', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var left = hot(' --a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
            var leftSubs = '      ^--------!';
            var right = hot('-----^----------d--e--f--#', { d: 'd', e: 'e', f: 'f' }, 'dun dun dun');
            var rightSubs = '     ^-------------------!';
            var expected = '      -----------x--y--z--#';
            var result = left.pipe(operators_1.combineLatest(right, function (x, y) { return x + y; }));
            expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' }, 'dun dun dun');
            expectSubscriptions(left.subscriptions).toBe(leftSubs);
            expectSubscriptions(right.subscriptions).toBe(rightSubs);
        });
    });
    it('should handle selector throwing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--|', { a: 1, b: 2 });
            var e1subs = '     ^--!';
            var e2 = hot('--c--^--d--|', { c: 3, d: 4 });
            var e2subs = '     ^--!';
            var expected = '   ---#';
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { throw 'ha ha ' + x + ', ' + y; }));
            expectObservable(result).toBe(expected, null, 'ha ha 2, 4');
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
            var result = e1.pipe(operators_1.combineLatest(e2, function (x, y) { return x + y; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--b--c---d-| ');
            var e1subs = '     ^--------!    ';
            var e2 = hot('---e-^---f--g---h-|');
            var e2subs = '     ^--------!    ';
            var expected = '   ----x-yz--    ';
            var unsub = '      ---------!    ';
            var values = { x: 'bf', y: 'cf', z: 'cg' };
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.combineLatest(e2, function (x, y) { return x + y; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit unique array instances with the default projection', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var e1 = hot('  -a--b--|');
            var e2 = hot('  --1--2-|');
            var expected = '-------(c|)';
            var result = e1.pipe(operators_1.combineLatest(e2), operators_1.distinct(), operators_1.count());
            expectObservable(result).toBe(expected, { c: 3 });
        });
    });
});
//# sourceMappingURL=combineLatest-legacy-spec.js.map