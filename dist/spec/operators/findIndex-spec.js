"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('findIndex operator', function () {
    function truePredicate(x) {
        return true;
    }
    it('should return matching element from source emits single element', function () {
        var values = { a: 3, b: 9, c: 15, d: 20 };
        var source = marble_testing_1.hot('---a--b--c--d---|', values);
        var subs = '^        !       ';
        var expected = '---------(x|)    ';
        var predicate = function (x) { return x % 5 === 0; };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected, { x: 2 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not emit if source does not emit', function () {
        var source = marble_testing_1.hot('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(truePredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return negative index if source is empty to match predicate', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '(x|)';
        var result = source.pipe(operators_1.findIndex(truePredicate));
        marble_testing_1.expectObservable(result).toBe(expected, { x: -1 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return index of element from source emits single element', function () {
        var sourceValue = 1;
        var source = marble_testing_1.hot('--a--|', { a: sourceValue });
        var subs = '^ !   ';
        var expected = '--(x|)';
        var predicate = function (value) {
            return value === sourceValue;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected, { x: 0 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return index of matching element from source emits multiple elements', function () {
        var source = marble_testing_1.hot('--a--b---c-|', { b: 7 });
        var subs = '^    !';
        var expected = '-----(x|)';
        var predicate = function (value) {
            return value === 7;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected, { x: 1 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should work with a custom thisArg', function () {
        var sourceValues = { b: 7 };
        var source = marble_testing_1.hot('--a--b---c-|', sourceValues);
        var subs = '^    !';
        var expected = '-----(x|)';
        var predicate = function (value) {
            return value === this.b;
        };
        var result = source.pipe(operators_1.findIndex(predicate, sourceValues));
        marble_testing_1.expectObservable(result).toBe(expected, { x: 1 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return negative index if element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^          !';
        var expected = '-----------(x|)';
        var predicate = function (value) {
            return value === 'z';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected, { x: -1 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.findIndex(function (value) { return value === 'z'; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.findIndex(function (value) { return value === 'z'; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should unsubscribe when the predicate is matched', function () {
        var source = marble_testing_1.hot('--a--b---c-|');
        var subs = '^    !';
        var expected = '-------(x|)';
        var duration = rxTestScheduler.createTime('--|');
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(function (value) { return value === 'b'; }), operators_1.delay(duration, rxTestScheduler))).toBe(expected, { x: 1 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise if source raise error while element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var subs = '^       !';
        var expected = '--------#';
        var predicate = function (value) {
            return value === 'z';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if predicate throws error', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^ !';
        var expected = '--#';
        var predicate = function (value) {
            throw 'error';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.findIndex(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=findIndex-spec.js.map