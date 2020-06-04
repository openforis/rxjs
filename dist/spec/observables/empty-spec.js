"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('empty', function () {
    asDiagram('empty')('should create a cold observable with only complete', function () {
        var expected = '|';
        var e1 = rxjs_1.empty();
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should return the same instance EMPTY', function () {
        var s1 = rxjs_1.empty();
        var s2 = rxjs_1.empty();
        chai_1.expect(s1).to.equal(s2);
    });
    it('should be synchronous by default', function () {
        var source = rxjs_1.empty();
        var hit = false;
        source.subscribe({
            complete: function () { hit = true; }
        });
        chai_1.expect(hit).to.be.true;
    });
    it('should equal EMPTY', function () {
        chai_1.expect(rxjs_1.empty()).to.equal(rxjs_1.EMPTY);
    });
    it('should take a scheduler', function () {
        var source = rxjs_1.empty(rxTestScheduler);
        var hit = false;
        source.subscribe({
            complete: function () { hit = true; }
        });
        chai_1.expect(hit).to.be.false;
        rxTestScheduler.flush();
        chai_1.expect(hit).to.be.true;
    });
});
//# sourceMappingURL=empty-spec.js.map