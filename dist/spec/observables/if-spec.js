"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('iif', function () {
    it('should subscribe to thenSource when the conditional returns true', function () {
        var e1 = rxjs_1.iif(function () { return true; }, rxjs_1.of('a'));
        var expected = '(a|)';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should subscribe to elseSource when the conditional returns false', function () {
        var e1 = rxjs_1.iif(function () { return false; }, rxjs_1.of('a'), rxjs_1.of('b'));
        var expected = '(b|)';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should complete without an elseSource when the conditional returns false', function () {
        var e1 = rxjs_1.iif(function () { return false; }, rxjs_1.of('a'));
        var expected = '|';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should raise error when conditional throws', function () {
        var e1 = rxjs_1.iif((function () {
            throw 'error';
        }), rxjs_1.of('a'));
        var expected = '#';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should accept resolved promise as thenSource', function (done) {
        var expected = 42;
        var e1 = rxjs_1.iif(function () { return true; }, new Promise(function (resolve) { resolve(expected); }));
        e1.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should accept resolved promise as elseSource', function (done) {
        var expected = 42;
        var e1 = rxjs_1.iif(function () { return false; }, rxjs_1.of('a'), new Promise(function (resolve) { resolve(expected); }));
        e1.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should accept rejected promise as elseSource', function (done) {
        var expected = 42;
        var e1 = rxjs_1.iif(function () { return false; }, rxjs_1.of('a'), new Promise(function (resolve, reject) { reject(expected); }));
        e1.subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (x) {
            chai_1.expect(x).to.equal(expected);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should accept rejected promise as thenSource', function (done) {
        var expected = 42;
        var e1 = rxjs_1.iif(function () { return true; }, new Promise(function (resolve, reject) { reject(expected); }));
        e1.subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (x) {
            chai_1.expect(x).to.equal(expected);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
});
//# sourceMappingURL=if-spec.js.map