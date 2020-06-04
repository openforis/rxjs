"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('throwError', function () {
    asDiagram('throw(e)')('should create a cold observable that just emits an error', function () {
        var expected = '#';
        var e1 = rxjs_1.throwError('error');
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should emit one value', function (done) {
        var calls = 0;
        rxjs_1.throwError('bad').subscribe(function () {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(++calls).to.equal(1);
            chai_1.expect(err).to.equal('bad');
            done();
        });
    });
    it('should accept scheduler', function () {
        var e = rxjs_1.throwError('error', rxTestScheduler);
        marble_testing_1.expectObservable(e).toBe('#');
    });
});
//# sourceMappingURL=throwError-spec.js.map