"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var marble_testing_1 = require("./helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function expectFullObserver(val) {
    chai_1.expect(val).to.be.a('object');
    chai_1.expect(val.next).to.be.a('function');
    chai_1.expect(val.error).to.be.a('function');
    chai_1.expect(val.complete).to.be.a('function');
    chai_1.expect(val.closed).to.be.a('boolean');
}
describe('Observable', function () {
    var originalConfigPromise;
    before(function () { return originalConfigPromise = rxjs_1.config.Promise; });
    after(function () {
        rxjs_1.config.Promise = originalConfigPromise;
        originalConfigPromise = null;
    });
    it('should be constructed with a subscriber function', function (done) {
        var source = new rxjs_1.Observable(function (observer) {
            expectFullObserver(observer);
            observer.next(1);
            observer.complete();
        });
        source.subscribe(function (x) { chai_1.expect(x).to.equal(1); }, null, done);
    });
    it('should send errors thrown in the constructor down the error path', function (done) {
        new rxjs_1.Observable(function (observer) {
            throw new Error('this should be handled');
        })
            .subscribe({
            error: function (err) {
                chai_1.expect(err).to.exist
                    .and.be.instanceof(Error)
                    .and.have.property('message', 'this should be handled');
                done();
            }
        });
    });
    it('should allow empty ctor, which is effectively a never-observable', function () {
        var result = new rxjs_1.Observable();
        marble_testing_1.expectObservable(result).toBe('-');
    });
    describe('forEach', function () {
        it('should iterate and return a Promise', function (done) {
            var expected = [1, 2, 3];
            var result = rxjs_1.of(1, 2, 3).forEach(function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            }, Promise)
                .then(function () {
                done();
            });
            chai_1.expect(result.then).to.be.a('function');
        });
        it('should reject promise when in error', function (done) {
            rxjs_1.throwError('bad').forEach(function (x) {
                done(new Error('should not be called'));
            }, Promise).then(function () {
                done(new Error('should not complete'));
            }, function (err) {
                chai_1.expect(err).to.equal('bad');
                done();
            });
        });
        it('should allow Promise to be globally configured', function (done) {
            var wasCalled = false;
            rxjs_1.config.Promise = function MyPromise(callback) {
                wasCalled = true;
                return new Promise(callback);
            };
            rxjs_1.of(42).forEach(function (x) {
                chai_1.expect(x).to.equal(42);
            }).then(function () {
                chai_1.expect(wasCalled).to.be.true;
                done();
            });
        });
        it('should reject promise if nextHandler throws', function (done) {
            var results = [];
            rxjs_1.of(1, 2, 3).forEach(function (x) {
                if (x === 3) {
                    throw new Error('NO THREES!');
                }
                results.push(x);
            }, Promise)
                .then(function () {
                done(new Error('should not be called'));
            }, function (err) {
                chai_1.expect(err).to.be.an('error', 'NO THREES!');
                chai_1.expect(results).to.deep.equal([1, 2]);
            }).then(function () {
                done();
            });
        });
        it('should handle a synchronous throw from the next handler', function () {
            var expected = new Error('I told, you Bobby Boucher, threes are the debil!');
            var syncObservable = new rxjs_1.Observable(function (observer) {
                observer.next(1);
                observer.next(2);
                observer.next(3);
                observer.next(4);
            });
            var results = [];
            return syncObservable.forEach(function (x) {
                results.push(x);
                if (x === 3) {
                    throw expected;
                }
            }).then(function () {
                throw new Error('should not be called');
            }, function (err) {
                results.push(err);
                chai_1.expect(results).to.deep.equal([1, 2, 3, 4, expected]);
            });
        });
        it('should handle an asynchronous throw from the next handler and tear down', function () {
            var expected = new Error('I told, you Bobby Boucher, twos are the debil!');
            var asyncObservable = new rxjs_1.Observable(function (observer) {
                var i = 1;
                var id = setInterval(function () { return observer.next(i++); }, 1);
                return function () {
                    clearInterval(id);
                };
            });
            var results = [];
            return asyncObservable.forEach(function (x) {
                results.push(x);
                if (x === 2) {
                    throw expected;
                }
            }).then(function () {
                throw new Error('should not be called');
            }, function (err) {
                results.push(err);
                chai_1.expect(results).to.deep.equal([1, 2, expected]);
            });
        });
    });
    describe('subscribe', function () {
        it('should be synchronous', function () {
            var subscribed = false;
            var nexted;
            var completed;
            var source = new rxjs_1.Observable(function (observer) {
                subscribed = true;
                observer.next('wee');
                chai_1.expect(nexted).to.equal('wee');
                observer.complete();
                chai_1.expect(completed).to.be.true;
            });
            chai_1.expect(subscribed).to.be.false;
            var mutatedByNext = false;
            var mutatedByComplete = false;
            source.subscribe(function (x) {
                nexted = x;
                mutatedByNext = true;
            }, null, function () {
                completed = true;
                mutatedByComplete = true;
            });
            chai_1.expect(mutatedByNext).to.be.true;
            chai_1.expect(mutatedByComplete).to.be.true;
        });
        it('should work when subscribe is called with no arguments', function () {
            var source = new rxjs_1.Observable(function (subscriber) {
                subscriber.next('foo');
                subscriber.complete();
            });
            source.subscribe();
        });
        it('should not be unsubscribed when other empty subscription completes', function () {
            var unsubscribeCalled = false;
            var source = new rxjs_1.Observable(function () {
                return function () {
                    unsubscribeCalled = true;
                };
            });
            source.subscribe();
            chai_1.expect(unsubscribeCalled).to.be.false;
            rxjs_1.empty().subscribe();
            chai_1.expect(unsubscribeCalled).to.be.false;
        });
        it('should not be unsubscribed when other subscription with same observer completes', function () {
            var unsubscribeCalled = false;
            var source = new rxjs_1.Observable(function () {
                return function () {
                    unsubscribeCalled = true;
                };
            });
            var observer = {
                next: function () { }
            };
            source.subscribe(observer);
            chai_1.expect(unsubscribeCalled).to.be.false;
            rxjs_1.empty().subscribe(observer);
            chai_1.expect(unsubscribeCalled).to.be.false;
        });
        it('should run unsubscription logic when an error is sent asynchronously and subscribe is called with no arguments', function (done) {
            var sandbox = sinon.createSandbox();
            var fakeTimer = sandbox.useFakeTimers();
            var unsubscribeCalled = false;
            var source = new rxjs_1.Observable(function (observer) {
                var id = setInterval(function () {
                    observer.error(0);
                }, 1);
                return function () {
                    clearInterval(id);
                    unsubscribeCalled = true;
                };
            });
            source.subscribe({
                error: function (err) {
                }
            });
            setTimeout(function () {
                var err;
                var errHappened = false;
                try {
                    chai_1.expect(unsubscribeCalled).to.be.true;
                }
                catch (e) {
                    err = e;
                    errHappened = true;
                }
                finally {
                    if (!errHappened) {
                        done();
                    }
                    else {
                        done(err);
                    }
                }
            }, 100);
            fakeTimer.tick(110);
            sandbox.restore();
        });
        it('should return a Subscription that calls the unsubscribe function returned by the subscriber', function () {
            var unsubscribeCalled = false;
            var source = new rxjs_1.Observable(function () {
                return function () {
                    unsubscribeCalled = true;
                };
            });
            var sub = source.subscribe(function () {
            });
            chai_1.expect(sub instanceof rxjs_1.Subscription).to.be.true;
            chai_1.expect(unsubscribeCalled).to.be.false;
            chai_1.expect(sub.unsubscribe).to.be.a('function');
            sub.unsubscribe();
            chai_1.expect(unsubscribeCalled).to.be.true;
        });
        it('should ignore next messages after unsubscription', function (done) {
            var times = 0;
            var subscription = new rxjs_1.Observable(function (observer) {
                var i = 0;
                var id = setInterval(function () {
                    observer.next(i++);
                });
                return function () {
                    clearInterval(id);
                    chai_1.expect(times).to.equal(2);
                    done();
                };
            })
                .pipe(operators_1.tap(function () { return times += 1; }))
                .subscribe(function () {
                if (times === 2) {
                    subscription.unsubscribe();
                }
            });
        });
        it('should ignore error messages after unsubscription', function (done) {
            var times = 0;
            var errorCalled = false;
            var subscription = new rxjs_1.Observable(function (observer) {
                var i = 0;
                var id = setInterval(function () {
                    observer.next(i++);
                    if (i === 3) {
                        observer.error(new Error());
                    }
                });
                return function () {
                    clearInterval(id);
                    chai_1.expect(times).to.equal(2);
                    chai_1.expect(errorCalled).to.be.false;
                    done();
                };
            })
                .pipe(operators_1.tap(function () { return times += 1; }))
                .subscribe(function () {
                if (times === 2) {
                    subscription.unsubscribe();
                }
            }, function () { errorCalled = true; });
        });
        it('should ignore complete messages after unsubscription', function (done) {
            var times = 0;
            var completeCalled = false;
            var subscription = new rxjs_1.Observable(function (observer) {
                var i = 0;
                var id = setInterval(function () {
                    observer.next(i++);
                    if (i === 3) {
                        observer.complete();
                    }
                });
                return function () {
                    clearInterval(id);
                    chai_1.expect(times).to.equal(2);
                    chai_1.expect(completeCalled).to.be.false;
                    done();
                };
            })
                .pipe(operators_1.tap(function () { return times += 1; }))
                .subscribe(function () {
                if (times === 2) {
                    subscription.unsubscribe();
                }
            }, null, function () { completeCalled = true; });
        });
        describe('when called with an anonymous observer', function () {
            it('should accept an anonymous observer with just a next function and call the next function in the context' +
                ' of the anonymous observer', function (done) {
                var o = {
                    myValue: 'foo',
                    next: function (x) {
                        chai_1.expect(this.myValue).to.equal('foo');
                        chai_1.expect(x).to.equal(1);
                        done();
                    }
                };
                rxjs_1.of(1).subscribe(o);
            });
            it('should accept an anonymous observer with just an error function and call the error function in the context' +
                ' of the anonymous observer', function (done) {
                var o = {
                    myValue: 'foo',
                    error: function (err) {
                        chai_1.expect(this.myValue).to.equal('foo');
                        chai_1.expect(err).to.equal('bad');
                        done();
                    }
                };
                rxjs_1.throwError('bad').subscribe(o);
            });
            it('should accept an anonymous observer with just a complete function and call the complete function in the' +
                ' context of the anonymous observer', function (done) {
                var o = {
                    myValue: 'foo',
                    complete: function complete() {
                        chai_1.expect(this.myValue).to.equal('foo');
                        done();
                    }
                };
                rxjs_1.empty().subscribe(o);
            });
            it('should accept an anonymous observer with no functions at all', function () {
                chai_1.expect(function () {
                    rxjs_1.empty().subscribe({});
                }).not.to.throw();
            });
            it('should ignore next messages after unsubscription', function (done) {
                var times = 0;
                var subscription = new rxjs_1.Observable(function (observer) {
                    var i = 0;
                    var id = setInterval(function () {
                        observer.next(i++);
                    });
                    return function () {
                        clearInterval(id);
                        chai_1.expect(times).to.equal(2);
                        done();
                    };
                })
                    .pipe(operators_1.tap(function () { return times += 1; }))
                    .subscribe({
                    next: function () {
                        if (times === 2) {
                            subscription.unsubscribe();
                        }
                    }
                });
            });
            it('should ignore error messages after unsubscription', function (done) {
                var times = 0;
                var errorCalled = false;
                var subscription = new rxjs_1.Observable(function (observer) {
                    var i = 0;
                    var id = setInterval(function () {
                        observer.next(i++);
                        if (i === 3) {
                            observer.error(new Error());
                        }
                    });
                    return function () {
                        clearInterval(id);
                        chai_1.expect(times).to.equal(2);
                        chai_1.expect(errorCalled).to.be.false;
                        done();
                    };
                })
                    .pipe(operators_1.tap(function () { return times += 1; }))
                    .subscribe({
                    next: function () {
                        if (times === 2) {
                            subscription.unsubscribe();
                        }
                    },
                    error: function () { errorCalled = true; }
                });
            });
            it('should ignore complete messages after unsubscription', function (done) {
                var times = 0;
                var completeCalled = false;
                var subscription = new rxjs_1.Observable(function (observer) {
                    var i = 0;
                    var id = setInterval(function () {
                        observer.next(i++);
                        if (i === 3) {
                            observer.complete();
                        }
                    });
                    return function () {
                        clearInterval(id);
                        chai_1.expect(times).to.equal(2);
                        chai_1.expect(completeCalled).to.be.false;
                        done();
                    };
                })
                    .pipe(operators_1.tap(function () { return times += 1; }))
                    .subscribe({
                    next: function () {
                        if (times === 2) {
                            subscription.unsubscribe();
                        }
                    },
                    complete: function () { completeCalled = true; }
                });
            });
        });
        describe('config.useDeprecatedSynchronousErrorHandling', function () {
            it('should log when it is set and unset', function () {
                var _log = console.log;
                var logCalledWith = [];
                console.log = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    logCalledWith.push(args);
                };
                var _warn = console.warn;
                var warnCalledWith = [];
                console.warn = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    warnCalledWith.push(args);
                };
                rxjs_1.config.useDeprecatedSynchronousErrorHandling = true;
                chai_1.expect(warnCalledWith.length).to.equal(1);
                rxjs_1.config.useDeprecatedSynchronousErrorHandling = false;
                chai_1.expect(logCalledWith.length).to.equal(1);
                console.log = _log;
                console.warn = _warn;
            });
        });
        describe('if config.useDeprecatedSynchronousErrorHandling === true', function () {
            beforeEach(function () {
                var _warn = console.warn;
                console.warn = rxjs_1.noop;
                rxjs_1.config.useDeprecatedSynchronousErrorHandling = true;
                console.warn = _warn;
            });
            it('should throw synchronously', function () {
                chai_1.expect(function () { return rxjs_1.throwError(new Error()).subscribe(); })
                    .to.throw();
            });
            it('should rethrow if sink has syncErrorThrowable = false', function () {
                var observable = new rxjs_1.Observable(function (observer) {
                    observer.next(1);
                });
                var sink = rxjs_1.Subscriber.create(function () {
                    throw 'error!';
                });
                chai_1.expect(function () {
                    observable.subscribe(sink);
                }).to.throw('error!');
            });
            afterEach(function () {
                var _log = console.log;
                console.log = rxjs_1.noop;
                rxjs_1.config.useDeprecatedSynchronousErrorHandling = false;
                console.log = _log;
            });
        });
    });
    describe('pipe', function () {
        it('should exist', function () {
            var source = rxjs_1.of('test');
            chai_1.expect(source.pipe).to.be.a('function');
        });
        it('should pipe multiple operations', function (done) {
            rxjs_1.of('test')
                .pipe(operators_1.map(function (x) { return x + x; }), operators_1.map(function (x) { return x + '!!!'; }))
                .subscribe(function (x) {
                chai_1.expect(x).to.equal('testtest!!!');
            }, null, done);
        });
        it('should return the same observable if there are no arguments', function () {
            var source = rxjs_1.of('test');
            var result = source.pipe();
            chai_1.expect(result).to.equal(source);
        });
    });
});
describe('Observable.create', function () {
    asDiagram('create(obs => { obs.next(1); })')('should create a cold observable that emits just 1', function () {
        var e1 = rxjs_1.Observable.create(function (obs) { obs.next(1); });
        var expected = 'x';
        marble_testing_1.expectObservable(e1).toBe(expected, { x: 1 });
    });
    it('should create an Observable', function () {
        var result = rxjs_1.Observable.create(function () {
        });
        chai_1.expect(result instanceof rxjs_1.Observable).to.be.true;
    });
    it('should provide an observer to the function', function () {
        var called = false;
        var result = rxjs_1.Observable.create(function (observer) {
            called = true;
            expectFullObserver(observer);
            observer.complete();
        });
        chai_1.expect(called).to.be.false;
        result.subscribe(function () {
        });
        chai_1.expect(called).to.be.true;
    });
    it('should send errors thrown in the passed function down the error path', function (done) {
        rxjs_1.Observable.create(function (observer) {
            throw new Error('this should be handled');
        })
            .subscribe({
            error: function (err) {
                chai_1.expect(err).to.exist
                    .and.be.instanceof(Error)
                    .and.have.property('message', 'this should be handled');
                done();
            }
        });
    });
});
describe('Observable.lift', function () {
    var MyCustomObservable = (function (_super) {
        __extends(MyCustomObservable, _super);
        function MyCustomObservable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MyCustomObservable.from = function (source) {
            var observable = new MyCustomObservable();
            observable.source = source;
            return observable;
        };
        MyCustomObservable.prototype.lift = function (operator) {
            var observable = new MyCustomObservable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        return MyCustomObservable;
    }(rxjs_1.Observable));
    it('should return Observable which calls TeardownLogic of operator on unsubscription', function (done) {
        var myOperator = {
            call: function (subscriber, source) {
                var subscription = source.subscribe(function (x) { return subscriber.next(x); });
                return function () {
                    subscription.unsubscribe();
                    done();
                };
            }
        };
        rxjs_1.NEVER.lift(myOperator)
            .subscribe()
            .unsubscribe();
    });
    it('should be overrideable in a custom Observable type that composes', function (done) {
        var result = new MyCustomObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.map(function (x) { return 10 * x; }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expected = [10, 20, 30];
        result.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should compose through multicast and refCount', function (done) {
        var result = new MyCustomObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount(), operators_1.map(function (x) { return 10 * x; }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expected = [10, 20, 30];
        result.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should compose through multicast with selector function', function (done) {
        var result = new MyCustomObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (shared) { return shared.pipe(operators_1.map(function (x) { return 10 * x; })); }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expected = [10, 20, 30];
        result.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should compose through combineLatest', function () {
        var e1 = marble_testing_1.cold('-a--b-----c-d-e-|');
        var e2 = marble_testing_1.cold('--1--2-3-4---|   ');
        var expected = '--A-BC-D-EF-G-H-|';
        var result = MyCustomObservable.from(e1).pipe(operators_1.combineLatest(e2, function (a, b) { return String(a) + String(b); }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        marble_testing_1.expectObservable(result).toBe(expected, {
            A: 'a1', B: 'b1', C: 'b2', D: 'b3', E: 'b4', F: 'c4', G: 'd4', H: 'e4'
        });
    });
    it('should compose through concat', function () {
        var e1 = marble_testing_1.cold('--a--b-|');
        var e2 = marble_testing_1.cold('--x---y--|');
        var expected = '--a--b---x---y--|';
        var result = MyCustomObservable.from(e1).pipe(operators_1.concat(e2, rxTestScheduler));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should compose through merge', function () {
        var e1 = marble_testing_1.cold('-a--b-| ');
        var e2 = marble_testing_1.cold('--x--y-|');
        var expected = '-ax-by-|';
        var result = MyCustomObservable.from(e1).pipe(operators_1.merge(e2, rxTestScheduler));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should compose through race', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b-----c----|';
        var result = MyCustomObservable.from(e1).pipe(operators_1.race(e2));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should compose through zip', function () {
        var e1 = marble_testing_1.cold('-a--b-----c-d-e-|');
        var e2 = marble_testing_1.cold('--1--2-3-4---|   ');
        var expected = ('--A--B----C-D|   ');
        var result = MyCustomObservable.from(e1).pipe(operators_1.zip(e2, function (a, b) { return String(a) + String(b); }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        marble_testing_1.expectObservable(result).toBe(expected, {
            A: 'a1', B: 'b2', C: 'c3', D: 'd4'
        });
    });
    it('should allow injecting behaviors into all subscribers in an operator ' +
        'chain when overridden', function (done) {
        var log = [];
        var LogSubscriber = (function (_super) {
            __extends(LogSubscriber, _super);
            function LogSubscriber() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            LogSubscriber.prototype.next = function (value) {
                log.push('next ' + value);
                if (!this.isStopped) {
                    this._next(value);
                }
            };
            return LogSubscriber;
        }(rxjs_1.Subscriber));
        var LogOperator = (function () {
            function LogOperator(childOperator) {
                this.childOperator = childOperator;
            }
            LogOperator.prototype.call = function (subscriber, source) {
                return this.childOperator.call(new LogSubscriber(subscriber), source);
            };
            return LogOperator;
        }());
        var LogObservable = (function (_super) {
            __extends(LogObservable, _super);
            function LogObservable() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            LogObservable.prototype.lift = function (operator) {
                var observable = new LogObservable();
                observable.source = this;
                observable.operator = new LogOperator(operator);
                return observable;
            };
            return LogObservable;
        }(rxjs_1.Observable));
        var result = new LogObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.map(function (x) { return 10 * x; }), operators_1.filter(function (x) { return x > 15; }), operators_1.count());
        chai_1.expect(result instanceof LogObservable).to.be.true;
        var expected = [2];
        result.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(log).to.deep.equal([
                'next 10',
                'next 20',
                'next 20',
                'next 30',
                'next 30',
                'next 2'
            ]);
            done();
        });
    });
    it('should not swallow internal errors', function () {
        var consoleStub = sinon.stub(console, 'warn');
        try {
            var source = new rxjs_1.Observable(function (observer) { return observer.next(42); });
            var _loop_1 = function (i) {
                var base = source;
                source = new rxjs_1.Observable(function (observer) { return base.subscribe(observer); });
            };
            for (var i = 0; i < 10000; ++i) {
                _loop_1(i);
            }
            source.subscribe();
            chai_1.expect(consoleStub).to.have.property('called', true);
        }
        finally {
            consoleStub.restore();
        }
    });
});
if (Symbol && Symbol.asyncIterator) {
    describe('async iterator support', function () {
        it('should work for sync observables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var source, results, source_1, source_1_1, value, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        source = rxjs_1.of(1, 2, 3);
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        source_1 = __asyncValues(source);
                        _b.label = 2;
                    case 2: return [4, source_1.next()];
                    case 3:
                        if (!(source_1_1 = _b.sent(), !source_1_1.done)) return [3, 5];
                        value = source_1_1.value;
                        results.push(value);
                        _b.label = 4;
                    case 4: return [3, 2];
                    case 5: return [3, 12];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(source_1_1 && !source_1_1.done && (_a = source_1.return))) return [3, 9];
                        return [4, _a.call(source_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 11: return [7];
                    case 12:
                        chai_1.expect(results).to.deep.equal([1, 2, 3]);
                        return [2];
                }
            });
        }); });
        it('should throw if the observable errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var source, error, source_2, source_2_1, _1, e_2_1, err_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        source = rxjs_1.throwError(new Error('bad'));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        source_2 = __asyncValues(source);
                        _b.label = 3;
                    case 3: return [4, source_2.next()];
                    case 4:
                        if (!(source_2_1 = _b.sent(), !source_2_1.done)) return [3, 6];
                        _1 = source_2_1.value;
                        _b.label = 5;
                    case 5: return [3, 3];
                    case 6: return [3, 13];
                    case 7:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(source_2_1 && !source_2_1.done && (_a = source_2.return))) return [3, 10];
                        return [4, _a.call(source_2)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [3, 15];
                    case 14:
                        err_1 = _b.sent();
                        error = err_1;
                        return [3, 15];
                    case 15:
                        chai_1.expect(error).to.be.an.instanceOf(Error);
                        chai_1.expect(error.message).to.equal('bad');
                        return [2];
                }
            });
        }); });
        it('should support async observables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var source, results, source_3, source_3_1, value, e_3_1;
            var e_3, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        source = rxjs_1.interval(10).pipe(operators_1.take(3));
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        source_3 = __asyncValues(source);
                        _b.label = 2;
                    case 2: return [4, source_3.next()];
                    case 3:
                        if (!(source_3_1 = _b.sent(), !source_3_1.done)) return [3, 5];
                        value = source_3_1.value;
                        results.push(value);
                        _b.label = 4;
                    case 4: return [3, 2];
                    case 5: return [3, 12];
                    case 6:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(source_3_1 && !source_3_1.done && (_a = source_3.return))) return [3, 9];
                        return [4, _a.call(source_3)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3, 11];
                    case 10:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 11: return [7];
                    case 12:
                        chai_1.expect(results).to.deep.equal([0, 1, 2]);
                        return [2];
                }
            });
        }); });
        it('should do something clever if the loop exits', function () { return __awaiter(void 0, void 0, void 0, function () {
            var finalized, source, results, source_4, source_4_1, value, e_4_1, err_2;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        finalized = false;
                        source = rxjs_1.interval(10).pipe(operators_1.take(10), operators_1.finalize(function () { return finalized = true; }));
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        source_4 = __asyncValues(source);
                        _b.label = 3;
                    case 3: return [4, source_4.next()];
                    case 4:
                        if (!(source_4_1 = _b.sent(), !source_4_1.done)) return [3, 6];
                        value = source_4_1.value;
                        results.push(value);
                        if (value === 1) {
                            throw new Error('bad');
                        }
                        _b.label = 5;
                    case 5: return [3, 3];
                    case 6: return [3, 13];
                    case 7:
                        e_4_1 = _b.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(source_4_1 && !source_4_1.done && (_a = source_4.return))) return [3, 10];
                        return [4, _a.call(source_4)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3, 12];
                    case 11:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 12: return [7];
                    case 13: return [3, 15];
                    case 14:
                        err_2 = _b.sent();
                        return [3, 15];
                    case 15:
                        chai_1.expect(results).to.deep.equal([0, 1]);
                        chai_1.expect(finalized).to.be.true;
                        return [2];
                }
            });
        }); });
    });
}
//# sourceMappingURL=Observable-spec.js.map