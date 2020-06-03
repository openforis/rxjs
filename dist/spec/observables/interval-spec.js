"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var sinon = require("sinon");
describe('interval', function () {
    it('should create an observable emitting periodically', function () {
        var e1 = rxjs_1.interval(20, rxTestScheduler).pipe(operators_1.take(6), operators_1.concat(rxjs_1.NEVER));
        var expected = '--a-b-c-d-e-f-';
        var values = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4,
            f: 5,
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
    it('should set up an interval', function () {
        var expected = '----------0---------1---------2---------3---------4---------5---------6-----';
        marble_testing_1.expectObservable(rxjs_1.interval(100, rxTestScheduler)).toBe(expected, [0, 1, 2, 3, 4, 5, 6]);
    });
    it('should emit when relative interval set to zero', function () {
        var e1 = rxjs_1.interval(0, rxTestScheduler).pipe(operators_1.take(7));
        var expected = '(0123456|)';
        marble_testing_1.expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6]);
    });
    it('should consider negative interval as zero', function () {
        var e1 = rxjs_1.interval(-1, rxTestScheduler).pipe(operators_1.take(7));
        var expected = '(0123456|)';
        marble_testing_1.expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6]);
    });
    it('should emit values until unsubscribed', function (done) {
        var values = [];
        var expected = [0, 1, 2, 3, 4, 5, 6];
        var e1 = rxjs_1.interval(5);
        var subscription = e1.subscribe(function (x) {
            values.push(x);
            if (x === 6) {
                subscription.unsubscribe();
                chai_1.expect(values).to.deep.equal(expected);
                done();
            }
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should create an observable emitting periodically with the AsapScheduler', function (done) {
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        var period = 10;
        var events = [0, 1, 2, 3, 4, 5];
        var source = rxjs_1.interval(period, rxjs_1.asapScheduler).pipe(operators_1.take(6));
        source.subscribe({
            next: function (x) {
                chai_1.expect(x).to.equal(events.shift());
            },
            error: function (e) {
                sandbox.restore();
                done(e);
            },
            complete: function () {
                chai_1.expect(rxjs_1.asapScheduler.actions.length).to.equal(0);
                chai_1.expect(rxjs_1.asapScheduler.scheduled).to.equal(undefined);
                sandbox.restore();
                done();
            }
        });
        var i = -1, n = events.length;
        while (++i < n) {
            fakeTimer.tick(period);
        }
    });
    it('should create an observable emitting periodically with the QueueScheduler', function (done) {
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        var period = 10;
        var events = [0, 1, 2, 3, 4, 5];
        var source = rxjs_1.interval(period, rxjs_1.queueScheduler).pipe(operators_1.take(6));
        source.subscribe({
            next: function (x) {
                chai_1.expect(x).to.equal(events.shift());
            },
            error: function (e) {
                sandbox.restore();
                done(e);
            },
            complete: function () {
                chai_1.expect(rxjs_1.queueScheduler.actions.length).to.equal(0);
                chai_1.expect(rxjs_1.queueScheduler.scheduled).to.equal(undefined);
                sandbox.restore();
                done();
            }
        });
        var i = -1, n = events.length;
        while (++i < n) {
            fakeTimer.tick(period);
        }
    });
    it('should create an observable emitting periodically with the AnimationFrameScheduler', function (done) {
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        var period = 10;
        var events = [0, 1, 2, 3, 4, 5];
        var source = rxjs_1.interval(period, rxjs_1.animationFrameScheduler).pipe(operators_1.take(6));
        source.subscribe({
            next: function (x) {
                chai_1.expect(x).to.equal(events.shift());
            },
            error: function (e) {
                sandbox.restore();
                done(e);
            },
            complete: function () {
                chai_1.expect(rxjs_1.animationFrameScheduler.actions.length).to.equal(0);
                chai_1.expect(rxjs_1.animationFrameScheduler.scheduled).to.equal(undefined);
                sandbox.restore();
                done();
            }
        });
        var i = -1, n = events.length;
        while (++i < n) {
            fakeTimer.tick(period);
        }
    });
});
//# sourceMappingURL=interval-spec.js.map