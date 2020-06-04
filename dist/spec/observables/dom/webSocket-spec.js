"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var webSocket_1 = require("rxjs/webSocket");
var operators_1 = require("rxjs/operators");
describe('webSocket', function () {
    var __ws;
    function setupMockWebSocket() {
        __ws = __root__.WebSocket;
        __root__.WebSocket = MockWebSocket;
    }
    function teardownMockWebSocket() {
        __root__.WebSocket = __ws;
        MockWebSocket.clearSockets();
    }
    describe('basic behavior', function () {
        beforeEach(function () {
            setupMockWebSocket();
        });
        afterEach(function () {
            teardownMockWebSocket();
        });
        it('should send and receive messages', function () {
            var messageReceived = false;
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.next('ping');
            subject.subscribe(function (x) {
                chai_1.expect(x).to.equal('pong');
                messageReceived = true;
            });
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.url).to.equal('ws://mysocket');
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.equal(JSON.stringify('ping'));
            socket.triggerMessage(JSON.stringify('pong'));
            chai_1.expect(messageReceived).to.be.true;
            subject.unsubscribe();
        });
        it('should allow use of operators and subscribe', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            var results = [];
            subject.pipe(operators_1.map(function (x) { return x + '!'; }))
                .subscribe(function (x) { return results.push(x); });
            MockWebSocket.lastSocket.triggerMessage(JSON.stringify('ngconf 2018 bug'));
            chai_1.expect(results).to.deep.equal(['ngconf 2018 bug!']);
        });
        it('receive multiple messages', function () {
            var expected = ['what', 'do', 'you', 'do', 'with', 'a', 'drunken', 'sailor?'];
            var results = [];
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe(function (x) {
                results.push(x);
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            expected.forEach(function (x) {
                socket.triggerMessage(JSON.stringify(x));
            });
            chai_1.expect(results).to.deep.equal(expected);
            subject.unsubscribe();
        });
        it('should queue messages prior to subscription', function () {
            var expected = ['make', 'him', 'walk', 'the', 'plank'];
            var subject = webSocket_1.webSocket('ws://mysocket');
            expected.forEach(function (x) {
                subject.next(x);
            });
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket).not.exist;
            subject.subscribe();
            socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.sent.length).to.equal(0);
            socket.open();
            chai_1.expect(socket.sent.length).to.equal(expected.length);
            subject.unsubscribe();
        });
        it('should send messages immediately if already open', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            socket.open();
            subject.next('avast!');
            chai_1.expect(socket.lastMessageSent).to.equal(JSON.stringify('avast!'));
            subject.next('ye swab!');
            chai_1.expect(socket.lastMessageSent).to.equal(JSON.stringify('ye swab!'));
            subject.unsubscribe();
        });
        it('should close the socket when completed', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(socket.readyState).to.equal(1);
            sinon.spy(socket, 'close');
            chai_1.expect(socket.close).not.have.been.called;
            subject.complete();
            chai_1.expect(socket.close).have.been.called;
            chai_1.expect(socket.readyState).to.equal(3);
            subject.unsubscribe();
            socket.close.restore();
        });
        it('should close the socket when unsubscribed before socket open', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            subject.unsubscribe();
            var socket = MockWebSocket.lastSocket;
            sinon.spy(socket, 'close');
            socket.open();
            chai_1.expect(socket.close).have.been.called;
            chai_1.expect(socket.readyState).to.equal(3);
            socket.close.restore();
        });
        it('should close the socket when subscription is cancelled before socket open', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            var subscription = subject.subscribe();
            subscription.unsubscribe();
            var socket = MockWebSocket.lastSocket;
            sinon.spy(socket, 'close');
            socket.open();
            chai_1.expect(socket.close).have.been.called;
            chai_1.expect(socket.readyState).to.equal(3);
            socket.close.restore();
        });
        it('should close the socket with a code and a reason when errored', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            socket.open();
            sinon.spy(socket, 'close');
            chai_1.expect(socket.close).not.have.been.called;
            subject.error({ code: 1337, reason: 'Too bad, so sad :(' });
            chai_1.expect(socket.close).have.been.calledWith(1337, 'Too bad, so sad :(');
            subject.unsubscribe();
            socket.close.restore();
        });
        it('should allow resubscription after closure via complete', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            var socket1 = MockWebSocket.lastSocket;
            socket1.open();
            subject.complete();
            subject.next('a mariner yer not. yarrr.');
            subject.subscribe();
            var socket2 = MockWebSocket.lastSocket;
            socket2.open();
            chai_1.expect(socket2).not.to.equal(socket1);
            chai_1.expect(socket2.lastMessageSent).to.equal(JSON.stringify('a mariner yer not. yarrr.'));
            subject.unsubscribe();
        });
        it('should allow resubscription after closure via error', function () {
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe();
            var socket1 = MockWebSocket.lastSocket;
            socket1.open();
            subject.error({ code: 1337 });
            subject.next('yo-ho! yo-ho!');
            subject.subscribe();
            var socket2 = MockWebSocket.lastSocket;
            socket2.open();
            chai_1.expect(socket2).not.to.equal(socket1);
            chai_1.expect(socket2.lastMessageSent).to.equal(JSON.stringify('yo-ho! yo-ho!'));
            subject.unsubscribe();
        });
        it('should have a default resultSelector that parses message data as JSON', function () {
            var result;
            var expected = { mork: 'shazbot!' };
            var subject = webSocket_1.webSocket('ws://mysocket');
            subject.subscribe(function (x) {
                result = x;
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            socket.triggerMessage(JSON.stringify(expected));
            chai_1.expect(result).to.deep.equal(expected);
            subject.unsubscribe();
        });
    });
    describe('with a config object', function () {
        beforeEach(function () {
            setupMockWebSocket();
        });
        afterEach(function () {
            teardownMockWebSocket();
        });
        it('should send and receive messages', function () {
            var messageReceived = false;
            var subject = webSocket_1.webSocket({ url: 'ws://mysocket' });
            subject.next('ping');
            subject.subscribe(function (x) {
                chai_1.expect(x).to.equal('pong');
                messageReceived = true;
            });
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.url).to.equal('ws://mysocket');
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.equal(JSON.stringify('ping'));
            socket.triggerMessage(JSON.stringify('pong'));
            chai_1.expect(messageReceived).to.be.true;
            subject.unsubscribe();
        });
        it('should take a protocol and set it properly on the web socket', function () {
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                protocol: 'someprotocol'
            });
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.protocol).to.equal('someprotocol');
            subject.unsubscribe();
        });
        it('should take a binaryType and set it properly on the web socket', function () {
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                binaryType: 'blob'
            });
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.binaryType).to.equal('blob');
            subject.unsubscribe();
        });
        it('should take a deserializer', function () {
            var results = [];
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                deserializer: function (e) {
                    return e.data + '!';
                }
            });
            subject.subscribe(function (x) {
                results.push(x);
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            ['ahoy', 'yarr', 'shove off'].forEach(function (x) {
                socket.triggerMessage(x);
            });
            chai_1.expect(results).to.deep.equal(['ahoy!', 'yarr!', 'shove off!']);
            subject.unsubscribe();
        });
        it('if the deserializer fails it should go down the error path', function () {
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                deserializer: function (e) {
                    throw new Error('I am a bad error');
                }
            });
            subject.subscribe(function (x) {
                chai_1.expect(x).to.equal('this should not happen');
            }, function (err) {
                chai_1.expect(err).to.be.an('error', 'I am a bad error');
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            socket.triggerMessage('weee!');
            subject.unsubscribe();
        });
        it('should accept a closingObserver', function () {
            var calls = 0;
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                closingObserver: {
                    next: function (x) {
                        calls++;
                        chai_1.expect(x).to.be.an('undefined');
                    }
                }
            });
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(calls).to.equal(0);
            subject.complete();
            chai_1.expect(calls).to.equal(1);
            subject.subscribe();
            socket = MockWebSocket.lastSocket;
            socket.open();
            subject.error({ code: 1337 });
            chai_1.expect(calls).to.equal(2);
            subject.unsubscribe();
        });
        it('should accept a closeObserver', function () {
            var expected = [{ wasClean: true }, { wasClean: false }];
            var closes = [];
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                closeObserver: {
                    next: function (e) {
                        closes.push(e);
                    }
                }
            });
            subject.subscribe();
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(closes.length).to.equal(0);
            socket.triggerClose(expected[0]);
            chai_1.expect(closes.length).to.equal(1);
            subject.subscribe(null, function (err) {
                chai_1.expect(err).to.equal(expected[1]);
            });
            socket = MockWebSocket.lastSocket;
            socket.open();
            socket.triggerClose(expected[1]);
            chai_1.expect(closes.length).to.equal(2);
            chai_1.expect(closes[0]).to.equal(expected[0]);
            chai_1.expect(closes[1]).to.equal(expected[1]);
            subject.unsubscribe();
        });
        it('should handle constructor errors', function () {
            var subject = webSocket_1.webSocket({
                url: 'bad_url',
                WebSocketCtor: function (url, protocol) {
                    throw new Error("connection refused");
                }
            });
            subject.subscribe(function (x) {
                chai_1.expect(x).to.equal('this should not happen');
            }, function (err) {
                chai_1.expect(err).to.be.an('error', 'connection refused');
            });
            subject.unsubscribe();
        });
    });
    describe('multiplex', function () {
        beforeEach(function () {
            setupMockWebSocket();
        });
        afterEach(function () {
            teardownMockWebSocket();
        });
        it('should be retryable', function () {
            var results = [];
            var subject = webSocket_1.webSocket('ws://websocket');
            var source = subject.multiplex(function () { return ({ sub: 'foo' }); }, function () { return ({ unsub: 'foo' }); }, function (value) { return value.name === 'foo'; });
            source.pipe(operators_1.retry(1), operators_1.map(function (x) { return x.value; }), operators_1.take(2)).subscribe(function (x) {
                results.push(x);
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.deep.equal(JSON.stringify({ sub: 'foo' }));
            socket.triggerClose({ wasClean: false });
            var socket2 = MockWebSocket.lastSocket;
            chai_1.expect(socket2).not.to.equal(socket);
            socket2.open();
            chai_1.expect(socket2.lastMessageSent).to.deep.equal(JSON.stringify({ sub: 'foo' }));
            socket2.triggerMessage(JSON.stringify({ name: 'foo', value: 'test' }));
            socket2.triggerMessage(JSON.stringify({ name: 'foo', value: 'this' }));
            chai_1.expect(results).to.deep.equal(['test', 'this']);
        });
        it('should be repeatable', function () {
            var results = [];
            var subject = webSocket_1.webSocket('ws://websocket');
            var source = subject.multiplex(function () { return ({ sub: 'foo' }); }, function () { return ({ unsub: 'foo' }); }, function (value) { return value.name === 'foo'; });
            source
                .pipe(operators_1.repeat(2), operators_1.map(function (x) { return x.value; }))
                .subscribe(function (x) {
                results.push(x);
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.deep.equal(JSON.stringify({ sub: 'foo' }), 'first multiplexed sub');
            socket.triggerMessage(JSON.stringify({ name: 'foo', value: 'test' }));
            socket.triggerMessage(JSON.stringify({ name: 'foo', value: 'this' }));
            socket.triggerClose({ wasClean: true });
            var socket2 = MockWebSocket.lastSocket;
            chai_1.expect(socket2).not.to.equal(socket, 'a new socket was not created');
            socket2.open();
            chai_1.expect(socket2.lastMessageSent).to.deep.equal(JSON.stringify({ sub: 'foo' }), 'second multiplexed sub');
            socket2.triggerMessage(JSON.stringify({ name: 'foo', value: 'test' }));
            socket2.triggerMessage(JSON.stringify({ name: 'foo', value: 'this' }));
            socket2.triggerClose({ wasClean: true });
            chai_1.expect(results).to.deep.equal(['test', 'this', 'test', 'this'], 'results were not equal');
        });
        it('should multiplex over the webSocket', function () {
            var results = [];
            var subject = webSocket_1.webSocket('ws://websocket');
            var source = subject.multiplex(function () { return ({ sub: 'foo' }); }, function () { return ({ unsub: 'foo' }); }, function (value) { return value.name === 'foo'; });
            var sub = source.subscribe(function (x) {
                results.push(x.value);
            });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.deep.equal(JSON.stringify({ sub: 'foo' }));
            [1, 2, 3, 4, 5].map(function (x) {
                return {
                    name: x % 3 === 0 ? 'bar' : 'foo',
                    value: x
                };
            }).forEach(function (x) {
                socket.triggerMessage(JSON.stringify(x));
            });
            chai_1.expect(results).to.deep.equal([1, 2, 4, 5]);
            sinon.spy(socket, 'close');
            sub.unsubscribe();
            chai_1.expect(socket.lastMessageSent).to.deep.equal(JSON.stringify({ unsub: 'foo' }));
            chai_1.expect(socket.close).have.been.called;
            socket.close.restore();
        });
        it('should keep the same socket for multiple multiplex subscriptions', function () {
            var socketSubject = webSocket_1.webSocket({ url: 'ws://mysocket' });
            var results = [];
            var socketMessages = [
                { id: 'A' },
                { id: 'B' },
                { id: 'A' },
                { id: 'B' },
                { id: 'B' },
            ];
            var sub1 = socketSubject.multiplex(function () { return 'no-op'; }, function () { return results.push('A unsub'); }, function (req) { return req.id === 'A'; }).pipe(operators_1.takeWhile(function (req) { return !req.complete; }))
                .subscribe(function () { return results.push('A next'); }, function (e) { return results.push('A error ' + e); }, function () { return results.push('A complete'); });
            socketSubject.multiplex(function () { return 'no-op'; }, function () { return results.push('B unsub'); }, function (req) { return req.id === 'B'; })
                .subscribe(function () { return results.push('B next'); }, function (e) { return results.push('B error ' + e); }, function () { return results.push('B complete'); });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            socketMessages.forEach(function (msg, i) {
                if (i === 1) {
                    sub1.unsubscribe();
                    chai_1.expect(socketSubject._socket).to.equal(socket);
                }
                socket.triggerMessage(JSON.stringify(msg));
            });
            socket.triggerClose({ wasClean: true });
            chai_1.expect(results).to.deep.equal([
                'A next',
                'A unsub',
                'B next',
                'B next',
                'B next',
                'B complete',
                'B unsub',
            ]);
        });
        it('should not close the socket until all subscriptions complete', function () {
            var socketSubject = webSocket_1.webSocket({ url: 'ws://mysocket' });
            var results = [];
            var socketMessages = [
                { id: 'A' },
                { id: 'B' },
                { id: 'A', complete: true },
                { id: 'B' },
                { id: 'B', complete: true },
            ];
            socketSubject.multiplex(function () { return 'no-op'; }, function () { return results.push('A unsub'); }, function (req) { return req.id === 'A'; }).pipe(operators_1.takeWhile(function (req) { return !req.complete; })).subscribe(function () { return results.push('A next'); }, function (e) { return results.push('A error ' + e); }, function () { return results.push('A complete'); });
            socketSubject.multiplex(function () { return 'no-op'; }, function () { return results.push('B unsub'); }, function (req) { return req.id === 'B'; }).pipe(operators_1.takeWhile(function (req) { return !req.complete; })).subscribe(function () { return results.push('B next'); }, function (e) { return results.push('B error ' + e); }, function () { return results.push('B complete'); });
            var socket = MockWebSocket.lastSocket;
            socket.open();
            socketMessages.forEach(function (msg) {
                socket.triggerMessage(JSON.stringify(msg));
            });
            chai_1.expect(results).to.deep.equal([
                'A next',
                'B next',
                'A complete',
                'A unsub',
                'B next',
                'B complete',
                'B unsub',
            ]);
        });
    });
    describe('node constructor', function () {
        it('should send and receive messages', function () {
            var messageReceived = false;
            var subject = webSocket_1.webSocket({
                url: 'ws://mysocket',
                WebSocketCtor: function (url, protocol) {
                    return new MockWebSocket(url, protocol);
                }
            });
            subject.next('ping');
            subject.subscribe(function (x) {
                chai_1.expect(x).to.equal('pong');
                messageReceived = true;
            });
            var socket = MockWebSocket.lastSocket;
            chai_1.expect(socket.url).to.equal('ws://mysocket');
            socket.open();
            chai_1.expect(socket.lastMessageSent).to.equal(JSON.stringify('ping'));
            socket.triggerMessage(JSON.stringify('pong'));
            chai_1.expect(messageReceived).to.be.true;
            subject.unsubscribe();
        });
        it('should handle constructor errors if no WebSocketCtor', function () {
            chai_1.expect(function () {
                var subject = webSocket_1.webSocket({
                    url: 'ws://mysocket'
                });
            }).to.throw('no WebSocket constructor can be found');
        });
    });
});
var MockWebSocket = (function () {
    function MockWebSocket(url, protocol) {
        this.url = url;
        this.protocol = protocol;
        this.sent = [];
        this.handlers = {};
        this.readyState = 0;
        MockWebSocket.sockets.push(this);
    }
    Object.defineProperty(MockWebSocket, "lastSocket", {
        get: function () {
            var socket = MockWebSocket.sockets;
            var length = socket.length;
            return length > 0 ? socket[length - 1] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    MockWebSocket.clearSockets = function () {
        MockWebSocket.sockets.length = 0;
    };
    MockWebSocket.prototype.send = function (data) {
        this.sent.push(data);
    };
    Object.defineProperty(MockWebSocket.prototype, "lastMessageSent", {
        get: function () {
            var sent = this.sent;
            var length = sent.length;
            return length > 0 ? sent[length - 1] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    MockWebSocket.prototype.triggerClose = function (e) {
        this.readyState = 3;
        this.trigger('close', e);
    };
    MockWebSocket.prototype.triggerMessage = function (data) {
        var messageEvent = {
            data: data,
            origin: 'mockorigin',
            ports: undefined,
            source: __root__,
        };
        this.trigger('message', messageEvent);
    };
    MockWebSocket.prototype.open = function () {
        this.readyState = 1;
        this.trigger('open', {});
    };
    MockWebSocket.prototype.close = function (code, reason) {
        if (this.readyState < 2) {
            this.readyState = 2;
            this.closeCode = code;
            this.closeReason = reason;
            this.triggerClose({ wasClean: true });
        }
    };
    MockWebSocket.prototype.trigger = function (name, e) {
        if (this['on' + name]) {
            this['on' + name](e);
        }
        var lookup = this.handlers[name];
        if (lookup) {
            for (var i = 0; i < lookup.length; i++) {
                lookup[i](e);
            }
        }
    };
    MockWebSocket.sockets = [];
    return MockWebSocket;
}());
//# sourceMappingURL=webSocket-spec.js.map