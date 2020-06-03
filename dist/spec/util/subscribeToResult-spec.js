"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    it('should pass along errors from an iterable', function () {
        var generator = function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, 1];
                    case 1:
                        _a.sent();
                        return [4, 2];
                    case 2:
                        _a.sent();
                        return [4, 3];
                    case 3:
                        _a.sent();
                        throw 'bad';
                }
            });
        };
        var results = [];
        var foundError = null;
        var subscriber = new OuterSubscriber_1.OuterSubscriber({
            next: function (x) { return results.push(x); },
            error: function (err) { return foundError = err; }
        });
        subscribeToResult_1.subscribeToResult(subscriber, generator());
        chai_1.expect(results).to.deep.equal([1, 2, 3]);
        chai_1.expect(foundError).to.equal('bad');
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