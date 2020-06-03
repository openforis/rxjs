"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var interop_helper_1 = require("../helpers/interop-helper");
describe('onErrorResumeNext operator', function () {
    it('should continue observable sequence with next observable', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next = marble_testing_1.cold('--c--d--|');
        var subs = '^       !';
        var expected = '--a--b----c--d--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should continue with hot observables', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next = marble_testing_1.hot('-----x----c--d--|');
        var subs = '^       !';
        var expected = '--a--b----c--d--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should continue with array of multiple observables throw error', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next = [marble_testing_1.cold('--c--d--#'),
            marble_testing_1.cold('--e--#'),
            marble_testing_1.cold('--f--g--|')];
        var subs = '^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should continue with multiple observables throw error', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next1 = marble_testing_1.cold('--c--d--#');
        var next2 = marble_testing_1.cold('--e--#');
        var next3 = marble_testing_1.cold('--f--g--|');
        var subs = '^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next1, next2, next3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should continue with multiple observables does not throw error', function () {
        var source = marble_testing_1.hot('--a--b--|');
        var next1 = marble_testing_1.cold('--c--d--|');
        var next2 = marble_testing_1.cold('--e--|');
        var next3 = marble_testing_1.cold('--f--g--|');
        var subs = '^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next1, next2, next3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should continue after empty observable', function () {
        var source = marble_testing_1.hot('|');
        var next1 = marble_testing_1.cold('--c--d--|');
        var next2 = marble_testing_1.cold('--e--#');
        var next3 = marble_testing_1.cold('--f--g--|');
        var subs = '(^!)';
        var expected = '--c--d----e----f--g--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next1, next2, next3))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not complete with observble does not ends', function () {
        var source = marble_testing_1.hot('--a--b--|');
        var next1 = marble_testing_1.cold('--');
        var subs = '^       !';
        var expected = '--a--b----';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next1))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not continue with observble does not ends', function () {
        var source = marble_testing_1.hot('--');
        var next1 = marble_testing_1.cold('-a--b-');
        var subs = '^       ';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next1))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should complete observable with next observable throws', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next = marble_testing_1.cold('--c--d--#');
        var subs = '^       !';
        var expected = '--a--b----c--d--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(next))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
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
        rxjs_1.throwError(new Error('Some error')).pipe(operators_1.onErrorResumeNext(synchronousObservable), operators_1.takeWhile(function (x) { return x != 2; })).subscribe(function () { });
        chai_1.expect(sideEffects).to.deep.equal([1, 2]);
    });
    it('should unsubscribe from an interop observble upon explicit unsubscription', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var next = marble_testing_1.cold('--c--d--');
        var nextSubs = '        ^   !';
        var subs = '^           !';
        var expected = '--a--b----c--';
        marble_testing_1.expectObservable(source.pipe(operators_1.onErrorResumeNext(interop_helper_1.asInteropObservable(next))), subs).toBe(expected);
        marble_testing_1.expectSubscriptions(next.subscriptions).toBe(nextSubs);
    });
    it('should work with promise', function (done) {
        var expected = [1, 2];
        var source = rxjs_1.concat(rxjs_1.of(1), rxjs_1.throwError('meh'));
        source.pipe(operators_1.onErrorResumeNext(Promise.resolve(2)))
            .subscribe(function (x) {
            chai_1.expect(expected.shift()).to.equal(x);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected).to.be.empty;
            done();
        });
    });
});
//# sourceMappingURL=onErrorResumeNext-spec.js.map