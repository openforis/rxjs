"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var interop_helper_1 = require("../helpers/interop-helper");
describe('skipUntil', function () {
    it('should skip values until another observable notifies', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e----|');
        var e1subs = '^                  !';
        var skip = marble_testing_1.hot('---------x------|   ');
        var skipSubs = '^        !          ';
        var expected = ('-----------d--e----|');
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should emit elements after notifer emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.hot('---------x----|   ');
        var skipSubs = '^        !        ';
        var expected = ('-----------d--e--|');
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should emit elements after a synchronous notifier emits', function () {
        var values = [];
        rxjs_1.of('a', 'b').pipe(operators_1.skipUntil(rxjs_1.of('x'))).subscribe(function (value) { return values.push(value); }, function (err) { throw err; }, function () { return chai_1.expect(values).to.deep.equal(['a', 'b']); });
    });
    it('should raise an error if notifier throws and source is hot', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^            !    ';
        var skip = marble_testing_1.hot('-------------#    ');
        var skipSubs = '^            !    ';
        var expected = '-------------#    ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip all elements when notifier does not emit and completes early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.hot('------------|');
        var skipSubs = '^           !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e----|');
        var unsub = '         !          ';
        var e1subs = '^        !          ';
        var skip = marble_testing_1.hot('-------------x--|   ');
        var skipSubs = '^        !          ';
        var expected = ('----------          ');
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e----|');
        var e1subs = '^        !          ';
        var skip = marble_testing_1.hot('-------------x--|   ');
        var skipSubs = '^        !          ';
        var expected = ('----------          ');
        var unsub = '         !          ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.skipUntil(skip), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e----|');
        var e1subs = '^        !          ';
        var skip = marble_testing_1.hot('-------------x--|   ');
        var skipSubs = '^        !          ';
        var expected = ('----------          ');
        var unsub = '         !          ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.skipUntil(interop_helper_1.asInteropObservable(skip)), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip all elements when notifier is empty', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.cold('|');
        var skipSubs = '(^!)';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should keep subscription to source, to wait for its eventual completion', function () {
        var e1 = marble_testing_1.hot('------------------------------|');
        var e1subs = '^                             !';
        var skip = marble_testing_1.hot('-------|                       ');
        var skipSubs = '^      !                       ';
        var expected = '------------------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not complete if hot source observable does not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var skip = marble_testing_1.hot('-------------x--|');
        var skipSubs = '^            !   ';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not complete if cold source observable never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var skip = marble_testing_1.hot('-------------x--|');
        var skipSubs = '^            !   ';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should raise error if cold source is never and notifier errors', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^            !';
        var skip = marble_testing_1.hot('-------------#');
        var skipSubs = '^            !';
        var expected = '-------------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip all elements and complete if notifier is cold never', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.cold('-');
        var skipSubs = '^                !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip all elements and complete if notifier is a hot never', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.hot('-');
        var skipSubs = '^                !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip all elements and complete, even if notifier would not complete until later', function () {
        var e1 = marble_testing_1.hot('^-a--b--c--d--e--|');
        var e1subs = '^                !';
        var skip = marble_testing_1.hot('^-----------------------|');
        var skipSubs = '^                !';
        var expected = '-----------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not complete if source does not complete if notifier completes without emission', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var skip = marble_testing_1.hot('--------------|');
        var skipSubs = '^             !';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should not complete if source and notifier are both hot never', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var skip = marble_testing_1.hot('-');
        var skipSubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
    it('should skip skip all elements if notifier is unsubscribed explicitly before the notifier emits', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--|');
        var e1subs = ['^                !',
            '^                !'];
        var skip = new rxjs_1.Subject();
        var expected = '-----------------|';
        e1.subscribe(function (x) {
            if (x === 'd' && !skip.closed) {
                skip.next('x');
            }
            skip.unsubscribe();
        });
        marble_testing_1.expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should unsubscribe the notifier after its first nexted value', function () {
        var source = marble_testing_1.hot('-^-o---o---o---o---o---o---|');
        var notifier = marble_testing_1.hot('-^--------n--n--n--n--n--n-|');
        var nSubs = '^        !';
        var expected = '-^---------o---o---o---o---|';
        var result = source.pipe(operators_1.skipUntil(notifier));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nSubs);
    });
    it('should stop listening to a synchronous notifier after its first nexted value', function () {
        var sideEffects = [];
        var synchronousNotifer = rxjs_1.concat(rxjs_1.defer(function () {
            sideEffects.push(1);
            return rxjs_1.of(1);
        }), rxjs_1.defer(function () {
            sideEffects.push(2);
            return rxjs_1.of(2);
        }), rxjs_1.defer(function () {
            sideEffects.push(3);
            return rxjs_1.of(3);
        }));
        rxjs_1.of(null).pipe(operators_1.skipUntil(synchronousNotifer)).subscribe(function () { });
        chai_1.expect(sideEffects).to.deep.equal([1]);
    });
});
//# sourceMappingURL=skipUntil-spec.js.map