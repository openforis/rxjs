"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
describe('count operator', function () {
    it('should count the values of an observable', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^          !';
        var expected = '-----------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.count())).toBe(expected, { x: 3 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should be never when source is never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be zero when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be never when source doesn\'t complete', function () {
        var e1 = marble_testing_1.hot('--x--^--y--');
        var e1subs = '^     ';
        var expected = '------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be zero when source doesn\'t have values', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should count the unique value of an observable', function () {
        var e1 = marble_testing_1.hot('-x-^--y--|');
        var e1subs = '^     !';
        var expected = '------(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 1 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should count the values of an ongoing hot observable', function () {
        var source = marble_testing_1.hot('--a-^-b--c--d--|');
        var subs = '^          !';
        var expected = '-----------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.count())).toBe(expected, { x: 3 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should count a range() source observable', function (done) {
        rxjs_1.range(1, 10).pipe(operators_1.count()).subscribe(function (value) {
            chai_1.expect(value).to.equal(10);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should count a range().skip(1) source observable', function (done) {
        rxjs_1.range(1, 10).pipe(operators_1.skip(1), operators_1.count()).subscribe(function (value) {
            chai_1.expect(value).to.equal(9);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should count a range().take(1) source observable', function (done) {
        rxjs_1.range(1, 10).pipe(operators_1.take(1), operators_1.count()).subscribe(function (value) {
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
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.count())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-true predicate on an empty hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        var predicate = function () {
            return true;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-false predicate on an empty hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        var predicate = function () {
            return false;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-true predicate on a simple hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^-a-|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        var predicate = function () {
            return true;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 1 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-false predicate on a simple hot observable', function () {
        var e1 = marble_testing_1.hot('-x-^-a-|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        var predicate = function () {
            return false;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--4-|');
        var e1subs = '^     !    ';
        var expected = '-------    ';
        var unsub = '      !    ';
        var result = e1.pipe(operators_1.count(function (value) { return parseInt(value) < 10; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, { w: 3 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--4-|');
        var e1subs = '^     !    ';
        var expected = '-------    ';
        var unsub = '      !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.count(function (value) { return parseInt(value) < 10; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, { w: 3 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a match-all predicate on observable with many values', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--4-|');
        var e1subs = '^         !';
        var expected = '----------(w|)';
        var predicate = function (value) { return parseInt(value) < 10; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 3 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a match-none predicate on observable with many values', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--4-|');
        var e1subs = '^         !';
        var expected = '----------(w|)';
        var predicate = function (value) { return parseInt(value) > 10; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, { w: 0 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-true predicate on observable that throws', function () {
        var e1 = marble_testing_1.hot('-1-^---#');
        var e1subs = '^   !';
        var expected = '----#';
        var predicate = function () { return true; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-false predicate on observable that throws', function () {
        var e1 = marble_testing_1.hot('-1-^---#');
        var e1subs = '^   !';
        var expected = '----#';
        var predicate = function () { return false; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an always-true predicate on a hot never-observable', function () {
        var e1 = marble_testing_1.hot('-x-^----');
        var e1subs = '^    ';
        var expected = '-----';
        var predicate = function () { return true; };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a predicate that throws, on observable with many values', function () {
        var e1 = marble_testing_1.hot('-1-^-2--3--|');
        var e1subs = '^    !   ';
        var expected = '-----#   ';
        var predicate = function (value) {
            if (value === '3') {
                throw 'error';
            }
            return true;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=count-spec.js.map