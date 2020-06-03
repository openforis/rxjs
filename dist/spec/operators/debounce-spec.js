"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
describe('debounce operator', function () {
    function getTimerSelector(x) {
        return function () { return rxjs_1.timer(x, rxTestScheduler); };
    }
    it('should debounce values by a specified cold Observable', function () {
        var e1 = marble_testing_1.hot('-a--bc--d---|');
        var e2 = marble_testing_1.cold('--|          ');
        var expected = '---a---c--d-|';
        var result = e1.pipe(operators_1.debounce(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should delay all element by selector observable', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d---------|');
        var e1subs = '^                    !';
        var expected = '----a--b--c--d-------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce by selector observable', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^             !';
        var expected = '----a---c--d--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support a scalar selector observable', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^             !';
        var expected = '--a--bc--d----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return rxjs_1.of(0); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.hot('-----|');
        var e1subs = '^    !';
        var expected = '-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source does not emit and raises error', function () {
        var e1 = marble_testing_1.hot('-----#');
        var e1subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^      !       ';
        var expected = '----a---       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.debounce(getTimerSelector(20)));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--bc--d----|');
        var e1subs = '^      !       ';
        var expected = '----a---       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.debounce(getTimerSelector(20)), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce and does not complete when source does not completes', function () {
        var e1 = marble_testing_1.hot('--a--bc--d---');
        var e1subs = '^            ';
        var expected = '----a---c--d-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes when source does not completes', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not completes when source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should delay all element until source raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d---------#');
        var e1subs = '^                    !';
        var expected = '----a--b--c--d-------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(20)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce all elements while source emits by selector observable', function () {
        var e1 = marble_testing_1.hot('---a---b---c---d---e|');
        var e1subs = '^                   !';
        var expected = '--------------------(e|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(40)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should debounce all element while source emits by selector observable until raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d-#');
        var e1subs = '^            !';
        var expected = '-------------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(50)))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should delay element by same selector observable emits multiple', function () {
        var e1 = marble_testing_1.hot('----a--b--c----d----e-------|');
        var e1subs = '^                           !';
        var expected = '------a--b--c----d----e-----|';
        var selector = marble_testing_1.cold('--x-y-');
        var selectorSubs = ['    ^ !                      ',
            '       ^ !                   ',
            '          ^ !                ',
            '               ^ !           ',
            '                    ^ !      '];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should debounce by selector observable emits multiple', function () {
        var e1 = marble_testing_1.hot('----a--b--c----d----e-------|');
        var e1subs = '^                           !';
        var expected = '------a-----c---------e-----|';
        var selector = [marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('----x-y-'),
            marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('------x-y-'),
            marble_testing_1.cold('--x-y-')];
        var selectorSubs = ['    ^ !                      ',
            '       ^  !                  ',
            '          ^ !                ',
            '               ^    !        ',
            '                    ^ !      '];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should debounce by selector observable until source completes', function () {
        var e1 = marble_testing_1.hot('----a--b--c----d----e|');
        var e1subs = '^                    !';
        var expected = '------a-----c--------(e|)';
        var selector = [marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('----x-y-'),
            marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('------x-y-'),
            marble_testing_1.cold('--x-y-')];
        var selectorSubs = ['    ^ !               ',
            '       ^  !           ',
            '          ^ !         ',
            '               ^    ! ',
            '                    ^!'];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should raise error when selector observable raises error', function () {
        var e1 = marble_testing_1.hot('--------a--------b--------c---------|');
        var e1subs = '^                            !';
        var expected = '---------a---------b---------#';
        var selector = [marble_testing_1.cold('-x-y-'),
            marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('---#')];
        var selectorSubs = ['        ^!                    ',
            '                 ^ !          ',
            '                          ^  !'];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should raise error when source raises error with selector observable', function () {
        var e1 = marble_testing_1.hot('--------a--------b--------c---------d#');
        var e1subs = '^                                    !';
        var expected = '---------a---------b---------c-------#';
        var selector = [marble_testing_1.cold('-x-y-'),
            marble_testing_1.cold('--x-y-'),
            marble_testing_1.cold('---x-y-'),
            marble_testing_1.cold('----x-y-')];
        var selectorSubs = ['        ^!                            ',
            '                 ^ !                  ',
            '                          ^  !        ',
            '                                    ^!'];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should raise error when selector function throws', function () {
        var e1 = marble_testing_1.hot('--------a--------b--------c---------|');
        var e1subs = '^                         !';
        var expected = '---------a---------b------#';
        var selector = [marble_testing_1.cold('-x-y-'),
            marble_testing_1.cold('--x-y-')];
        var selectorSubs = ['        ^!                            ',
            '                 ^ !                  '];
        function selectorFunction(x) {
            if (x !== 'c') {
                return selector.shift();
            }
            else {
                throw 'error';
            }
        }
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should mirror the source when given an empty selector Observable', function () {
        var e1 = marble_testing_1.hot('--------a-x-yz---bxy---z--c--x--y--z|');
        var e1subs = '^                                   !';
        var expected = '--------a-x-yz---bxy---z--c--x--y--z|';
        function selectorFunction(x) { return rxjs_1.EMPTY; }
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should ignore all values except last, when given a never selector Observable', function () {
        var e1 = marble_testing_1.hot('--------a-x-yz---bxy---z--c--x--y--z|');
        var e1subs = '^                                   !';
        var expected = '------------------------------------(z|)';
        function selectorFunction() { return rxjs_1.NEVER; }
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should delay element by selector observable completes when it does not emits', function () {
        var e1 = marble_testing_1.hot('--------a--------b--------c---------|');
        var e1subs = '^                                   !';
        var expected = '---------a---------b---------c------|';
        var selector = [marble_testing_1.cold('-|'),
            marble_testing_1.cold('--|'),
            marble_testing_1.cold('---|')];
        var selectorSubs = ['        ^!                           ',
            '                 ^ !                 ',
            '                          ^  !       '];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should debounce by selector observable completes when it does not emits', function () {
        var e1 = marble_testing_1.hot('----a--b-c---------de-------------|');
        var e1subs = '^                                 !';
        var expected = '-----a------c------------e--------|';
        var selector = [marble_testing_1.cold('-|'),
            marble_testing_1.cold('--|'),
            marble_testing_1.cold('---|'),
            marble_testing_1.cold('----|'),
            marble_testing_1.cold('-----|')];
        var selectorSubs = ['    ^!                             ',
            '       ^ !                         ',
            '         ^  !                      ',
            '                   ^!              ',
            '                    ^    !         '];
        marble_testing_1.expectObservable(e1.pipe(operators_1.debounce(function () { return selector.shift(); }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var i = 0; i < selectorSubs.length; i++) {
            marble_testing_1.expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
        }
    });
    it('should delay by promise resolves', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(100).pipe(operators_1.mapTo(4)));
        var expected = [1, 2, 3, 4];
        e1.pipe(operators_1.debounce(function () {
            return new Promise(function (resolve) { resolve(42); });
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should raises error when promise rejects', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(100).pipe(operators_1.mapTo(4)));
        var expected = [1, 2];
        var error = new Error('error');
        e1.pipe(operators_1.debounce(function (x) {
            if (x === 3) {
                return new Promise(function (resolve, reject) { reject(error); });
            }
            else {
                return new Promise(function (resolve) { resolve(42); });
            }
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (err) {
            chai_1.expect(err).to.be.an('error', 'error');
            chai_1.expect(expected.length).to.equal(0);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should debounce correctly when synchronously reentered', function () {
        var results = [];
        var source = new rxjs_1.Subject();
        source.pipe(operators_1.debounce(function () { return rxjs_1.of(null); })).subscribe(function (value) {
            results.push(value);
            if (value === 1) {
                source.next(2);
            }
        });
        source.next(1);
        chai_1.expect(results).to.deep.equal([1, 2]);
    });
    type('should support selectors of the same type', function () {
        var o;
        var s;
        var r = o.pipe(operators_1.debounce(function (n) { return s; }));
    });
    type('should support selectors of a different type', function () {
        var o;
        var s;
        var r = o.pipe(operators_1.debounce(function (n) { return s; }));
    });
});
//# sourceMappingURL=debounce-spec.js.map