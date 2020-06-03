"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('zipWith', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should combine a source with a second', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1---2---3---');
            var asubs = '   ^';
            var b = hot('   --4--5--6--7--8--');
            var bsubs = '   ^';
            var expected = '---x---y---z';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should end once one observable completes and its buffer is empty', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a--b--c--|               ');
            var e1subs = '  ^-----------!               ';
            var e2 = hot('  ------d----e----f--------|  ');
            var e2subs = '  ^-----------------!         ';
            var e3 = hot('  --------h----i----j---------');
            var e3subs = '  ^-----------------!         ';
            var expected = '--------x----y----(z|)      ';
            var values = {
                x: ['a', 'd', 'h'],
                y: ['b', 'e', 'i'],
                z: ['c', 'f', 'j'],
            };
            expectObservable(e1.pipe(operators_1.zipWith(e2, e3))).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    it('should end once one observable nexts and zips value from completed other ' + 'observable whose buffer is empty', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a--b--c--|             ');
            var e1subs = '  ^-----------!             ';
            var e2 = hot('  ------d----e----f|        ');
            var e2subs = '  ^----------------!        ';
            var e3 = hot('  --------h----i----j-------');
            var e3subs = '  ^-----------------!       ';
            var expected = '--------x----y----(z|)    ';
            var values = {
                x: ['a', 'd', 'h'],
                y: ['b', 'e', 'i'],
                z: ['c', 'f', 'j'],
            };
            expectObservable(e1.pipe(operators_1.zipWith(e2, e3))).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    describe('with iterables', function () {
        it('should zip them with values', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var myIterator = {
                    count: 0,
                    next: function () {
                        return { value: this.count++, done: false };
                    },
                };
                myIterator[Symbol.iterator] = function () {
                    return this;
                };
                var e1 = hot('  ---a---b---c---d---|');
                var e1subs = '  ^------------------!';
                var expected = '---w---x---y---z---|';
                var values = {
                    w: ['a', 0],
                    x: ['b', 1],
                    y: ['c', 2],
                    z: ['d', 3],
                };
                expectObservable(e1.pipe(operators_1.zipWith(myIterator))).toBe(expected, values);
                expectSubscriptions(e1.subscriptions).toBe(e1subs);
            });
        });
        it('should only call `next` as needed', function () {
            var nextCalled = 0;
            var myIterator = {
                count: 0,
                next: function () {
                    nextCalled++;
                    return { value: this.count++, done: false };
                },
            };
            myIterator[Symbol.iterator] = function () {
                return this;
            };
            rxjs_1.of(1, 2, 3)
                .pipe(operators_1.zipWith(myIterator))
                .subscribe();
            chai_1.expect(nextCalled).to.equal(4);
        });
        it('should work with never observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  -');
                var asubs = '   ^';
                var expected = '-';
                var b = [];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with empty observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  |');
                var asubs = '   (^!)';
                var expected = '|';
                var b = [];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with empty observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  |');
                var asubs = '   (^!)';
                var expected = '|';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('   ---^----a--|');
                var asubs = '   ^-------!';
                var b = [];
                var expected = '--------|';
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with never observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  -');
                var asubs = '   ^';
                var expected = '-';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^----1--|');
                var asubs = '   ^----!   ';
                var expected = '-----(x|)';
                var b = [2];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', 2] });
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^----#');
                var asubs = '   ^----!';
                var expected = '-----#';
                var b = [];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with observable which raises error and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^----#');
                var asubs = '   ^----!';
                var expected = '-----#';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty many observable and non-empty many iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^--1--2--3--|');
                var asubs = '   ^--------!   ';
                var expected = '---x--y--(z|)';
                var b = [4, 5, 6];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', 4], y: ['2', 5], z: ['3', 6] });
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty observable and non-empty iterable selector that throws', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^--1--2--3--|');
                var asubs = '   ^-----!';
                var expected = '---x--#';
                var b = [4, 5, 6];
                var selector = function (x, y) {
                    if (y === 5) {
                        throw new Error('too bad');
                    }
                    else {
                        return x + y;
                    }
                };
                expectObservable(a.pipe(operators_1.zipWith(b, selector))).toBe(expected, { x: '14' }, new Error('too bad'));
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
    });
    it('should work with n-ary symmetric', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1----4----|');
            var asubs = '     ^---------!  ';
            var b = hot('---1-^--2--5----| ');
            var bsubs = '     ^---------!  ';
            var c = hot('---1-^---3---6-|  ');
            var expected = '  ----x---y-|  ';
            expectObservable(a.pipe(operators_1.zipWith(b, c))).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with right completes first', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-2-----|');
            var asubs = '     ^-----!';
            var b = hot('---1-^--3--|');
            var bsubs = '     ^-----!';
            var expected = '  ---x--|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['2', '3'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two nevers', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   ^';
            var b = cold('  -');
            var bsubs = '   ^';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = cold('  -');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and non-empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = hot('   ---1--|');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with non-empty and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1--|');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and non-empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   ^';
            var b = hot('   ---1--|');
            var bsubs = '   ^-----!';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with non-empty and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1--|');
            var asubs = '   ^-----!';
            var b = cold('  -');
            var bsubs = '   ^';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and error', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = hot('   ------#', undefined, 'too bad');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#', undefined, 'too bad');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ----------|');
            var asubs = '   ^-----!    ';
            var b = hot('   ------#    ');
            var bsubs = '   ^-----!    ';
            var expected = '------#    ';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and error', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -------');
            var asubs = '   ^-----!';
            var b = hot('   ------#');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#');
            var asubs = '   ^-----!';
            var b = cold('  -------');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#', undefined, 'too bad');
            var asubs = '   ^-----!';
            var b = hot('   ----------#', undefined, 'too bad 2');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, null, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two sources that eventually raise errors', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   --w-----#----', { w: 1 }, 'too bad');
            var asubs = '   ^-------!';
            var b = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
            var bsubs = '   ^-------!';
            var expected = '-----x--#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: [1, 2] }, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two sources that eventually raise errors (swapped)', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
            var asubs = '   ^-------!';
            var b = hot('   --w-----#----', { w: 1 }, 'too bad');
            var bsubs = '   ^-------!';
            var expected = '-----x--#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: [2, 1] }, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and some', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  #');
            var asubs = '   (^!)';
            var b = hot('   --1--2--3--');
            var bsubs = '   (^!)';
            var expected = '#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [
            [1, 4],
            [2, 5],
            [3, 6],
        ];
        var i = 0;
        a.pipe(operators_1.zipWith(b)).subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r[i++]);
        }, null, done);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1---2---3---|');
            var unsub = '   ---------!';
            var asubs = '   ^--------!';
            var b = hot('   --4--5--6--7--8--|');
            var bsubs = '   ^--------!';
            var expected = '---x---y--';
            var r = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.zipWith(b), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(r, unsub).toBe(expected, { x: ['1', '4'], y: ['2', '5'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
});
//# sourceMappingURL=zipWith-spec.js.map