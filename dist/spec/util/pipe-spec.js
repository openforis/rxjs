"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('pipe', function () {
    it('should exist', function () {
        chai_1.expect(rxjs_1.pipe).to.be.a('function');
    });
    it('should pipe two functions together', function () {
        var a = function (x) { return x + x; };
        var b = function (x) { return x - 1; };
        var c = rxjs_1.pipe(a, b);
        chai_1.expect(c).to.be.a('function');
        chai_1.expect(c(1)).to.equal(1);
        chai_1.expect(c(10)).to.equal(19);
    });
    it('should return the same function if only one is passed', function () {
        var a = function (x) { return x; };
        var c = rxjs_1.pipe(a);
        chai_1.expect(c).to.equal(a);
    });
    it('should return the identity if not passed any functions', function () {
        var c = rxjs_1.pipe();
        chai_1.expect(c('whatever')).to.equal('whatever');
        var someObj = {};
        chai_1.expect(c(someObj)).to.equal(someObj);
    });
});
//# sourceMappingURL=pipe-spec.js.map