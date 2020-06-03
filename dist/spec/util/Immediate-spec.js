"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Immediate_1 = require("../../src/internal/util/Immediate");
describe('Immediate', function () {
    it('should schedule on the next microtask', function (done) {
        var results = [];
        results.push(1);
        setTimeout(function () { return results.push(5); });
        Immediate_1.Immediate.setImmediate(function () { return results.push(3); });
        results.push(2);
        Promise.resolve().then(function () { return results.push(4); });
        setTimeout(function () {
            chai_1.expect(results).to.deep.equal([1, 2, 3, 4, 5]);
            done();
        });
    });
    it('should cancel the task with clearImmediate', function (done) {
        var results = [];
        results.push(1);
        setTimeout(function () { return results.push(5); });
        var handle = Immediate_1.Immediate.setImmediate(function () { return results.push(3); });
        Immediate_1.Immediate.clearImmediate(handle);
        results.push(2);
        Promise.resolve().then(function () { return results.push(4); });
        setTimeout(function () {
            chai_1.expect(results).to.deep.equal([1, 2, 4, 5]);
            done();
        });
    });
    it('should clear the task after execution', function (done) {
        var results = [];
        Immediate_1.Immediate.setImmediate(function () { return results.push(1); });
        Immediate_1.Immediate.setImmediate(function () { return results.push(2); });
        setTimeout(function () {
            var number = Immediate_1.TestTools.pending();
            chai_1.expect(number).to.equal(0);
            done();
        });
    });
});
//# sourceMappingURL=Immediate-spec.js.map