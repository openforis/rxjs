"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('ignoreElements operator', function () {
    asDiagram('ignoreElements')('should ignore all the elements of the source', function () {
        var source = marble_testing_1.hot('--a--b--c--d--|');
        var subs = '^             !';
        var expected = '--------------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.ignoreElements())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--d--|');
        var subs = '^      !       ';
        var expected = '--------       ';
        var unsub = '       !       ';
        var result = source.pipe(operators_1.ignoreElements());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--d--|');
        var subs = '^      !       ';
        var expected = '--------       ';
        var unsub = '       !       ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.ignoreElements(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should propagate errors from the source', function () {
        var source = marble_testing_1.hot('--a--#');
        var subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(source.pipe(operators_1.ignoreElements())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.empty', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(source.pipe(operators_1.ignoreElements())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.never', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.ignoreElements())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.throw', function () {
        var source = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.ignoreElements())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=ignoreElements-spec.js.map