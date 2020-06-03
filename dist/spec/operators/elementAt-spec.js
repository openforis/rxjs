"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('elementAt operator', function () {
    it('should return last element by zero-based index', function () {
        var source = marble_testing_1.hot('--a--b--c-d---|');
        var subs = '^       !      ';
        var expected = '--------(c|)   ';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return first element by zero-based index', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^ !';
        var expected = '--(a|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return non-first element by zero-based index', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--f--|');
        var subs = '^          !';
        var expected = '-----------(d|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return last element by zero-based index', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^       !';
        var expected = '--------(c|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if source is Empty Observable', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(0))).toBe(expected, undefined, new rxjs_1.ArgumentOutOfRangeError());
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should propagate error if source is Throw Observable', function () {
        var source = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return Never if source is Never Observable', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.elementAt(2));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result Observable is unsubscribed', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.elementAt(2), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should throw if index is smaller than zero', function () {
        chai_1.expect(function () { rxjs_1.range(0, 10).pipe(operators_1.elementAt(-1)); })
            .to.throw(rxjs_1.ArgumentOutOfRangeError);
    });
    it('should raise error if index is out of range but does not have default value', function () {
        var source = marble_testing_1.hot('--a--|');
        var subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(3)))
            .toBe(expected, null, new rxjs_1.ArgumentOutOfRangeError());
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return default value if index is out of range', function () {
        var source = marble_testing_1.hot('--a--|');
        var subs = '^    !';
        var expected = '-----(x|)';
        var defaultValue = '42';
        marble_testing_1.expectObservable(source.pipe(operators_1.elementAt(3, defaultValue))).toBe(expected, { x: defaultValue });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=elementAt-spec.js.map