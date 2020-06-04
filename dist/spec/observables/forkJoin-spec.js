"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var test_helper_1 = require("../helpers/test-helper");
var marble_testing_1 = require("../helpers/marble-testing");
describe('forkJoin', function () {
    asDiagram('forkJoin')('should join the last values of the provided observables into an array', function () {
        var e1 = rxjs_1.forkJoin([
            marble_testing_1.hot('-a--b-----c-d-e-|'),
            marble_testing_1.hot('--------f--g-h-i--j-|'),
            marble_testing_1.cold('--1--2-3-4---|'),
        ]);
        var expected = '--------------------(x|)';
        marble_testing_1.expectObservable(e1).toBe(expected, { x: ['e', 'j', '4'] });
    });
    it('should support the deprecated resultSelector with an Array of ObservableInputs', function () {
        var results = [];
        rxjs_1.forkJoin([
            rxjs_1.of(1, 2, 3),
            rxjs_1.of(4, 5, 6),
            rxjs_1.of(7, 8, 9),
        ], function (a, b, c) { return a + b + c; })
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                results.push('done');
            }
        });
        chai_1.expect(results).to.deep.equal([18, 'done']);
    });
    it('should support the deprecated resultSelector with a spread of ObservableInputs', function () {
        var results = [];
        rxjs_1.forkJoin(rxjs_1.of(1, 2, 3), rxjs_1.of(4, 5, 6), rxjs_1.of(7, 8, 9), function (a, b, c) { return a + b + c; })
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                results.push('done');
            }
        });
        chai_1.expect(results).to.deep.equal([18, 'done']);
    });
    it('should accept single observable', function () {
        var e1 = rxjs_1.forkJoin(marble_testing_1.hot('--a--b--c--d--|'));
        var expected = '--------------(x|)';
        marble_testing_1.expectObservable(e1).toBe(expected, { x: ['d'] });
    });
    describe('forkJoin([input1, input2, input3])', function () {
        it('should join the last values of the provided observables into an array', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                marble_testing_1.hot('--1--2--3--|')
            ]);
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
        });
        it('should allow emit null or undefined', function () {
            var e2 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|', { d: null }),
                marble_testing_1.hot('(b|)'),
                marble_testing_1.hot('--1--2--3--|'),
                marble_testing_1.hot('-----r--t--u--|', { u: undefined })
            ]);
            var expected2 = '--------------(x|)';
            marble_testing_1.expectObservable(e2).toBe(expected2, { x: [null, 'b', '3', undefined] });
        });
        it('should accept array of observable contains single', function () {
            var e1 = rxjs_1.forkJoin([marble_testing_1.hot('--a--b--c--d--|')]);
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: ['d'] });
        });
        it('should accept lowercase-o observables', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                test_helper_1.lowerCaseO('1', '2', '3')
            ]);
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
        });
        it('should accept empty lowercase-o observables', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                test_helper_1.lowerCaseO()
            ]);
            var expected = '|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should accept promise', function (done) {
            var e1 = rxjs_1.forkJoin([
                rxjs_1.of(1),
                Promise.resolve(2)
            ]);
            e1.subscribe({
                next: function (x) { return chai_1.expect(x).to.deep.equal([1, 2]); },
                complete: done,
            });
        });
        it('should accept array of observables', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                marble_testing_1.hot('--1--2--3--|')
            ]);
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
        });
        it('should not emit if any of source observable is empty', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                marble_testing_1.hot('------------------|')
            ]);
            var expected = '------------------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete early if any of source is empty and completes before than others', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--a--b--c--d--|'),
                marble_testing_1.hot('(b|)'),
                marble_testing_1.hot('---------|')
            ]);
            var expected = '---------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete when all sources are empty', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--------------|'),
                marble_testing_1.hot('---------|')
            ]);
            var expected = '---------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should not complete when only source never completes', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--------------')
            ]);
            var expected = '-';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should not complete when one of the sources never completes', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--------------'),
                marble_testing_1.hot('-a---b--c--|')
            ]);
            var expected = '-';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete when one of the sources never completes but other completes without values', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('--------------'),
                marble_testing_1.hot('------|')
            ]);
            var expected = '------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete if source is not provided', function () {
            var e1 = rxjs_1.forkJoin();
            var expected = '|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete if sources list is empty', function () {
            var e1 = rxjs_1.forkJoin([]);
            var expected = '|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when any of source raises error with empty observable', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('------#'),
                marble_testing_1.hot('---------|')
            ]);
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when any of source raises error with source that never completes', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('------#'),
                marble_testing_1.hot('----------')
            ]);
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when source raises error', function () {
            var e1 = rxjs_1.forkJoin([
                marble_testing_1.hot('------#'),
                marble_testing_1.hot('---a-----|')
            ]);
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should allow unsubscribing early and explicitly', function () {
            var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
            var e1subs = '^        !    ';
            var e2 = marble_testing_1.hot('---e-^---f--g---h-|');
            var e2subs = '^        !    ';
            var expected = '----------    ';
            var unsub = '         !    ';
            var result = rxjs_1.forkJoin([e1, e2]);
            marble_testing_1.expectObservable(result, unsub).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
        it('should unsubscribe other Observables, when one of them errors', function () {
            var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
            var e1subs = '^        !    ';
            var e2 = marble_testing_1.hot('---e-^---f--g-#');
            var e2subs = '^        !    ';
            var expected = '---------#    ';
            var result = rxjs_1.forkJoin([e1, e2]);
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    describe('forkJoin({ foo, bar, baz })', function () {
        it('should join the last values of the provided observables into an array', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: marble_testing_1.hot('--1--2--3--|')
            });
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: { foo: 'd', bar: 'b', baz: '3' } });
        });
        it('should allow emit null or undefined', function () {
            var e2 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|', { d: null }),
                bar: marble_testing_1.hot('(b|)'),
                baz: marble_testing_1.hot('--1--2--3--|'),
                qux: marble_testing_1.hot('-----r--t--u--|', { u: undefined })
            });
            var expected2 = '--------------(x|)';
            marble_testing_1.expectObservable(e2).toBe(expected2, { x: { foo: null, bar: 'b', baz: '3', qux: undefined } });
        });
        it('should accept array of observable contains single', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|')
            });
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: { foo: 'd' } });
        });
        it('should accept lowercase-o observables', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: test_helper_1.lowerCaseO('1', '2', '3')
            });
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: { foo: 'd', bar: 'b', baz: '3' } });
        });
        it('should accept empty lowercase-o observables', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: test_helper_1.lowerCaseO()
            });
            var expected = '|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should accept promise', function (done) {
            var e1 = rxjs_1.forkJoin({
                foo: rxjs_1.of(1),
                bar: Promise.resolve(2)
            });
            e1.subscribe({
                next: function (x) { return chai_1.expect(x).to.deep.equal({ foo: 1, bar: 2 }); },
                complete: done,
            });
        });
        it('should accept array of observables', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: marble_testing_1.hot('--1--2--3--|')
            });
            var expected = '--------------(x|)';
            marble_testing_1.expectObservable(e1).toBe(expected, { x: { foo: 'd', bar: 'b', baz: '3' } });
        });
        it('should not emit if any of source observable is empty', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: marble_testing_1.hot('------------------|')
            });
            var expected = '------------------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete early if any of source is empty and completes before than others', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--a--b--c--d--|'),
                bar: marble_testing_1.hot('(b|)'),
                baz: marble_testing_1.hot('---------|')
            });
            var expected = '---------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete when all sources are empty', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--------------|'),
                bar: marble_testing_1.hot('---------|')
            });
            var expected = '---------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should not complete when only source never completes', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--------------')
            });
            var expected = '-';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should not complete when one of the sources never completes', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--------------'),
                bar: marble_testing_1.hot('-a---b--c--|')
            });
            var expected = '-';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should complete when one of the sources never completes but other completes without values', function () {
            var e1 = rxjs_1.forkJoin({
                foo: marble_testing_1.hot('--------------'),
                bar: marble_testing_1.hot('------|')
            });
            var expected = '------|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should have same v5/v6 throwing behavior full argument of null', function (done) {
            chai_1.expect(function () { return rxjs_1.forkJoin(null); }).not.to.throw();
            chai_1.expect(function () { return rxjs_1.forkJoin(null).subscribe({
                error: function (err) { return done(); },
            }); }).not.to.throw();
        });
        it('should complete if sources object is empty', function () {
            var e1 = rxjs_1.forkJoin({});
            var expected = '|';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when any of source raises error with empty observable', function () {
            var e1 = rxjs_1.forkJoin({
                lol: marble_testing_1.hot('------#'),
                wut: marble_testing_1.hot('---------|')
            });
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when any of source raises error with source that never completes', function () {
            var e1 = rxjs_1.forkJoin({
                lol: marble_testing_1.hot('------#'),
                wut: marble_testing_1.hot('----------')
            });
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should raise error when source raises error', function () {
            var e1 = rxjs_1.forkJoin({
                lol: marble_testing_1.hot('------#'),
                foo: marble_testing_1.hot('---a-----|')
            });
            var expected = '------#';
            marble_testing_1.expectObservable(e1).toBe(expected);
        });
        it('should allow unsubscribing early and explicitly', function () {
            var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
            var e1subs = '^        !    ';
            var e2 = marble_testing_1.hot('---e-^---f--g---h-|');
            var e2subs = '^        !    ';
            var expected = '----------    ';
            var unsub = '         !    ';
            var result = rxjs_1.forkJoin({
                e1: e1, e2: e2
            });
            marble_testing_1.expectObservable(result, unsub).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
        it('should unsubscribe other Observables, when one of them errors', function () {
            var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
            var e1subs = '^        !    ';
            var e2 = marble_testing_1.hot('---e-^---f--g-#');
            var e2subs = '^        !    ';
            var expected = '---------#    ';
            var result = rxjs_1.forkJoin({
                e1: e1, e2: e2
            });
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
        it('should accept promise as the first arg', function (done) {
            var e1 = rxjs_1.forkJoin(Promise.resolve(1));
            var values = [];
            e1.subscribe({
                next: function (x) { return values.push(x); },
                complete: function () {
                    chai_1.expect(values).to.deep.equal([[1]]);
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=forkJoin-spec.js.map