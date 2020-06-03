"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var interop_helper_1 = require("../helpers/interop-helper");
describe('finalize operator', function () {
    it('should call finalize after complete', function (done) {
        var completed = false;
        rxjs_1.of(1, 2, 3).pipe(operators_1.finalize(function () {
            chai_1.expect(completed).to.be.true;
            done();
        })).subscribe(null, null, function () {
            completed = true;
        });
    });
    it('should call finalize after error', function (done) {
        var thrown = false;
        rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (x) {
            if (x === 3) {
                throw x;
            }
            return x;
        }), operators_1.finalize(function () {
            chai_1.expect(thrown).to.be.true;
            done();
        })).subscribe(null, function () {
            thrown = true;
        });
    });
    it('should call finalize upon disposal', function (done) {
        var disposed = false;
        var subscription = rxjs_1.timer(100).pipe(operators_1.finalize(function () {
            chai_1.expect(disposed).to.be.true;
            done();
        })).subscribe();
        disposed = true;
        subscription.unsubscribe();
    });
    it('should call finalize when synchronously subscribing to and unsubscribing ' +
        'from a shared Observable', function (done) {
        rxjs_1.interval(50).pipe(operators_1.finalize(done), operators_1.share()).subscribe()
            .unsubscribe();
    });
    it('should call two finalize instances in succession on a shared Observable', function (done) {
        var invoked = 0;
        function checkFinally() {
            invoked += 1;
            if (invoked === 2) {
                done();
            }
        }
        rxjs_1.of(1, 2, 3).pipe(operators_1.finalize(checkFinally), operators_1.finalize(checkFinally), operators_1.share()).subscribe();
    });
    it('should handle empty', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('|');
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        var expected = '|';
        marble_testing_1.expectObservable(result).toBe(expected);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle never', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('-');
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        var expected = '-';
        marble_testing_1.expectObservable(result).toBe(expected);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.false;
    });
    it('should handle throw', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('#');
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        var expected = '#';
        marble_testing_1.expectObservable(result).toBe(expected);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle basic hot observable', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('--a--b--c--|');
        var subs = '^          !';
        var expected = '--a--b--c--|';
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle basic cold observable', function () {
        var executed = false;
        var s1 = marble_testing_1.cold('--a--b--c--|');
        var subs = '^          !';
        var expected = '--a--b--c--|';
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle basic error', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('--a--b--c--#');
        var subs = '^          !';
        var expected = '--a--b--c--#';
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle unsubscription', function () {
        var executed = false;
        var s1 = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '--a--b-';
        var unsub = '      !';
        var result = s1.pipe(operators_1.finalize(function () { return executed = true; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs);
        rxTestScheduler.flush();
        chai_1.expect(executed).to.be.true;
    });
    it('should handle interop source observables', function () {
        var finalized = false;
        var subscription = interop_helper_1.asInteropObservable(rxjs_1.NEVER).pipe(operators_1.finalize(function () { return finalized = true; })).subscribe();
        subscription.unsubscribe();
        chai_1.expect(finalized).to.be.true;
    });
    it('should finalize sources before sinks', function () {
        var finalized = [];
        rxjs_1.of(42).pipe(operators_1.finalize(function () { return finalized.push('source'); }), operators_1.finalize(function () { return finalized.push('sink'); })).subscribe();
        chai_1.expect(finalized).to.deep.equal(['source', 'sink']);
    });
    it('should finalize after the teardown', function () {
        var order = [];
        var source = new rxjs_1.Observable(function () {
            return function () { return order.push('teardown'); };
        });
        var subscription = source.pipe(operators_1.finalize(function () { return order.push('finalize'); })).subscribe();
        subscription.unsubscribe();
        chai_1.expect(order).to.deep.equal(['teardown', 'finalize']);
    });
    it('should finalize after the teardown with synchronous completion', function () {
        var order = [];
        var source = new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () { return order.push('teardown'); };
        });
        source.pipe(operators_1.finalize(function () { return order.push('finalize'); })).subscribe();
        chai_1.expect(order).to.deep.equal(['teardown', 'finalize']);
    });
});
//# sourceMappingURL=finalize-spec.js.map