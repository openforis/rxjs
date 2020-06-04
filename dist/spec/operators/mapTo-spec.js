"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('mapTo operator', function () {
    asDiagram('mapTo(\'a\')')('should map multiple values', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var asubs = '^          !';
        var expected = '--a--a--a--|';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo('a'))).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map one value', function () {
        var a = marble_testing_1.cold('--7--|');
        var asubs = '^    !';
        var expected = '--y--|';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo('y'))).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--x--x-     ';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo('x')), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from observable that emits only errors', function () {
        var a = marble_testing_1.cold('--#', undefined, 'too bad');
        var asubs = '^ !';
        var expected = '--#';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo(1))).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from observable that emit values', function () {
        var a = marble_testing_1.cold('--1--2--#', undefined, 'too bad');
        var asubs = '^       !';
        var expected = '--x--x--#';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo('x'))).toBe(expected, undefined, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not map an empty observable', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(a.pipe(operators_1.mapTo(-1))).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map twice', function () {
        var a = marble_testing_1.hot('-0----1-^-2---3--4-5--6--7-8-|');
        var asubs = '^                    !';
        var expected = '--h---h--h-h--h--h-h-|';
        var r = a.pipe(operators_1.mapTo(-1), operators_1.mapTo('h'));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--x--x-     ';
        var r = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.mapTo('x'), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(r, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
});
//# sourceMappingURL=mapTo-spec.js.map