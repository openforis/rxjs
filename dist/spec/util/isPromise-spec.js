"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var chai_1 = require("chai");
var isPromise_1 = require("rxjs/internal/util/isPromise");
describe('isPromise', function () {
    it('should return true for new Promise', function () {
        var o = new Promise(function () { return null; });
        chai_1.expect(isPromise_1.isPromise(o)).to.be.true;
    });
    it('should return true for a Promise that comes from an Observable', function () {
        var o = rxjs_1.of(null).toPromise();
        chai_1.expect(isPromise_1.isPromise(o)).to.be.true;
    });
    it('should NOT return true for any Observable', function () {
        var o = rxjs_1.of(null);
        chai_1.expect(isPromise_1.isPromise(o)).to.be.false;
    });
    it('should return false for null', function () {
        chai_1.expect(isPromise_1.isPromise(null)).to.be.false;
    });
    it('should return false for undefined', function () {
        chai_1.expect(isPromise_1.isPromise(undefined)).to.be.false;
    });
    it('should return false for a number', function () {
        chai_1.expect(isPromise_1.isPromise(1)).to.be.false;
    });
    it('should return false for a string', function () {
        chai_1.expect(isPromise_1.isPromise('1')).to.be.false;
    });
});
//# sourceMappingURL=isPromise-spec.js.map