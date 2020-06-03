"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stubRAF = exports.assertDeepEquals = exports.NO_SUBS = exports.createObservableInputs = exports.lowerCaseO = void 0;
var rxjs_1 = require("rxjs");
var root_1 = require("rxjs/internal/util/root");
var observable_1 = require("rxjs/internal/symbol/observable");
var iterator_1 = require("rxjs/internal/symbol/iterator");
var sinon = require("sinon");
var chai_1 = require("chai");
if (process && process.on) {
    process.on('unhandledRejection', function (err) {
        console.error(err);
        process.exit(1);
    });
}
function lowerCaseO() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var o = {
        subscribe: function (observer) {
            args.forEach(function (v) { return observer.next(v); });
            observer.complete();
            return {
                unsubscribe: function () { }
            };
        }
    };
    o[observable_1.observable] = function () {
        return this;
    };
    return o;
}
exports.lowerCaseO = lowerCaseO;
exports.createObservableInputs = function (value) {
    var _a, _b;
    return rxjs_1.of(rxjs_1.of(value), rxjs_1.scheduled([value], rxjs_1.asyncScheduler), [value], Promise.resolve(value), (_a = {},
        _a[iterator_1.iterator] = function () {
            var iteratorResults = [
                { value: value, done: false },
                { done: true }
            ];
            return {
                next: function () {
                    return iteratorResults.shift();
                }
            };
        },
        _a), (_b = {},
        _b[observable_1.observable] = function () { return rxjs_1.of(value); },
        _b));
};
exports.NO_SUBS = [];
function assertDeepEquals(actual, expected) {
    chai_1.expect(actual).to.deep.equal(expected);
}
exports.assertDeepEquals = assertDeepEquals;
global.__root__ = root_1.root;
var _raf;
var _caf;
var _id = 0;
function stubRAF() {
    _raf = requestAnimationFrame;
    _caf = cancelAnimationFrame;
    var handlers = [];
    requestAnimationFrame = sinon.stub().callsFake(function (handler) {
        var id = _id++;
        handlers.push({ id: id, handler: handler });
        return id;
    });
    cancelAnimationFrame = sinon.stub().callsFake(function (id) {
        var index = handlers.findIndex(function (x) { return x.id === id; });
        if (index >= 0) {
            handlers.splice(index, 1);
        }
    });
    function tick() {
        if (handlers.length > 0) {
            handlers.shift().handler();
        }
    }
    function flush() {
        while (handlers.length > 0) {
            handlers.shift().handler();
        }
    }
    return {
        tick: tick,
        flush: flush,
        restore: function () {
            requestAnimationFrame = _raf;
            cancelAnimationFrame = _caf;
            _raf = _caf = undefined;
            handlers.length = 0;
            _id = 0;
        }
    };
}
exports.stubRAF = stubRAF;
//# sourceMappingURL=test-helper.js.map