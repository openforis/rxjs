"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('max operator', function () {
    asDiagram('max')('should find the max of values of an observable', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|', { a: 42, b: -1, c: 3 });
        var subs = '^          !';
        var expected = '-----------(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected, { x: 42 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should be never when source is never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be zero when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be never when source doesn\'t complete', function () {
        var e1 = marble_testing_1.hot('--x--^--y--');
        var e1subs = '^     ';
        var expected = '------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be completes when source doesn\'t have values', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should max the unique value of an observable', function () {
        var e1 = marble_testing_1.hot('-x-^--y--|', { y: 42 });
        var e1subs = '^     !';
        var expected = '------(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected, { w: 42 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should max the values of an ongoing hot observable', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--|', { a: 42, b: -1, c: 0, d: 666 });
        var subs = '^          !';
        var expected = '-----------(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected, { x: 666 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|', { a: 42, b: -1, c: 0 });
        var unsub = '      !     ';
        var subs = '^     !     ';
        var expected = '-------     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max()), unsub).toBe(expected, { x: 42 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|', { a: 42, b: -1, c: 0 });
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.max(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, { x: 42 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should max a range() source observable', function (done) {
        rxjs_1.range(1, 10000).pipe(operators_1.max()).subscribe(function (value) {
            chai_1.expect(value).to.equal(10000);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should max a range().skip(1) source observable', function (done) {
        rxjs_1.range(1, 10).pipe(operators_1.skip(1), operators_1.max()).subscribe(function (value) {
            chai_1.expect(value).to.equal(10);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should max a range().take(1) source observable', function (done) {
        rxjs_1.range(1, 10).pipe(operators_1.take(1), operators_1.max()).subscribe(function (value) {
            chai_1.expect(value).to.equal(1);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should work with error', function () {
        var e1 = marble_testing_1.hot('-x-^--y--z--#', { x: 1, y: 2, z: 3 }, 'too bad');
        var e1subs = '^        !';
        var expected = '---------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.max())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a constant predicate on an empty hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----|';
        var predicate = function (x, y) {
            return 42;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a constant predicate on an never hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^----');
        var e1subs = '^    ';
        var expected = '-----';
        var predicate = function (x, y) {
            return 42;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a constant predicate on a simple hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^-a-|', { a: 1 });
        var e1subs = '^   !';
        var expected = '----(w|)';
        var predicate = function () {
            return 42;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, { w: 1 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a reverse predicate on observable with many values', function () {
        var e1 = marble_testing_1.hot('-a-^-b--c--d-|', { a: 42, b: -1, c: 0, d: 666 });
        var e1subs = '^         !';
        var expected = '----------(w|)';
        var predicate = function (x, y) {
            return x > y ? -1 : 1;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, { w: -1 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a predicate for string on observable with many values', function () {
        var e1 = marble_testing_1.hot('-a-^-b--c--d-|');
        var e1subs = '^         !';
        var expected = '----------(w|)';
        var predicate = function (x, y) {
            return x > y ? -1 : 1;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, { w: 'b' });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a constant predicate on observable that throws', function () {
        var e1 = marble_testing_1.hot('-1-^---#');
        var e1subs = '^   !';
        var expected = '----#';
        var predicate = function () {
            return 42;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a predicate that throws, on observable with many values', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--|');
        var e1subs = '^    !   ';
        var expected = '-----#   ';
        var predicate = function (x, y) {
            if (y === '3') {
                throw 'error';
            }
            return x > y ? -1 : 1;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=max-spec.js.map