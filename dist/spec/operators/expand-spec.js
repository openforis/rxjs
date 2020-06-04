"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('expand operator', function () {
    asDiagram('expand(x => x === 8 ? empty : \u2014\u20142*x\u2014| )')('should recursively map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--x----|  ', { x: 1 });
        var e1subs = '^      !  ';
        var e2 = marble_testing_1.cold('--c|    ', { c: 2 });
        var expected = '--a-b-c-d|';
        var values = { a: 1, b: 2, c: 4, d: 8 };
        var result = e1.pipe(operators_1.expand(function (x) { return x === 8 ? rxjs_1.EMPTY : e2.pipe(operators_1.map(function (c) { return c * x; })); }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with scheduler', function () {
        var e1 = marble_testing_1.hot('--x----|  ', { x: 1 });
        var e1subs = '^      !  ';
        var e2 = marble_testing_1.cold('--c|    ', { c: 2 });
        var expected = '--a-b-c-d|';
        var values = { a: 1, b: 2, c: 4, d: 8 };
        var result = e1.pipe(operators_1.expand(function (x) { return x === 8 ? rxjs_1.EMPTY : e2.pipe(operators_1.map(function (c) { return c * x; })); }, Number.POSITIVE_INFINITY, rxTestScheduler));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and recursively flatten', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)            ';
        var e2shape = '---(z|)         ';
        var expected = 'a--b--c--d--(e|)';
        var result = e1.pipe(operators_1.expand(function (x, index) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            else {
                return marble_testing_1.cold(e2shape, { z: x + x });
            }
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and recursively flatten, and handle event raised error', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)         ';
        var e2shape = '---(z|)      ';
        var expected = 'a--b--c--(d#)';
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 8) {
                return marble_testing_1.cold('#');
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and recursively flatten, and propagate error thrown from projection', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)         ';
        var e2shape = '---(z|)      ';
        var expected = 'a--b--c--(d#)';
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 8) {
                throw 'error';
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing early', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var unsub = '       !  ';
        var e1subs = '(^!)      ';
        var e2shape = '---(z|)   ';
        var expected = 'a--b--c-  ';
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)      ';
        var e2shape = '---(z|)   ';
        var expected = 'a--b--c-  ';
        var unsub = '       !  ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow concurrent expansions', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('a-a|              ', values);
        var e1subs = '^  !              ';
        var e2shape = '---(z|)           ';
        var expected = 'a-ab-bc-cd-de-(e|)';
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow configuring the concurrency limit parameter to 1', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
            u: 10,
            v: 20,
            x: 40,
            y: 80,
            z: 160,
        };
        var e1 = marble_testing_1.hot('a-u|', values);
        var e2shape = '---(z|)';
        var e1subs = '^  !                         ';
        var expected = 'a--u--b--v--c--x--d--y--(ez|)';
        var concurrencyLimit = 1;
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 16 || x === 160) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }, concurrencyLimit));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow configuring the concurrency limit parameter to 2', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            u: 10,
            v: 20,
            x: 40,
        };
        var e1 = marble_testing_1.hot('a---au|', values);
        var e2shape = '------(z|)';
        var e1subs = '^     !                   ';
        var expected = 'a---a-u---b-b---v-(cc)(x|)';
        var concurrencyLimit = 2;
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 4 || x === 40) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }, concurrencyLimit));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should ignore concurrency limit if it is not passed', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
            u: 10,
            v: 20,
            x: 40,
            y: 80,
            z: 160,
        };
        var e1 = marble_testing_1.hot('a-u|              ', values);
        var e1subs = '^  !              ';
        var e2shape = '---(z|)           ';
        var expected = 'a-ub-vc-xd-ye-(z|)';
        var concurrencyLimit = 100;
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 16 || x === 160) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        }, concurrencyLimit));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and recursively flatten with scalars', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)';
        var expected = '(abcde|)';
        var result = e1.pipe(operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return rxjs_1.of(x + x);
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should recursively flatten promises', function (done) {
        var expected = [1, 2, 4, 8, 16];
        rxjs_1.of(1).pipe(operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return Promise.resolve(x + x);
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should recursively flatten Arrays', function (done) {
        var expected = [1, 2, 4, 8, 16];
        rxjs_1.of(1).pipe(operators_1.expand(function (x) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return [x + x];
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should recursively flatten lowercase-o observables', function (done) {
        var expected = [1, 2, 4, 8, 16];
        var project = function (x, index) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            var ish = {
                subscribe: function (observer) {
                    observer.next(x + x);
                    observer.complete();
                }
            };
            ish[Symbol.observable] = function () {
                return this;
            };
            return ish;
        };
        rxjs_1.of(1).pipe(operators_1.expand(project)).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should work when passing undefined for the optional arguments', function () {
        var values = {
            a: 1,
            b: 1 + 1,
            c: 2 + 2,
            d: 4 + 4,
            e: 8 + 8,
        };
        var e1 = marble_testing_1.hot('(a|)', values);
        var e1subs = '(^!)            ';
        var e2shape = '---(z|)         ';
        var expected = 'a--b--c--d--(e|)';
        var project = function (x, index) {
            if (x === 16) {
                return rxjs_1.EMPTY;
            }
            return marble_testing_1.cold(e2shape, { z: x + x });
        };
        var result = e1.pipe(operators_1.expand(project, undefined, undefined));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=expand-spec.js.map