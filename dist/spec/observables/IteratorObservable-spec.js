"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fromIterable_1 = require("rxjs/internal/observable/fromIterable");
var iterator_1 = require("rxjs/internal/symbol/iterator");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('fromIterable', function () {
    it('should not accept null (or truthy-equivalent to null) iterator', function () {
        chai_1.expect(function () {
            fromIterable_1.fromIterable(null, undefined);
        }).to.throw(Error, 'Iterable cannot be null');
        chai_1.expect(function () {
            fromIterable_1.fromIterable(void 0, undefined);
        }).to.throw(Error, 'Iterable cannot be null');
    });
    it('should emit members of an array iterator', function (done) {
        var expected = [10, 20, 30, 40];
        fromIterable_1.fromIterable([10, 20, 30, 40], undefined)
            .subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should get new iterator for each subscription', function () {
        var expected = [
            rxjs_1.Notification.createNext(10),
            rxjs_1.Notification.createNext(20),
            rxjs_1.Notification.createComplete()
        ];
        var e1 = fromIterable_1.fromIterable(new Int32Array([10, 20]), undefined).pipe(operators_1.observeOn(rxTestScheduler));
        var v1, v2;
        e1.pipe(operators_1.materialize(), operators_1.toArray()).subscribe(function (x) { return v1 = x; });
        e1.pipe(operators_1.materialize(), operators_1.toArray()).subscribe(function (x) { return v2 = x; });
        rxTestScheduler.flush();
        chai_1.expect(v1).to.deep.equal(expected);
        chai_1.expect(v2).to.deep.equal(expected);
    });
    it('should finalize generators if the subscription ends', function () {
        var _a;
        var iterator = {
            finalized: false,
            next: function () {
                return { value: 'duck', done: false };
            },
            return: function () {
                this.finalized = true;
            }
        };
        var iterable = (_a = {},
            _a[iterator_1.iterator] = function () {
                return iterator;
            },
            _a);
        var results = [];
        fromIterable_1.fromIterable(iterable, undefined)
            .pipe(operators_1.take(3))
            .subscribe(function (x) { return results.push(x); }, null, function () { return results.push('GOOSE!'); });
        chai_1.expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
        chai_1.expect(iterator.finalized).to.be.true;
    });
    it('should finalize generators if the subscription and it is scheduled', function () {
        var _a;
        var iterator = {
            finalized: false,
            next: function () {
                return { value: 'duck', done: false };
            },
            return: function () {
                this.finalized = true;
            }
        };
        var iterable = (_a = {},
            _a[iterator_1.iterator] = function () {
                return iterator;
            },
            _a);
        var results = [];
        fromIterable_1.fromIterable(iterable, rxjs_1.queueScheduler)
            .pipe(operators_1.take(3))
            .subscribe(function (x) { return results.push(x); }, null, function () { return results.push('GOOSE!'); });
        chai_1.expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
        chai_1.expect(iterator.finalized).to.be.true;
    });
    it('should emit members of an array iterator on a particular scheduler', function () {
        var source = fromIterable_1.fromIterable([10, 20, 30, 40], rxTestScheduler);
        var values = { a: 10, b: 20, c: 30, d: 40 };
        expectObservable(source).toBe('(abcd|)', values);
    });
    it('should emit members of an array iterator on a particular scheduler, ' +
        'but is unsubscribed early', function (done) {
        var expected = [10, 20, 30, 40];
        var source = fromIterable_1.fromIterable([10, 20, 30, 40], rxjs_1.queueScheduler);
        var subscriber = rxjs_1.Subscriber.create(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
            if (x === 30) {
                subscriber.unsubscribe();
                done();
            }
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done(new Error('should not be called'));
        });
        source.subscribe(subscriber);
    });
    it('should emit characters of a string iterator', function (done) {
        var expected = ['f', 'o', 'o'];
        fromIterable_1.fromIterable('foo', undefined)
            .subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should be possible to unsubscribe in the middle of the iteration', function (done) {
        var expected = [10, 20, 30];
        var subscriber = rxjs_1.Subscriber.create(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
            if (x === 30) {
                subscriber.unsubscribe();
                done();
            }
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done(new Error('should not be called'));
        });
        fromIterable_1.fromIterable([10, 20, 30, 40, 50, 60], undefined).subscribe(subscriber);
    });
});
//# sourceMappingURL=IteratorObservable-spec.js.map