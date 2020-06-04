"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('pluck operator', function () {
    asDiagram('pluck(\'v\')')('should dematerialize an Observable', function () {
        var values = {
            a: '{v:1}',
            b: '{v:2}',
            c: '{v:3}'
        };
        var e1 = marble_testing_1.cold('--a--b--c--|', values);
        var expected = '--x--y--z--|';
        var result = e1.pipe(operators_1.map(function (x) { return ({ v: x.charAt(3) }); }), operators_1.pluck('v'));
        marble_testing_1.expectObservable(result).toBe(expected, { x: '1', y: '2', z: '3' });
    });
    it('should work for one array', function () {
        var a = marble_testing_1.cold('--x--|', { x: ['abc'] });
        var asubs = '^    !';
        var expected = '--y--|';
        var r = a.pipe(operators_1.pluck(0));
        marble_testing_1.expectObservable(r).toBe(expected, { y: 'abc' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should work for one object', function () {
        var a = marble_testing_1.cold('--x--|', { x: { prop: 42 } });
        var asubs = '^    !';
        var expected = '--y--|';
        var r = a.pipe(operators_1.pluck('prop'));
        marble_testing_1.expectObservable(r).toBe(expected, { y: 42 });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should work for multiple objects', function () {
        var inputs = {
            a: { prop: '1' },
            b: { prop: '2' },
            c: { prop: '3' },
            d: { prop: '4' },
            e: { prop: '5' },
        };
        var a = marble_testing_1.cold('--a-b--c-d---e-|', inputs);
        var asubs = '^              !';
        var expected = '--1-2--3-4---5-|';
        var r = a.pipe(operators_1.pluck('prop'));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should work with deep nested properties', function () {
        var inputs = {
            a: { a: { b: { c: '1' } } },
            b: { a: { b: { c: '2' } } },
            c: { a: { b: { c: '3' } } },
            d: { a: { b: { c: '4' } } },
            e: { a: { b: { c: '5' } } },
        };
        var a = marble_testing_1.cold('--a-b--c-d---e-|', inputs);
        var asubs = '^              !';
        var expected = '--1-2--3-4---5-|';
        var r = a.pipe(operators_1.pluck('a', 'b', 'c'));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should work with edge cases of deep nested properties', function () {
        var inputs = {
            a: { a: { b: { c: 1 } } },
            b: { a: { b: 2 } },
            c: { a: { c: { c: 3 } } },
            d: {},
            e: { a: { b: { c: 5 } } },
        };
        var a = marble_testing_1.cold('--a-b--c-d---e-|', inputs);
        var asubs = '^              !';
        var expected = '--r-x--y-z---w-|';
        var values = { r: 1, x: undefined, y: undefined, z: undefined, w: 5 };
        var r = a.pipe(operators_1.pluck('a', 'b', 'c'));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should throw an error if not property is passed', function () {
        chai_1.expect(function () {
            rxjs_1.of({ prop: 1 }, { prop: 2 }).pipe(operators_1.pluck());
        }).to.throw(Error, 'list of properties cannot be empty.');
    });
    it('should propagate errors from observable that emits only errors', function () {
        var a = marble_testing_1.cold('#');
        var asubs = '(^!)';
        var expected = '#';
        var r = a.pipe(operators_1.pluck('whatever'));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from observable that emit values', function () {
        var a = marble_testing_1.cold('--a--b--#', { a: { prop: '1' }, b: { prop: '2' } }, 'too bad');
        var asubs = '^       !';
        var expected = '--1--2--#';
        var r = a.pipe(operators_1.pluck('prop'));
        marble_testing_1.expectObservable(r).toBe(expected, undefined, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not pluck an empty observable', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var expected = '|';
        var invoked = 0;
        var r = a.pipe(operators_1.pluck('whatever'), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(0);
        }));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var a = marble_testing_1.cold('--a--b--c--|', { a: { prop: '1' }, b: { prop: '2' } });
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--1--2-     ';
        var r = a.pipe(operators_1.pluck('prop'));
        marble_testing_1.expectObservable(r, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should pluck twice', function () {
        var inputs = {
            a: { a: { b: { c: '1' } } },
            b: { a: { b: { c: '2' } } },
            c: { a: { b: { c: '3' } } },
            d: { a: { b: { c: '4' } } },
            e: { a: { b: { c: '5' } } },
        };
        var a = marble_testing_1.cold('--a-b--c-d---e-|', inputs);
        var asubs = '^              !';
        var expected = '--1-2--3-4---5-|';
        var r = a.pipe(operators_1.pluck('a', 'b'), operators_1.pluck('c'));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var a = marble_testing_1.cold('--a--b--c--|', { a: { prop: '1' }, b: { prop: '2' } });
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--1--2-     ';
        var r = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.pluck('prop'), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(r, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should support symbols', function () {
        var _a;
        var sym = Symbol('sym');
        var a = marble_testing_1.cold('--x--|', { x: (_a = {}, _a[sym] = 'abc', _a) });
        var asubs = '^    !';
        var expected = '--y--|';
        var r = a.pipe(operators_1.pluck(sym));
        marble_testing_1.expectObservable(r).toBe(expected, { y: 'abc' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
});
//# sourceMappingURL=pluck-spec.js.map