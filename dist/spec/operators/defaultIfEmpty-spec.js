"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('Observable.prototype.defaultIfEmpty', function () {
    it('should return the Observable if not empty with a default value', function () {
        var e1 = marble_testing_1.hot('--------|');
        var expected = '--------(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty(42))).toBe(expected, { x: 42 });
    });
    it('should return the argument if Observable is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty('x'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return null if the Observable is empty and no arguments', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(x|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty())).toBe(expected, { x: null });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return the Observable if not empty with a default value', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^       !';
        var expected = '--a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty('x'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return the Observable if not empty with no default value', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^       !';
        var expected = '--a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.defaultIfEmpty('x'));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var e1subs = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.defaultIfEmpty('x'), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should error if the Observable errors', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.defaultIfEmpty('x'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=defaultIfEmpty-spec.js.map