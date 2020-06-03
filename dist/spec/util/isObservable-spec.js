"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var chai_1 = require("chai");
describe('isObservable', function () {
    it('should return true for RxJS Observable', function () {
        var o = new rxjs_1.Observable();
        chai_1.expect(rxjs_1.isObservable(o)).to.be.true;
    });
    it('should return true for an observable that comes from another RxJS 5+ library', function () {
        var o = {
            lift: function () { },
            subscribe: function () { },
        };
        chai_1.expect(rxjs_1.isObservable(o)).to.be.true;
    });
    it('should NOT return true for any old subscribable', function () {
        var o = {
            subscribe: function () { },
        };
        chai_1.expect(rxjs_1.isObservable(o)).to.be.false;
    });
    it('should return false for null', function () {
        chai_1.expect(rxjs_1.isObservable(null)).to.be.false;
    });
    it('should return false for a number', function () {
        chai_1.expect(rxjs_1.isObservable(1)).to.be.false;
    });
});
//# sourceMappingURL=isObservable-spec.js.map