"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require("rxjs/ajax");
var chai_1 = require("chai");
describe('index', function () {
    it('should export static ajax observable creator functions', function () {
        chai_1.expect(index.ajax).to.exist;
    });
    it('should export Ajax data classes', function () {
        chai_1.expect(index.AjaxResponse).to.exist;
        chai_1.expect(index.AjaxError).to.exist;
        chai_1.expect(index.AjaxTimeoutError).to.exist;
        var ajaxRequest;
    });
});
//# sourceMappingURL=index-spec.js.map