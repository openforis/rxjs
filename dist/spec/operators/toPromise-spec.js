"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('Observable.toPromise', function () {
    it('should convert an Observable to a promise of its last value', function (done) {
        rxjs_1.of(1, 2, 3).toPromise(Promise).then(function (x) {
            chai_1.expect(x).to.equal(3);
            done();
        });
    });
    it('should convert an empty Observable to a promise of undefined', function (done) {
        rxjs_1.EMPTY.toPromise(Promise).then(function (x) {
            chai_1.expect(x).to.be.undefined;
            done();
        });
    });
    it('should handle errors properly', function (done) {
        rxjs_1.throwError('bad').toPromise(Promise).then(function () {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(err).to.equal('bad');
            done();
        });
    });
    it('should allow for global config via config.Promise', function (done) {
        var wasCalled = false;
        rxjs_1.config.Promise = function MyPromise(callback) {
            wasCalled = true;
            return new Promise(callback);
        };
        rxjs_1.of(42).toPromise().then(function (x) {
            chai_1.expect(wasCalled).to.be.true;
            chai_1.expect(x).to.equal(42);
            done();
        });
    });
});
//# sourceMappingURL=toPromise-spec.js.map