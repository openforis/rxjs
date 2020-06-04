"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var chai_1 = require("chai");
var interop_helper_1 = require("../helpers/interop-helper");
describe('exhaustMap', function () {
    asDiagram('exhaustMap(i => 10*i\u2014\u201410*i\u2014\u201410*i\u2014| )')('should map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--1-----3--5-------|');
        var e1subs = '^                  !';
        var e2 = marble_testing_1.cold('x-x-x|              ', { x: 10 });
        var expected = '--x-x-x-y-y-y------|';
        var values = { x: 10, y: 30, z: 50 };
        var result = e1.pipe(operators_1.exhaustMap(function (x) { return e2.pipe(operators_1.map(function (i) { return i * +x; })); }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support the deprecated resultSelector', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.exhaustMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, function (a, b, i, ii) { return [a, b, i, ii]; }))
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
        rxjs_1.of(1, 2, 3).pipe(operators_1.exhaustMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, void 0))
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
    it('should handle outer throw', function () {
        var x = marble_testing_1.cold('--a--b--c--|');
        var xsubs = [];
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var result = e1.pipe(operators_1.exhaustMap(function () { return x; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle outer empty', function () {
        var x = marble_testing_1.cold('--a--b--c--|');
        var xsubs = [];
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var result = e1.pipe(operators_1.exhaustMap(function () { return x; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle outer never', function () {
        var x = marble_testing_1.cold('--a--b--c--|');
        var xsubs = [];
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var result = e1.pipe(operators_1.exhaustMap(function () { return x; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if project throws', function () {
        var e1 = marble_testing_1.hot('---x---------y-----------------z-------------|');
        var e1subs = '^  !';
        var expected = '---#';
        var result = e1.pipe(operators_1.exhaustMap(function (value) {
            throw 'error';
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch with a selector function', function () {
        var x = marble_testing_1.cold('--a--b--c--|                              ');
        var xsubs = '   ^          !                              ';
        var y = marble_testing_1.cold('--d--e--f--|                    ');
        var ysubs = [];
        var z = marble_testing_1.cold('--g--h--i--|  ');
        var zsubs = '                               ^          !  ';
        var e1 = marble_testing_1.hot('---x---------y-----------------z-------------|');
        var e1subs = '^                                            !';
        var expected = '-----a--b--c---------------------g--h--i-----|';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner cold observables, outer is unsubscribed early', function () {
        var x = marble_testing_1.cold('--a--b--c--|                               ');
        var xsubs = '   ^          !                               ';
        var y = marble_testing_1.cold('--d--e--f--|                     ');
        var ysubs = [];
        var z = marble_testing_1.cold('--g--h--i--|   ');
        var zsubs = '                               ^  !           ';
        var e1 = marble_testing_1.hot('---x---------y-----------------z-------------|');
        var unsub = '                                  !           ';
        var e1subs = '^                                 !           ';
        var expected = '-----a--b--c---------------------g-           ';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a--b--c--|                               ');
        var xsubs = '   ^          !                               ';
        var y = marble_testing_1.cold('--d--e--f--|                     ');
        var ysubs = [];
        var z = marble_testing_1.cold('--g--h--i--|   ');
        var zsubs = '                               ^  !           ';
        var e1 = marble_testing_1.hot('---x---------y-----------------z-------------|');
        var e1subs = '^                                 !           ';
        var expected = '-----a--b--c---------------------g-           ';
        var unsub = '                                  !           ';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.exhaustMap(function (value) { return observableLookup[value]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a--b--c--|                               ');
        var xsubs = '   ^          !                               ';
        var y = marble_testing_1.cold('--d--e--f--|                     ');
        var ysubs = [];
        var z = marble_testing_1.cold('--g--h--i--|   ');
        var zsubs = '                               ^  !           ';
        var e1 = marble_testing_1.hot('---x---------y-----------------z-------------|');
        var e1subs = '^                                 !           ';
        var expected = '-----a--b--c---------------------g-           ';
        var unsub = '                                  !           ';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.exhaustMap(function (value) { return interop_helper_1.asInteropObservable(observableLookup[value]); }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should stop listening to a synchronous observable when unsubscribed', function () {
        var sideEffects = [];
        var synchronousObservable = rxjs_1.concat(rxjs_1.defer(function () {
            sideEffects.push(1);
            return rxjs_1.of(1);
        }), rxjs_1.defer(function () {
            sideEffects.push(2);
            return rxjs_1.of(2);
        }), rxjs_1.defer(function () {
            sideEffects.push(3);
            return rxjs_1.of(3);
        }));
        rxjs_1.of(null).pipe(operators_1.exhaustMap(function () { return synchronousObservable; }), operators_1.takeWhile(function (x) { return x != 2; })).subscribe(function () { });
        chai_1.expect(sideEffects).to.deep.equal([1, 2]);
    });
    it('should switch inner cold observables, inner never completes', function () {
        var x = marble_testing_1.cold('--a--b--c--|                              ');
        var xsubs = '   ^          !                              ';
        var y = marble_testing_1.cold('--d--e--f--|                    ');
        var ysubs = [];
        var z = marble_testing_1.cold('--g--h--i-----');
        var zsubs = '                               ^             ';
        var e1 = marble_testing_1.hot('---x---------y-----------------z---------|   ');
        var e1subs = '^                                        !   ';
        var expected = '-----a--b--c---------------------g--h--i-----';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a synchronous switch an stay on the first inner observable', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|   ');
        var xsubs = '         ^                !   ';
        var y = marble_testing_1.cold('---f---g---h---i--|  ');
        var ysubs = [];
        var e1 = marble_testing_1.hot('---------(xy)----------------|');
        var e1subs = '^                            !';
        var expected = '-----------a--b--c--d--e-----|';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner cold observables, one inner throws', function () {
        var x = marble_testing_1.cold('--a--b--c--d--#             ');
        var xsubs = '         ^             !             ';
        var y = marble_testing_1.cold('---f---g---h---i--');
        var ysubs = [];
        var e1 = marble_testing_1.hot('---------x---------y---------|       ');
        var e1subs = '^                      !             ';
        var expected = '-----------a--b--c--d--#             ';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner hot observables', function () {
        var x = marble_testing_1.hot('-----a--b--c--d--e--|                  ');
        var xsubs = '         ^          !                  ';
        var y = marble_testing_1.hot('--p-o-o-p-------f---g---h---i--|       ');
        var ysubs = [];
        var z = marble_testing_1.hot('---z-o-o-m-------------j---k---l---m--|');
        var zsubs = '                    ^                 !';
        var e1 = marble_testing_1.hot('---------x----y-----z--------|         ');
        var e1subs = '^                            !         ';
        var expected = '-----------c--d--e-----j---k---l---m--|';
        var observableLookup = { x: x, y: y, z: z };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner empty and empty', function () {
        var x = marble_testing_1.cold('|');
        var y = marble_testing_1.cold('|');
        var xsubs = '         (^!)                 ';
        var ysubs = '                   (^!)       ';
        var e1 = marble_testing_1.hot('---------x---------y---------|');
        var e1subs = '^                            !';
        var expected = '-----------------------------|';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner empty and never', function () {
        var x = marble_testing_1.cold('|');
        var y = marble_testing_1.cold('-');
        var xsubs = '         (^!)                 ';
        var ysubs = '                   ^          ';
        var e1 = marble_testing_1.hot('---------x---------y---------|');
        var e1subs = '^                            !';
        var expected = '------------------------------';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should never switch inner never', function () {
        var x = marble_testing_1.cold('-');
        var y = marble_testing_1.cold('#');
        var xsubs = '         ^                     ';
        var ysubs = [];
        var e1 = marble_testing_1.hot('---------x---------y----------|');
        var e1subs = '^                             !';
        var expected = '-------------------------------';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should switch inner empty and throw', function () {
        var x = marble_testing_1.cold('|');
        var y = marble_testing_1.cold('#');
        var xsubs = '         (^!)                  ';
        var ysubs = '                   (^!)        ';
        var e1 = marble_testing_1.hot('---------x---------y---------|');
        var e1subs = '^                  !          ';
        var expected = '-------------------#          ';
        var observableLookup = { x: x, y: y };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle outer error', function () {
        var x = marble_testing_1.cold('--a--b--c--d--e--|');
        var xsubs = '         ^         !       ';
        var e1 = marble_testing_1.hot('---------x---------#       ');
        var e1subs = '^                  !       ';
        var expected = '-----------a--b--c-#       ';
        var observableLookup = { x: x };
        var result = e1.pipe(operators_1.exhaustMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=exhaustMap-spec.js.map