"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('single operator', function () {
    asDiagram('single')('should raise error from empty predicate if observable emits multiple time', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^    !      ';
        var expected = '-----#      ';
        var errorMsg = 'Sequence contains more than one element';
        marble_testing_1.expectObservable(e1.pipe(operators_1.single())).toBe(expected, null, errorMsg);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error from empty predicate if observable does not emit', function () {
        var e1 = marble_testing_1.hot('--a--^--|');
        var e1subs = '^  !';
        var expected = '---#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.single())).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return only element from empty predicate if observable emits only once', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = '-----(a|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.single())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var unsub = '   !        ';
        var e1subs = '^  !        ';
        var expected = '----        ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.single()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^  !        ';
        var expected = '----        ';
        var unsub = '   !        ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.single(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error from empty predicate if observable emits error', function () {
        var e1 = marble_testing_1.hot('--a--b^--#');
        var e1subs = '^  !';
        var expected = '---#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.single())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error from predicate if observable emits error', function () {
        var e1 = marble_testing_1.hot('--a--b^--#');
        var e1subs = '^  !';
        var expected = '---#';
        var predicate = function (value) {
            return value === 'c';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if predicate throws error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--|');
        var e1subs = '^          !   ';
        var expected = '-----------#   ';
        var predicate = function (value) {
            if (value !== 'd') {
                return false;
            }
            throw 'error';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return element from predicate if observable have single matching element', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var expected = '-----------(b|)';
        var predicate = function (value) {
            return value === 'b';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error from predicate if observable have multiple matching element', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--b--|');
        var e1subs = '^          !      ';
        var expected = '-----------#      ';
        var predicate = function (value) {
            return value === 'b';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected, null, 'Sequence contains more than one element');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error from predicate if observable does not emit', function () {
        var e1 = marble_testing_1.hot('--a--^--|');
        var e1subs = '^  !';
        var expected = '---#';
        var predicate = function (value) {
            return value === 'a';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return undefined from predicate if observable does not contain matching element', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var expected = '-----------(z|)';
        var predicate = function (value) {
            return value === 'x';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate))).toBe(expected, { z: undefined });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should call predicate with indices starting at 0', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var expected = '-----------(b|)';
        var indices = [];
        var predicate = function (value, index) {
            indices.push(index);
            return value === 'b';
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.single(predicate), operators_1.tap(null, null, function () {
            chai_1.expect(indices).to.deep.equal([0, 1, 2]);
        }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=single-spec.js.map