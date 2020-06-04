"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('zip legacy', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should zip the provided observables', function (done) {
        var expected = ['a1', 'b2', 'c3'];
        var i = 0;
        rxjs_1.from(['a', 'b', 'c'])
            .pipe(operators_1.zip(rxjs_1.from([1, 2, 3]), function (a, b) { return a + b; }))
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        }, null, done);
    });
    it('should work with selector throws', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-2---4----|  ');
            var asubs = '     ^-------!     ';
            var b = hot('---1-^--3----5----|');
            var bsubs = '     ^-------!     ';
            var expected = '  ---x----#     ';
            var selector = function (x, y) {
                if (y === '5') {
                    throw new Error('too bad');
                }
                else {
                    return x + y;
                }
            };
            var observable = a.pipe(operators_1.zip(b, selector));
            expectObservable(observable).toBe(expected, { x: '23' }, new Error('too bad'));
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with some data asymmetric 1', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
            var asubs = '     ^-----------------!    ';
            var b = hot('---1-^--2--4--6--8--0--|    ');
            var bsubs = '     ^-----------------!    ';
            var expected = '  ---a--b--c--d--e--|    ';
            expectObservable(a.pipe(operators_1.zip(b, function (r1, r2) {
                return r1 + r2;
            }))).toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with some data asymmetric 2', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^--2--4--6--8--0--|    ');
            var asubs = '     ^-----------------!    ';
            var b = hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
            var bsubs = '     ^-----------------!    ';
            var expected = '  ---a--b--c--d--e--|    ';
            expectObservable(a.pipe(operators_1.zip(b, function (r1, r2) {
                return r1 + r2;
            }))).toBe(expected, { a: '21', b: '43', c: '65', d: '87', e: '09' });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with some data symmetric', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1-3-5-7-9------| ');
            var asubs = '     ^----------------! ';
            var b = hot('---1-^--2--4--6--8--0--|');
            var bsubs = '     ^----------------! ';
            var expected = '  ---a--b--c--d--e-| ';
            expectObservable(a.pipe(operators_1.zip(b, function (r1, r2) {
                return r1 + r2;
            }))).toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with n-ary symmetric selector', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1----4----|');
            var asubs = '     ^---------!  ';
            var b = hot('---1-^--2--5----| ');
            var bsubs = '     ^---------!  ';
            var c = hot('---1-^---3---6-|  ');
            var expected = '  ----x---y-|  ';
            var observable = a.pipe(operators_1.zip(b, c, function (r0, r1, r2) {
                return [r0, r1, r2];
            }));
            expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with n-ary symmetric array selector', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1----4----|');
            var asubs = '     ^---------!  ';
            var b = hot('---1-^--2--5----| ');
            var bsubs = '     ^---------!  ';
            var c = hot('---1-^---3---6-|  ');
            var expected = '  ----x---y-|  ';
            var observable = a.pipe(operators_1.zip(b, c, function (r0, r1, r2) {
                return [r0, r1, r2];
            }));
            expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should combine two observables and selector', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1---2---3---');
            var asubs = '   ^';
            var b = hot('   --4--5--6--7--8--');
            var bsubs = '   ^';
            var expected = '---x---y---z';
            expectObservable(a.pipe(operators_1.zip(b, function (e1, e2) {
                return e1 + e2;
            }))).toBe(expected, { x: '14', y: '25', z: '36' });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
});
//# sourceMappingURL=zip-legacy-spec.js.map