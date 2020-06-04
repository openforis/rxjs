"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var canReportError_1 = require("rxjs/internal/util/canReportError");
describe('canReportError', function () {
    it('should report errors to an observer if possible', function () {
        var subscriber = new rxjs_1.Subscriber(rxjs_1.noop, rxjs_1.noop);
        chai_1.expect(canReportError_1.canReportError(subscriber)).to.be.true;
    });
    it('should not report errors to a stopped observer', function () {
        var subscriber = new rxjs_1.Subscriber(rxjs_1.noop, rxjs_1.noop);
        subscriber.error(new Error('kaboom'));
        chai_1.expect(canReportError_1.canReportError(subscriber)).to.be.false;
    });
    it('should not report errors to a closed subject', function () {
        var subject = new rxjs_1.Subject();
        subject.unsubscribe();
        chai_1.expect(canReportError_1.canReportError(subject)).to.be.false;
    });
    it('should not report errors an observer with a stopped destination', function () {
        var destination = new rxjs_1.Subscriber(rxjs_1.noop, rxjs_1.noop);
        var subscriber = new rxjs_1.Subscriber(destination);
        destination.error(new Error('kaboom'));
        chai_1.expect(canReportError_1.canReportError(subscriber)).to.be.false;
    });
});
//# sourceMappingURL=canReportError-spec.js.map