"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var addDrama = function (x) { return x + '!'; };
var identity = function (x) { return x; };
describe('map operator', function () {
    asDiagram('map(x => 10 * x)')('should map multiple values', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var asubs = '^          !';
        var expected = '--x--y--z--|';
        var r = a.pipe(operators_1.map(function (x) { return 10 * (+x); }));
        marble_testing_1.expectObservable(r).toBe(expected, { x: 10, y: 20, z: 30 });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map one value', function () {
        var a = marble_testing_1.cold('--x--|', { x: 42 });
        var asubs = '^    !';
        var expected = '--y--|';
        var r = a.pipe(operators_1.map(addDrama));
        marble_testing_1.expectObservable(r).toBe(expected, { y: '42!' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should throw an error if not passed a function', function () {
        chai_1.expect(function () {
            rxjs_1.of(1, 2, 3).pipe(operators_1.map('potato'));
        }).to.throw(TypeError, 'argument is not a function. Are you looking for `mapTo()`?');
    });
    it('should map multiple values', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var asubs = '^          !';
        var expected = '--x--y--z--|';
        var r = a.pipe(operators_1.map(addDrama));
        marble_testing_1.expectObservable(r).toBe(expected, { x: '1!', y: '2!', z: '3!' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from map function', function () {
        var a = marble_testing_1.cold('--x--|', { x: 42 });
        var asubs = '^ !   ';
        var expected = '--#   ';
        var r = a.pipe(operators_1.map(function (x) {
            throw 'too bad';
        }));
        marble_testing_1.expectObservable(r).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from observable that emits only errors', function () {
        var a = marble_testing_1.cold('#');
        var asubs = '(^!)';
        var expected = '#';
        var r = a.pipe(operators_1.map(identity));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should propagate errors from observable that emit values', function () {
        var a = marble_testing_1.cold('--a--b--#', { a: 1, b: 2 }, 'too bad');
        var asubs = '^       !';
        var expected = '--x--y--#';
        var r = a.pipe(operators_1.map(addDrama));
        marble_testing_1.expectObservable(r).toBe(expected, { x: '1!', y: '2!' }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not map an empty observable', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var expected = '|';
        var invoked = 0;
        var r = a.pipe(operators_1.map(function (x) { invoked++; return x; }), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(0);
        }));
        marble_testing_1.expectObservable(r).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--x--y-     ';
        var r = a.pipe(operators_1.map(addDrama));
        marble_testing_1.expectObservable(r, unsub).toBe(expected, { x: '1!', y: '2!' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map with index', function () {
        var a = marble_testing_1.hot('-5-^-4--3---2----1--|');
        var asubs = '^                !';
        var expected = '--a--b---c----d--|';
        var values = { a: 5, b: 14, c: 23, d: 32 };
        var invoked = 0;
        var r = a.pipe(operators_1.map(function (x, index) {
            invoked++;
            return (parseInt(x) + 1) + (index * 10);
        }), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(4);
        }));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map with index until completed', function () {
        var a = marble_testing_1.hot('-5-^-4--3---2----1--|');
        var asubs = '^                !';
        var expected = '--a--b---c----d--|';
        var values = { a: 5, b: 14, c: 23, d: 32 };
        var invoked = 0;
        var r = a.pipe(operators_1.map(function (x, index) {
            invoked++;
            return (parseInt(x) + 1) + (index * 10);
        }), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(4);
        }));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map with index until an error occurs', function () {
        var a = marble_testing_1.hot('-5-^-4--3---2----1--#', undefined, 'too bad');
        var asubs = '^                !';
        var expected = '--a--b---c----d--#';
        var values = { a: 5, b: 14, c: 23, d: 32 };
        var invoked = 0;
        var r = a.pipe(operators_1.map(function (x, index) {
            invoked++;
            return (parseInt(x) + 1) + (index * 10);
        }), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(4);
        }));
        marble_testing_1.expectObservable(r).toBe(expected, values, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map using a custom thisArg', function () {
        var a = marble_testing_1.hot('-5-^-4--3---2----1--|');
        var asubs = '^                !';
        var expected = '--a--b---c----d--|';
        var values = { a: 5, b: 14, c: 23, d: 32 };
        var foo = {
            value: 42
        };
        var r = a
            .pipe(operators_1.map(function (x, index) {
            chai_1.expect(this).to.equal(foo);
            return (parseInt(x) + 1) + (index * 10);
        }, foo));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should map twice', function () {
        var a = marble_testing_1.hot('-0----1-^-2---3--4-5--6--7-8-|');
        var asubs = '^                    !';
        var expected = '--a---b--c-d--e--f-g-|';
        var values = { a: 2, b: 3, c: 4, d: 5, e: 6, f: 7, g: 8 };
        var invoked1 = 0;
        var invoked2 = 0;
        var r = a.pipe(operators_1.map(function (x) { invoked1++; return parseInt(x) * 2; }), operators_1.map(function (x) { invoked2++; return x / 2; }), operators_1.tap(null, null, function () {
            chai_1.expect(invoked1).to.equal(7);
            chai_1.expect(invoked2).to.equal(7);
        }));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should do multiple maps using a custom thisArg', function () {
        var a = marble_testing_1.hot('--1--2--3--4--|');
        var asubs = '^             !';
        var expected = '--a--b--c--d--|';
        var values = { a: 11, b: 14, c: 17, d: 20 };
        var Filterer = (function () {
            function Filterer() {
                this.selector1 = function (x) { return parseInt(x) + 2; };
                this.selector2 = function (x) { return parseInt(x) * 3; };
            }
            return Filterer;
        }());
        var filterer = new Filterer();
        var r = a.pipe(operators_1.map(function (x) { return this.selector1(x); }, filterer), operators_1.map(function (x) { return this.selector2(x); }, filterer), operators_1.map(function (x) { return this.selector1(x); }, filterer));
        marble_testing_1.expectObservable(r).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var a = marble_testing_1.cold('--1--2--3--|');
        var unsub = '      !     ';
        var asubs = '^     !     ';
        var expected = '--x--y-     ';
        var r = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.map(addDrama), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(r, unsub).toBe(expected, { x: '1!', y: '2!' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
    });
});
//# sourceMappingURL=map-spec.js.map