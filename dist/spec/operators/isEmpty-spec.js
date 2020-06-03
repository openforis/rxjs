"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('isEmpty operator', function () {
    it('should return true if source is empty', function () {
        var source = marble_testing_1.hot('-----|');
        var subs = '^    !';
        var expected = '-----(T|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty())).toBe(expected, { T: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return false if source emits element', function () {
        var source = marble_testing_1.hot('--a--^--b--|');
        var subs = '^  !';
        var expected = '---(F|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty())).toBe(expected, { F: false });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if source raise error', function () {
        var source = marble_testing_1.hot('--#');
        var subs = '^ !';
        var expected = '--#';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not completes if source never emits', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty())).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return true if source is Observable.empty()', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '(T|)';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty())).toBe(expected, { T: true });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var source = marble_testing_1.cold('-----------a--b--|');
        var unsub = '      !           ';
        var subs = '^     !           ';
        var expected = '-------           ';
        marble_testing_1.expectObservable(source.pipe(operators_1.isEmpty()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('-----------a--b--|');
        var subs = '^     !           ';
        var expected = '-------           ';
        var unsub = '      !           ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.isEmpty(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=isEmpty-spec.js.map