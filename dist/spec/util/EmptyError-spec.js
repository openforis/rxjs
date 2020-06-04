"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('EmptyError', function () {
    var error = new rxjs_1.EmptyError();
    it('Should have a name', function () {
        chai_1.expect(error.name).to.be.equal('EmptyError');
    });
    it('Should have a message', function () {
        chai_1.expect(error.message).to.be.equal('no elements in sequence');
    });
});
//# sourceMappingURL=EmptyError-spec.js.map