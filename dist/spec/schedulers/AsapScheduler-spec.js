"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var rxjs_1 = require("rxjs");
var asap = rxjs_1.asapScheduler;
describe('Scheduler.asap', function () {
    it('should exist', function () {
        chai_1.expect(asap).exist;
    });
    it('should act like the async scheduler if delay > 0', function () {
        var actionHappened = false;
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        asap.schedule(function () {
            actionHappened = true;
        }, 50);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.true;
        sandbox.restore();
    });
    it('should cancel asap actions when delay > 0', function () {
        var actionHappened = false;
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        asap.schedule(function () {
            actionHappened = true;
        }, 50).unsubscribe();
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        sandbox.restore();
    });
    it('should reuse the interval for recursively scheduled actions with the same delay', function () {
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        var stubSetInterval = sinon.stub(global, 'setInterval').callThrough();
        var period = 50;
        var state = { index: 0, period: period };
        function dispatch(state) {
            state.index += 1;
            if (state.index < 3) {
                this.schedule(state, state.period);
            }
        }
        asap.schedule(dispatch, period, state);
        chai_1.expect(state).to.have.property('index', 0);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
        fakeTimer.tick(period);
        chai_1.expect(state).to.have.property('index', 1);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
        fakeTimer.tick(period);
        chai_1.expect(state).to.have.property('index', 2);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
        stubSetInterval.restore();
        sandbox.restore();
    });
    it('should not reuse the interval for recursively scheduled actions with a different delay', function () {
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        var stubSetInterval = sinon.stub(global, 'setInterval').callThrough();
        var period = 50;
        var state = { index: 0, period: period };
        function dispatch(state) {
            state.index += 1;
            state.period -= 1;
            if (state.index < 3) {
                this.schedule(state, state.period);
            }
        }
        asap.schedule(dispatch, period, state);
        chai_1.expect(state).to.have.property('index', 0);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
        fakeTimer.tick(period);
        chai_1.expect(state).to.have.property('index', 1);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 2);
        fakeTimer.tick(period);
        chai_1.expect(state).to.have.property('index', 2);
        chai_1.expect(stubSetInterval).to.have.property('callCount', 3);
        stubSetInterval.restore();
        sandbox.restore();
    });
    it('should schedule an action to happen later', function (done) {
        var actionHappened = false;
        asap.schedule(function () {
            actionHappened = true;
            done();
        });
        if (actionHappened) {
            done(new Error('Scheduled action happened synchronously'));
        }
    });
    it('should execute recursively scheduled actions in separate asynchronous contexts', function (done) {
        var syncExec1 = true;
        var syncExec2 = true;
        asap.schedule(function (index) {
            if (index === 0) {
                this.schedule(1);
                asap.schedule(function () { syncExec1 = false; });
            }
            else if (index === 1) {
                this.schedule(2);
                asap.schedule(function () { syncExec2 = false; });
            }
            else if (index === 2) {
                this.schedule(3);
            }
            else if (index === 3) {
                if (!syncExec1 && !syncExec2) {
                    done();
                }
                else {
                    done(new Error('Execution happened synchronously.'));
                }
            }
        }, 0, 0);
    });
    it('should cancel the setImmediate if all scheduled actions unsubscribe before it executes', function (done) {
        var asapExec1 = false;
        var asapExec2 = false;
        var action1 = asap.schedule(function () { asapExec1 = true; });
        var action2 = asap.schedule(function () { asapExec2 = true; });
        chai_1.expect(asap.scheduled).to.exist;
        chai_1.expect(asap.actions.length).to.equal(2);
        action1.unsubscribe();
        action2.unsubscribe();
        chai_1.expect(asap.actions.length).to.equal(0);
        chai_1.expect(asap.scheduled).to.equal(undefined);
        asap.schedule(function () {
            chai_1.expect(asapExec1).to.equal(false);
            chai_1.expect(asapExec2).to.equal(false);
            done();
        });
    });
    it('should execute the rest of the scheduled actions if the first action is canceled', function (done) {
        var actionHappened = false;
        var secondSubscription = null;
        var firstSubscription = asap.schedule(function () {
            actionHappened = true;
            if (secondSubscription) {
                secondSubscription.unsubscribe();
            }
            done(new Error('The first action should not have executed.'));
        });
        secondSubscription = asap.schedule(function () {
            if (!actionHappened) {
                done();
            }
        });
        if (actionHappened) {
            done(new Error('Scheduled action happened synchronously'));
        }
        else {
            firstSubscription.unsubscribe();
        }
    });
    it('should not execute rescheduled actions when flushing', function (done) {
        var flushCount = 0;
        var scheduledIndices = [];
        var originalFlush = asap.flush;
        asap.flush = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            ++flushCount;
            originalFlush.apply(asap, args);
            if (flushCount === 2) {
                asap.flush = originalFlush;
                try {
                    chai_1.expect(scheduledIndices).to.deep.equal([0, 1]);
                    done();
                }
                catch (error) {
                    done(error);
                }
            }
        };
        asap.schedule(function (index) {
            if (flushCount < 2) {
                this.schedule(index + 1);
                scheduledIndices.push(index + 1);
            }
        }, 0, 0);
        scheduledIndices.push(0);
    });
});
//# sourceMappingURL=AsapScheduler-spec.js.map