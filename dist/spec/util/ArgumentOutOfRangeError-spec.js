"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('ArgumentOutOfRangeError', function () {
    var error = new rxjs_1.ArgumentOutOfRangeError();
    it('Should have a name', function () {
        chai_1.expect(error.name).to.be.equal('ArgumentOutOfRangeError');
    });
    it('Should have a message', function () {
        chai_1.expect(error.message).to.be.equal('argument out of range');
    });
});
//# sourceMappingURL=ArgumentOutOfRangeError-spec.js.map