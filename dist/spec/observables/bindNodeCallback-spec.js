"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var rxjs_1 = require("rxjs");
describe('bindNodeCallback', function () {
    describe('when not scheduled', function () {
        it('should emit undefined when callback is called without success arguments', function () {
            function callback(cb) {
                cb(null);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback);
            var results = [];
            boundCallback()
                .subscribe(function (x) {
                results.push(typeof x);
            }, null, function () {
                results.push('done');
            });
            chai_1.expect(results).to.deep.equal(['undefined', 'done']);
        });
        it('should support the deprecated resultSelector', function () {
            function callback(cb) {
                cb(null, 42);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, function (x) { return x + 1; });
            var results = [];
            boundCallback()
                .subscribe(function (x) {
                results.push(x);
            }, null, function () {
                results.push('done');
            });
            chai_1.expect(results).to.deep.equal([43, 'done']);
        });
        it('should emit one value from a callback', function () {
            function callback(datum, cb) {
                cb(null, datum);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback);
            var results = [];
            boundCallback(42)
                .subscribe(function (x) {
                results.push(x);
            }, null, function () {
                results.push('done');
            });
            chai_1.expect(results).to.deep.equal([42, 'done']);
        });
        it('should set context of callback to context of boundCallback', function () {
            function callback(cb) {
                cb(null, this.datum);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback);
            var results = [];
            boundCallback.call({ datum: 42 })
                .subscribe(function (x) { return results.push(x); }, null, function () { return results.push('done'); });
            chai_1.expect(results).to.deep.equal([42, 'done']);
        });
        it('should raise error from callback', function () {
            var error = new Error();
            function callback(cb) {
                cb(error);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback);
            var results = [];
            boundCallback()
                .subscribe(function () {
                throw new Error('should not next');
            }, function (err) {
                results.push(err);
            }, function () {
                throw new Error('should not complete');
            });
            chai_1.expect(results).to.deep.equal([error]);
        });
        it('should not emit, throw or complete if immediately unsubscribed', function (done) {
            var nextSpy = sinon.spy();
            var throwSpy = sinon.spy();
            var completeSpy = sinon.spy();
            var timeout;
            function callback(datum, cb) {
                timeout = setTimeout(function () {
                    cb(null, datum);
                });
            }
            var subscription = rxjs_1.bindNodeCallback(callback)(42)
                .subscribe(nextSpy, throwSpy, completeSpy);
            subscription.unsubscribe();
            setTimeout(function () {
                chai_1.expect(nextSpy).not.have.been.called;
                chai_1.expect(throwSpy).not.have.been.called;
                chai_1.expect(completeSpy).not.have.been.called;
                clearTimeout(timeout);
                done();
            });
        });
    });
    describe('when scheduled', function () {
        it('should emit undefined when callback is called without success arguments', function () {
            function callback(cb) {
                cb(null);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
            var results = [];
            boundCallback()
                .subscribe(function (x) {
                results.push(typeof x);
            }, null, function () {
                results.push('done');
            });
            rxTestScheduler.flush();
            chai_1.expect(results).to.deep.equal(['undefined', 'done']);
        });
        it('should emit one value from a callback', function () {
            function callback(datum, cb) {
                cb(null, datum);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
            var results = [];
            boundCallback(42)
                .subscribe(function (x) {
                results.push(x);
            }, null, function () {
                results.push('done');
            });
            rxTestScheduler.flush();
            chai_1.expect(results).to.deep.equal([42, 'done']);
        });
        it('should set context of callback to context of boundCallback', function () {
            function callback(cb) {
                cb(null, this.datum);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
            var results = [];
            boundCallback.call({ datum: 42 })
                .subscribe(function (x) { return results.push(x); }, null, function () { return results.push('done'); });
            rxTestScheduler.flush();
            chai_1.expect(results).to.deep.equal([42, 'done']);
        });
        it('should error if callback throws', function () {
            var expected = new Error('haha no callback for you');
            function callback(datum, cb) {
                throw expected;
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
            boundCallback(42)
                .subscribe(function (x) {
                throw new Error('should not next');
            }, function (err) {
                chai_1.expect(err).to.equal(expected);
            }, function () {
                throw new Error('should not complete');
            });
            rxTestScheduler.flush();
        });
        it('should raise error from callback', function () {
            var error = new Error();
            function callback(cb) {
                cb(error);
            }
            var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
            var results = [];
            boundCallback()
                .subscribe(function () {
                throw new Error('should not next');
            }, function (err) {
                results.push(err);
            }, function () {
                throw new Error('should not complete');
            });
            rxTestScheduler.flush();
            chai_1.expect(results).to.deep.equal([error]);
        });
    });
    it('should pass multiple inner arguments as an array', function () {
        function callback(datum, cb) {
            cb(null, datum, 1, 2, 3);
        }
        var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
        var results = [];
        boundCallback(42)
            .subscribe(function (x) {
            results.push(x);
        }, null, function () {
            results.push('done');
        });
        rxTestScheduler.flush();
        chai_1.expect(results).to.deep.equal([[42, 1, 2, 3], 'done']);
    });
    it('should cache value for next subscription and not call callbackFunc again', function () {
        var calls = 0;
        function callback(datum, cb) {
            calls++;
            cb(null, datum);
        }
        var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
        var results1 = [];
        var results2 = [];
        var source = boundCallback(42);
        source.subscribe(function (x) {
            results1.push(x);
        }, null, function () {
            results1.push('done');
        });
        source.subscribe(function (x) {
            results2.push(x);
        }, null, function () {
            results2.push('done');
        });
        rxTestScheduler.flush();
        chai_1.expect(calls).to.equal(1);
        chai_1.expect(results1).to.deep.equal([42, 'done']);
        chai_1.expect(results2).to.deep.equal([42, 'done']);
    });
    it('should not swallow post-callback errors', function () {
        function badFunction(callback) {
            callback(null, 42);
            throw new Error('kaboom');
        }
        var consoleStub = sinon.stub(console, 'warn');
        try {
            rxjs_1.bindNodeCallback(badFunction)().subscribe();
            chai_1.expect(consoleStub).to.have.property('called', true);
        }
        finally {
            consoleStub.restore();
        }
    });
});
//# sourceMappingURL=bindNodeCallback-spec.js.map