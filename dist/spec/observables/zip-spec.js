"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var queueScheduler = rxjs_1.queueScheduler;
describe('static zip', function () {
    it('should combine a source with a second', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b))
            .toBe(expected, { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should zip the provided observables', function (done) {
        var expected = ['a1', 'b2', 'c3'];
        var i = 0;
        rxjs_1.zip(rxjs_1.from(['a', 'b', 'c']), rxjs_1.from([1, 2, 3]), function (a, b) { return a + b; })
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
        marble_testing_1.expectObservable(rxjs_1.zip(e1, e2, e3)).toBe(expected, values);
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
        marble_testing_1.expectObservable(rxjs_1.zip(e1, e2, e3)).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    describe('with iterables', function () {
        it('should zip them with values', function () {
            var myIterator = {
                count: 0,
                next: function () {
                    return { value: this.count++, done: false };
                }
            };
            myIterator[Symbol.iterator] = function () { return this; };
            var e1 = marble_testing_1.hot('---a---b---c---d---|');
            var e1subs = '^                  !';
            var expected = '---w---x---y---z---|';
            var values = {
                w: ['a', 0],
                x: ['b', 1],
                y: ['c', 2],
                z: ['d', 3]
            };
            marble_testing_1.expectObservable(rxjs_1.zip(e1, myIterator)).toBe(expected, values);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should only call `next` as needed', function () {
            var nextCalled = 0;
            var myIterator = {
                count: 0,
                next: function () {
                    nextCalled++;
                    return { value: this.count++, done: false };
                }
            };
            myIterator[Symbol.iterator] = function () {
                return this;
            };
            rxjs_1.zip(rxjs_1.of(1, 2, 3), myIterator)
                .subscribe();
            chai_1.expect(nextCalled).to.equal(4);
        });
        it('should work with never observable and empty iterable', function () {
            var a = marble_testing_1.cold('-');
            var asubs = '^';
            var b = [];
            var expected = '-';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with empty observable and empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with empty observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [1];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and empty iterable', function () {
            var a = marble_testing_1.hot('---^----a--|');
            var asubs = '^       !';
            var b = [];
            var expected = '--------|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with never observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('-');
            var asubs = '^';
            var b = [1];
            var expected = '-';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----1--|');
            var asubs = '^    !   ';
            var b = [2];
            var expected = '-----(x|)';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['1', 2] });
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and empty iterable', function () {
            var a = marble_testing_1.hot('---^----#');
            var asubs = '^    !';
            var b = [];
            var expected = '-----#';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with observable which raises error and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----#');
            var asubs = '^    !';
            var b = [1];
            var expected = '-----#';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty many observable and non-empty many iterable', function () {
            var a = marble_testing_1.hot('---^--1--2--3--|');
            var asubs = '^        !   ';
            var b = [4, 5, 6];
            var expected = '---x--y--(z|)';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['1', 4], y: ['2', 5], z: ['3', 6] });
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
            marble_testing_1.expectObservable(rxjs_1.zip(a, b, selector)).toBe(expected, { x: '14' }, new Error('too bad'));
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
    });
    it('should combine two observables and selector', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (e1, e2) { return e1 + e2; }))
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
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, c)).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
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
        var observable = rxjs_1.zip(a, b, c, function (r0, r1, r2) { return [r0, r1, r2]; });
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
        var observable = rxjs_1.zip(a, b, c, function (r0, r1, r2) { return [r0, r1, r2]; });
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
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
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
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
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
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
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
        var observable = rxjs_1.zip(a, b, selector);
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
    it('should work with two nevers', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and never', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('-');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and non-empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and empty', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and non-empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '^     !';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and never', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and error', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('------#', undefined, 'too bad');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and empty', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error', function () {
        var a = marble_testing_1.hot('----------|');
        var asubs = '^     !    ';
        var b = marble_testing_1.hot('------#    ');
        var bsubs = '^     !    ';
        var expected = '------#    ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and error', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^     !';
        var b = marble_testing_1.hot('------#');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and never', function () {
        var a = marble_testing_1.hot('------#');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and error', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '^     !';
        var b = marble_testing_1.hot('----------#', undefined, 'too bad 2');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors', function () {
        var a = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var asubs = '^       !';
        var b = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: [1, 2] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors (swapped)', function () {
        var a = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var asubs = '^       !';
        var b = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: [2, 1] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and some', function () {
        var a = marble_testing_1.cold('#');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('--1--2--3--');
        var bsubs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, queueScheduler);
        var r = [[1, 4], [2, 5], [3, 6]];
        var i = 0;
        rxjs_1.zip(a, b).subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r[i++]);
        }, null, done);
    });
    type('should support observables', function () {
        var a;
        var b;
        var c;
        var o1 = rxjs_1.zip(a, b, c);
    });
    type('should support mixed observables and promises', function () {
        var a;
        var b;
        var c;
        var d;
        var o1 = rxjs_1.zip(a, b, c, d);
    });
    type('should support arrays of promises', function () {
        var a;
        var o1 = rxjs_1.zip(a);
        var o2 = rxjs_1.zip.apply(void 0, a);
    });
    type('should support arrays of observables', function () {
        var a;
        var o1 = rxjs_1.zip(a);
        var o2 = rxjs_1.zip.apply(void 0, a);
    });
    type('should return Array<T> when given a single promise', function () {
        var a;
        var o1 = rxjs_1.zip(a);
    });
    type('should return Array<T> when given a single observable', function () {
        var a;
        var o1 = rxjs_1.zip(a);
    });
});
//# sourceMappingURL=zip-spec.js.map