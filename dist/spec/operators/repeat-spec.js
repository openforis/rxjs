"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('repeat operator', function () {
    it('should resubscribe count number of times', function () {
        var e1 = marble_testing_1.cold('--a--b--|                ');
        var subs = ['^       !                ',
            '        ^       !        ',
            '                ^       !'];
        var expected = '--a--b----a--b----a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should resubscribe multiple times', function () {
        var e1 = marble_testing_1.cold('--a--b--|                        ');
        var subs = ['^       !                        ',
            '        ^       !                ',
            '                ^       !        ',
            '                        ^       !'];
        var expected = '--a--b----a--b----a--b----a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(2), operators_1.repeat(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete without emit when count is zero', function () {
        var e1 = marble_testing_1.cold('--a--b--|');
        var subs = [];
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should emit source once when count is one', function () {
        var e1 = marble_testing_1.cold('--a--b--|');
        var subs = '^       !';
        var expected = '--a--b--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should repeat until gets unsubscribed', function () {
        var e1 = marble_testing_1.cold('--a--b--|      ');
        var subs = ['^       !      ',
            '        ^     !'];
        var unsub = '              !';
        var expected = '--a--b----a--b-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(10)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should be able to repeat indefinitely until unsubscribed', function () {
        var e1 = marble_testing_1.cold('--a--b--|                                    ');
        var subs = ['^       !                                    ',
            '        ^       !                            ',
            '                ^       !                    ',
            '                        ^       !            ',
            '                                ^       !    ',
            '                                        ^   !'];
        var unsub = '                                            !';
        var expected = '--a--b----a--b----a--b----a--b----a--b----a--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.cold('--a--b--|                                    ');
        var subs = ['^       !                                    ',
            '        ^       !                            ',
            '                ^       !                    ',
            '                        ^       !            ',
            '                                ^       !    ',
            '                                        ^   !'];
        var unsub = '                                            !';
        var expected = '--a--b----a--b----a--b----a--b----a--b----a--';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.repeat(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should consider negative count as repeat indefinitely', function () {
        var e1 = marble_testing_1.cold('--a--b--|                                    ');
        var subs = ['^       !                                    ',
            '        ^       !                            ',
            '                ^       !                    ',
            '                        ^       !            ',
            '                                ^       !    ',
            '                                        ^   !'];
        var unsub = '                                            !';
        var expected = '--a--b----a--b----a--b----a--b----a--b----a--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(-1)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should not complete when source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete when source does not completes', function () {
        var e1 = marble_testing_1.cold('-');
        var unsub = '                              !';
        var subs = '^                             !';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete immediately when source does not complete without emit but count is zero', function () {
        var e1 = marble_testing_1.cold('-');
        var subs = [];
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete immediately when source does not complete but count is zero', function () {
        var e1 = marble_testing_1.cold('--a--b--');
        var subs = [];
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should emit source once and does not complete when source emits but does not complete', function () {
        var e1 = marble_testing_1.cold('--a--b--');
        var subs = ['^       '];
        var expected = '--a--b--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = ['(^!)', '(^!)', '(^!)'];
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.cold('----|        ');
        var subs = ['^   !        ',
            '    ^   !    ',
            '        ^   !'];
        var expected = '------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should complete immediately when source does not emit but count is zero', function () {
        var e1 = marble_testing_1.cold('----|');
        var subs = [];
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should raise error when source raises error', function () {
        var e1 = marble_testing_1.cold('--a--b--#');
        var subs = '^       !';
        var expected = '--a--b--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should raises error if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raises error if source throws when repeating infinitely', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error after first emit succeed', function () {
        var repeated = false;
        var e1 = marble_testing_1.cold('--a--|').pipe(operators_1.map(function (x) {
            if (repeated) {
                throw 'error';
            }
            else {
                repeated = true;
                return x;
            }
        }));
        var expected = '--a----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.repeat(2))).toBe(expected);
    });
    it('should repeat a synchronous source (multicasted and refCounted) multiple times', function (done) {
        var expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        rxjs_1.of(1, 2, 3).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount(), operators_1.repeat(5)).subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
});
//# sourceMappingURL=repeat-spec.js.map