"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('timeoutWith operator', function () {
    it('should timeout after a specified period then subscribe to the passed observable', function () {
        var e1 = marble_testing_1.cold('-------a--b--|');
        var e1subs = '^    !        ';
        var e2 = marble_testing_1.cold('x-y-z-|  ');
        var e2subs = '     ^     !  ';
        var expected = '-----x-y-z-|  ';
        var result = e1.pipe(operators_1.timeoutWith(50, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout at a specified date then subscribe to the passed observable', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^         !           ';
        var e2 = marble_testing_1.cold('--x--y--z--|');
        var e2subs = '          ^          !';
        var expected = '------------x--y--z--|';
        var result = e1.pipe(operators_1.timeoutWith(new Date(rxTestScheduler.now() + 100), e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after a specified period between emit then subscribe ' +
        'to the passed observable when source emits', function () {
        var e1 = marble_testing_1.hot('---a---b------c---|');
        var e1subs = '^          !       ';
        var e2 = marble_testing_1.cold('-x-y-|  ');
        var e2subs = '           ^    !  ';
        var expected = '---a---b----x-y-|  ';
        var result = e1.pipe(operators_1.timeoutWith(40, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('---a---b-----c----|');
        var e1subs = '^          !       ';
        var e2 = marble_testing_1.cold('-x---y| ');
        var e2subs = '           ^  !    ';
        var expected = '---a---b----x--    ';
        var unsub = '              !    ';
        var result = e1.pipe(operators_1.timeoutWith(40, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('---a---b-----c----|');
        var e1subs = '^          !       ';
        var e2 = marble_testing_1.cold('-x---y| ');
        var e2subs = '           ^  !    ';
        var expected = '---a---b----x--    ';
        var unsub = '              !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.timeoutWith(40, e2, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not subscribe to withObservable after explicit unsubscription', function () {
        var e1 = marble_testing_1.cold('---a------b------');
        var e1subs = '^    !           ';
        var e2 = marble_testing_1.cold('i---j---|');
        var e2subs = [];
        var expected = '---a--           ';
        var unsub = '     !           ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.timeoutWith(50, e2, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after a specified period then subscribe to the ' +
        'passed observable when source is empty', function () {
        var e1 = marble_testing_1.hot('-------------|      ');
        var e1subs = '^         !         ';
        var e2 = marble_testing_1.cold('----x----|');
        var e2subs = '          ^        !';
        var expected = '--------------x----|';
        var result = e1.pipe(operators_1.timeoutWith(100, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after a specified period between emit then never completes ' +
        'if other source does not complete', function () {
        var e1 = marble_testing_1.hot('--a--b--------c--d--|');
        var e1subs = '^        !           ';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '         ^           ';
        var expected = '--a--b----           ';
        var result = e1.pipe(operators_1.timeoutWith(40, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after a specified period then subscribe to the ' +
        'passed observable when source raises error after timeout', function () {
        var e1 = marble_testing_1.hot('-------------#      ');
        var e1subs = '^         !         ';
        var e2 = marble_testing_1.cold('----x----|');
        var e2subs = '          ^        !';
        var expected = '--------------x----|';
        var result = e1.pipe(operators_1.timeoutWith(100, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after a specified period between emit then never completes ' +
        'if other source emits but not complete', function () {
        var e1 = marble_testing_1.hot('-------------|     ');
        var e1subs = '^         !        ';
        var e2 = marble_testing_1.cold('----x----');
        var e2subs = '          ^        ';
        var expected = '--------------x----';
        var result = e1.pipe(operators_1.timeoutWith(100, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not timeout if source completes within timeout period', function () {
        var e1 = marble_testing_1.hot('-----|');
        var e1subs = '^    !';
        var e2 = marble_testing_1.cold('----x----');
        var e2subs = [];
        var expected = '-----|';
        var result = e1.pipe(operators_1.timeoutWith(100, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not timeout if source raises error within timeout period', function () {
        var e1 = marble_testing_1.hot('-----#');
        var e1subs = '^    !';
        var e2 = marble_testing_1.cold('----x----|');
        var e2subs = [];
        var expected = '-----#';
        var result = e1.pipe(operators_1.timeoutWith(100, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not timeout if source emits within timeout period', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var e2 = marble_testing_1.cold('----x----|');
        var e2subs = [];
        var expected = '--a--b--c--d--e--|';
        var result = e1.pipe(operators_1.timeoutWith(50, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout after specified Date then subscribe to the passed observable', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^      !          ';
        var e2 = marble_testing_1.cold('--z--|     ');
        var e2subs = '       ^    !     ';
        var expected = '--a--b---z--|     ';
        var result = e1.pipe(operators_1.timeoutWith(new Date(rxTestScheduler.now() + 70), e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not timeout if source completes within specified Date', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var e2 = marble_testing_1.cold('--x--|');
        var e2subs = [];
        var expected = '--a--b--c--d--e--|';
        var timeoutValue = new Date(Date.now() + (expected.length + 2) * 10);
        var result = e1.pipe(operators_1.timeoutWith(timeoutValue, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not timeout if source raises error within specified Date', function () {
        var e1 = marble_testing_1.hot('---a---#');
        var e1subs = '^      !';
        var e2 = marble_testing_1.cold('--x--|');
        var e2subs = [];
        var expected = '---a---#';
        var result = e1.pipe(operators_1.timeoutWith(new Date(Date.now() + 100), e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should timeout specified Date after specified Date then never completes ' +
        'if other source does not complete', function () {
        var e1 = marble_testing_1.hot('---a---b---c---d---e---|');
        var e1subs = '^         !             ';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '          ^             ';
        var expected = '---a---b---             ';
        var result = e1.pipe(operators_1.timeoutWith(new Date(rxTestScheduler.now() + 100), e2, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should unsubscribe from the scheduled timeout action when timeout is unsubscribed early', function () {
        var e1 = marble_testing_1.hot('---a---b-----c----|');
        var e1subs = '^          !       ';
        var e2 = marble_testing_1.cold('-x---y| ');
        var e2subs = '           ^  !    ';
        var expected = '---a---b----x--    ';
        var unsub = '              !    ';
        var result = e1
            .lift({
            call: function (timeoutSubscriber, source) {
                var action = timeoutSubscriber.action;
                timeoutSubscriber.add(function () {
                    if (!action.closed) {
                        throw new Error('TimeoutSubscriber scheduled action wasn\'t canceled');
                    }
                });
                return source.subscribe(timeoutSubscriber);
            }
        })
            .pipe(operators_1.timeoutWith(40, e2, rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=timeoutWith-spec.js.map