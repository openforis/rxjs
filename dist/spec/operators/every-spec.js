"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('every operator', function () {
    function truePredicate(x) {
        return true;
    }
    function predicate(x) {
        return (+x) % 5 === 0;
    }
    asDiagram('every(x => x % 5 === 0)')('should return false if only some of element matches with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|', { a: 5, b: 10, c: 15, d: 18, e: 20 });
        var sourceSubs = '^          !      ';
        var expected = '-----------(F|)   ';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { F: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should accept thisArg with scalar observables', function () {
        var thisArg = {};
        rxjs_1.of(1).pipe(operators_1.every(function (value, index) {
            chai_1.expect(this).to.deep.equal(thisArg);
            return true;
        }, thisArg)).subscribe();
    });
    it('should accept thisArg with array observables', function () {
        var thisArg = {};
        rxjs_1.of(1, 2, 3, 4).pipe(operators_1.every(function (value, index) {
            chai_1.expect(this).to.deep.equal(thisArg);
            return true;
        }, thisArg)).subscribe();
    });
    it('should accept thisArg with ordinary observables', function () {
        var thisArg = {};
        rxjs_1.Observable.create(function (observer) {
            observer.next(1);
            observer.complete();
        })
            .pipe(operators_1.every(function (value, index) {
            chai_1.expect(this).to.deep.equal(thisArg);
            return true;
        }, thisArg)).subscribe();
    });
    it('should emit true if source is empty', function () {
        var source = marble_testing_1.hot('-----|');
        var sourceSubs = '^    !';
        var expected = '-----(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit false if single source of element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--|');
        var sourceSubs = '^ !';
        var expected = '--(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit false if none of element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var sourceSubs = '^ !';
        var expected = '--(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should return false if only some of element matches with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|', { a: 5, b: 10, c: 15 });
        var sourceSubs = '^          !';
        var expected = '-----------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|', { a: 5, b: 10, c: 15 });
        var sourceSubs = '^      !          ';
        var expected = '--------          ';
        var unsub = '       !          ';
        var result = source.pipe(operators_1.every(predicate));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not break unsubscription chains when result Observable is unsubscribed', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|', { a: 5, b: 10, c: 15 });
        var sourceSubs = '^      !          ';
        var expected = '--------          ';
        var unsub = '       !          ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.every(predicate), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should propagate error if predicate eventually throws', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|');
        var sourceSubs = '^       !';
        var expected = '--------#';
        function faultyPredicate(x) {
            if (x === 'c') {
                throw 'error';
            }
            else {
                return true;
            }
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.every(faultyPredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit true if single source element match with predicate', function () {
        var source = marble_testing_1.hot('--a--|', { a: 5 });
        var sourceSubs = '^    !';
        var expected = '-----(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit true if Scalar source matches with predicate', function () {
        var source = rxjs_1.of(5);
        var expected = '(T|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { T: true });
    });
    it('should emit false if Scalar source does not match with predicate', function () {
        var source = rxjs_1.of(3);
        var expected = '(F|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { F: false });
    });
    it('should propagate error if predicate throws on Scalar source', function () {
        var source = rxjs_1.of(3);
        var expected = '#';
        function faultyPredicate(x) {
            throw 'error';
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.every(faultyPredicate))).toBe(expected);
    });
    it('should emit true if Array source matches with predicate', function () {
        var source = rxjs_1.of(5, 10, 15, 20);
        var expected = '(T|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { T: true });
    });
    it('should emit false if Array source does not match with predicate', function () {
        var source = rxjs_1.of(5, 9, 15, 20);
        var expected = '(F|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { F: false });
    });
    it('should propagate error if predicate eventually throws on Array source', function () {
        var source = rxjs_1.of(5, 10, 15, 20);
        var expected = '#';
        function faultyPredicate(x) {
            if (x === 15) {
                throw 'error';
            }
            return true;
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.every(faultyPredicate))).toBe(expected);
    });
    it('should emit true if all source element matches with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--|', { a: 5, b: 10, c: 15, d: 20, e: 25 });
        var sourceSubs = '^                !';
        var expected = '-----------------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should raise error if source raises error', function () {
        var source = marble_testing_1.hot('--#');
        var sourceSubs = '^ !';
        var expected = '--#';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(truePredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not completes if source never emits', function () {
        var source = marble_testing_1.cold('-');
        var sourceSubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(truePredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit true if source element matches with predicate after subscription', function () {
        var source = marble_testing_1.hot('--z--^--a--b--c--d--e--|', { a: 5, b: 10, c: 15, d: 20, e: 25 });
        var sourceSubs = '^                 !';
        var expected = '------------------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit false if source element does not match with predicate after subscription', function () {
        var source = marble_testing_1.hot('--z--^--b--c--z--d--|', { a: 5, b: 10, c: 15, d: 20 });
        var sourceSubs = '^        !';
        var expected = '---------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should raise error if source raises error after subscription', function () {
        var source = marble_testing_1.hot('--z--^--#');
        var sourceSubs = '^  !';
        var expected = '---#';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(truePredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should emit true if source does not emit after subscription', function () {
        var source = marble_testing_1.hot('--z--^-----|');
        var sourceSubs = '^     !';
        var expected = '------(x|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.every(predicate))).toBe(expected, { x: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
});
//# sourceMappingURL=every-spec.js.map