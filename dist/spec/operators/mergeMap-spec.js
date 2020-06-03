"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
var interop_helper_1 = require("../helpers/interop-helper");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('mergeMap', function () {
    var rxTest;
    beforeEach(function () {
        rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--1-----3--5-------|');
        var e1subs = '^                  !';
        var e2 = marble_testing_1.cold('x-x-x|              ', { x: 10 });
        var expected = '--x-x-x-y-yzyz-z---|';
        var values = { x: 10, y: 30, z: 50 };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return e2.pipe(operators_1.map(function (i) { return i * +x; })); }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support the deprecated resultSelector', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, function (a, b, i, ii) { return [a, b, i, ii]; }))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    [1, 1, 0, 0],
                    [1, 2, 0, 1],
                    [1, 3, 0, 2],
                    [2, 2, 1, 0],
                    [2, 3, 1, 1],
                    [2, 4, 1, 2],
                    [3, 3, 2, 0],
                    [3, 4, 2, 1],
                    [3, 5, 2, 2],
                ]);
            }
        });
    });
    it('should support a void resultSelector (still deprecated)', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, void 0))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    1, 2, 3, 2, 3, 4, 3, 4, 5
                ]);
            }
        });
    });
    it('should support a void resultSelector (still deprecated) and concurrency limit', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, void 0, 1))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    1, 2, 3, 2, 3, 4, 3, 4, 5
                ]);
            }
        });
    });
    it('should mergeMap many regular interval inners', function () {
        var a = marble_testing_1.cold('----a---a---a---(a|)                    ');
        var b = marble_testing_1.cold('----b---b---(b|)                    ');
        var c = marble_testing_1.cold('----c---c---c---c---(c|)');
        var d = marble_testing_1.cold('----(d|)        ');
        var e1 = marble_testing_1.hot('a---b-----------c-------d-------|       ');
        var e1subs = '^                               !       ';
        var expected = '----a---(ab)(ab)(ab)c---c---(cd)c---(c|)';
        var observableLookup = { a: a, b: b, c: c, d: d };
        var source = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map values to constant resolved promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value) { return rxjs_1.from(Promise.resolve(42)); };
        var results = [];
        source.pipe(operators_1.mergeMap(project)).subscribe(function (x) {
            results.push(x);
        }, function (err) {
            done(new Error('Subscriber error handler not supposed to be called.'));
        }, function () {
            chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
            done();
        });
    });
    it('should map values to constant rejected promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value) {
            return rxjs_1.from(Promise.reject(42));
        };
        source.pipe(operators_1.mergeMap(project)).subscribe(function (x) {
            done(new Error('Subscriber next handler not supposed to be called.'));
        }, function (err) {
            chai_1.expect(err).to.equal(42);
            done();
        }, function () {
            done(new Error('Subscriber complete handler not supposed to be called.'));
        });
    });
    it('should map values to resolved promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value, index) {
            return rxjs_1.from(Promise.resolve(value + index));
        };
        var results = [];
        source.pipe(operators_1.mergeMap(project)).subscribe(function (x) {
            results.push(x);
        }, function (err) {
            done(new Error('Subscriber error handler not supposed to be called.'));
        }, function () {
            chai_1.expect(results).to.deep.equal([4, 4, 4, 4]);
            done();
        });
    });
    it('should map values to rejected promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value, index) {
            return rxjs_1.from(Promise.reject('' + value + '-' + index));
        };
        source.pipe(operators_1.mergeMap(project)).subscribe(function (x) {
            done(new Error('Subscriber next handler not supposed to be called.'));
        }, function (err) {
            chai_1.expect(err).to.equal('4-0');
            done();
        }, function () {
            done(new Error('Subscriber complete handler not supposed to be called.'));
        });
    });
    it('should mergeMap many outer values to many inner values', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|            ');
        var e1subs = '^                                !            ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                        ', values);
        var innersubs = [' ^                   !                        ',
            '         ^                   !                ',
            '                 ^                   !        ',
            '                         ^                   !'];
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l---|';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, complete late', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-----------------------|');
        var e1subs = '^                                                !';
        var inner = marble_testing_1.cold('----i---j---k---l---|                            ', values);
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-------|';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, outer never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------e---------------f------');
        var unsub = '                                                       !';
        var e1subs = '^                                                      !';
        var inner = marble_testing_1.cold('----i---j---k---l---|                                  ', values);
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i--';
        var source = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------e---------------f------');
        var e1subs = '^                                                      !';
        var inner = marble_testing_1.cold('----i---j---k---l---|                                  ', values);
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i--';
        var unsub = '                                                       !';
        var source = e1.pipe(operators_1.map(function (x) { return x; }), operators_1.mergeMap(function (value) { return inner; }), operators_1.map(function (x) { return x; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|           ');
        var xsubs = '         ^           !                ';
        var y = marble_testing_1.cold('---f---g---h---i--|');
        var ysubs = '                   ^ !                ';
        var e1 = marble_testing_1.hot('---------x---------y---------|        ');
        var e1subs = '^                    !                ';
        var expected = '-----------a--b--c--d-                ';
        var unsub = '                     !                ';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.mergeMap(function (value) { return interop_helper_1.asInteropObservable(observableLookup[value]); }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, inner never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|         ');
        var e1subs = '^                                !         ';
        var inner = marble_testing_1.cold('----i---j---k---l-------------------------', values);
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, and inner throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|');
        var e1subs = '^                        !        ';
        var inner = marble_testing_1.cold('----i---j---k---l-------#        ', values);
        var expected = '-----i---j---(ki)(lj)(ki)#        ';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, and outer throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------#');
        var e1subs = '^                                !';
        var inner = marble_testing_1.cold('----i---j---k---l---|            ', values);
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)#';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to many inner, both inner and outer throw', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------#');
        var e1subs = '^                    !            ';
        var inner = marble_testing_1.cold('----i---j---k---l---#            ', values);
        var expected = '-----i---j---(ki)(lj)#            ';
        var result = e1.pipe(operators_1.mergeMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many cold Observable, with parameter concurrency=1', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                                        ');
        var e1subs = '^                    !                                        ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                                        ', values);
        var innersubs = [' ^                   !                                        ',
            '                     ^                   !                    ',
            '                                         ^                   !'];
        var expected = '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
        function project() { return inner; }
        var result = e1.pipe(operators_1.mergeMap(project, 1));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many cold Observable, with parameter concurrency=2', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                    ');
        var e1subs = '^                    !                    ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                    ', values);
        var innersubs = [' ^                   !                    ',
            '         ^                   !            ',
            '                     ^                   !'];
        var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
        function project() { return inner; }
        var result = e1.pipe(operators_1.mergeMap(project, 2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many hot Observable, with parameter concurrency=1', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                                        ');
        var e1subs = '^                    !                                        ';
        var hotA = marble_testing_1.hot('x----i---j---k---l---|                                        ', values);
        var hotB = marble_testing_1.hot('-x-x-xxxx-x-x-xxxxx-x----i---j---k---l---|                    ', values);
        var hotC = marble_testing_1.hot('x-xxxx---x-x-x-x-x-xx--x--x-x--x--xxxx-x-----i---j---k---l---|', values);
        var asubs = ' ^                   !                                        ';
        var bsubs = '                     ^                   !                    ';
        var csubs = '                                         ^                   !';
        var expected = '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
        var inners = { a: hotA, b: hotB, c: hotC };
        function project(x) { return inners[x]; }
        var result = e1.pipe(operators_1.mergeMap(project, 1));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(hotA.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(hotB.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(hotC.subscriptions).toBe(csubs);
    });
    it('should mergeMap to many hot Observable, with parameter concurrency=2', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                    ');
        var e1subs = '^                    !                    ';
        var hotA = marble_testing_1.hot('x----i---j---k---l---|                    ', values);
        var hotB = marble_testing_1.hot('-x-x-xxxx----i---j---k---l---|            ', values);
        var hotC = marble_testing_1.hot('x-xxxx---x-x-x-x-x-xx----i---j---k---l---|', values);
        var asubs = ' ^                   !                    ';
        var bsubs = '         ^                   !            ';
        var csubs = '                     ^                   !';
        var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
        var inners = { a: hotA, b: hotB, c: hotC };
        function project(x) { return inners[x]; }
        var result = e1.pipe(operators_1.mergeMap(project, 2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(hotA.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(hotB.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(hotC.subscriptions).toBe(csubs);
    });
    it('should mergeMap to many cold Observable, with parameter concurrency=1', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                                        ');
        var e1subs = '^                    !                                        ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                                        ', values);
        var innersubs = [' ^                   !                                        ',
            '                     ^                   !                    ',
            '                                         ^                   !'];
        var expected = '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
        function project() { return inner; }
        var result = e1.pipe(operators_1.mergeMap(project, 1));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many cold Observable, with parameter concurrency=2', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                    ');
        var e1subs = '^                    !                    ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                    ', values);
        var innersubs = [' ^                   !                    ',
            '         ^                   !            ',
            '                     ^                   !'];
        var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
        function project() { return inner; }
        var result = e1.pipe(operators_1.mergeMap(project, 2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many hot Observable, with parameter concurrency=1', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                                        ');
        var e1subs = '^                    !                                        ';
        var hotA = marble_testing_1.hot('x----i---j---k---l---|                                        ', values);
        var hotB = marble_testing_1.hot('-x-x-xxxx-x-x-xxxxx-x----i---j---k---l---|                    ', values);
        var hotC = marble_testing_1.hot('x-xxxx---x-x-x-x-x-xx--x--x-x--x--xxxx-x-----i---j---k---l---|', values);
        var asubs = ' ^                   !                                        ';
        var bsubs = '                     ^                   !                    ';
        var csubs = '                                         ^                   !';
        var expected = '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
        var inners = { a: hotA, b: hotB, c: hotC };
        function project(x) { return inners[x]; }
        var result = e1.pipe(operators_1.mergeMap(project, 1));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(hotA.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(hotB.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(hotC.subscriptions).toBe(csubs);
    });
    it('should mergeMap to many hot Observable, with parameter concurrency=2', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                    ');
        var e1subs = '^                    !                    ';
        var hotA = marble_testing_1.hot('x----i---j---k---l---|                    ', values);
        var hotB = marble_testing_1.hot('-x-x-xxxx----i---j---k---l---|            ', values);
        var hotC = marble_testing_1.hot('x-xxxx---x-x-x-x-x-xx----i---j---k---l---|', values);
        var asubs = ' ^                   !                    ';
        var bsubs = '         ^                   !            ';
        var csubs = '                     ^                   !';
        var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
        var inners = { a: hotA, b: hotB, c: hotC };
        function project(x) { return inners[x]; }
        var result = e1.pipe(operators_1.mergeMap(project, 2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(hotA.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(hotB.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(hotC.subscriptions).toBe(csubs);
    });
    it('should mergeMap many complex, where all inners are finite', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|');
        var e1subs = '^                                      !';
        var expected = '---2--3--4--5---1--2--3--2--3--6--4--5---1-2--|';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, all inners finite except one', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3-');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|');
        var e1subs = '^                                      !';
        var expected = '---2--3--4--5---1--2--3--2--3--6--4--5---1-2----';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, inners finite, outer does not complete', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g--------');
        var e1subs = '^                                               ';
        var expected = '---2--3--4--5---1--2--3--2--3--6--4--5---1-2----';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, all inners finite, and outer throws', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g#       ');
        var e1subs = '^                                      !       ';
        var expected = '---2--3--4--5---1--2--3--2--3--6--4--5-#       ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, all inners complete except one throws', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-#');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|');
        var e1subs = '^                                !             ';
        var expected = '---2--3--4--5---1--2--3--2--3--6-#             ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, all inners finite, outer is unsubscribed', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|');
        var unsub = '                              !                ';
        var e1subs = '^                             !                ';
        var expected = '---2--3--4--5---1--2--3--2--3--                ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var source = e1.pipe(operators_1.mergeMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many complex, all inners finite, project throws', function () {
        var a = marble_testing_1.cold('-#');
        var b = marble_testing_1.cold('-#');
        var c = marble_testing_1.cold('-2--3--4--5------------------6-|');
        var d = marble_testing_1.cold('-----------2--3|');
        var e = marble_testing_1.cold('-1--------2--3-----4--5--------|');
        var f = marble_testing_1.cold('--|');
        var g = marble_testing_1.cold('---1-2|');
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|');
        var e1subs = '^              !                               ';
        var expected = '---2--3--4--5--#                               ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var invoked = 0;
        var source = e1.pipe(operators_1.mergeMap(function (value) {
            invoked++;
            if (invoked === 3) {
                throw 'error';
            }
            return observableLookup[value];
        }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    function arrayRepeat(value, times) {
        var results = [];
        for (var i = 0; i < times; i++) {
            results.push(value);
        }
        return results;
    }
    it('should mergeMap many outer to an array for each value', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^                               !';
        var expected = '(22)--(4444)---(333)----(22)----|';
        var source = e1.pipe(operators_1.mergeMap(function (value) { return arrayRepeat(value, +value); }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to inner arrays, and outer throws', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------#');
        var e1subs = '^                               !';
        var expected = '(22)--(4444)---(333)----(22)----#';
        var source = e1.pipe(operators_1.mergeMap(function (value) { return arrayRepeat(value, +value); }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to inner arrays, outer gets unsubscribed', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var unsub = '             !                   ';
        var e1subs = '^            !                   ';
        var expected = '(22)--(4444)--                   ';
        var source = e1.pipe(operators_1.mergeMap(function (value) { return arrayRepeat(value, +value); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap many outer to inner arrays, project throws', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^              !                 ';
        var expected = '(22)--(4444)---#                 ';
        var invoked = 0;
        var source = e1.pipe(operators_1.mergeMap(function (value) {
            invoked++;
            if (invoked === 3) {
                throw 'error';
            }
            return arrayRepeat(value, +value);
        }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and flatten', function () {
        var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x + '!'); }));
        var expected = ['1!', '2!', '3!', '4!'];
        var completed = false;
        source.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            completed = true;
        });
        chai_1.expect(completed).to.be.true;
    });
    it('should map and flatten an Array', function () {
        var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.mergeMap(function (x) { return [x + '!']; }));
        var expected = ['1!', '2!', '3!', '4!'];
        var completed = false;
        source.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            completed = true;
        });
        chai_1.expect(completed).to.be.true;
    });
    it('should support nested merges', function (done) {
        var results = [];
        rxjs_1.of(1).pipe(operators_1.mergeMap(function () { return rxjs_1.defer(function () {
            return rxjs_1.of(2, rxjs_1.asapScheduler);
        }).pipe(operators_1.mergeMap(function () { return rxjs_1.defer(function () {
            return rxjs_1.of(3, rxjs_1.asapScheduler);
        }); })); }))
            .subscribe({
            next: function (value) { results.push(value); },
            complete: function () { results.push('done'); }
        });
        setTimeout(function () {
            chai_1.expect(results).to.deep.equal([3, 'done']);
            done();
        }, 0);
    });
    it('should support nested merges with promises', function (done) {
        var results = [];
        rxjs_1.of(1).pipe(operators_1.mergeMap(function () {
            return rxjs_1.from(Promise.resolve(2)).pipe(operators_1.mergeMap(function () { return Promise.resolve(3); }));
        }))
            .subscribe({
            next: function (value) { results.push(value); },
            complete: function () { results.push('done'); }
        });
        setTimeout(function () {
            chai_1.expect(results).to.deep.equal([3, 'done']);
            done();
        }, 0);
    });
    it('should support wrapped sources', function (done) {
        var results = [];
        var wrapped = new rxjs_1.Observable(function (subscriber) {
            var subscription = rxjs_1.timer(0, rxjs_1.asapScheduler).subscribe(subscriber);
            return function () { return subscription.unsubscribe(); };
        });
        wrapped.pipe(operators_1.mergeMap(function () { return rxjs_1.timer(0, rxjs_1.asapScheduler); })).subscribe({
            next: function (value) { results.push(value); },
            complete: function () { results.push('done'); }
        });
        setTimeout(function () {
            chai_1.expect(results).to.deep.equal([0, 'done']);
            done();
        }, 0);
    });
    it('should properly handle errors from iterables that are processed after some async', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var noXError = new Error('we do not allow x');
            var source = cold('-----A------------B-----|', { A: ['o', 'o', 'o'], B: ['o', 'x', 'o'] });
            var expected = '   -----(ooo)--------(o#)';
            var iterable = function (data) {
                var _i, data_1, d;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, data_1 = data;
                            _a.label = 1;
                        case 1:
                            if (!(_i < data_1.length)) return [3, 4];
                            d = data_1[_i];
                            if (d === 'x') {
                                throw noXError;
                            }
                            return [4, d];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4: return [2];
                    }
                });
            };
            var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x).pipe(operators_1.delay(0), operators_1.mergeMap(iterable)); }));
            expectObservable(result).toBe(expected, undefined, noXError);
        });
    });
});
//# sourceMappingURL=mergeMap-spec.js.map