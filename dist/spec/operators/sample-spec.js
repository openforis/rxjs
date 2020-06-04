"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('sample operator', function () {
    asDiagram('sample')('should get samples when the notifier emits', function () {
        var e1 = marble_testing_1.hot('---a----b---c----------d-----|   ');
        var e1subs = '^                            !   ';
        var e2 = marble_testing_1.hot('-----x----------x---x------x---|');
        var e2subs = '^                            !   ';
        var expected = '-----a----------c----------d-|   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should sample nothing if source has not nexted at all', function () {
        var e1 = marble_testing_1.hot('----a-^------------|');
        var e1subs = '^            !';
        var e2 = marble_testing_1.hot('-----x-------|');
        var e2subs = '^            !';
        var expected = '-------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should behave properly when notified by the same observable as the source (issue #2075)', function () {
        var item$ = new rxjs_1.Subject();
        var results = [];
        item$.pipe(operators_1.sample(item$)).subscribe(function (value) { return results.push(value); });
        item$.next(1);
        item$.next(2);
        item$.next(3);
        chai_1.expect(results).to.deep.equal([1, 2, 3]);
    });
    it('should sample nothing if source has nexted after all notifications, but notifier does not complete', function () {
        var e1 = marble_testing_1.hot('----a-^------b-----|');
        var e1subs = '^            !';
        var e2 = marble_testing_1.hot('-----x--------');
        var e2subs = '^            !';
        var expected = '-------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should sample when the notifier completes', function () {
        var e1 = marble_testing_1.hot('----a-^------b----------|');
        var e1subs = '^                 !';
        var e2 = marble_testing_1.hot('-----x-----|');
        var e2subs = '^          !';
        var expected = '-----------b------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete when the notifier completes, nor should it emit', function () {
        var e1 = marble_testing_1.hot('----a----b----c----d----e----f----');
        var e1subs = '^                                 ';
        var e2 = marble_testing_1.hot('------x-|                         ');
        var e2subs = '^       !                         ';
        var expected = '------a---------------------------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should complete only when the source completes, if notifier completes early', function () {
        var e1 = marble_testing_1.hot('----a----b----c----d----e----f---|');
        var e1subs = '^                                !';
        var e2 = marble_testing_1.hot('------x-|                         ');
        var e2subs = '^       !                         ';
        var expected = '------a--------------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----e----f----|          ');
        var unsub = '              !                        ';
        var e1subs = '^             !                        ';
        var e2 = marble_testing_1.hot('-----x----------x----------x----------|');
        var e2subs = '^             !                        ';
        var expected = '-----b---------                        ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----e----f----|          ');
        var e1subs = '^             !                        ';
        var e2 = marble_testing_1.hot('-----x----------x----------x----------|');
        var e2subs = '^             !                        ';
        var expected = '-----b---------                        ';
        var unsub = '              !                        ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.sample(e2), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should only sample when a new value arrives, even if it is the same value', function () {
        var e1 = marble_testing_1.hot('----a----b----c----c----e----f----|  ');
        var e1subs = '^                                 !  ';
        var e2 = marble_testing_1.hot('------x-x------xx-x---x----x--------|');
        var e2subs = '^                                 !  ';
        var expected = '------a--------c------c----e------|  ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error if source raises error', function () {
        var e1 = marble_testing_1.hot('----a-^--b----c----d----#                    ');
        var e1subs = '^                 !                    ';
        var e2 = marble_testing_1.hot('-----x----------x----------x----------|');
        var e2subs = '^                 !                    ';
        var expected = '-----b----------d-#                    ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should completes if source does not emits', function () {
        var e1 = marble_testing_1.hot('|');
        var e2 = marble_testing_1.hot('------x-------|');
        var expected = '|';
        var e1subs = '(^!)';
        var e2subs = '(^!)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error if source throws immediately', function () {
        var e1 = marble_testing_1.hot('#');
        var e2 = marble_testing_1.hot('------x-------|');
        var expected = '#';
        var e1subs = '(^!)';
        var e2subs = '(^!)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error if notification raises error', function () {
        var e1 = marble_testing_1.hot('--a-----|');
        var e2 = marble_testing_1.hot('----#');
        var expected = '----#';
        var e1subs = '^   !';
        var e2subs = '^   !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not completes if source does not complete', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^              ';
        var e2 = marble_testing_1.hot('------x-------|');
        var e2subs = '^             !';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should sample only until source completes', function () {
        var e1 = marble_testing_1.hot('----a----b----c----d-|');
        var e1subs = '^                    !';
        var e2 = marble_testing_1.hot('-----------x----------x------------|');
        var e2subs = '^                    !';
        var expected = '-----------b---------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should complete sampling if sample observable completes', function () {
        var e1 = marble_testing_1.hot('----a----b----c----d-|');
        var e1subs = '^                    !';
        var e2 = marble_testing_1.hot('|');
        var e2subs = '(^!)';
        var expected = '---------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=sample-spec.js.map