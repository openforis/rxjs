"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var isNumeric_1 = require("rxjs/internal/util/isNumeric");
describe('isNumeric', function () {
    it('should cover the following numeric scenario', function () {
        chai_1.expect(isNumeric_1.isNumeric(' ')).to.be.false;
        chai_1.expect(isNumeric_1.isNumeric('\n')).to.be.false;
        chai_1.expect(isNumeric_1.isNumeric('\t')).to.be.false;
        chai_1.expect(isNumeric_1.isNumeric('0')).to.be.true;
        chai_1.expect(isNumeric_1.isNumeric(0)).to.be.true;
        chai_1.expect(isNumeric_1.isNumeric(-1)).to.be.true;
        chai_1.expect(isNumeric_1.isNumeric(-1.5)).to.be.true;
        chai_1.expect(isNumeric_1.isNumeric(6e6)).to.be.true;
        chai_1.expect(isNumeric_1.isNumeric('6e6')).to.be.true;
    });
});
//# sourceMappingURL=IsNumeric-spec.js.map