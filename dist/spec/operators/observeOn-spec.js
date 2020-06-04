"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('observeOn operator', function () {
    asDiagram('observeOn(scheduler)')('should observe on specified scheduler', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '--a--b--|';
        var sub = '^       !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.observeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should observe after specified delay', function () {
        var e1 = marble_testing_1.hot('--a--b--|   ');
        var expected = '-----a--b--|';
        var sub = '^       !   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.observeOn(rxTestScheduler, 30))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should observe when source raises error', function () {
        var e1 = marble_testing_1.hot('--a--#');
        var expected = '--a--#';
        var sub = '^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.observeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should observe when source is empty', function () {
        var e1 = marble_testing_1.hot('-----|');
        var expected = '-----|';
        var sub = '^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.observeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should observe when source does not complete', function () {
        var e1 = marble_testing_1.hot('-----');
        var expected = '-----';
        var sub = '^    ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.observeOn(rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var sub = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.observeOn(rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should not break unsubscription chains when the result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var sub = '^   !    ';
        var expected = '--a--    ';
        var unsub = '    !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.observeOn(rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should clean up subscriptions created by async scheduling (prevent memory leaks #2244)', function (done) {
        var results = [];
        var subscription = new rxjs_1.Observable(function (observer) {
            var i = 1;
            return rxjs_1.asapScheduler.schedule(function () {
                if (i > 3) {
                    observer.complete();
                }
                else {
                    observer.next(i++);
                    this.schedule();
                }
            });
        })
            .pipe(operators_1.observeOn(rxjs_1.asapScheduler))
            .subscribe(function (x) {
            chai_1.expect(subscription._subscriptions.length).to.equal(2);
            var actionSubscription = subscription._subscriptions[1];
            chai_1.expect(actionSubscription.state.notification.kind).to.equal('N');
            chai_1.expect(actionSubscription.state.notification.value).to.equal(x);
            results.push(x);
        }, function (err) { return done(err); }, function () {
            chai_1.expect(subscription._subscriptions.length).to.equal(1);
            var actionSubscription = subscription._subscriptions[0];
            chai_1.expect(actionSubscription.state.notification.kind).to.equal('C');
            chai_1.expect(results).to.deep.equal([1, 2, 3]);
            done();
        });
    });
});
//# sourceMappingURL=observeOn-spec.js.map