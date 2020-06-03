"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var chai_1 = require("chai");
describe('pairwise operator', function () {
    it('should group consecutive emissions as arrays of two', function () {
        var e1 = marble_testing_1.hot('--a--b-c----d--e---|');
        var expected = '-----u-v----w--x---|';
        var values = {
            u: ['a', 'b'],
            v: ['b', 'c'],
            w: ['c', 'd'],
            x: ['d', 'e']
        };
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected, values);
    });
    it('should pairwise things', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '------v--w--x--y--z--|';
        var values = {
            v: ['b', 'c'],
            w: ['c', 'd'],
            x: ['d', 'e'],
            y: ['e', 'f'],
            z: ['f', 'g']
        };
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not emit on single-element streams', function () {
        var e1 = marble_testing_1.hot('-----^--b----|');
        var e1subs = '^       !';
        var expected = '--------|';
        var values = {};
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle mid-stream throw', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--#');
        var e1subs = '^              !';
        var expected = '------v--w--x--#';
        var values = {
            v: ['b', 'c'],
            w: ['c', 'd'],
            x: ['d', 'e']
        };
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var source = e1.pipe(operators_1.pairwise());
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be recursively re-enterable', function () {
        var results = new Array();
        var subject = new rxjs_1.Subject();
        subject
            .pipe(operators_1.pairwise(), operators_1.take(3))
            .subscribe(function (pair) {
            results.push(pair);
            subject.next('c');
        });
        subject.next('a');
        subject.next('b');
        chai_1.expect(results).to.deep.equal([['a', 'b'], ['b', 'c'], ['c', 'c']]);
    });
});
//# sourceMappingURL=pairwise-spec.js.map