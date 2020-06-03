"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('Scheduler.queue', function () {
    it('should schedule things recursively', function () {
        var call1 = false;
        var call2 = false;
        rxjs_1.queueScheduler.active = false;
        rxjs_1.queueScheduler.schedule(function () {
            call1 = true;
            rxjs_1.queueScheduler.schedule(function () {
                call2 = true;
            });
        });
        chai_1.expect(call1).to.be.true;
        chai_1.expect(call2).to.be.true;
    });
    it('should schedule things recursively via this.schedule', function () {
        var call1 = false;
        var call2 = false;
        rxjs_1.queueScheduler.active = false;
        rxjs_1.queueScheduler.schedule(function (state) {
            call1 = state.call1;
            call2 = state.call2;
            if (!call2) {
                this.schedule({ call1: true, call2: true });
            }
        }, 0, { call1: true, call2: false });
        chai_1.expect(call1).to.be.true;
        chai_1.expect(call2).to.be.true;
    });
    it('should schedule things in the future too', function (done) {
        var called = false;
        rxjs_1.queueScheduler.schedule(function () {
            called = true;
        }, 60);
        setTimeout(function () {
            chai_1.expect(called).to.be.false;
        }, 20);
        setTimeout(function () {
            chai_1.expect(called).to.be.true;
            done();
        }, 100);
    });
    it('should be reusable after an error is thrown during execution', function (done) {
        var results = [];
        chai_1.expect(function () {
            rxjs_1.queueScheduler.schedule(function () {
                results.push(1);
            });
            rxjs_1.queueScheduler.schedule(function () {
                throw new Error('bad');
            });
        }).to.throw(Error, 'bad');
        setTimeout(function () {
            rxjs_1.queueScheduler.schedule(function () {
                results.push(2);
                done();
            });
        }, 0);
    });
});
//# sourceMappingURL=Scheduler-spec.js.map