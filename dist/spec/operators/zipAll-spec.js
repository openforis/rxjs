"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('zipAll operator', function () {
    asDiagram('zipAll')('should combine paired events from two observables', function () {
        var x = marble_testing_1.cold('-a-----b-|');
        var y = marble_testing_1.cold('--1-2-----');
        var outer = marble_testing_1.hot('-x----y--------|         ', { x: x, y: y });
        var expected = '-----------------A----B-|';
        var result = outer.pipe(operators_1.zipAll(function (a, b) { return String(a) + String(b); }));
        marble_testing_1.expectObservable(result).toBe(expected, { A: 'a1', B: 'b2' });
    });
    it('should combine two observables', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        var values = { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] };
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should take all observables from the source and zip them', function (done) {
        var expected = ['a1', 'b2', 'c3'];
        var i = 0;
        var source = rxjs_1.of(rxjs_1.of('a', 'b', 'c'), rxjs_1.of(1, 2, 3)).pipe(operators_1.zipAll(function (a, b) { return a + b; }))
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        }, null, done);
    });
    it('should end once one observable completes and its buffer is empty', function () {
        var e1 = marble_testing_1.hot('---a--b--c--|               ');
        var e1subs = '^           !               ';
        var e2 = marble_testing_1.hot('------d----e----f--------|  ');
        var e2subs = '^                 !         ';
        var e3 = marble_testing_1.hot('--------h----i----j---------');
        var e3subs = '^                 !         ';
        var expected = '--------x----y----(z|)      ';
        var values = {
            x: ['a', 'd', 'h'],
            y: ['b', 'e', 'i'],
            z: ['c', 'f', 'j']
        };
        marble_testing_1.expectObservable(rxjs_1.of(e1, e2, e3).pipe(operators_1.zipAll())).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should end once one observable nexts and zips value from completed other ' +
        'observable whose buffer is empty', function () {
        var e1 = marble_testing_1.hot('---a--b--c--|             ');
        var e1subs = '^           !             ';
        var e2 = marble_testing_1.hot('------d----e----f|        ');
        var e2subs = '^                !        ';
        var e3 = marble_testing_1.hot('--------h----i----j-------');
        var e3subs = '^                 !       ';
        var expected = '--------x----y----(z|)    ';
        var values = {
            x: ['a', 'd', 'h'],
            y: ['b', 'e', 'i'],
            z: ['c', 'f', 'j']
        };
        marble_testing_1.expectObservable(rxjs_1.of(e1, e2, e3).pipe(operators_1.zipAll())).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    describe('with iterables', function () {
        it('should zip them with values', function () {
            var _a;
            var myIterator = (_a = {
                    count: 0,
                    next: function () {
                        return { value: this.count++, done: false };
                    }
                },
                _a[Symbol.iterator] = function () {
                    return this;
                },
                _a);
            var e1 = marble_testing_1.hot('---a---b---c---d---|');
            var e1subs = '^                  !';
            var expected = '---w---x---y---z---|';
            var values = {
                w: ['a', 0],
                x: ['b', 1],
                y: ['c', 2],
                z: ['d', 3]
            };
            marble_testing_1.expectObservable(rxjs_1.of(e1, myIterator).pipe(operators_1.zipAll())).toBe(expected, values);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should only call `next` as needed', function () {
            var _a;
            var nextCalled = 0;
            var myIterator = (_a = {
                    count: 0,
                    next: function () {
                        nextCalled++;
                        return { value: this.count++, done: false };
                    }
                },
                _a[Symbol.iterator] = function () {
                    return this;
                },
                _a);
            rxjs_1.of(rxjs_1.of(1, 2, 3), myIterator).pipe(operators_1.zipAll())
                .subscribe();
            chai_1.expect(nextCalled).to.equal(4);
        });
        it('should work with never observable and empty iterable', function () {
            var a = marble_testing_1.cold('-');
            var asubs = '^';
            var b = [];
            var expected = '-';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with empty observable and empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with empty observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [1];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and empty iterable', function () {
            var a = marble_testing_1.hot('---^----a--|');
            var asubs = '^       !';
            var b = [];
            var expected = '--------|';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with never observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('-');
            var asubs = '^';
            var b = [1];
            var expected = '-';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----1--|');
            var asubs = '^    !   ';
            var b = [2];
            var expected = '-----(x|)';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, { x: ['1', 2] });
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and empty iterable', function () {
            var a = marble_testing_1.hot('---^----#');
            var asubs = '^    !';
            var b = [];
            var expected = '-----#';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with observable which raises error and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----#');
            var asubs = '^    !';
            var b = [1];
            var expected = '-----#';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty many observable and non-empty many iterable', function () {
            var a = marble_testing_1.hot('---^--1--2--3--|');
            var asubs = '^        !   ';
            var b = [4, 5, 6];
            var expected = '---x--y--(z|)';
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, { x: ['1', 4], y: ['2', 5], z: ['3', 6] });
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and non-empty iterable selector that throws', function () {
            var a = marble_testing_1.hot('---^--1--2--3--|');
            var asubs = '^     !';
            var b = [4, 5, 6];
            var expected = '---x--#';
            var selector = function (x, y) {
                if (y === 5) {
                    throw new Error('too bad');
                }
                else {
                    return x + y;
                }
            };
            marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll(selector))).toBe(expected, { x: '14' }, new Error('too bad'));
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
    });
    it('should combine two observables and selector', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll(function (e1, e2) { return e1 + e2; })))
            .toBe(expected, { x: '14', y: '25', z: '36' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        marble_testing_1.expectObservable(rxjs_1.of(a, b, c).pipe(operators_1.zipAll())).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric selector', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        var observable = rxjs_1.of(a, b, c).pipe(operators_1.zipAll(function (r0, r1, r2) { return [r0, r1, r2]; }));
        marble_testing_1.expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric array selector', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        var observable = rxjs_1.of(a, b, c).pipe(operators_1.zipAll(function (r0, r1, r2) { return [r0, r1, r2]; }));
        marble_testing_1.expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data asymmetric 1', function () {
        var a = marble_testing_1.hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
        var asubs = '^                 !    ';
        var b = marble_testing_1.hot('---1-^--2--4--6--8--0--|    ');
        var bsubs = '^                 !    ';
        var expected = '---a--b--c--d--e--|    ';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll(function (r1, r2) { return r1 + r2; })))
            .toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data asymmetric 2', function () {
        var a = marble_testing_1.hot('---1-^--2--4--6--8--0--|    ');
        var asubs = '^                 !    ';
        var b = marble_testing_1.hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
        var bsubs = '^                 !    ';
        var expected = '---a--b--c--d--e--|    ';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll(function (r1, r2) { return r1 + r2; })))
            .toBe(expected, { a: '21', b: '43', c: '65', d: '87', e: '09' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data symmetric', function () {
        var a = marble_testing_1.hot('---1-^-1-3-5-7-9------| ');
        var asubs = '^                ! ';
        var b = marble_testing_1.hot('---1-^--2--4--6--8--0--|');
        var bsubs = '^                ! ';
        var expected = '---a--b--c--d--e-| ';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll(function (r1, r2) { return r1 + r2; })))
            .toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with selector throws', function () {
        var a = marble_testing_1.hot('---1-^-2---4----|  ');
        var asubs = '^       !     ';
        var b = marble_testing_1.hot('---1-^--3----5----|');
        var bsubs = '^       !     ';
        var expected = '---x----#     ';
        var selector = function (x, y) {
            if (y === '5') {
                throw new Error('too bad');
            }
            else {
                return x + y;
            }
        };
        var observable = rxjs_1.of(a, b).pipe(operators_1.zipAll(selector));
        marble_testing_1.expectObservable(observable).toBe(expected, { x: '23' }, new Error('too bad'));
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with right completes first', function () {
        var a = marble_testing_1.hot('---1-^-2-----|');
        var asubs = '^     !';
        var b = marble_testing_1.hot('---1-^--3--|');
        var bsubs = '^     !';
        var expected = '---x--|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['2', '3'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should zip until one child terminates', function (done) {
        var expected = ['a1', 'b2'];
        var i = 0;
        rxjs_1.of(rxjs_1.of('a', 'b', 'c'), rxjs_1.of(1, 2))
            .pipe(operators_1.zipAll(function (a, b) { return a + b; }))
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        }, null, done);
    });
    it('should handle a hot observable of observables', function () {
        var x = marble_testing_1.cold('a---b---c---|      ');
        var xsubs = '        ^           !';
        var y = marble_testing_1.cold('d---e---f---|   ');
        var ysubs = '        ^           !';
        var e1 = marble_testing_1.hot('--x--y--|            ', { x: x, y: y });
        var e1subs = '^       !            ';
        var expected = '--------u---v---w---|';
        var values = {
            u: ['a', 'd'],
            v: ['b', 'e'],
            w: ['c', 'f']
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected, values);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle merging a hot observable of non-overlapped observables', function () {
        var x = marble_testing_1.cold('a-b---------|                         ');
        var xsubs = '                           ^           !';
        var y = marble_testing_1.cold('c-d-e-f-|                      ');
        var ysubs = '                           ^       !    ';
        var z = marble_testing_1.cold('g-h-i-j-k-|           ');
        var zsubs = '                           ^         !  ';
        var e1 = marble_testing_1.hot('--x------y--------z--------|            ', { x: x, y: y, z: z });
        var e1subs = '^                          !            ';
        var expected = '---------------------------u-v---------|';
        var values = {
            u: ['a', 'c', 'g'],
            v: ['b', 'd', 'h']
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected, values);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if inner observable raises error', function () {
        var x = marble_testing_1.cold('a-b---------|                     ');
        var xsubs = '                              ^       !';
        var y = marble_testing_1.cold('c-d-e-f-#               ');
        var ysubs = '                              ^       !';
        var z = marble_testing_1.cold('g-h-i-j-k-|    ');
        var zsubs = '                              ^       !';
        var e1 = marble_testing_1.hot('--x---------y--------z--------|        ', { x: x, y: y, z: z });
        var e1subs = '^                             !        ';
        var expected = '------------------------------u-v-----#';
        var expectedValues = {
            u: ['a', 'c', 'g'],
            v: ['b', 'd', 'h']
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if outer observable raises error', function () {
        var y = marble_testing_1.cold('a-b---------|');
        var z = marble_testing_1.cold('c-d-e-f-|');
        var e1 = marble_testing_1.hot('--y---------z---#', { y: y, z: z });
        var e1subs = '^               !';
        var expected = '----------------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with two nevers', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and never', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('-');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and non-empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and empty', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and non-empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '^     !';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and never', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should combine a source with a second', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll()))
            .toBe(expected, { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and error', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('------#', undefined, 'too bad');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and empty', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error', function () {
        var a = marble_testing_1.hot('----------|');
        var asubs = '^     !    ';
        var b = marble_testing_1.hot('------#    ');
        var bsubs = '^     !    ';
        var expected = '------#    ';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and error', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^     !';
        var b = marble_testing_1.hot('------#');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and never', function () {
        var a = marble_testing_1.hot('------#');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and error', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '^     !';
        var b = marble_testing_1.hot('----------#', undefined, 'too bad 2');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors', function () {
        var a = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var asubs = '^       !';
        var b = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, { x: [1, 2] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors (swapped)', function () {
        var a = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var asubs = '^       !';
        var b = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected, { x: [2, 1] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and some', function () {
        var a = marble_testing_1.cold('#');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('--1--2--3--');
        var bsubs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should combine two immediately-scheduled observables', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [[1, 4], [2, 5], [3, 6]];
        var i = 0;
        var result = rxjs_1.of(a, b, rxjs_1.queueScheduler).pipe(operators_1.zipAll());
        result.subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r[i++]);
        }, null, done);
    });
    it('should combine a source with an immediately-scheduled source', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8);
        var r = [[1, 4], [2, 5], [3, 6]];
        var i = 0;
        var result = rxjs_1.of(a, b, rxjs_1.queueScheduler).pipe(operators_1.zipAll());
        result.subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r[i++]);
        }, null, done);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var a = marble_testing_1.hot('---1---2---3---|');
        var unsub = '         !';
        var asubs = '^        !';
        var b = marble_testing_1.hot('--4--5--6--7--8--|');
        var bsubs = '^        !';
        var expected = '---x---y--';
        var values = { x: ['1', '4'], y: ['2', '5'] };
        var r = rxjs_1.of(a, b).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.zipAll(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(r, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should complete when empty source', function () {
        var source = marble_testing_1.hot('|');
        var expected = '|';
        marble_testing_1.expectObservable(source.pipe(operators_1.zipAll())).toBe(expected);
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.zipAll(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.reduce(function (acc, x) { return acc + x; }, 0);
        }));
    });
});
//# sourceMappingURL=zipAll-spec.js.map