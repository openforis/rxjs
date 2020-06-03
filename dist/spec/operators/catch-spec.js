"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var sinon = require("sinon");
var test_helper_1 = require("../helpers/test-helper");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
var interop_helper_1 = require("../helpers/interop-helper");
describe('catchError operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should catch error and replace with a cold Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('  --a--b--#       ');
            var e2 = cold('         -1-2-3-|');
            var expected = '--a--b---1-2-3-|';
            var result = e1.pipe(operators_1.catchError(function (err) { return e2; }));
            expectObservable(result).toBe(expected);
        });
    });
    it('should catch error and replace it with Observable.of()', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--------|');
            var subs = '    ^-------!';
            var expected = '--a--b--(XYZ|)';
            var result = e1.pipe(operators_1.map(function (n) {
                if (n === 'c') {
                    throw 'bad';
                }
                return n;
            }), operators_1.catchError(function (err) {
                return rxjs_1.of('X', 'Y', 'Z');
            }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should catch error and replace it with a cold Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#          ');
            var e1subs = '  ^-------!          ';
            var e2 = cold('         1-2-3-4-5-|');
            var e2subs = '  --------^---------!';
            var expected = '--a--b--1-2-3-4-5-|';
            var result = e1.pipe(operators_1.catchError(function (err) { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --1-2-3-4-5-6---#');
            var e1subs = '  ^------!         ';
            var expected = '--1-2-3-         ';
            var unsub = '   -------!         ';
            var result = e1.pipe(operators_1.catchError(function () {
                return rxjs_1.of('X', 'Y', 'Z');
            }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --1-2-3-4-5-6---#');
            var e1subs = '  ^------!         ';
            var expected = '--1-2-3-         ';
            var unsub = '   -------!         ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.catchError(function () {
                return rxjs_1.of('X', 'Y', 'Z');
            }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should unsubscribe from a caught hot caught observable when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -1-2-3-#          ');
            var e1subs = '  ^------!          ';
            var e2 = hot('  ---3-4-5-6-7-8-9-|');
            var e2subs = '  -------^----!     ';
            var expected = '-1-2-3-5-6-7-     ';
            var unsub = '   ------------!     ';
            var result = e1.pipe(operators_1.catchError(function () { return e2; }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should unsubscribe from a caught cold caught observable when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -1-2-3-#          ');
            var e1subs = '  ^------!          ';
            var e2 = cold('       5-6-7-8-9-|');
            var e2subs = '  -------^----!     ';
            var expected = '-1-2-3-5-6-7-     ';
            var unsub = '   ------------!     ';
            var result = e1.pipe(operators_1.catchError(function () { return e2; }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should unsubscribe from a caught cold caught interop observable when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -1-2-3-#          ');
            var e1subs = '  ^------!          ';
            var e2 = cold('       5-6-7-8-9-|');
            var e2subs = '  -------^----!     ';
            var expected = '-1-2-3-5-6-7-     ';
            var unsub = '   ------------!     ';
            var result = e1.pipe(operators_1.catchError(function () { return interop_helper_1.asInteropObservable(e2); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should stop listening to a synchronous observable when unsubscribed', function () {
        var sideEffects = [];
        var synchronousObservable = rxjs_1.concat(rxjs_1.defer(function () {
            sideEffects.push(1);
            return rxjs_1.of(1);
        }), rxjs_1.defer(function () {
            sideEffects.push(2);
            return rxjs_1.of(2);
        }), rxjs_1.defer(function () {
            sideEffects.push(3);
            return rxjs_1.of(3);
        }));
        rxjs_1.throwError(new Error('Some error')).pipe(operators_1.catchError(function () { return synchronousObservable; }), operators_1.takeWhile(function (x) { return x != 2; })).subscribe(function () { });
        chai_1.expect(sideEffects).to.deep.equal([1, 2]);
    });
    it('should catch error and replace it with a hot Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#          ');
            var e1subs = '  ^-------!          ';
            var e2 = hot('  1-2-3-4-5-6-7-8-9-|');
            var e2subs = '  --------^---------!';
            var expected = '--a--b--5-6-7-8-9-|';
            var result = e1.pipe(operators_1.catchError(function (err) { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should catch and allow the cold observable to be repeated with the third ' +
        '(caught) argument', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold('--a--b--c--------|       ');
            var subs = [
                '               ^-------!                ',
                '              --------^-------!         ',
                '              ----------------^-------! '
            ];
            var expected = '--a--b----a--b----a--b--#';
            var retries = 0;
            var result = e1.pipe(operators_1.map(function (n) {
                if (n === 'c') {
                    throw 'bad';
                }
                return n;
            }), operators_1.catchError(function (err, caught) {
                if (retries++ === 2) {
                    throw 'done';
                }
                return caught;
            }));
            expectObservable(result).toBe(expected, undefined, 'done');
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should catch and allow the hot observable to proceed with the third ' +
        '(caught) argument', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c----d---|');
            var subs = [
                '               ^-------!         ',
                '              --------^--------! '
            ];
            var expected = '--a--b-------d---|';
            var retries = 0;
            var result = e1.pipe(operators_1.map(function (n) {
                if (n === 'c') {
                    throw 'bad';
                }
                return n;
            }), operators_1.catchError(function (err, caught) {
                if (retries++ === 2) {
                    throw 'done';
                }
                return caught;
            }));
            expectObservable(result).toBe(expected, undefined, 'done');
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should catch and replace a Observable.throw() as the source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var subs = '    (^!)';
            var expected = '(abc|)';
            var result = e1.pipe(operators_1.catchError(function (err) { return rxjs_1.of('a', 'b', 'c'); }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should mirror the source if it does not raise errors', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' --a--b--c--|');
            var subs = '    ^----------!';
            var expected = '--a--b--c--|';
            var result = e1.pipe(operators_1.catchError(function (err) { return rxjs_1.of('x', 'y', 'z'); }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should complete if you return Observable.empty()', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#');
            var e1subs = '  ^-------!';
            var e2 = cold('         |');
            var e2subs = '  --------(^!)';
            var expected = '--a--b--|';
            var result = e1.pipe(operators_1.catchError(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should raise error if you return Observable.throw()', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#');
            var e1subs = '  ^-------!';
            var e2 = cold('         #');
            var e2subs = '  --------(^!)';
            var expected = '--a--b--#';
            var result = e1.pipe(operators_1.catchError(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should never terminate if you return NEVER', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--#');
            var e1subs = '  ^-------!';
            var e2 = cold('         -');
            var e2subs = '  --------^';
            var expected = '--a--b---';
            var result = e1.pipe(operators_1.catchError(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should pass the error as the first argument', function (done) {
        rxjs_1.throwError('bad').pipe(operators_1.catchError(function (err) {
            chai_1.expect(err).to.equal('bad');
            return rxjs_1.EMPTY;
        })).subscribe(function () {
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should accept selector returns any ObservableInput', function (done) {
        var input$ = test_helper_1.createObservableInputs(42);
        input$.pipe(operators_1.mergeMap(function (input) {
            return rxjs_1.throwError('bad').pipe(operators_1.catchError(function (err) { return input; }));
        })).subscribe(function (x) {
            chai_1.expect(x).to.be.equal(42);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should catch errors throw from within the constructor', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var source = rxjs_1.concat(new rxjs_1.Observable(function (o) {
                o.next('a');
                throw 'kaboom';
            }).pipe(operators_1.catchError(function (_) { return rxjs_1.of('b'); })), rxjs_1.of('c'));
            var expected = '(abc|)';
            expectObservable(source).toBe(expected);
        });
    });
    context('fromPromise', function () {
        var trueSetTimeout;
        var sandbox;
        var timers;
        beforeEach(function () {
            trueSetTimeout = global.setTimeout;
            sandbox = sinon.createSandbox();
            timers = sandbox.useFakeTimers();
        });
        afterEach(function () {
            sandbox.restore();
        });
        it('should chain a throw from a promise using Observable.throw', function (done) {
            var subscribeSpy = sinon.spy();
            var errorSpy = sinon.spy();
            var thrownError = new Error('BROKEN THROW');
            var testError = new Error('BROKEN PROMISE');
            rxjs_1.from(Promise.reject(testError)).pipe(operators_1.catchError(function (err) {
                return rxjs_1.throwError(thrownError);
            })).subscribe(subscribeSpy, errorSpy);
            trueSetTimeout(function () {
                try {
                    timers.tick(1);
                }
                catch (e) {
                    return done(new Error('This should not have thrown an error'));
                }
                chai_1.expect(subscribeSpy).not.to.be.called;
                chai_1.expect(errorSpy).to.have.been.called;
                chai_1.expect(errorSpy).to.have.been.calledWith(thrownError);
                done();
            }, 0);
        });
    });
});
//# sourceMappingURL=catch-spec.js.map