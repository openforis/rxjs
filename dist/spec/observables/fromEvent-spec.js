"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('fromEvent', function () {
    asDiagram('fromEvent(element, \'click\')')('should create an observable of click on the element', function () {
        var target = {
            addEventListener: function (eventType, listener) {
                rxjs_1.timer(50, 20, rxTestScheduler)
                    .pipe(operators_1.mapTo('ev'), operators_1.take(2), operators_1.concat(rxjs_1.NEVER))
                    .subscribe(listener);
            },
            removeEventListener: function () { return void 0; },
            dispatchEvent: function () { return void 0; },
        };
        var e1 = rxjs_1.fromEvent(target, 'click');
        var expected = '-----x-x---';
        marble_testing_1.expectObservable(e1).toBe(expected, { x: 'ev' });
    });
    it('should setup an event observable on objects with "on" and "off" ', function () {
        var onEventName;
        var onHandler;
        var offEventName;
        var offHandler;
        var obj = {
            on: function (a, b) {
                onEventName = a;
                onHandler = b;
            },
            off: function (a, b) {
                offEventName = a;
                offHandler = b;
            }
        };
        var subscription = rxjs_1.fromEvent(obj, 'click')
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onEventName).to.equal('click');
        chai_1.expect(typeof onHandler).to.equal('function');
        chai_1.expect(offEventName).to.equal(onEventName);
        chai_1.expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addEventListener" and "removeEventListener" ', function () {
        var onEventName;
        var onHandler;
        var offEventName;
        var offHandler;
        var obj = {
            addEventListener: function (a, b, useCapture) {
                onEventName = a;
                onHandler = b;
            },
            removeEventListener: function (a, b, useCapture) {
                offEventName = a;
                offHandler = b;
            }
        };
        var subscription = rxjs_1.fromEvent(obj, 'click')
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onEventName).to.equal('click');
        chai_1.expect(typeof onHandler).to.equal('function');
        chai_1.expect(offEventName).to.equal(onEventName);
        chai_1.expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" returning event emitter', function () {
        var onEventName;
        var onHandler;
        var offEventName;
        var offHandler;
        var obj = {
            addListener: function (a, b) {
                onEventName = a;
                onHandler = b;
                return this;
            },
            removeListener: function (a, b) {
                offEventName = a;
                offHandler = b;
                return this;
            }
        };
        var subscription = rxjs_1.fromEvent(obj, 'click')
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onEventName).to.equal('click');
        chai_1.expect(typeof onHandler).to.equal('function');
        chai_1.expect(offEventName).to.equal(onEventName);
        chai_1.expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" returning nothing', function () {
        var onEventName;
        var onHandler;
        var offEventName;
        var offHandler;
        var obj = {
            addListener: function (a, b, context) {
                onEventName = a;
                onHandler = b;
                return { context: '' };
            },
            removeListener: function (a, b) {
                offEventName = a;
                offHandler = b;
            }
        };
        var subscription = rxjs_1.fromEvent(obj, 'click')
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onEventName).to.equal('click');
        chai_1.expect(typeof onHandler).to.equal('function');
        chai_1.expect(offEventName).to.equal(onEventName);
        chai_1.expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" and "length" ', function () {
        var onEventName;
        var onHandler;
        var offEventName;
        var offHandler;
        var obj = {
            addListener: function (a, b) {
                onEventName = a;
                onHandler = b;
            },
            removeListener: function (a, b) {
                offEventName = a;
                offHandler = b;
            },
            length: 1
        };
        var subscription = rxjs_1.fromEvent(obj, 'click')
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onEventName).to.equal('click');
        chai_1.expect(typeof onHandler).to.equal('function');
        chai_1.expect(offEventName).to.equal(onEventName);
        chai_1.expect(offHandler).to.equal(onHandler);
    });
    it('should error on invalid event targets', function () {
        var obj = {
            addListener: function () {
            }
        };
        rxjs_1.fromEvent(obj, 'click').subscribe({
            error: function (err) {
                chai_1.expect(err).to.exist
                    .and.be.instanceof(Error)
                    .and.have.property('message', 'Invalid event target');
            }
        });
    });
    it('should pass through options to addEventListener and removeEventListener', function () {
        var onOptions;
        var offOptions;
        var expectedOptions = { capture: true, passive: true };
        var obj = {
            addEventListener: function (a, b, c) {
                onOptions = c;
            },
            removeEventListener: function (a, b, c) {
                offOptions = c;
            }
        };
        var subscription = rxjs_1.fromEvent(obj, 'click', expectedOptions)
            .subscribe(function () {
        });
        subscription.unsubscribe();
        chai_1.expect(onOptions).to.equal(expectedOptions);
        chai_1.expect(offOptions).to.equal(expectedOptions);
    });
    it('should pass through events that occur', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        rxjs_1.fromEvent(obj, 'click').pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).to.equal('test');
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send('test');
    });
    it('should pass through events that occur and use the selector if provided', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        function selector(x) {
            return x + '!';
        }
        rxjs_1.fromEvent(obj, 'click', selector).pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).to.equal('test!');
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send('test');
    });
    it('should not fail if no event arguments are passed and the selector does not return', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        function selector() {
        }
        rxjs_1.fromEvent(obj, 'click', selector).pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).not.exist;
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send();
    });
    it('should return a value from the selector if no event arguments are passed', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        function selector() {
            return 'no arguments';
        }
        rxjs_1.fromEvent(obj, 'click', selector).pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).to.equal('no arguments');
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send();
    });
    it('should pass multiple arguments to selector from event emitter', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        function selector(x, y, z) {
            return [].slice.call(arguments);
        }
        rxjs_1.fromEvent(obj, 'click', selector).pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).to.deep.equal([1, 2, 3]);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send(1, 2, 3);
    });
    it('should emit multiple arguments from event as an array', function (done) {
        var send;
        var obj = {
            on: function (name, handler) {
                send = handler;
            },
            off: function () {
            }
        };
        rxjs_1.fromEvent(obj, 'click').pipe(operators_1.take(1))
            .subscribe(function (e) {
            chai_1.expect(e).to.deep.equal([1, 2, 3]);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        send(1, 2, 3);
    });
    it('should not throw an exception calling toString on obj with a null prototype', function (done) {
        var NullProtoEventTarget = (function () {
            function NullProtoEventTarget() {
            }
            NullProtoEventTarget.prototype.on = function () { };
            NullProtoEventTarget.prototype.off = function () { };
            return NullProtoEventTarget;
        }());
        NullProtoEventTarget.prototype.toString = null;
        var obj = new NullProtoEventTarget();
        chai_1.expect(function () {
            rxjs_1.fromEvent(obj, 'foo').subscribe();
            done();
        }).to.not.throw(TypeError);
    });
    type('should support node style event emitters interfaces', function () {
        var a;
        var b = rxjs_1.fromEvent(a, 'mock');
    });
    type('should support node compatible event emitters interfaces', function () {
        var a;
        var b = rxjs_1.fromEvent(a, 'mock');
    });
    type('should support node style event emitters objects', function () {
        var a;
        var b = rxjs_1.fromEvent(a, 'mock');
    });
    type('should support React Native event emitters', function () {
        var a;
        var b = rxjs_1.fromEvent(a, 'mock');
    });
});
//# sourceMappingURL=fromEvent-spec.js.map