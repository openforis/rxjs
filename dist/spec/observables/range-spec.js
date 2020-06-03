"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
var range_1 = require("rxjs/internal/observable/range");
var operators_1 = require("rxjs/operators");
describe('range', function () {
    it('should create an observable with numbers 1 to 10', function () {
        var e1 = rxjs_1.range(1, 10)
            .pipe(operators_1.concatMap(function (x, i) { return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : 20, rxTestScheduler)); }));
        var expected = 'a-b-c-d-e-f-g-h-i-(j|)';
        var values = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 8,
            i: 9,
            j: 10,
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
    it('should work for two subscribers', function () {
        var e1 = rxjs_1.range(1, 5)
            .pipe(operators_1.concatMap(function (x, i) { return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : 20, rxTestScheduler)); }));
        var expected = 'a-b-c-d-(e|)';
        var values = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
    it('should synchronously create a range of values by default', function () {
        var results = [];
        rxjs_1.range(12, 4).subscribe(function (x) {
            results.push(x);
        });
        chai_1.expect(results).to.deep.equal([12, 13, 14, 15]);
    });
    it('should accept a scheduler', function (done) {
        var expected = [12, 13, 14, 15];
        sinon.spy(rxjs_1.asapScheduler, 'schedule');
        var source = rxjs_1.range(12, 4, rxjs_1.asapScheduler);
        source.subscribe(function (x) {
            chai_1.expect(rxjs_1.asapScheduler.schedule).have.been.called;
            var exp = expected.shift();
            chai_1.expect(x).to.equal(exp);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            rxjs_1.asapScheduler.schedule.restore();
            done();
        });
    });
    it('should accept only one argument where count is argument and start is zero', function () {
        var e1 = rxjs_1.range(5)
            .pipe(operators_1.concatMap(function (x, i) { return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : 20, rxTestScheduler)); }));
        var expected = 'a-b-c-d-(e|)';
        var values = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
});
describe('RangeObservable', function () {
    describe('dispatch', function () {
        it('should complete if index >= count', function () {
            var o = new rxjs_1.Subscriber();
            var obj = sinon.stub(o);
            var state = {
                subscriber: obj,
                index: 10,
                start: 0,
                count: 9
            };
            range_1.dispatch.call({}, state);
            chai_1.expect(state.subscriber.complete).have.been.called;
            chai_1.expect(state.subscriber.next).not.have.been.called;
        });
        it('should next out another value and increment the index and start', function () {
            var o = new rxjs_1.Subscriber();
            var obj = sinon.stub(o);
            var state = {
                subscriber: obj,
                index: 1,
                start: 5,
                count: 9
            };
            var thisArg = {
                schedule: sinon.spy()
            };
            range_1.dispatch.call(thisArg, state);
            chai_1.expect(state.subscriber.complete).not.have.been.called;
            chai_1.expect(state.subscriber.next).have.been.calledWith(5);
            chai_1.expect(state.start).to.equal(6);
            chai_1.expect(state.index).to.equal(2);
            chai_1.expect(thisArg.schedule).have.been.calledWith(state);
        });
    });
});
//# sourceMappingURL=range-spec.js.map