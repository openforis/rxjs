"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('takeUntil operator', function () {
    it('should take values until notifier emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^            !          ';
        var e2 = marble_testing_1.hot('-------------z--|       ');
        var e2subs = '^            !          ';
        var expected = '--a--b--c--d-|          ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should take values and raises error when notifier raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^            !          ';
        var e2 = marble_testing_1.hot('-------------#          ');
        var e2subs = '^            !          ';
        var expected = '--a--b--c--d-#          ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should take all values when notifier is empty', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^                      !';
        var e2 = marble_testing_1.hot('-------------|          ');
        var e2subs = '^            !          ';
        var expected = '--a--b--c--d--e--f--g--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should take all values when notifier does not complete', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^                      !';
        var e2 = marble_testing_1.hot('-');
        var e2subs = '^                      !';
        var expected = '--a--b--c--d--e--f--g--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should complete without subscribing to the source when notifier synchronously emits', function () {
        var e1 = marble_testing_1.hot('----a--|');
        var e2 = rxjs_1.of(1, 2, 3);
        var expected = '(|)     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([]);
    });
    it('should subscribe to the source when notifier synchronously completes without emitting', function () {
        var e1 = marble_testing_1.hot('----a--|');
        var e1subs = '^      !';
        var e2 = rxjs_1.EMPTY;
        var expected = '----a--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^      !                ';
        var e2 = marble_testing_1.hot('-------------z--|       ');
        var e2subs = '^      !                ';
        var unsub = '       !                ';
        var expected = '--a--b--                ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should complete when notifier emits if source observable does not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('--a--b--|');
        var e2subs = '^ !';
        var expected = '--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error when notifier raises error if source observable does not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('--#');
        var e2subs = '^ !';
        var expected = '--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete when notifier is empty if source observable does not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var e2 = marble_testing_1.hot('--|');
        var e2subs = '^ !';
        var expected = '---';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete when source and notifier do not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var e2 = marble_testing_1.hot('-');
        var e2subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should complete when notifier emits before source observable emits', function () {
        var e1 = marble_testing_1.hot('----a--|');
        var e1subs = '^ !     ';
        var e2 = marble_testing_1.hot('--x     ');
        var e2subs = '^ !     ';
        var expected = '--|     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error if source raises error before notifier emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--#     ');
        var e1subs = '^             !     ';
        var e2 = marble_testing_1.hot('----------------a--|');
        var e2subs = '^             !     ';
        var expected = '--a--b--c--d--#     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error immediately if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.hot('--x');
        var e2subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should dispose source observable if notifier emits before source emits', function () {
        var e1 = marble_testing_1.hot('---a---|');
        var e1subs = '^ !     ';
        var e2 = marble_testing_1.hot('--x-|   ');
        var e2subs = '^ !     ';
        var expected = '--|     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should dispose notifier if source observable completes', function () {
        var e1 = marble_testing_1.hot('--a--|     ');
        var e1subs = '^    !     ';
        var e2 = marble_testing_1.hot('-------x--|');
        var e2subs = '^    !     ';
        var expected = '--a--|     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--|');
        var e1subs = '^      !                ';
        var e2 = marble_testing_1.hot('-------------z--|       ');
        var e2subs = '^      !                ';
        var unsub = '       !                ';
        var expected = '--a--b--                ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.takeUntil(e2), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=takeUntil-spec.js.map