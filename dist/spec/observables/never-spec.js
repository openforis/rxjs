"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
describe('NEVER', function () {
    it('should create a cold observable that never emits', function () {
        var expected = '-';
        var e1 = rxjs_1.NEVER;
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should return the same instance every time', function () {
        chai_1.expect(rxjs_1.NEVER).to.equal(rxjs_1.NEVER);
    });
});
//# sourceMappingURL=never-spec.js.map