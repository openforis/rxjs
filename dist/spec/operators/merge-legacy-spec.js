"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var chai_1 = require("chai");
describe('merge (legacy)', function () {
    it('should merge an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [1, 2, 4, 3, 5, 6, 7, 8];
        a.pipe(operators_1.merge(b, rxjs_1.queueScheduler)).subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
});
//# sourceMappingURL=merge-legacy-spec.js.map