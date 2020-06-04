"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('VirtualTimeScheduler', function () {
    it('should exist', function () {
        chai_1.expect(rxjs_1.VirtualTimeScheduler).exist;
        chai_1.expect(rxjs_1.VirtualTimeScheduler).to.be.a('function');
    });
    it('should schedule things in order when flushed if each this is scheduled synchrously', function () {
        var v = new rxjs_1.VirtualTimeScheduler();
        var invoked = [];
        var invoke = function (state) {
            invoked.push(state);
        };
        v.schedule(invoke, 0, 1);
        v.schedule(invoke, 0, 2);
        v.schedule(invoke, 0, 3);
        v.schedule(invoke, 0, 4);
        v.schedule(invoke, 0, 5);
        v.flush();
        chai_1.expect(invoked).to.deep.equal([1, 2, 3, 4, 5]);
    });
    it('should schedule things in order when flushed if each this is scheduled at random', function () {
        var v = new rxjs_1.VirtualTimeScheduler();
        var invoked = [];
        var invoke = function (state) {
            invoked.push(state);
        };
        v.schedule(invoke, 0, 1);
        v.schedule(invoke, 100, 2);
        v.schedule(invoke, 0, 3);
        v.schedule(invoke, 500, 4);
        v.schedule(invoke, 0, 5);
        v.schedule(invoke, 100, 6);
        v.flush();
        chai_1.expect(invoked).to.deep.equal([1, 3, 5, 2, 6, 4]);
    });
    it('should schedule things in order when there are negative delays', function () {
        var v = new rxjs_1.VirtualTimeScheduler();
        var invoked = [];
        var invoke = function (state) {
            invoked.push(state);
        };
        v.schedule(invoke, 0, 1);
        v.schedule(invoke, 100, 2);
        v.schedule(invoke, 0, 3);
        v.schedule(invoke, -2, 4);
        v.schedule(invoke, 0, 5);
        v.schedule(invoke, -10, 6);
        v.flush();
        chai_1.expect(invoked).to.deep.equal([6, 4, 1, 3, 5, 2]);
    });
    it('should support recursive scheduling', function () {
        var v = new rxjs_1.VirtualTimeScheduler();
        var count = 0;
        var expected = [100, 200, 300];
        v.schedule(function (state) {
            if (++count === 3) {
                return;
            }
            var virtualAction = this;
            chai_1.expect(virtualAction.delay).to.equal(expected.shift());
            this.schedule(state, virtualAction.delay);
        }, 100, 'test');
        v.flush();
        chai_1.expect(count).to.equal(3);
    });
    it('should not execute virtual actions that have been rescheduled before flush', function () {
        var v = new rxjs_1.VirtualTimeScheduler();
        var messages = [];
        var action = v.schedule(function (state) { return messages.push(state); }, 10, 'first message');
        action.schedule('second message', 10);
        v.flush();
        chai_1.expect(messages).to.deep.equal(['second message']);
    });
    it('should execute only those virtual actions that fall into the maxFrames timespan', function () {
        var MAX_FRAMES = 50;
        var v = new rxjs_1.VirtualTimeScheduler(rxjs_1.VirtualAction, MAX_FRAMES);
        var messages = ['first message', 'second message', 'third message'];
        var actualMessages = [];
        messages.forEach(function (message, index) {
            v.schedule(function (state) { return actualMessages.push(state); }, index * MAX_FRAMES, message);
        });
        v.flush();
        chai_1.expect(actualMessages).to.deep.equal(['first message', 'second message']);
        chai_1.expect(v.actions.map(function (a) { return a.state; })).to.deep.equal(['third message']);
    });
    it('should pick up actions execution where it left off after reaching previous maxFrames limit', function () {
        var MAX_FRAMES = 50;
        var v = new rxjs_1.VirtualTimeScheduler(rxjs_1.VirtualAction, MAX_FRAMES);
        var messages = ['first message', 'second message', 'third message'];
        var actualMessages = [];
        messages.forEach(function (message, index) {
            v.schedule(function (state) { return actualMessages.push(state); }, index * MAX_FRAMES, message);
        });
        v.flush();
        v.maxFrames = 2 * MAX_FRAMES;
        v.flush();
        chai_1.expect(actualMessages).to.deep.equal(messages);
    });
});
//# sourceMappingURL=VirtualTimeScheduler-spec.js.map