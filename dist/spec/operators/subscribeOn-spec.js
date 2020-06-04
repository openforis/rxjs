"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('subscribeOn operator', function () {
    asDiagram('subscribeOn(scheduler)')('should subscribe on specified scheduler', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '--a--b--|';
        var sub = '^       !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.subscribeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should start subscribe after specified delay', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '-----b--|';
        var sub = '   ^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.subscribeOn(rxTestScheduler, 30))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should subscribe when source raises error', function () {
        var e1 = marble_testing_1.hot('--a--#');
        var expected = '--a--#';
        var sub = '^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.subscribeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should subscribe when source is empty', function () {
        var e1 = marble_testing_1.hot('----|');
        var expected = '----|';
        var sub = '^   !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.subscribeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should subscribe when source does not complete', function () {
        var e1 = marble_testing_1.hot('----');
        var expected = '----';
        var sub = '^   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.subscribeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var sub = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.subscribeOn(rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should not break unsubscription chains when the result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var sub = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.subscribeOn(rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
});
//# sourceMappingURL=subscribeOn-spec.js.map