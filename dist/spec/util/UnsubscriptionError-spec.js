"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('UnsubscriptionError', function () {
    it('should create a message that is a clear indication of its internal errors', function () {
        var err1 = new Error('Swiss cheese tastes amazing but smells like socks');
        var err2 = new Error('User too big to fit in tiny European elevator');
        var source1 = new rxjs_1.Observable(function () { return function () { throw err1; }; });
        var source2 = rxjs_1.timer(1000);
        var source3 = new rxjs_1.Observable(function () { return function () { throw err2; }; });
        var source = rxjs_1.merge(source1, source2, source3);
        var subscription = source.subscribe();
        try {
            subscription.unsubscribe();
        }
        catch (err) {
            chai_1.expect(err instanceof rxjs_1.UnsubscriptionError).to.equal(true);
            chai_1.expect(err.errors).to.deep.equal([err1, err2]);
            chai_1.expect(err.name).to.equal('UnsubscriptionError');
        }
    });
});
//# sourceMappingURL=UnsubscriptionError-spec.js.map