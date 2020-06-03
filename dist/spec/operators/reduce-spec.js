"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('reduce operator', function () {
    it('should reduce', function () {
        var values = {
            a: 1, b: 3, c: 5, x: 9
        };
        var e1 = marble_testing_1.hot('--a--b--c--|', values);
        var e1subs = '^          !';
        var expected = '-----------(x|)';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, 0))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce with seed', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^       !';
        var expected = '--------(x|)';
        var seed = 'n';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, seed))).toBe(expected, { x: seed + 'ab' });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce with a seed of undefined', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---------------------(x|)';
        var values = {
            x: 'undefined b c d e f g'
        };
        var source = e1.pipe(operators_1.reduce(function (acc, x) { return acc + ' ' + x; }, undefined));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce without a seed', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---------------------(x|)';
        var values = {
            x: 'b c d e f g'
        };
        var source = e1.pipe(operators_1.reduce(function (acc, x) { return acc + ' ' + x; }));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce with index without seed', function (done) {
        var idx = [1, 2, 3, 4, 5];
        rxjs_1.range(0, 6).pipe(operators_1.reduce(function (acc, value, index) {
            chai_1.expect(idx.shift()).to.equal(index);
            return value;
        })).subscribe(null, null, function () {
            chai_1.expect(idx).to.be.empty;
            done();
        });
    });
    it('should reduce with index with seed', function (done) {
        var idx = [0, 1, 2, 3, 4, 5];
        rxjs_1.range(0, 6).pipe(operators_1.reduce(function (acc, value, index) {
            chai_1.expect(idx.shift()).to.equal(index);
            return value;
        }, -1)).subscribe(null, null, function () {
            chai_1.expect(idx).to.be.empty;
            done();
        });
    });
    it('should reduce with seed if source is empty', function () {
        var e1 = marble_testing_1.hot('--a--^-------|');
        var e1subs = '^       !';
        var expected = '--------(x|)';
        var expectedValue = '42';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, expectedValue))).toBe(expected, { x: expectedValue });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if reduce function throws without seed', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^    !   ';
        var expected = '-----#   ';
        var reduceFunction = function (o, x) {
            throw 'error';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var unsub = '      !  ';
        var e1subs = '^     !  ';
        var expected = '-------  ';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        var result = e1.pipe(operators_1.reduce(reduceFunction));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^     !  ';
        var expected = '-------  ';
        var unsub = '      !  ';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.reduce(reduceFunction), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source emits and raises error with seed', function () {
        var e1 = marble_testing_1.hot('--a--b--#');
        var e1subs = '^       !';
        var expected = '--------#';
        var expectedValue = '42';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, expectedValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source raises error with seed', function () {
        var e1 = marble_testing_1.hot('----#');
        var e1subs = '^   !';
        var expected = '----#';
        var expectedValue = '42';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, expectedValue))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if reduce function throws with seed', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^ !     ';
        var expected = '--#     ';
        var seed = 'n';
        var reduceFunction = function (o, x) {
            throw 'error';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, seed))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete with seed if source emits but does not completes', function () {
        var e1 = marble_testing_1.hot('--a--');
        var e1subs = '^    ';
        var expected = '-----';
        var seed = 'n';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, seed))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete with seed if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var seed = 'n';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction, seed))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete without seed if source emits but does not completes', function () {
        var e1 = marble_testing_1.hot('--a--b--');
        var e1subs = '^       ';
        var expected = '--------';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete without seed if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce if source does not emit without seed', function () {
        var e1 = marble_testing_1.hot('--a--^-------|');
        var e1subs = '^       !';
        var expected = '--------|';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source emits and raises error without seed', function () {
        var e1 = marble_testing_1.hot('--a--b--#');
        var e1subs = '^       !';
        var expected = '--------#';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if source raises error without seed', function () {
        var e1 = marble_testing_1.hot('----#');
        var e1subs = '^   !';
        var expected = '----#';
        var reduceFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.reduce(reduceFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=reduce-spec.js.map