"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('share operator', function () {
    it('should mirror a simple source Observable', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = '^              !';
        var expected = '--1-2---3-4--5-|';
        var shared = source.pipe(operators_1.share());
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share a single subscription', function () {
        var subscriptionCount = 0;
        var obs = new rxjs_1.Observable(function (observer) {
            subscriptionCount++;
        });
        var source = obs.pipe(operators_1.share());
        chai_1.expect(subscriptionCount).to.equal(0);
        source.subscribe();
        source.subscribe();
        chai_1.expect(subscriptionCount).to.equal(1);
    });
    it('should not change the output of the observable when error', function () {
        var e1 = marble_testing_1.hot('---a--^--b--c--d--e--#');
        var e1subs = '^              !';
        var expected = '---b--c--d--e--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not change the output of the observable when successful with cold observable', function () {
        var e1 = marble_testing_1.cold('---a--b--c--d--e--|');
        var e1subs = '^                 !';
        var expected = '---a--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not change the output of the observable when error with cold observable', function () {
        var e1 = marble_testing_1.cold('---a--b--c--d--e--#');
        var e1subs = '^                 !';
        var expected = '---a--b--c--d--e--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should retry just fine', function () {
        var e1 = marble_testing_1.cold('---a--b--c--d--e--#');
        var e1subs = ['^                 !                  ',
            '                  ^                 !'];
        var expected = '---a--b--c--d--e-----a--b--c--d--e--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share(), operators_1.retry(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should share the same values to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^           !';
        var shared = source.pipe(operators_1.share());
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-3----4-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    -3----4-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '        --4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share an error from the source to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-#');
        var sourceSubs = '^           !';
        var shared = source.pipe(operators_1.share());
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-3----4-#';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    -3----4-#';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '        --4-#';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share the same values to multiple observers, ' +
        'but is unsubscribed explicitly and early', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^        !   ';
        var shared = source.pipe(operators_1.share());
        var unsub = '         !   ';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-3----   ';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    -3----   ';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '        --   ';
        marble_testing_1.expectObservable(subscriber1, unsub).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2, unsub).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3, unsub).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share an empty source', function () {
        var source = marble_testing_1.cold('|');
        var sourceSubs = '(^!)';
        var shared = source.pipe(operators_1.share());
        var expected = '|';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share a never source', function () {
        var source = marble_testing_1.cold('-');
        var sourceSubs = '^';
        var shared = source.pipe(operators_1.share());
        var expected = '-';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should share a throw source', function () {
        var source = marble_testing_1.cold('#');
        var sourceSubs = '(^!)';
        var shared = source.pipe(operators_1.share());
        var expected = '#';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should connect when first subscriber subscribes', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '   ^           !';
        var shared = source.pipe(operators_1.share());
        var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '   -1-2-3----4-|';
        var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '       -3----4-|';
        var subscriber3 = marble_testing_1.hot('           c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '           --4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should disconnect when last subscriber unsubscribes', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '   ^        !   ';
        var shared = source.pipe(operators_1.share());
        var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(shared));
        var unsub1 = '          !     ';
        var expected1 = '   -1-2-3--     ';
        var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(shared));
        var unsub2 = '            !   ';
        var expected2 = '       -3----   ';
        marble_testing_1.expectObservable(subscriber1, unsub1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2, unsub2).toBe(expected2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not break unsubscription chain when last subscriber unsubscribes', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '   ^        !   ';
        var shared = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.share(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(shared));
        var unsub1 = '          !     ';
        var expected1 = '   -1-2-3--     ';
        var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(shared));
        var unsub2 = '            !   ';
        var expected2 = '       -3----   ';
        marble_testing_1.expectObservable(subscriber1, unsub1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2, unsub2).toBe(expected2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should be retryable when cold source is synchronous', function () {
        var source = marble_testing_1.cold('(123#)');
        var shared = source.pipe(operators_1.share());
        var subscribe1 = 's         ';
        var expected1 = '(123123#) ';
        var subscribe2 = ' s        ';
        var expected2 = ' (123123#)';
        var sourceSubs = ['(^!)',
            '(^!)',
            ' (^!)',
            ' (^!)'];
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.retry(1))).toBe(expected1);
        }))).toBe(subscribe1);
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.retry(1))).toBe(expected2);
        }))).toBe(subscribe2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should be repeatable when cold source is synchronous', function () {
        var source = marble_testing_1.cold('(123|)');
        var shared = source.pipe(operators_1.share());
        var subscribe1 = 's         ';
        var expected1 = '(123123|) ';
        var subscribe2 = ' s        ';
        var expected2 = ' (123123|)';
        var sourceSubs = ['(^!)',
            '(^!)',
            ' (^!)',
            ' (^!)'];
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.repeat(2))).toBe(expected1);
        }))).toBe(subscribe1);
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.repeat(2))).toBe(expected2);
        }))).toBe(subscribe2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should be retryable', function () {
        var source = marble_testing_1.cold('-1-2-3----4-#                        ');
        var sourceSubs = ['^           !                        ',
            '            ^           !            ',
            '                        ^           !'];
        var shared = source.pipe(operators_1.share());
        var subscribe1 = 's                                    ';
        var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-#';
        var subscribe2 = '    s                                ';
        var expected2 = '    -3----4--1-2-3----4--1-2-3----4-#';
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.retry(2))).toBe(expected1);
        }))).toBe(subscribe1);
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.retry(2))).toBe(expected2);
        }))).toBe(subscribe2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should be repeatable', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|                        ');
        var sourceSubs = ['^           !                        ',
            '            ^           !            ',
            '                        ^           !'];
        var shared = source.pipe(operators_1.share());
        var subscribe1 = 's                                    ';
        var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-|';
        var subscribe2 = '    s                                ';
        var expected2 = '    -3----4--1-2-3----4--1-2-3----4-|';
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.repeat(3))).toBe(expected1);
        }))).toBe(subscribe1);
        marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
            marble_testing_1.expectObservable(shared.pipe(operators_1.repeat(3))).toBe(expected2);
        }))).toBe(subscribe2);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not change the output of the observable when never', function () {
        var e1 = rxjs_1.NEVER;
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share())).toBe(expected);
    });
    it('should not change the output of the observable when empty', function () {
        var e1 = rxjs_1.EMPTY;
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.share())).toBe(expected);
    });
});
//# sourceMappingURL=share-spec.js.map