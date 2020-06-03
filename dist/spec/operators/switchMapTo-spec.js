"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('switchMapTo', function () {
    it('should map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--1-----3--5-------|');
        var e1subs = '^                  !';
        var e2 = marble_testing_1.cold('x-x-x|              ', { x: 10 });
        var expected = '--x-x-x-x-xx-x-x---|';
        var values = { x: 10 };
        var result = e1.pipe(operators_1.switchMapTo(e2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support the deprecated resultSelector', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.switchMapTo(rxjs_1.of(4, 5, 6), function (a, b, i, ii) { return [a, b, i, ii]; }))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    [1, 4, 0, 0],
                    [1, 5, 0, 1],
                    [1, 6, 0, 2],
                    [2, 4, 1, 0],
                    [2, 5, 1, 1],
                    [2, 6, 1, 2],
                    [3, 4, 2, 0],
                    [3, 5, 2, 1],
                    [3, 6, 2, 2],
                ]);
            }
        });
    });
    it('should support a void resultSelector (still deprecated)', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.switchMapTo(rxjs_1.of(4, 5, 6), void 0))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    4, 5, 6, 4, 5, 6, 4, 5, 6
                ]);
            }
        });
    });
    it('should switch a synchronous many outer to a synchronous many inner', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var expected = ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c'];
        a.pipe(operators_1.switchMapTo(rxjs_1.of('a', 'b', 'c'))).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, done);
    });
    it('should unsub inner observables', function () {
        var unsubbed = 0;
        rxjs_1.of('a', 'b').pipe(operators_1.switchMapTo(new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
                unsubbed++;
            };
        }))).subscribe();
        chai_1.expect(unsubbed).to.equal(2);
    });
    it('should switch to an inner cold observable', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|          ');
        var xsubs = ['         ^         !                 ',
            '                   ^                !'];
        var e1 = marble_testing_1.hot('---------x---------x---------|       ');
        var e1subs = '^                            !       ';
        var expected = '-----------a--b--c---a--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner cold observable, outer eventually throws', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|');
        var xsubs = '         ^         !       ';
        var e1 = marble_testing_1.hot('---------x---------#       ');
        var e1subs = '^                  !       ';
        var expected = '-----------a--b--c-#       ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner cold observable, outer is unsubscribed early', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|   ');
        var xsubs = ['         ^         !          ',
            '                   ^  !       '];
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var unsub = '                      !       ';
        var e1subs = '^                     !       ';
        var expected = '-----------a--b--c---a-       ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|   ');
        var xsubs = ['         ^         !          ',
            '                   ^  !       '];
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^                     !       ';
        var expected = '-----------a--b--c---a-       ';
        var unsub = '                      !       ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.switchMapTo(x), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner cold observable, inner never completes', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e-          ');
        var xsubs = ['         ^         !               ',
            '                   ^               '];
        var e1 = marble_testing_1.hot('---------x---------y---------|     ');
        var e1subs = '^                            !     ';
        var expected = '-----------a--b--c---a--b--c--d--e-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a synchronous switch to the inner observable', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|   ');
        var xsubs = ['         (^!)                 ',
            '         ^                !   '];
        var e1 = marble_testing_1.hot('---------(xx)----------------|');
        var e1subs = '^                            !';
        var expected = '-----------a--b--c--d--e-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner cold observable, inner raises an error', function () {
        var x = marble_testing_1.cold('--a--b--#            ');
        var xsubs = '         ^       !            ';
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^                !            ';
        var expected = '-----------a--b--#            ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch an inner hot observable', function () {
        var x = marble_testing_1.hot('--p-o-o-p---a--b--c--d-|      ');
        var xsubs = ['         ^         !          ',
            '                   ^   !      '];
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^                            !';
        var expected = '------------a--b--c--d-------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner empty', function () {
        var x = marble_testing_1.cold('|');
        var xsubs = ['         (^!)                 ',
            '                   (^!)       '];
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^                            !';
        var expected = '-----------------------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner never', function () {
        var x = marble_testing_1.cold('-');
        var xsubs = ['         ^         !          ',
            '                   ^          '];
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^                            !';
        var expected = '------------------------------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch to an inner that just raises an error', function () {
        var x = marble_testing_1.cold('#');
        var xsubs = '         (^!)                 ';
        var e1 = marble_testing_1.hot('---------x---------x---------|');
        var e1subs = '^        !                    ';
        var expected = '---------#                    ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an empty outer', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never outer', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an outer that just raises and error', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=switchMapTo-spec.js.map