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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var root_1 = require("rxjs/internal/util/root");
var ajax_1 = require("rxjs/ajax");
describe('ajax', function () {
    var gXHR;
    var rXHR;
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
        gXHR = global.XMLHttpRequest;
        rXHR = root_1.root.XMLHttpRequest;
        global.XMLHttpRequest = MockXMLHttpRequest;
        root_1.root.XMLHttpRequest = MockXMLHttpRequest;
    });
    afterEach(function () {
        sandbox.restore();
        MockXMLHttpRequest.clearRequest();
        global.XMLHttpRequest = gXHR;
        root_1.root.XMLHttpRequest = rXHR;
        root_1.root.XDomainRequest = null;
        root_1.root.ActiveXObject = null;
    });
    it('should create default XMLHttpRequest for non CORS', function () {
        var obj = {
            url: '/',
            method: ''
        };
        ajax_1.ajax(obj).subscribe();
        chai_1.expect(MockXMLHttpRequest.mostRecent.withCredentials).to.be.false;
    });
    it('should try to create AXObject for XHR in old version of IE', function () {
        var axObjectStub = sandbox.stub();
        axObjectStub.returns(sinon.stub(new MockXMLHttpRequest()));
        root_1.root.ActiveXObject = axObjectStub;
        root_1.root.XMLHttpRequest = null;
        var obj = {
            url: '/',
            method: '',
            crossDomain: false,
        };
        ajax_1.ajax(obj).subscribe();
        chai_1.expect(axObjectStub).to.have.been.called;
    });
    it('should raise an error if not able to create XMLHttpRequest', function () {
        root_1.root.XMLHttpRequest = null;
        root_1.root.ActiveXObject = null;
        var obj = {
            url: '/',
            method: ''
        };
        ajax_1.ajax(obj).subscribe(null, function (err) { return chai_1.expect(err).to.exist; });
    });
    it('should create XMLHttpRequest for CORS', function () {
        var obj = {
            url: '/',
            method: '',
            crossDomain: true,
            withCredentials: true
        };
        ajax_1.ajax(obj).subscribe();
        chai_1.expect(MockXMLHttpRequest.mostRecent.withCredentials).to.be.true;
    });
    it('should try to create XDomainRequest for CORS if XMLHttpRequest is not available', function () {
        var xDomainStub = sandbox.stub();
        xDomainStub.returns(sinon.stub(new MockXMLHttpRequest()));
        root_1.root.XDomainRequest = xDomainStub;
        root_1.root.XMLHttpRequest = null;
        var obj = {
            url: '/',
            method: '',
            crossDomain: true,
            withCredentials: true
        };
        ajax_1.ajax(obj).subscribe();
        chai_1.expect(xDomainStub).to.have.been.called;
    });
    it('should raise an error if not able to create CORS request', function () {
        root_1.root.XMLHttpRequest = null;
        root_1.root.XDomainRequest = null;
        var obj = {
            url: '/',
            method: '',
            crossDomain: true,
            withCredentials: true
        };
        ajax_1.ajax(obj).subscribe(null, function (err) { return chai_1.expect(err).to.exist; });
    });
    it('should set headers', function () {
        var obj = {
            url: '/talk-to-me-goose',
            headers: {
                'Content-Type': 'kenny/loggins',
                'Fly-Into-The': 'Dangah Zone!',
                'Take-A-Ride-Into-The': 'Danger ZoooOoone!'
            },
            method: ''
        };
        ajax_1.ajax(obj).subscribe();
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.url).to.equal('/talk-to-me-goose');
        chai_1.expect(request.requestHeaders).to.deep.equal({
            'Content-Type': 'kenny/loggins',
            'Fly-Into-The': 'Dangah Zone!',
            'Take-A-Ride-Into-The': 'Danger ZoooOoone!',
        });
    });
    it('should set the X-Requested-With if crossDomain is false', function () {
        ajax_1.ajax({
            url: '/test/monkey',
            method: 'GET',
            crossDomain: false,
        })
            .subscribe();
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.requestHeaders).to.deep.equal({
            'X-Requested-With': 'XMLHttpRequest',
        });
    });
    it('should not set default Content-Type header when no body is sent', function () {
        var obj = {
            url: '/talk-to-me-goose',
            method: 'GET'
        };
        ajax_1.ajax(obj).subscribe();
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.url).to.equal('/talk-to-me-goose');
        chai_1.expect(request.requestHeaders).to.not.have.keys('Content-Type');
    });
    it('should error if createXHR throws', function () {
        var error;
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            createXHR: function () {
                throw new Error('wokka wokka');
            }
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            throw 'should not next';
        }, function (err) {
            error = err;
        }, function () {
            throw 'should not complete';
        });
        chai_1.expect(error).to.be.an('error', 'wokka wokka');
    });
    it('should error if send request throws', function (done) {
        var expected = new Error('xhr send failure');
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            method: '',
            createXHR: function () {
                var ret = new MockXMLHttpRequest();
                ret.send = function () {
                    throw expected;
                };
                return ret;
            }
        };
        ajax_1.ajax(obj)
            .subscribe(function () {
            done(new Error('should not be called'));
        }, function (e) {
            chai_1.expect(e).to.be.equal(expected);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should succeed on 200', function () {
        var expected = { foo: 'bar' };
        var result;
        var complete = false;
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            method: ''
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            result = x;
        }, null, function () {
            complete = true;
        });
        chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 200,
            'contentType': 'application/json',
            'responseText': JSON.stringify(expected)
        });
        chai_1.expect(result.xhr).exist;
        chai_1.expect(result.response).to.deep.equal(JSON.stringify({ foo: 'bar' }));
        chai_1.expect(complete).to.be.true;
    });
    it('should fail if fails to parse response', function () {
        var error;
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'json',
            method: ''
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            throw 'should not next';
        }, function (err) {
            error = err;
        }, function () {
            throw 'should not complete';
        });
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 207,
            'contentType': '',
            'responseType': '',
            'responseText': 'Wee! I am text, but should be valid JSON!'
        });
        chai_1.expect(error instanceof SyntaxError).to.be.true;
        chai_1.expect(error.message).to.equal('Unexpected token W in JSON at position 0');
    });
    it('should fail on 404', function () {
        var error;
        var obj = {
            url: '/flibbertyJibbet',
            normalizeError: function (e, xhr, type) {
                return xhr.response || xhr.responseText;
            },
            responseType: 'text',
            method: ''
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            throw 'should not next';
        }, function (err) {
            error = err;
        }, function () {
            throw 'should not complete';
        });
        chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 404,
            'contentType': 'text/plain',
            'responseText': 'Wee! I am text!'
        });
        chai_1.expect(error instanceof ajax_1.AjaxError).to.be.true;
        chai_1.expect(error.name).to.equal('AjaxError');
        chai_1.expect(error.message).to.equal('ajax error 404');
        chai_1.expect(error.status).to.equal(404);
    });
    it('should succeed on 300', function () {
        var result;
        var complete = false;
        var obj = {
            url: '/flibbertyJibbet',
            normalizeError: function (e, xhr, type) {
                return xhr.response || xhr.responseText;
            },
            responseType: 'text',
            method: ''
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            result = x;
        }, null, function () {
            complete = true;
        });
        chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 300,
            'contentType': 'text/plain',
            'responseText': 'Wee! I am text!'
        });
        chai_1.expect(result.xhr).exist;
        chai_1.expect(result.response).to.deep.equal('Wee! I am text!');
        chai_1.expect(complete).to.be.true;
    });
    it('should fail if fails to parse error response', function () {
        var error;
        var obj = {
            url: '/flibbertyJibbet',
            normalizeError: function (e, xhr, type) {
                return xhr.response || xhr.responseText;
            },
            responseType: 'json',
            method: ''
        };
        ajax_1.ajax(obj).subscribe(function (x) {
            throw 'should not next';
        }, function (err) {
            error = err;
        }, function () {
            throw 'should not complete';
        });
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 404,
            'contentType': '',
            'responseType': '',
            'responseText': 'Wee! I am text, but should be valid JSON!'
        });
        chai_1.expect(error instanceof SyntaxError).to.be.true;
        chai_1.expect(error.message).to.equal('Unexpected token W in JSON at position 0');
    });
    it('should succeed no settings', function () {
        var expected = JSON.stringify({ foo: 'bar' });
        ajax_1.ajax('/flibbertyJibbet')
            .subscribe(function (x) {
            chai_1.expect(x.status).to.equal(200);
            chai_1.expect(x.xhr.method).to.equal('GET');
            chai_1.expect(x.xhr.responseText).to.equal(expected);
        }, function () {
            throw 'should not have been called';
        });
        chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 200,
            'contentType': 'text/plain',
            'responseText': expected
        });
    });
    it('should fail no settings', function () {
        var expected = JSON.stringify({ foo: 'bar' });
        ajax_1.ajax('/flibbertyJibbet')
            .subscribe(function () {
            throw 'should not have been called';
        }, function (x) {
            chai_1.expect(x.status).to.equal(500);
            chai_1.expect(x.xhr.method).to.equal('GET');
            chai_1.expect(x.xhr.responseText).to.equal(expected);
        }, function () {
            throw 'should not have been called';
        });
        chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        MockXMLHttpRequest.mostRecent.respondWith({
            'status': 500,
            'contentType': 'text/plain',
            'responseText': expected
        });
    });
    it('should create an asynchronous request', function () {
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            timeout: 10
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            chai_1.expect(x.status).to.equal(200);
            chai_1.expect(x.xhr.method).to.equal('GET');
            chai_1.expect(x.xhr.async).to.equal(true);
            chai_1.expect(x.xhr.timeout).to.equal(10);
            chai_1.expect(x.xhr.responseType).to.equal('text');
        }, function () {
            throw 'should not have been called';
        });
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.url).to.equal('/flibbertyJibbet');
        request.respondWith({
            'status': 200,
            'contentType': 'text/plain',
            'responseText': 'Wee! I am text!'
        });
    });
    it('should error on timeout of asynchronous request', function () {
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            timeout: 10
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            throw 'should not have been called';
        }, function (e) {
            chai_1.expect(e.status).to.equal(0);
            chai_1.expect(e.xhr.method).to.equal('GET');
            chai_1.expect(e.xhr.async).to.equal(true);
            chai_1.expect(e.xhr.timeout).to.equal(10);
            chai_1.expect(e.xhr.responseType).to.equal('text');
        });
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.url).to.equal('/flibbertyJibbet');
        rxTestScheduler.schedule(function () {
            request.respondWith({
                'status': 200,
                'contentType': 'text/plain',
                'responseText': 'Wee! I am text!'
            });
        }, 1000);
        rxTestScheduler.flush();
    });
    it('should create a synchronous request', function () {
        var obj = {
            url: '/flibbertyJibbet',
            responseType: 'text',
            timeout: 10,
            async: false
        };
        ajax_1.ajax(obj)
            .subscribe(function (x) {
            chai_1.expect(x.status).to.equal(200);
            chai_1.expect(x.xhr.method).to.equal('GET');
            chai_1.expect(x.xhr.async).to.equal(false);
            chai_1.expect(x.xhr.timeout).to.be.undefined;
            chai_1.expect(x.xhr.responseType).to.equal('');
        }, function () {
            throw 'should not have been called';
        });
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(request.url).to.equal('/flibbertyJibbet');
        request.respondWith({
            'status': 200,
            'contentType': 'text/plain',
            'responseText': 'Wee! I am text!'
        });
    });
    describe('ajax request body', function () {
        var rFormData;
        beforeEach(function () {
            rFormData = root_1.root.FormData;
            root_1.root.FormData = root_1.root.FormData || (function () {
                function FormData() {
                }
                return FormData;
            }());
        });
        afterEach(function () {
            root_1.root.FormData = rFormData;
        });
        it('can take string body', function () {
            var obj = {
                url: '/flibbertyJibbet',
                method: '',
                body: 'foobar'
            };
            ajax_1.ajax(obj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
            chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('foobar');
        });
        it('can take FormData body', function () {
            var body = new root_1.root.FormData();
            var obj = {
                url: '/flibbertyJibbet',
                method: '',
                body: body
            };
            ajax_1.ajax(obj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
            chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.deep.equal(body);
            chai_1.expect(MockXMLHttpRequest.mostRecent.requestHeaders).to.deep.equal({});
        });
        it('should not fail when FormData is undefined', function () {
            root_1.root.FormData = void 0;
            var obj = {
                url: '/flibbertyJibbet',
                method: '',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: { '🌟': '🚀' }
            };
            ajax_1.ajax(obj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
        });
        it('should send by form-urlencoded format', function () {
            var body = {
                '🌟': '🚀'
            };
            var obj = {
                url: '/flibbertyJibbet',
                method: '',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            };
            ajax_1.ajax(obj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
            chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('%F0%9F%8C%9F=%F0%9F%9A%80');
        });
        it('should send by JSON', function () {
            var body = {
                '🌟': '🚀'
            };
            var obj = {
                url: '/flibbertyJibbet',
                method: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            };
            ajax_1.ajax(obj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
            chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('{"🌟":"🚀"}');
        });
        it('should send json body not mattered on case-sensitivity of HTTP headers', function () {
            var body = {
                hello: 'world'
            };
            var requestObj = {
                url: '/flibbertyJibbet',
                method: '',
                body: body,
                headers: {
                    'cOnTeNt-TyPe': 'application/json; charset=UTF-8'
                }
            };
            ajax_1.ajax(requestObj).subscribe();
            chai_1.expect(MockXMLHttpRequest.mostRecent.url).to.equal('/flibbertyJibbet');
            chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('{"hello":"world"}');
        });
        it('should error if send request throws', function (done) {
            var expected = new Error('xhr send failure');
            var obj = {
                url: '/flibbertyJibbet',
                responseType: 'text',
                method: '',
                body: 'foobar',
                createXHR: function () {
                    var ret = new MockXMLHttpRequest();
                    ret.send = function () {
                        throw expected;
                    };
                    return ret;
                }
            };
            ajax_1.ajax(obj)
                .subscribe(function () {
                done(new Error('should not be called'));
            }, function (e) {
                chai_1.expect(e).to.be.equal(expected);
                done();
            }, function () {
                done(new Error('should not be called'));
            });
        });
    });
    describe('ajax.get', function () {
        it('should succeed on 200', function () {
            var expected = { foo: 'bar' };
            var result;
            var complete = false;
            ajax_1.ajax.get('/flibbertyJibbet')
                .subscribe(function (x) {
                result = x.response;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(expected)
            });
            chai_1.expect(result).to.deep.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should succeed on 204 No Content', function () {
            var expected = null;
            var result;
            var complete = false;
            ajax_1.ajax.get('/flibbertyJibbet')
                .subscribe(function (x) {
                result = x.response;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            request.respondWith({
                'status': 204,
                'contentType': 'application/json',
                'responseText': expected
            });
            chai_1.expect(result).to.deep.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should able to select json response via getJSON', function () {
            var expected = { foo: 'bar' };
            var result;
            var complete = false;
            ajax_1.ajax.getJSON('/flibbertyJibbet')
                .subscribe(function (x) {
                result = x;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(expected)
            });
            chai_1.expect(result).to.deep.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
    });
    describe('ajax.post', function () {
        it('should succeed on 200', function () {
            var expected = { foo: 'bar', hi: 'there you' };
            var result;
            var complete = false;
            ajax_1.ajax.post('/flibbertyJibbet', expected)
                .subscribe(function (x) {
                result = x;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.method).to.equal('POST');
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            chai_1.expect(request.requestHeaders).to.deep.equal({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(expected)
            });
            chai_1.expect(request.data).to.equal('foo=bar&hi=there%20you');
            chai_1.expect(result.response).to.deep.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should properly encode full URLs passed', function () {
            var expected = { test: 'https://google.com/search?q=encodeURI+vs+encodeURIComponent' };
            var result;
            var complete = false;
            ajax_1.ajax.post('/flibbertyJibbet', expected)
                .subscribe(function (x) {
                result = x;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.method).to.equal('POST');
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            chai_1.expect(request.requestHeaders).to.deep.equal({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify(expected)
            });
            chai_1.expect(request.data)
                .to.equal('test=https%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3DencodeURI%2Bvs%2BencodeURIComponent');
            chai_1.expect(result.response).to.deep.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should succeed on 204 No Content', function () {
            var expected = null;
            var result;
            var complete = false;
            ajax_1.ajax.post('/flibbertyJibbet', expected)
                .subscribe(function (x) {
                result = x;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.method).to.equal('POST');
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            chai_1.expect(request.requestHeaders).to.deep.equal({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            request.respondWith({
                'status': 204,
                'contentType': 'application/json',
                'responseType': 'json',
                'responseText': expected
            });
            chai_1.expect(result.response).to.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should succeed in IE on 204 No Content', function () {
            var expected = null;
            var result;
            var complete = false;
            root_1.root.XMLHttpRequest = MockXMLHttpRequestInternetExplorer;
            ajax_1.ajax.post('/flibbertyJibbet', expected)
                .subscribe(function (x) {
                result = x;
            }, null, function () {
                complete = true;
            });
            var request = MockXMLHttpRequest.mostRecent;
            chai_1.expect(request.method).to.equal('POST');
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            chai_1.expect(request.requestHeaders).to.deep.equal({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            request.respondWith({
                'status': 204,
                'contentType': 'application/json'
            });
            chai_1.expect(result.response).to.equal(expected);
            chai_1.expect(complete).to.be.true;
        });
        it('should emit progress event when progressSubscriber is specified', function () {
            var spy = sinon.spy();
            var progressSubscriber = {
                next: spy,
                error: function () {
                },
                complete: function () {
                }
            };
            ajax_1.ajax({
                url: '/flibbertyJibbet',
                progressSubscriber: progressSubscriber
            })
                .subscribe();
            var request = MockXMLHttpRequest.mostRecent;
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({})
            }, 3);
            chai_1.expect(spy).to.be.calledThrice;
        });
        it('should emit progress event when progressSubscriber is specified in IE', function () {
            var spy = sinon.spy();
            var progressSubscriber = {
                next: spy,
                error: function () {
                },
                complete: function () {
                }
            };
            root_1.root.XMLHttpRequest = MockXMLHttpRequestInternetExplorer;
            root_1.root.XDomainRequest = MockXMLHttpRequestInternetExplorer;
            ajax_1.ajax({
                url: '/flibbertyJibbet',
                progressSubscriber: progressSubscriber
            })
                .subscribe();
            var request = MockXMLHttpRequest.mostRecent;
            request.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({})
            }, 3);
            chai_1.expect(spy.callCount).to.equal(3);
        });
    });
    it('should work fine when XMLHttpRequest onreadystatechange property is monkey patched', function () {
        Object.defineProperty(root_1.root.XMLHttpRequest.prototype, 'onreadystatechange', {
            set: function (fn) {
                var _this = this;
                var wrapFn = function (ev) {
                    var result = fn.call(_this, ev);
                    if (result === false) {
                        ev.preventDefault();
                    }
                };
                this['_onreadystatechange'] = wrapFn;
            },
            get: function () {
                return this['_onreadystatechange'];
            },
            configurable: true
        });
        ajax_1.ajax({
            url: '/flibbertyJibbet'
        })
            .subscribe();
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(function () {
            request.onreadystatechange('onreadystatechange');
        }).not.throw();
        delete root_1.root.XMLHttpRequest.prototype.onreadystatechange;
    });
    it('should work fine when XMLHttpRequest ontimeout property is monkey patched', function (done) {
        Object.defineProperty(root_1.root.XMLHttpRequest.prototype, 'ontimeout', {
            set: function (fn) {
                var _this = this;
                var wrapFn = function (ev) {
                    var result = fn.call(_this, ev);
                    if (result === false) {
                        ev.preventDefault();
                    }
                };
                this['_ontimeout'] = wrapFn;
            },
            get: function () {
                return this['_ontimeout'];
            },
            configurable: true
        });
        var ajaxRequest = {
            url: '/flibbertyJibbet'
        };
        ajax_1.ajax(ajaxRequest)
            .subscribe({
            error: function (err) {
                chai_1.expect(err.name).to.equal('AjaxTimeoutError');
                done();
            }
        });
        var request = MockXMLHttpRequest.mostRecent;
        try {
            request.ontimeout('ontimeout');
        }
        catch (e) {
            chai_1.expect(e.message).to.equal(new ajax_1.AjaxTimeoutError(request, ajaxRequest).message);
        }
        delete root_1.root.XMLHttpRequest.prototype.ontimeout;
    });
    it('should work fine when XMLHttpRequest onprogress property is monkey patched', function () {
        Object.defineProperty(root_1.root.XMLHttpRequest.prototype, 'onprogress', {
            set: function (fn) {
                var _this = this;
                var wrapFn = function (ev) {
                    var result = fn.call(_this, ev);
                    if (result === false) {
                        ev.preventDefault();
                    }
                };
                this['_onprogress'] = wrapFn;
            },
            get: function () {
                return this['_onprogress'];
            },
            configurable: true
        });
        ajax_1.ajax({
            url: '/flibbertyJibbet',
            progressSubscriber: {
                next: function () {
                },
                error: function () {
                },
                complete: function () {
                }
            }
        })
            .subscribe();
        var request = MockXMLHttpRequest.mostRecent;
        chai_1.expect(function () {
            request.upload.onprogress('onprogress');
        }).not.throw();
        delete root_1.root.XMLHttpRequest.prototype.onprogress;
        delete root_1.root.XMLHttpRequest.prototype.upload;
    });
    it('should work fine when XMLHttpRequest onerror property is monkey patched', function () {
        Object.defineProperty(root_1.root.XMLHttpRequest.prototype, 'onerror', {
            set: function (fn) {
                var _this = this;
                var wrapFn = function (ev) {
                    var result = fn.call(_this, ev);
                    if (result === false) {
                        ev.preventDefault();
                    }
                };
                this['_onerror'] = wrapFn;
            },
            get: function () {
                return this['_onerror'];
            },
            configurable: true
        });
        ajax_1.ajax({
            url: '/flibbertyJibbet'
        })
            .subscribe({
            error: function (err) {
            }
        });
        var request = MockXMLHttpRequest.mostRecent;
        try {
            request.onerror('onerror');
        }
        catch (e) {
            chai_1.expect(e.message).to.equal('ajax error');
        }
        delete root_1.root.XMLHttpRequest.prototype.onerror;
        delete root_1.root.XMLHttpRequest.prototype.upload;
    });
    describe('ajax.patch', function () {
        it('should create an AjaxObservable with correct options', function () {
            var body = { foo: 'bar' };
            var headers = { first: 'first' };
            var request = ajax_1.ajax.patch('/flibbertyJibbet', body, headers).request;
            chai_1.expect(request.method).to.equal('PATCH');
            chai_1.expect(request.url).to.equal('/flibbertyJibbet');
            chai_1.expect(request.body).to.equal(body);
            chai_1.expect(request.headers).to.equal(headers);
        });
    });
    describe('ajax error classes', function () {
        describe('AjaxError', function () {
            it('should extend Error class', function () {
                var error = new ajax_1.AjaxError('Test error', new XMLHttpRequest(), {});
                chai_1.expect(error).to.be.an.instanceOf(Error);
            });
        });
        describe('AjaxTimeoutError', function () {
            it('should extend Error class', function () {
                var error = new ajax_1.AjaxTimeoutError(new XMLHttpRequest(), {});
                chai_1.expect(error).to.be.an.instanceOf(Error);
            });
            it('should extend AjaxError class', function () {
                var error = new ajax_1.AjaxTimeoutError(new XMLHttpRequest(), {});
                chai_1.expect(error).to.be.an.instanceOf(ajax_1.AjaxError);
            });
        });
    });
});
var MockXMLHttpRequest = (function () {
    function MockXMLHttpRequest() {
        this.responseType = '';
        this.eventHandlers = [];
        this.readyState = 0;
        this.async = true;
        this.requestHeaders = {};
        this.withCredentials = false;
        this.upload = {};
        this.previousRequest = MockXMLHttpRequest.recentRequest;
        MockXMLHttpRequest.recentRequest = this;
        MockXMLHttpRequest.requests.push(this);
    }
    Object.defineProperty(MockXMLHttpRequest, "mostRecent", {
        get: function () {
            return MockXMLHttpRequest.recentRequest;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockXMLHttpRequest, "allRequests", {
        get: function () {
            return MockXMLHttpRequest.requests;
        },
        enumerable: true,
        configurable: true
    });
    MockXMLHttpRequest.clearRequest = function () {
        MockXMLHttpRequest.requests.length = 0;
        MockXMLHttpRequest.recentRequest = null;
    };
    MockXMLHttpRequest.prototype.send = function (data) {
        var _this = this;
        this.data = data;
        if (this.timeout && this.timeout > 0) {
            setTimeout(function () {
                if (_this.readyState != 4) {
                    _this.readyState = 4;
                    _this.status = 0;
                    _this.triggerEvent('readystatechange');
                    _this.triggerEvent('timeout');
                }
            }, this.timeout);
        }
    };
    MockXMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.method = method;
        this.url = url;
        this.async = async;
        this.user = user;
        this.password = password;
        this.readyState = 1;
        this.triggerEvent('readystatechange');
        var originalProgressHandler = this.upload.onprogress;
        Object.defineProperty(this.upload, 'progress', {
            get: function () {
                return originalProgressHandler;
            }
        });
    };
    MockXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        this.requestHeaders[key] = value;
    };
    MockXMLHttpRequest.prototype.jsonResponseValue = function (response) {
        try {
            this.response = JSON.parse(response.responseText);
        }
        catch (err) {
            throw new Error('unable to JSON.parse: \n' + response.responseText);
        }
    };
    MockXMLHttpRequest.prototype.defaultResponseValue = function () {
        if (this.async === false) {
            this.response = this.responseText;
        }
    };
    MockXMLHttpRequest.prototype.respondWith = function (response, progressTimes) {
        if (progressTimes) {
            for (var i = 1; i <= progressTimes; ++i) {
                this.triggerUploadEvent('progress', { type: 'ProgressEvent', total: progressTimes, loaded: i });
            }
        }
        this.readyState = 4;
        this.responseHeaders = {
            'Content-Type': response.contentType || 'text/plain'
        };
        this.status = response.status || 200;
        this.responseText = response.responseText;
        var responseType = response.responseType !== undefined ? response.responseType : this.responseType;
        if (!('response' in response)) {
            switch (responseType) {
                case 'json':
                    this.jsonResponseValue(response);
                    break;
                case 'text':
                    this.response = response.responseText;
                    break;
                default:
                    this.defaultResponseValue();
            }
        }
        this.triggerEvent('load');
        this.triggerEvent('readystatechange');
    };
    MockXMLHttpRequest.prototype.triggerEvent = function (name, eventObj) {
        var e = eventObj || { type: name };
        if (this['on' + name]) {
            this['on' + name](e);
        }
    };
    MockXMLHttpRequest.prototype.triggerUploadEvent = function (name, eventObj) {
        var e = eventObj || {};
        if (this.upload['on' + name]) {
            this.upload['on' + name](e);
        }
    };
    MockXMLHttpRequest.requests = [];
    return MockXMLHttpRequest;
}());
var MockXMLHttpRequestInternetExplorer = (function (_super) {
    __extends(MockXMLHttpRequestInternetExplorer, _super);
    function MockXMLHttpRequestInternetExplorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockXMLHttpRequestInternetExplorer.prototype.mockHttp204 = function () {
        this.responseType = '';
        this.responseText = '';
        this.response = '';
    };
    MockXMLHttpRequestInternetExplorer.prototype.jsonResponseValue = function (response) {
        if (this.status == 204) {
            this.mockHttp204();
            return;
        }
        return _super.prototype.jsonResponseValue.call(this, response);
    };
    MockXMLHttpRequestInternetExplorer.prototype.defaultResponseValue = function () {
        if (this.status == 204) {
            this.mockHttp204();
            return;
        }
        return _super.prototype.defaultResponseValue.call(this);
    };
    MockXMLHttpRequestInternetExplorer.prototype.triggerUploadEvent = function (name, eventObj) {
        var e = eventObj || {};
        if (this['on' + name]) {
            this['on' + name](e);
        }
    };
    return MockXMLHttpRequestInternetExplorer;
}(MockXMLHttpRequest));
//# sourceMappingURL=ajax-spec.js.map