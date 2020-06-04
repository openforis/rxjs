"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('Observable.prototype.concatMap', function () {
    asDiagram('concatMap(i => 10*i\u2014\u201410*i\u2014\u201410*i\u2014| )')('should map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--1-----3--5-------|');
        var e1subs = '^                  !';
        var e2 = marble_testing_1.cold('x-x-x|              ', { x: 10 });
        var expected = '--x-x-x-y-y-yz-z-z-|';
        var values = { x: 10, y: 30, z: 50 };
        var result = e1.pipe(operators_1.concatMap(function (x) { return e2.pipe(operators_1.map(function (i) { return i * parseInt(x); })); }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support the deprecated resultSelector', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.concatMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, function (a, b, i, ii) { return [a, b, i, ii]; }))
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
        rxjs_1.of(1, 2, 3).pipe(operators_1.concatMap(function (x) { return rxjs_1.of(x, x + 1, x + 2); }, void 0))
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
    it('should concatenate many regular interval inners', function () {
        var a = marble_testing_1.cold('--a-a-a-(a|)                            ');
        var asubs = '^       !                               ';
        var b = marble_testing_1.cold('----b--b--(b|)                  ');
        var bsubs = '        ^         !                     ';
        var c = marble_testing_1.cold('-c-c-(c|)      ');
        var csubs = '                         ^    !         ';
        var d = marble_testing_1.cold('------(d|)');
        var dsubs = '                              ^     !   ';
        var e1 = marble_testing_1.hot('a---b--------------------c-d----|       ');
        var e1subs = '^                               !       ';
        var expected = '--a-a-a-a---b--b--b-------c-c-c-----(d|)';
        var observableLookup = { a: a, b: b, c: c, d: d };
        var source = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer values to many inner values', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d---|                        ');
        var e1subs = '^                !                        ';
        var inner = marble_testing_1.cold('--i-j-k-l-|                               ', values);
        var innersubs = [' ^         !                              ',
            '           ^         !                    ',
            '                     ^         !          ',
            '                               ^         !'];
        var expected = '---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l-|';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var inner = marble_testing_1.cold('-1-2-3|');
        var innersubs = [];
        var expected = '|';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never source', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var inner = marble_testing_1.cold('-1-2-3|');
        var innersubs = [];
        var expected = '-';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should error immediately if given a just-throw source', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var inner = marble_testing_1.cold('-1-2-3|');
        var innersubs = [];
        var expected = '#';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return a silenced version of the source if the mapped inner is empty', function () {
        var e1 = marble_testing_1.cold('--a-b--c-| ');
        var e1subs = '^        ! ';
        var inner = marble_testing_1.cold('|');
        var innersubs = ['  (^!)     ',
            '    (^!)   ',
            '       (^!)'];
        var expected = '---------| ';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return a never if the mapped inner is never', function () {
        var e1 = marble_testing_1.cold('--a-b--c-|');
        var e1subs = '^        !';
        var inner = marble_testing_1.cold('-');
        var innersubs = '  ^       ';
        var expected = '----------';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should propagate errors if the mapped inner is a just-throw Observable', function () {
        var e1 = marble_testing_1.cold('--a-b--c-|');
        var e1subs = '^ !       ';
        var inner = marble_testing_1.cold('#');
        var innersubs = '  (^!)    ';
        var expected = '--#       ';
        var result = e1.pipe(operators_1.concatMap(function () { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, complete late', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d----------------------------------|');
        var e1subs = '^                                               !';
        var inner = marble_testing_1.cold('--i-j-k-l-|                                     ', values);
        var innersubs = [' ^         !                                     ',
            '           ^         !                           ',
            '                     ^         !                 ',
            '                               ^         !       '];
        var expected = '---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l--------|';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, outer never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d-----------------------------------');
        var e1subs = '^                                                ';
        var inner = marble_testing_1.cold('--i-j-k-l-|                                     ', values);
        var innersubs = [' ^         !                                     ',
            '           ^         !                           ',
            '                     ^         !                 ',
            '                               ^         !       '];
        var expected = '---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l---------';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, inner never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d---|');
        var e1subs = '^                !';
        var inner = marble_testing_1.cold('--i-j-k-l-       ', values);
        var innersubs = ' ^                ';
        var expected = '---i-j-k-l--------';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, and inner throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d---|');
        var e1subs = '^          !      ';
        var inner = marble_testing_1.cold('--i-j-k-l-#      ', values);
        var innersubs = ' ^         !      ';
        var expected = '---i-j-k-l-#      ';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, and outer throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d---#');
        var e1subs = '^                !';
        var inner = marble_testing_1.cold('--i-j-k-l-|      ', values);
        var innersubs = [' ^         !      ',
            '           ^     !'];
        var expected = '---i-j-k-l---i-j-#';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to many inner, both inner and outer throw', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a---b---c---d---#');
        var e1subs = '^          !      ';
        var inner = marble_testing_1.cold('--i-j-k-l-#      ', values);
        var innersubs = ' ^         !      ';
        var expected = '---i-j-k-l-#      ';
        var result = e1.pipe(operators_1.concatMap(function (value) { return inner; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, where all inners are finite', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = '                           ^                  !        ';
        var f = marble_testing_1.cold('--|      ');
        var fsubs = '                                              ^ !      ';
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = '                                                ^     !';
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                                      !               ';
        var expected = '---2--3--4--5----6-----2--3-1------2--3-4-5--------1-2|';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, all inners finite except one', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3-                           ');
        var dsubs = '                   ^                                   ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = [];
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                                      !               ';
        var expected = '---2--3--4--5----6-----2--3----------------------------';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, inners finite, outer does not complete', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = '                           ^                  !        ';
        var f = marble_testing_1.cold('--|      ');
        var fsubs = '                                              ^ !      ';
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = '                                                ^     !';
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g---             ');
        var e1subs = '^                                                      ';
        var expected = '---2--3--4--5----6-----2--3-1------2--3-4-5--------1-2-';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, all inners finite, and outer throws', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = '                           ^           !               ';
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g#               ');
        var e1subs = '^                                      !               ';
        var expected = '---2--3--4--5----6-----2--3-1------2--3#               ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, all inners complete except one throws', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-#                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = [];
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = [];
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                  !                                   ';
        var expected = '---2--3--4--5----6-#                                   ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, all inners finite, outer is unsubscribed early', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = '                           ^  !                        ';
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                             !                        ';
        var unsub = '                              !                        ';
        var expected = '---2--3--4--5----6-----2--3-1--                        ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) { return observableLookup[value]; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = '                           ^  !                        ';
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                             !                        ';
        var unsub = '                              !                        ';
        var expected = '---2--3--4--5----6-----2--3-1--                        ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.concatMap(function (value) { return observableLookup[value]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many complex, all inners finite, project throws', function () {
        var a = marble_testing_1.cold('-#                                                          ');
        var asubs = [];
        var b = marble_testing_1.cold('-#                                                        ');
        var bsubs = [];
        var c = marble_testing_1.cold('-2--3--4--5----6-|                                   ');
        var csubs = '  ^                !                                   ';
        var d = marble_testing_1.cold('----2--3|                           ');
        var dsubs = '                   ^       !                           ';
        var e = marble_testing_1.cold('-1------2--3-4-5---|        ');
        var esubs = [];
        var f = marble_testing_1.cold('--|      ');
        var fsubs = [];
        var g = marble_testing_1.cold('---1-2|');
        var gsubs = [];
        var e1 = marble_testing_1.hot('-a-b--^-c-----d------e----------------f-----g|               ');
        var e1subs = '^                          !                           ';
        var expected = '---2--3--4--5----6-----2--3#                           ';
        var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
        var result = e1.pipe(operators_1.concatMap(function (value) {
            if (value === 'e') {
                throw 'error';
            }
            return observableLookup[value];
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
        marble_testing_1.expectSubscriptions(c.subscriptions).toBe(csubs);
        marble_testing_1.expectSubscriptions(d.subscriptions).toBe(dsubs);
        marble_testing_1.expectSubscriptions(e.subscriptions).toBe(esubs);
        marble_testing_1.expectSubscriptions(f.subscriptions).toBe(fsubs);
        marble_testing_1.expectSubscriptions(g.subscriptions).toBe(gsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    function arrayRepeat(value, times) {
        var results = [];
        for (var i = 0; i < times; i++) {
            results.push(value);
        }
        return results;
    }
    it('should concatMap many outer to an array for each value', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^                               !';
        var expected = '(22)--(4444)---(333)----(22)----|';
        var result = e1.pipe(operators_1.concatMap(function (value) { return arrayRepeat(value, +value); }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to inner arrays, outer unsubscribed early', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^            !                   ';
        var unsub = '             !                   ';
        var expected = '(22)--(4444)--                   ';
        var result = e1.pipe(operators_1.concatMap(function (value) { return arrayRepeat(value, +value); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should concatMap many outer to inner arrays, project throws', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^              !                 ';
        var expected = '(22)--(4444)---#                 ';
        var invoked = 0;
        var result = e1.pipe(operators_1.concatMap(function (value) {
            invoked++;
            if (invoked === 3) {
                throw 'error';
            }
            return arrayRepeat(value, +value);
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map values to constant resolved promises and concatenate', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value) { return rxjs_1.from(Promise.resolve(42)); };
        var results = [];
        source.pipe(operators_1.concatMap(project)).subscribe(function (x) {
            results.push(x);
        }, function (err) {
            done(new Error('Subscriber error handler not supposed to be called.'));
        }, function () {
            chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
            done();
        });
    });
    it('should map values to constant rejected promises and concatenate', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value) { return rxjs_1.from(Promise.reject(42)); };
        source.pipe(operators_1.concatMap(project)).subscribe(function (x) {
            done(new Error('Subscriber next handler not supposed to be called.'));
        }, function (err) {
            chai_1.expect(err).to.deep.equal(42);
            done();
        }, function () {
            done(new Error('Subscriber complete handler not supposed to be called.'));
        });
    });
    it('should map values to resolved promises and concatenate', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value, index) { return rxjs_1.from(Promise.resolve(value + index)); };
        var results = [];
        source.pipe(operators_1.concatMap(project)).subscribe(function (x) {
            results.push(x);
        }, function (err) {
            done(new Error('Subscriber error handler not supposed to be called.'));
        }, function () {
            chai_1.expect(results).to.deep.equal([4, 4, 4, 4]);
            done();
        });
    });
    it('should map values to rejected promises and concatenate', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var project = function (value, index) { return rxjs_1.from(Promise.reject('' + value + '-' + index)); };
        source.pipe(operators_1.concatMap(project)).subscribe(function (x) {
            done(new Error('Subscriber next handler not supposed to be called.'));
        }, function (err) {
            chai_1.expect(err).to.deep.equal('4-0');
            done();
        }, function () {
            done(new Error('Subscriber complete handler not supposed to be called.'));
        });
    });
});
//# sourceMappingURL=concatMap-spec.js.map