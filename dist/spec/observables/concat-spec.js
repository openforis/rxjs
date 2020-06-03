"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var test_helper_1 = require("../helpers/test-helper");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var queueScheduler = rxjs_1.queueScheduler;
describe('static concat', function () {
    it('should emit elements from multiple sources', function () {
        var e1 = marble_testing_1.cold('-a-b-c-|');
        var e1subs = '^      !';
        var e2 = marble_testing_1.cold('-0-1-|');
        var e2subs = '       ^    !';
        var e3 = marble_testing_1.cold('-w-x-y-z-|');
        var e3subs = '            ^        !';
        var expected = '-a-b-c--0-1--w-x-y-z-|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2, e3)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should concat the same cold observable multiple times', function () {
        var inner = marble_testing_1.cold('--i-j-k-l-|                              ');
        var innersubs = ['^         !                              ',
            '          ^         !                    ',
            '                    ^         !          ',
            '                              ^         !'];
        var expected = '--i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l-|';
        var result = rxjs_1.concat(inner, inner, inner, inner);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
    });
    it('should concat the same cold observable multiple times, ' +
        'but the result is unsubscribed early', function () {
        var inner = marble_testing_1.cold('--i-j-k-l-|     ');
        var unsub = '               !';
        var innersubs = ['^         !     ',
            '          ^    !'];
        var expected = '--i-j-k-l---i-j-';
        var result = rxjs_1.concat(inner, inner, inner, inner);
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var inner = marble_testing_1.cold('--i-j-k-l-|     ');
        var innersubs = ['^         !     ',
            '          ^    !'];
        var expected = '--i-j-k-l---i-j-';
        var unsub = '               !';
        var innerWrapped = inner.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        var result = rxjs_1.concat(innerWrapped, innerWrapped, innerWrapped, innerWrapped)
            .pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
    });
    it('should complete without emit if both sources are empty', function () {
        var e1 = marble_testing_1.cold('--|');
        var e1subs = '^ !';
        var e2 = marble_testing_1.cold('----|');
        var e2subs = '  ^   !';
        var expected = '------|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete if first source does not completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('--|');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete if second source does not completes', function () {
        var e1 = marble_testing_1.cold('--|');
        var e1subs = '^ !';
        var e2 = marble_testing_1.cold('---');
        var e2subs = '  ^';
        var expected = '---';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete if both sources do not complete', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('-');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error when first source is empty, second source raises error', function () {
        var e1 = marble_testing_1.cold('--|');
        var e1subs = '^ !';
        var e2 = marble_testing_1.cold('----#');
        var e2subs = '  ^   !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error when first source raises error, second source is empty', function () {
        var e1 = marble_testing_1.cold('---#');
        var e1subs = '^  !';
        var e2 = marble_testing_1.cold('----|');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '---#';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise first error when both source raise error', function () {
        var e1 = marble_testing_1.cold('---#');
        var e1subs = '^  !';
        var e2 = marble_testing_1.cold('------#');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '---#';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should concat if first source emits once, second source is empty', function () {
        var e1 = marble_testing_1.cold('--a--|');
        var e1subs = '^    !';
        var e2 = marble_testing_1.cold('--------|');
        var e2subs = '     ^       !';
        var expected = '--a----------|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should concat if first source is empty, second source emits once', function () {
        var e1 = marble_testing_1.cold('--|');
        var e1subs = '^ !';
        var e2 = marble_testing_1.cold('--a--|');
        var e2subs = '  ^    !';
        var expected = '----a--|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit element from first source, and should not complete if second ' +
        'source does not completes', function () {
        var e1 = marble_testing_1.cold('--a--|');
        var e1subs = '^    !';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '     ^';
        var expected = '--a---';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not complete if first source does not complete', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('--a--|');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit elements from each source when source emit once', function () {
        var e1 = marble_testing_1.cold('---a|');
        var e1subs = '^   !';
        var e2 = marble_testing_1.cold('-----b--|');
        var e2subs = '    ^       !';
        var expected = '---a-----b--|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should unsubscribe to inner source if outer is unsubscribed early', function () {
        var e1 = marble_testing_1.cold('---a-a--a|            ');
        var e1subs = '^        !            ';
        var e2 = marble_testing_1.cold('-----b-b--b-|');
        var e2subs = '         ^       !    ';
        var unsub = '                 !    ';
        var expected = '---a-a--a-----b-b     ';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error from first source and does not emit from second source', function () {
        var e1 = marble_testing_1.cold('--#');
        var e1subs = '^ !';
        var e2 = marble_testing_1.cold('----a--|');
        var e2subs = marble_testing_1.emptySubs;
        var expected = '--#';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit element from first source then raise error from second source', function () {
        var e1 = marble_testing_1.cold('--a--|');
        var e1subs = '^    !';
        var e2 = marble_testing_1.cold('-------#');
        var e2subs = '     ^      !';
        var expected = '--a---------#';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit all elements from both hot observable sources if first source ' +
        'completes before second source starts emit', function () {
        var e1 = marble_testing_1.hot('--a--b-|');
        var e1subs = '^      !';
        var e2 = marble_testing_1.hot('--------x--y--|');
        var e2subs = '       ^      !';
        var expected = '--a--b--x--y--|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit elements from second source regardless of completion time ' +
        'when second source is cold observable', function () {
        var e1 = marble_testing_1.hot('--a--b--c---|');
        var e1subs = '^           !';
        var e2 = marble_testing_1.cold('-x-y-z-|');
        var e2subs = '            ^      !';
        var expected = '--a--b--c----x-y-z-|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not emit collapsing element from second source', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var e2 = marble_testing_1.hot('--------x--y--z--|');
        var e2subs = '           ^     !';
        var expected = '--a--b--c--y--z--|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should return empty if concatenating an empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = ['(^!)', '(^!)'];
        var expected = '|';
        var result = rxjs_1.concat(e1, e1);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should error immediately if given a just-throw source', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var result = rxjs_1.concat(e1, e1);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit elements from second source regardless of completion time ' +
        'when second source is cold observable', function () {
        var e1 = marble_testing_1.hot('--a--b--c---|');
        var e1subs = '^           !';
        var e2 = marble_testing_1.cold('-x-y-z-|');
        var e2subs = '            ^      !';
        var expected = '--a--b--c----x-y-z-|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not emit collapsing element from second source', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var e2 = marble_testing_1.hot('--------x--y--z--|');
        var e2subs = '           ^     !';
        var expected = '--a--b--c--y--z--|';
        marble_testing_1.expectObservable(rxjs_1.concat(e1, e2)).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should concat an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, queueScheduler);
        var r = [1, 2, 3, 4, 5, 6, 7, 8];
        rxjs_1.concat(a, b, queueScheduler).subscribe(function (vals) {
            chai_1.expect(vals).to.equal(r.shift());
        }, null, done);
    });
    it('should use the scheduler even when one Observable is concat\'d', function (done) {
        var e1Subscribed = false;
        var e1 = rxjs_1.defer(function () {
            e1Subscribed = true;
            return rxjs_1.of('a');
        });
        rxjs_1.concat(e1, rxjs_1.asyncScheduler)
            .subscribe({
            error: done,
            complete: function () {
                chai_1.expect(e1Subscribed).to.be.true;
                done();
            }
        });
        chai_1.expect(e1Subscribed).to.be.false;
    });
    it('should return passed observable if no scheduler was passed', function () {
        var source = marble_testing_1.cold('--a---b----c---|');
        var result = rxjs_1.concat(source);
        marble_testing_1.expectObservable(result).toBe('--a---b----c---|');
    });
    it('should return RxJS Observable when single lowerCaseO was passed', function () {
        var source = test_helper_1.lowerCaseO('a', 'b', 'c');
        var result = rxjs_1.concat(source);
        chai_1.expect(result).to.be.an.instanceof(rxjs_1.Observable);
        marble_testing_1.expectObservable(result).toBe('(abc|)');
    });
});
//# sourceMappingURL=concat-spec.js.map