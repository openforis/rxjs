"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('timeout operator', function () {
    var defaultTimeoutError = new rxjs_1.TimeoutError();
    asDiagram('timeout(50)')('should timeout after a specified timeout period', function () {
        var e1 = marble_testing_1.cold('-------a--b--|');
        var e1subs = '^    !        ';
        var expected = '-----#        ';
        var result = e1.pipe(operators_1.timeout(50, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected, null, defaultTimeoutError);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit and error of an instanceof TimeoutError on timeout', function () {
        var e1 = marble_testing_1.cold('-------a--b--|');
        var result = e1.pipe(operators_1.timeout(50, rxTestScheduler));
        var error;
        result.subscribe(function () {
            throw new Error('this should not next');
        }, function (err) {
            error = err;
        }, function () {
            throw new Error('this should not complete');
        });
        rxTestScheduler.flush();
        chai_1.expect(error).to.be.an.instanceof(rxjs_1.TimeoutError);
        chai_1.expect(error).to.have.property('name', 'TimeoutError');
    });
    it('should not timeout if source completes within absolute timeout period', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var expected = '--a--b--c--d--e--|';
        var timeoutValue = new Date(rxTestScheduler.now() + (expected.length + 2) * 10);
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeout(timeoutValue, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not timeout if source emits within timeout period', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var expected = '--a--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.timeout(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c---d--e--|');
        var unsub = '          !        ';
        var e1subs = '^         !        ';
        var expected = '--a--b--c--        ';
        var result = e1.pipe(operators_1.timeout(50, rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c---d--e--|');
        var e1subs = '^         !        ';
        var expected = '--a--b--c--        ';
        var unsub = '          !        ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.timeout(50, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should timeout after a specified timeout period between emit with default ' +
        'error while source emits', function () {
        var e1 = marble_testing_1.hot('---a---b---c------d---e---|');
        var e1subs = '^               !          ';
        var expected = '---a---b---c----#          ';
        var values = { a: 'a', b: 'b', c: 'c' };
        var result = e1.pipe(operators_1.timeout(50, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected, values, defaultTimeoutError);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should timeout at a specified Date', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^         !';
        var expected = '----------#';
        var result = e1.pipe(operators_1.timeout(new Date(rxTestScheduler.now() + 100), rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected, null, defaultTimeoutError);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should timeout specified Date with default error while source emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^         !       ';
        var expected = '--a--b--c-#       ';
        var values = { a: 'a', b: 'b', c: 'c' };
        var result = e1.pipe(operators_1.timeout(new Date(rxTestScheduler.now() + 100), rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected, values, defaultTimeoutError);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should unsubscribe from the scheduled timeout action when timeout is unsubscribed early', function () {
        var e1 = marble_testing_1.hot('--a--b--c---d--e--|');
        var e1subs = '^         !        ';
        var expected = '--a--b--c--        ';
        var unsub = '          !        ';
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
            .pipe(operators_1.timeout(50, rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=timeout-spec.js.map