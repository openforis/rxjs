"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('skipWhile operator', function () {
    asDiagram('skipWhile(x => x < 4)')('should skip all elements until predicate is false', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^               !';
        var expected = '-------4--5--6--|';
        var predicate = function (v) {
            return +v < 4;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should skip all elements with a true predicate', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^               !';
        var expected = '----------------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should skip all elements with a truthy predicate', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^               !';
        var expected = '----------------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return {}; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not skip any element with a false predicate', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^               !';
        var expected = '-2--3--4--5--6--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return false; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not skip any elements with a falsy predicate', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^               !';
        var expected = '-2--3--4--5--6--|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return undefined; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should skip elements on hot source', function () {
        var source = marble_testing_1.hot('--1--2-^-3--4--5--6--7--8--');
        var sourceSubs = '^                   ';
        var expected = '--------5--6--7--8--';
        var predicate = function (v) {
            return +v < 5;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should be possible to skip using the element\'s index', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--|');
        var sourceSubs = '^                   !';
        var expected = '--------e--f--g--h--|';
        var predicate = function (v, index) {
            return index < 2;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should skip using index with source unsubscribes early', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--|');
        var sourceSubs = '^          !';
        var unsub = '-----------!';
        var expected = '-----d--e---';
        var predicate = function (v, index) {
            return index < 1;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--|');
        var sourceSubs = '^          !';
        var expected = '-----d--e---';
        var unsub = '           !';
        var predicate = function (v, index) {
            return index < 1;
        };
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.skipWhile(predicate), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should skip using value with source throws', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--#');
        var sourceSubs = '^                   !';
        var expected = '-----d--e--f--g--h--#';
        var predicate = function (v) {
            return v !== 'd';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should invoke predicate while its false and never again', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--|');
        var sourceSubs = '^                   !';
        var expected = '--------e--f--g--h--|';
        var invoked = 0;
        var predicate = function (v) {
            invoked++;
            return v !== 'e';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(3);
        }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should handle predicate that throws', function () {
        var source = marble_testing_1.hot('--a--b-^-c--d--e--f--g--h--|');
        var sourceSubs = '^       !';
        var expected = '--------#';
        var predicate = function (v) {
            if (v === 'e') {
                throw new Error('nom d\'une pipe !');
            }
            return v !== 'f';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(predicate))).toBe(expected, undefined, new Error('nom d\'une pipe !'));
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should handle Observable.empty', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle Observable.never', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle Observable.throw', function () {
        var source = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.skipWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=skipWhile-spec.js.map