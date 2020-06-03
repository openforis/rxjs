"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function getArguments() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return arguments;
}
describe('from', function () {
    var _a;
    it('should create an observable from an array', function () {
        var e1 = rxjs_1.from([10, 20, 30]).pipe(operators_1.concatMap(function (x, i) { return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : 20, rxTestScheduler)); }));
        var expected = 'x-y-(z|)';
        expectObservable(e1).toBe(expected, { x: 10, y: 20, z: 30 });
    });
    it('should throw for non observable object', function () {
        var r = function () {
            rxjs_1.from({}).subscribe();
        };
        chai_1.expect(r).to.throw();
    });
    type('should return T for InteropObservable objects', function () {
        var o1 = rxjs_1.from([], rxjs_1.asapScheduler);
        var o2 = rxjs_1.from(rxjs_1.EMPTY);
        var o3 = rxjs_1.from(new Promise(function (resolve) { return resolve(); }));
    });
    type('should return T for arrays', function () {
        var o1 = rxjs_1.from([], rxjs_1.asapScheduler);
    });
    var fakervable = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return (_a = {},
            _a[rxjs_1.observable] = function () { return ({
                subscribe: function (observer) {
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var value = values_1[_i];
                        observer.next(value);
                    }
                    observer.complete();
                }
            }); },
            _a);
    };
    var fakeArrayObservable = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var arr = ['bad array!'];
        arr[rxjs_1.observable] = function () {
            return {
                subscribe: function (observer) {
                    for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                        var value = values_2[_i];
                        observer.next(value);
                    }
                    observer.complete();
                }
            };
        };
        return arr;
    };
    var fakerator = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return (_a = {},
            _a[Symbol.iterator] = function () {
                var clone = __spreadArrays(values);
                return {
                    next: function () { return ({
                        done: clone.length <= 0,
                        value: clone.shift()
                    }); }
                };
            },
            _a);
    };
    var sources = [
        { name: 'observable', value: rxjs_1.of('x') },
        { name: 'observable-like', value: fakervable('x') },
        { name: 'observable-like-array', value: fakeArrayObservable('x') },
        { name: 'array', value: ['x'] },
        { name: 'promise', value: Promise.resolve('x') },
        { name: 'iterator', value: fakerator('x') },
        { name: 'array-like', value: (_a = {}, _a[0] = 'x', _a.length = 1, _a) },
        { name: 'string', value: 'x' },
        { name: 'arguments', value: getArguments('x') },
    ];
    if (Symbol && Symbol.asyncIterator) {
        var fakeAsyncIterator = function () {
            var _a;
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            return _a = {},
                _a[Symbol.asyncIterator] = function () {
                    var _a;
                    var i = 0;
                    return _a = {
                            next: function () {
                                var index = i++;
                                if (index < values.length) {
                                    return Promise.resolve({ done: false, value: values[index] });
                                }
                                else {
                                    return Promise.resolve({ done: true });
                                }
                            }
                        },
                        _a[Symbol.asyncIterator] = function () {
                            return this;
                        },
                        _a;
                },
                _a;
        };
        sources.push({
            name: 'async-iterator',
            value: fakeAsyncIterator('x')
        });
    }
    var _loop_1 = function (source) {
        it("should accept " + source.name, function (done) {
            var nextInvoked = false;
            rxjs_1.from(source.value)
                .subscribe(function (x) {
                nextInvoked = true;
                chai_1.expect(x).to.equal('x');
            }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                chai_1.expect(nextInvoked).to.equal(true);
                done();
            });
        });
        it("should accept " + source.name + " and scheduler", function (done) {
            var nextInvoked = false;
            rxjs_1.from(source.value, rxjs_1.asyncScheduler)
                .subscribe(function (x) {
                nextInvoked = true;
                chai_1.expect(x).to.equal('x');
            }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                chai_1.expect(nextInvoked).to.equal(true);
                done();
            });
            chai_1.expect(nextInvoked).to.equal(false);
        });
        it("should accept a function", function (done) {
            var subject = new rxjs_1.Subject();
            var handler = function (arg) { return subject.next(arg); };
            handler[rxjs_1.observable] = function () { return subject; };
            var nextInvoked = false;
            rxjs_1.from(handler).pipe(operators_1.first()).subscribe(function (x) {
                nextInvoked = true;
                chai_1.expect(x).to.equal('x');
            }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                chai_1.expect(nextInvoked).to.equal(true);
                done();
            });
            handler('x');
        });
    };
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        _loop_1(source);
    }
});
//# sourceMappingURL=from-spec.js.map