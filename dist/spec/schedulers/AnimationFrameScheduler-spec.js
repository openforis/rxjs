"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var rxjs_1 = require("rxjs");
var animationFrame = rxjs_1.animationFrameScheduler;
describe('Scheduler.animationFrame', function () {
    it('should exist', function () {
        chai_1.expect(animationFrame).exist;
    });
    it('should act like the async scheduler if delay > 0', function () {
        var actionHappened = false;
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        animationFrame.schedule(function () {
            actionHappened = true;
        }, 50);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.true;
        sandbox.restore();
    });
    it('should cancel animationFrame actions when unsubscribed', function () {
        var actionHappened = false;
        var sandbox = sinon.createSandbox();
        var fakeTimer = sandbox.useFakeTimers();
        animationFrame.schedule(function () {
            actionHappened = true;
        }, 50).unsubscribe();
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        fakeTimer.tick(25);
        chai_1.expect(actionHappened).to.be.false;
        sandbox.restore();
    });
    it('should schedule an action to happen later', function (done) {
        var actionHappened = false;
        animationFrame.schedule(function () {
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
        animationFrame.schedule(function (index) {
            if (index === 0) {
                this.schedule(1);
                animationFrame.schedule(function () { syncExec1 = false; });
            }
            else if (index === 1) {
                this.schedule(2);
                animationFrame.schedule(function () { syncExec2 = false; });
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
    it('should cancel the animation frame if all scheduled actions unsubscribe before it executes', function (done) {
        var animationFrameExec1 = false;
        var animationFrameExec2 = false;
        var action1 = animationFrame.schedule(function () { animationFrameExec1 = true; });
        var action2 = animationFrame.schedule(function () { animationFrameExec2 = true; });
        chai_1.expect(animationFrame.scheduled).to.exist;
        chai_1.expect(animationFrame.actions.length).to.equal(2);
        action1.unsubscribe();
        action2.unsubscribe();
        chai_1.expect(animationFrame.actions.length).to.equal(0);
        chai_1.expect(animationFrame.scheduled).to.equal(undefined);
        animationFrame.schedule(function () {
            chai_1.expect(animationFrameExec1).to.equal(false);
            chai_1.expect(animationFrameExec2).to.equal(false);
            done();
        });
    });
    it('should execute the rest of the scheduled actions if the first action is canceled', function (done) {
        var actionHappened = false;
        var secondSubscription = null;
        var firstSubscription = animationFrame.schedule(function () {
            actionHappened = true;
            if (secondSubscription) {
                secondSubscription.unsubscribe();
            }
            done(new Error('The first action should not have executed.'));
        });
        secondSubscription = animationFrame.schedule(function () {
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
        var originalFlush = animationFrame.flush;
        animationFrame.flush = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            ++flushCount;
            originalFlush.apply(animationFrame, args);
            if (flushCount === 2) {
                animationFrame.flush = originalFlush;
                try {
                    chai_1.expect(scheduledIndices).to.deep.equal([0, 1]);
                    done();
                }
                catch (error) {
                    done(error);
                }
            }
        };
        animationFrame.schedule(function (index) {
            if (flushCount < 2) {
                this.schedule(index + 1);
                scheduledIndices.push(index + 1);
            }
        }, 0, 0);
        scheduledIndices.push(0);
    });
});
//# sourceMappingURL=AnimationFrameScheduler-spec.js.map