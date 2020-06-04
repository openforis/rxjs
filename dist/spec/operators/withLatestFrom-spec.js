"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var test_helper_1 = require("../helpers/test-helper");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('withLatestFrom operator', function () {
    asDiagram('withLatestFrom')('should combine events from cold observables', function () {
        var e1 = marble_testing_1.cold('-a--b-----c-d-e-|');
        var e2 = marble_testing_1.cold('--1--2-3-4---|   ');
        var expected = '----B-----C-D-E-|';
        var result = e1.pipe(operators_1.withLatestFrom(e2, function (a, b) { return String(a) + String(b); }));
        marble_testing_1.expectObservable(result).toBe(expected, { B: 'b1', C: 'c4', D: 'd4', E: 'e4' });
    });
    it('should merge the value with the latest values from the other observables into arrays', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|');
        var e1subs = '^             !';
        var e2 = marble_testing_1.hot('--e--^-f---g---h------|');
        var e2subs = '^             !';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^             !';
        var expected = '----x---y---z-|';
        var values = {
            x: ['b', 'f', 'j'],
            y: ['c', 'g', 'k'],
            z: ['d', 'h', 'l']
        };
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should merge the value with the latest values from the other observables into ' +
        'arrays and a project argument', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|');
        var e1subs = '^             !';
        var e2 = marble_testing_1.hot('--e--^-f---g---h------|');
        var e2subs = '^             !';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^             !';
        var expected = '----x---y---z-|';
        var values = {
            x: 'bfj',
            y: 'cgk',
            z: 'dhl'
        };
        var project = function (a, b, c) { return a + b + c; };
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|');
        var e1subs = '^          !   ';
        var e2 = marble_testing_1.hot('--e--^-f---g---h------|');
        var e2subs = '^          !   ';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^          !   ';
        var expected = '----x---y---   ';
        var unsub = '           !   ';
        var values = {
            x: 'bfj',
            y: 'cgk',
            z: 'dhl'
        };
        var project = function (a, b, c) { return a + b + c; };
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|');
        var e1subs = '^          !   ';
        var e2 = marble_testing_1.hot('--e--^-f---g---h------|');
        var e2subs = '^          !   ';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^          !   ';
        var expected = '----x---y---   ';
        var unsub = '           !   ';
        var values = {
            x: 'bfj',
            y: 'cgk',
            z: 'dhl'
        };
        var project = function (a, b, c) { return a + b + c; };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.withLatestFrom(e2, e3, project), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.hot('--e--^-f---g---h----|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.hot('--i--^-j---k---l----|');
        var e3subs = '(^!)';
        var expected = '|';
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^               ';
        var e2 = marble_testing_1.hot('--e--^-f---g---h----|');
        var e2subs = '^              !';
        var e3 = marble_testing_1.hot('--i--^-j---k---l----|');
        var e3subs = '^              !';
        var expected = '--------------------';
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.hot('--e--^-f---g---h----|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.hot('--i--^-j---k---l----|');
        var e3subs = '(^!)';
        var expected = '#';
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle error', function () {
        var e1 = marble_testing_1.hot('--a--^---b---#', undefined, new Error('boo-hoo'));
        var e1subs = '^       !';
        var e2 = marble_testing_1.hot('--e--^-f---g---h----|');
        var e2subs = '^       !';
        var e3 = marble_testing_1.hot('--i--^-j---k---l----|');
        var e3subs = '^       !';
        var expected = '----x---#';
        var values = {
            x: ['b', 'f', 'j']
        };
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected, values, new Error('boo-hoo'));
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle error with project argument', function () {
        var e1 = marble_testing_1.hot('--a--^---b---#', undefined, new Error('boo-hoo'));
        var e1subs = '^       !';
        var e2 = marble_testing_1.hot('--e--^-f---g---h----|');
        var e2subs = '^       !';
        var e3 = marble_testing_1.hot('--i--^-j---k---l----|');
        var e3subs = '^       !';
        var expected = '----x---#';
        var values = {
            x: 'bfj'
        };
        var project = function (a, b, c) { return a + b + c; };
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
        marble_testing_1.expectObservable(result).toBe(expected, values, new Error('boo-hoo'));
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle merging with empty', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|   ');
        var e1subs = '^             !   ';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^             !   ';
        var expected = '--------------|   ';
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle merging with never', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d-|   ');
        var e1subs = '^             !   ';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^             !   ';
        var e3 = marble_testing_1.hot('--i--^-j---k---l------|');
        var e3subs = '^             !   ';
        var expected = '--------------|   ';
        var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should handle promises', function (done) {
        rxjs_1.of(1).pipe(operators_1.delay(1), operators_1.withLatestFrom(Promise.resolve(2), Promise.resolve(3)))
            .subscribe(function (x) {
            chai_1.expect(x).to.deep.equal([1, 2, 3]);
        }, null, done);
    });
    it('should handle arrays', function () {
        rxjs_1.of(1).pipe(operators_1.delay(1), operators_1.withLatestFrom([2, 3, 4], [4, 5, 6]))
            .subscribe(function (x) {
            chai_1.expect(x).to.deep.equal([1, 4, 6]);
        });
    });
    it('should handle lowercase-o observables', function () {
        rxjs_1.of(1).pipe(operators_1.delay(1), operators_1.withLatestFrom(test_helper_1.lowerCaseO(2, 3, 4), test_helper_1.lowerCaseO(4, 5, 6)))
            .subscribe(function (x) {
            chai_1.expect(x).to.deep.equal([1, 4, 6]);
        });
    });
});
//# sourceMappingURL=withLatestFrom-spec.js.map