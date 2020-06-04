"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("rxjs/fetch");
var chai_1 = require("chai");
var root_1 = require("../../../src/internal/util/root");
var OK_RESPONSE = {
    ok: true,
};
function mockFetchImpl(input, init) {
    mockFetchImpl.calls.push({ input: input, init: init });
    return new Promise(function (resolve, reject) {
        if (init) {
            if (init.signal) {
                if (init.signal.aborted) {
                    reject(new MockDOMException());
                    return;
                }
                init.signal.addEventListener('abort', function () {
                    reject(new MockDOMException());
                });
            }
        }
        Promise.resolve(null).then(function () {
            resolve(mockFetchImpl.respondWith);
        });
    });
}
mockFetchImpl.reset = function () {
    this.calls = [];
    this.respondWith = OK_RESPONSE;
};
mockFetchImpl.reset();
var mockFetch = mockFetchImpl;
var MockDOMException = (function () {
    function MockDOMException() {
    }
    return MockDOMException;
}());
var MockAbortController = (function () {
    function MockAbortController() {
        this.signal = new MockAbortSignal();
        MockAbortController.created++;
    }
    MockAbortController.prototype.abort = function () {
        this.signal._signal();
    };
    MockAbortController.reset = function () {
        MockAbortController.created = 0;
    };
    MockAbortController.created = 0;
    return MockAbortController;
}());
var MockAbortSignal = (function () {
    function MockAbortSignal() {
        this._listeners = [];
        this.aborted = false;
    }
    MockAbortSignal.prototype.addEventListener = function (name, handler) {
        this._listeners.push(handler);
    };
    MockAbortSignal.prototype.removeEventListener = function (name, handler) {
        var index = this._listeners.indexOf(handler);
        if (index >= 0) {
            this._listeners.splice(index, 1);
        }
    };
    MockAbortSignal.prototype._signal = function () {
        this.aborted = true;
        while (this._listeners.length > 0) {
            this._listeners.shift()();
        }
    };
    return MockAbortSignal;
}());
describe('fromFetch', function () {
    var _fetch;
    var _AbortController;
    beforeEach(function () {
        mockFetch.reset();
        if (root_1.root.fetch) {
            _fetch = root_1.root.fetch;
        }
        root_1.root.fetch = mockFetch;
        MockAbortController.reset();
        if (root_1.root.AbortController) {
            _AbortController = root_1.root.AbortController;
        }
        root_1.root.AbortController = MockAbortController;
    });
    afterEach(function () {
        root_1.root.fetch = _fetch;
        root_1.root.AbortController = _AbortController;
    });
    it('should exist', function () {
        chai_1.expect(fetch_1.fromFetch).to.be.a('function');
    });
    it('should fetch', function (done) {
        var fetch$ = fetch_1.fromFetch('/foo');
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: function (response) {
                chai_1.expect(response).to.equal(OK_RESPONSE);
            },
            error: done,
            complete: function () {
                setTimeout(function () {
                    chai_1.expect(MockAbortController.created).to.equal(1);
                    chai_1.expect(mockFetch.calls.length).to.equal(1);
                    chai_1.expect(mockFetch.calls[0].input).to.equal('/foo');
                    chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
                    chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
                    done();
                }, 0);
            }
        });
    });
    it('should handle Response that is not `ok`', function (done) {
        mockFetch.respondWith = {
            ok: false,
            status: 400,
            body: 'Bad stuff here'
        };
        var fetch$ = fetch_1.fromFetch('/foo');
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: function (response) {
                chai_1.expect(response).to.equal(mockFetch.respondWith);
            },
            complete: done,
            error: done
        });
        chai_1.expect(MockAbortController.created).to.equal(1);
        chai_1.expect(mockFetch.calls.length).to.equal(1);
        chai_1.expect(mockFetch.calls[0].input).to.equal('/foo');
        chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
    });
    it('should abort when unsubscribed', function () {
        var fetch$ = fetch_1.fromFetch('/foo');
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        var subscription = fetch$.subscribe();
        chai_1.expect(MockAbortController.created).to.equal(1);
        chai_1.expect(mockFetch.calls.length).to.equal(1);
        chai_1.expect(mockFetch.calls[0].input).to.equal('/foo');
        chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
    });
    it('should not immediately abort repeat subscribers', function () {
        var fetch$ = fetch_1.fromFetch('/foo');
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        var subscription = fetch$.subscribe();
        chai_1.expect(MockAbortController.created).to.equal(1);
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        subscription = fetch$.subscribe();
        chai_1.expect(MockAbortController.created).to.equal(2);
        chai_1.expect(mockFetch.calls[1].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        chai_1.expect(mockFetch.calls[1].init.signal.aborted).to.be.true;
    });
    it('should allow passing of init object', function (done) {
        var fetch$ = fetch_1.fromFetch('/foo', { method: 'HEAD' });
        fetch$.subscribe({
            error: done,
            complete: done,
        });
        chai_1.expect(mockFetch.calls[0].init.method).to.equal('HEAD');
    });
    it('should add a signal to internal init object without mutating the passed init object', function (done) {
        var myInit = { method: 'DELETE' };
        var fetch$ = fetch_1.fromFetch('/bar', myInit);
        fetch$.subscribe({
            error: done,
            complete: done,
        });
        chai_1.expect(mockFetch.calls[0].init.method).to.equal(myInit.method);
        chai_1.expect(mockFetch.calls[0].init).not.to.equal(myInit);
        chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
    });
    it('should treat passed signals as a cancellation token which triggers an error', function (done) {
        var controller = new MockAbortController();
        var signal = controller.signal;
        var fetch$ = fetch_1.fromFetch('/foo', { signal: signal });
        var subscription = fetch$.subscribe({
            error: function (err) {
                chai_1.expect(err).to.be.instanceof(MockDOMException);
                done();
            }
        });
        controller.abort();
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        chai_1.expect(subscription.closed).to.be.false;
    });
    it('should treat passed already aborted signals as a cancellation token which triggers an error', function (done) {
        var controller = new MockAbortController();
        controller.abort();
        var signal = controller.signal;
        var fetch$ = fetch_1.fromFetch('/foo', { signal: signal });
        var subscription = fetch$.subscribe({
            error: function (err) {
                chai_1.expect(err).to.be.instanceof(MockDOMException);
                done();
            }
        });
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        chai_1.expect(subscription.closed).to.be.false;
    });
    it('should not leak listeners added to the passed in signal', function (done) {
        var controller = new MockAbortController();
        var signal = controller.signal;
        var fetch$ = fetch_1.fromFetch('/foo', { signal: signal });
        var subscription = fetch$.subscribe();
        subscription.add(function () {
            try {
                chai_1.expect(signal._listeners).to.be.empty;
                done();
            }
            catch (error) {
                done(error);
            }
        });
    });
    it('should support a selector', function (done) {
        mockFetch.respondWith = __assign(__assign({}, OK_RESPONSE), { text: function () { return Promise.resolve('bar'); } });
        var fetch$ = fetch_1.fromFetch('/foo', {
            selector: function (response) { return response.text(); }
        });
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: function (text) {
                chai_1.expect(text).to.equal('bar');
            },
            error: done,
            complete: function () {
                setTimeout(function () {
                    chai_1.expect(MockAbortController.created).to.equal(1);
                    chai_1.expect(mockFetch.calls.length).to.equal(1);
                    chai_1.expect(mockFetch.calls[0].input).to.equal('/foo');
                    chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
                    chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
                    done();
                }, 0);
            }
        });
    });
    it('should abort when unsubscribed and a selector is specified', function () {
        mockFetch.respondWith = __assign(__assign({}, OK_RESPONSE), { text: function () { return Promise.resolve('bar'); } });
        var fetch$ = fetch_1.fromFetch('/foo', {
            selector: function (response) { return response.text(); }
        });
        chai_1.expect(mockFetch.calls.length).to.equal(0);
        chai_1.expect(MockAbortController.created).to.equal(0);
        var subscription = fetch$.subscribe();
        chai_1.expect(MockAbortController.created).to.equal(1);
        chai_1.expect(mockFetch.calls.length).to.equal(1);
        chai_1.expect(mockFetch.calls[0].input).to.equal('/foo');
        chai_1.expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        chai_1.expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
    });
});
//# sourceMappingURL=fetch-spec.js.map