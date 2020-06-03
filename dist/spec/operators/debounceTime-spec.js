"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var VirtualTimeScheduler_1 = require("../../src/internal/scheduler/VirtualTimeScheduler");
describe('debounceTime operator', function () {
    it('should debounce values by 20 time units', function () {
        var e1 = marble_testing_1.hot('-a--bc--d---|');
        var expected = '---a---c--d-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(20, rxTestScheduler))).toBe(expected);
    });
    it('should delay all element by the specified time', function () {
        var e1 = marble_testing_1.hot('-a--------b------c----|');
        var e1subs = '^                     !';
        var expected = '------a--------b------(c|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce and delay element by the specified time', function () {
        var e1 = marble_testing_1.hot('-a--(bc)-----------d-------|');
        var e1subs = '^                          !';
        var expected = '---------c--------------d--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.hot('-----|');
        var e1subs = '^    !';
        var expected = '-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source does not emit and raises error', function () {
        var e1 = marble_testing_1.hot('-----#');
        var e1subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^      !       ';
        var expected = '----a---       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.debounceTime(20, rxTestScheduler));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^      !       ';
        var expected = '----a---       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.debounceTime(20, rxTestScheduler), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce and does not complete when source does not completes', function () {
        var e1 = marble_testing_1.hot('-a--(bc)-----------d-------');
        var e1subs = '^                          ';
        var expected = '---------c--------------d--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes when source does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes when source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(10, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should delay all element until source raises error', function () {
        var e1 = marble_testing_1.hot('-a--------b------c----#');
        var e1subs = '^                     !';
        var expected = '------a--------b------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(50, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce all elements while source emits within given time', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--h-|');
        var e1subs = '^                        !';
        var expected = '-------------------------(h|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(40, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce all element while source emits within given time until raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--e--f--g--h-#');
        var e1subs = '^                        !';
        var expected = '-------------------------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounceTime(40, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce correctly when synchronously reentered', function () {
        var results = [];
        var source = new rxjs_1.Subject();
        var scheduler = new VirtualTimeScheduler_1.VirtualTimeScheduler();
        source.pipe(operators_1.debounceTime(0, scheduler)).subscribe(function (value) {
            results.push(value);
            if (value === 1) {
                source.next(2);
            }
        });
        source.next(1);
        scheduler.flush();
        chai_1.expect(results).to.deep.equal([1, 2]);
    });
});
//# sourceMappingURL=debounceTime-spec.js.map