"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var rxjs_1 = require("rxjs");
describe('from (fromPromise)', function () {
    it('should emit one value from a resolved promise', function (done) {
        var promise = Promise.resolve(42);
        rxjs_1.from(promise)
            .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should raise error from a rejected promise', function (done) {
        var promise = Promise.reject('bad');
        rxjs_1.from(promise)
            .subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (e) {
            chai_1.expect(e).to.equal('bad');
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should share the underlying promise with multiple subscribers', function (done) {
        var promise = Promise.resolve(42);
        var observable = rxjs_1.from(promise);
        observable
            .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
            done(new Error('should not be called'));
        }, undefined);
        setTimeout(function () {
            observable
                .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                done();
            });
        });
    });
    it('should accept already-resolved Promise', function (done) {
        var promise = Promise.resolve(42);
        promise.then(function (x) {
            chai_1.expect(x).to.equal(42);
            rxjs_1.from(promise)
                .subscribe(function (y) { chai_1.expect(y).to.equal(42); }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                done();
            });
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should accept PromiseLike object for interoperability', function (done) {
        var CustomPromise = (function () {
            function CustomPromise(promise) {
                this.promise = promise;
            }
            CustomPromise.prototype.then = function (onFulfilled, onRejected) {
                return new CustomPromise(this.promise.then(onFulfilled, onRejected));
            };
            return CustomPromise;
        }());
        var promise = new CustomPromise(Promise.resolve(42));
        rxjs_1.from(promise)
            .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function () {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should emit a value from a resolved promise on a separate scheduler', function (done) {
        var promise = Promise.resolve(42);
        rxjs_1.from(promise, rxjs_1.asapScheduler)
            .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should raise error from a rejected promise on a separate scheduler', function (done) {
        var promise = Promise.reject('bad');
        rxjs_1.from(promise, rxjs_1.asapScheduler)
            .subscribe(function (x) { done(new Error('should not be called')); }, function (e) {
            chai_1.expect(e).to.equal('bad');
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should share the underlying promise with multiple subscribers on a separate scheduler', function (done) {
        var promise = Promise.resolve(42);
        var observable = rxjs_1.from(promise, rxjs_1.asapScheduler);
        observable
            .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
            done(new Error('should not be called'));
        }, undefined);
        setTimeout(function () {
            observable
                .subscribe(function (x) { chai_1.expect(x).to.equal(42); }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                done();
            });
        });
    });
    it('should not emit, throw or complete if immediately unsubscribed', function (done) {
        var nextSpy = sinon.spy();
        var throwSpy = sinon.spy();
        var completeSpy = sinon.spy();
        var promise = Promise.resolve(42);
        var subscription = rxjs_1.from(promise)
            .subscribe(nextSpy, throwSpy, completeSpy);
        subscription.unsubscribe();
        setTimeout(function () {
            chai_1.expect(nextSpy).not.have.been.called;
            chai_1.expect(throwSpy).not.have.been.called;
            chai_1.expect(completeSpy).not.have.been.called;
            done();
        });
    });
});
//# sourceMappingURL=from-promise-spec.js.map