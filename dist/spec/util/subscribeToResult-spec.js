"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var OuterSubscriber_1 = require("rxjs/internal/OuterSubscriber");
var subscribeToResult_1 = require("rxjs/internal/util/subscribeToResult");
var iterator_1 = require("rxjs/internal/symbol/iterator");
var observable_1 = require("rxjs/internal/symbol/observable");
var rxjs_1 = require("rxjs");
describe('subscribeToResult', function () {
    it('should synchronously complete when subscribed to scalarObservable', function () {
        var result = rxjs_1.of(42);
        var expected;
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) { return expected = x; });
        var subscription = subscribeToResult_1.subscribeToResult(subscriber, result);
        chai_1.expect(expected).to.be.equal(42);
        chai_1.expect(subscription.closed).to.be.true;
    });
    it('should subscribe to observables that are an instanceof Observable', function (done) {
        var expected = [1, 2, 3];
        var result = rxjs_1.range(1, 3);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            chai_1.expect(expected.shift()).to.be.equal(x);
        }, function () {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected).to.be.empty;
            done();
        });
        subscribeToResult_1.subscribeToResult(subscriber, result);
    });
    it('should emit error when observable emits error', function (done) {
        var result = rxjs_1.throwError(new Error('error'));
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(err).to.be.an('error', 'error');
            done();
        }, function () {
            done(new Error('should not be called'));
        });
        subscribeToResult_1.subscribeToResult(subscriber, result);
    });
    it('should subscribe to an array and emit synchronously', function () {
        var result = [1, 2, 3];
        var expected = [];
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) { return expected.push(x); });
        subscribeToResult_1.subscribeToResult(subscriber, result);
        chai_1.expect(expected).to.be.deep.equal(result);
    });
    it('should subscribe to an array-like and emit synchronously', function () {
        var result = { 0: 0, 1: 1, 2: 2, length: 3 };
        var expected = [];
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) { return expected.push(x); });
        subscribeToResult_1.subscribeToResult(subscriber, result);
        chai_1.expect(expected).to.be.deep.equal([0, 1, 2]);
    });
    it('should subscribe to a promise', function (done) {
        var result = Promise.resolve(42);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            chai_1.expect(x).to.be.equal(42);
        }, function () {
            done(new Error('should not be called'));
        }, done);
        subscribeToResult_1.subscribeToResult(subscriber, result);
    });
    it('should emits error when the promise rejects', function (done) {
        var result = Promise.reject(42);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            done(new Error('should not be called'));
        }, function (x) {
            chai_1.expect(x).to.be.equal(42);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
        subscribeToResult_1.subscribeToResult(subscriber, result);
    });
    it('should subscribe an iterable and emit results synchronously', function () {
        var _a;
        var expected;
        var iteratorResults = [
            { value: 42, done: false },
            { done: true }
        ];
        var iterable = (_a = {},
            _a[iterator_1.iterator] = function () {
                return {
                    next: function () {
                        return iteratorResults.shift();
                    }
                };
            },
            _a);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) { return expected = x; });
        subscribeToResult_1.subscribeToResult(subscriber, iterable);
        chai_1.expect(expected).to.be.equal(42);
    });
    it('should subscribe to to an object that implements Symbol.observable', function (done) {
        var _a;
        var observableSymbolObject = (_a = {}, _a[observable_1.observable] = function () { return rxjs_1.of(42); }, _a);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            chai_1.expect(x).to.be.equal(42);
        }, function () {
            done(new Error('should not be called'));
        }, done);
        subscribeToResult_1.subscribeToResult(subscriber, observableSymbolObject);
    });
    it('should throw an error if value returned by Symbol.observable call is not ' +
        'a valid observable', function () {
        var _a;
        var observableSymbolObject = (_a = {}, _a[observable_1.observable] = function () { return ({}); }, _a);
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            throw new Error('should not be called');
        }, function (x) {
            throw new Error('should not be called');
        }, function () {
            throw new Error('should not be called');
        });
        chai_1.expect(function () { return subscribeToResult_1.subscribeToResult(subscriber, observableSymbolObject); })
            .to.throw(TypeError, 'Provided object does not correctly implement Symbol.observable');
    });
    it('should emit an error when trying to subscribe to an unknown type of object', function () {
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            throw new Error('should not be called');
        }, function (x) {
            throw new Error('should not be called');
        }, function () {
            throw new Error('should not be called');
        });
        chai_1.expect(function () { return subscribeToResult_1.subscribeToResult(subscriber, {}); })
            .to.throw(TypeError, 'You provided an invalid object where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.');
    });
    it('should emit an error when trying to subscribe to a non-object', function () {
        var subscriber = new OuterSubscriber_1.OuterSubscriber(function (x) {
            throw new Error('should not be called');
        }, function (x) {
            throw new Error('should not be called');
        }, function () {
            throw new Error('should not be called');
        });
        chai_1.expect(function () { return subscribeToResult_1.subscribeToResult(subscriber, null); })
            .to.throw(TypeError, "You provided 'null' where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.");
    });
});
//# sourceMappingURL=subscribeToResult-spec.js.map