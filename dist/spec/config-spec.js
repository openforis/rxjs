"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../src/internal/config");
var chai_1 = require("chai");
describe('config', function () {
    it('should have a Promise property that defaults to nothing', function () {
        chai_1.expect(config_1.config).to.have.property('Promise');
        chai_1.expect(config_1.config.Promise).to.be.undefined;
    });
});
//# sourceMappingURL=config-spec.js.map