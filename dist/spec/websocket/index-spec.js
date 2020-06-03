"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require("rxjs/webSocket");
var chai_1 = require("chai");
describe('index', function () {
    it('should export static websocket subject creator functions', function () {
        chai_1.expect(index.webSocket).to.exist;
    });
});
//# sourceMappingURL=index-spec.js.map