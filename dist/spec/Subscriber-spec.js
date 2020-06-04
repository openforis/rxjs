"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Subscriber_1 = require("rxjs/internal/Subscriber");
var rxjs_1 = require("rxjs");
describe('Subscriber', function () {
    it('should ignore next messages after unsubscription', function () {
        var times = 0;
        var sub = new rxjs_1.Subscriber({
            next: function () { times += 1; }
        });
        sub.next();
        sub.next();
        sub.unsubscribe();
        sub.next();
        chai_1.expect(times).to.equal(2);
    });
    it('should wrap unsafe observers in a safe subscriber', function () {
        var observer = {
            next: function (x) { },
            error: function (err) { },
            complete: function () { }
        };
        var subscriber = new rxjs_1.Subscriber(observer);
        chai_1.expect(subscriber.destination).not.to.equal(observer);
        chai_1.expect(subscriber.destination).to.be.an.instanceof(Subscriber_1.SafeSubscriber);
    });
    it('should ignore error messages after unsubscription', function () {
        var times = 0;
        var errorCalled = false;
        var sub = new rxjs_1.Subscriber({
            next: function () { times += 1; },
            error: function () { errorCalled = true; }
        });
        sub.next();
        sub.next();
        sub.unsubscribe();
        sub.next();
        sub.error();
        chai_1.expect(times).to.equal(2);
        chai_1.expect(errorCalled).to.be.false;
    });
    it('should ignore complete messages after unsubscription', function () {
        var times = 0;
        var completeCalled = false;
        var sub = new rxjs_1.Subscriber({
            next: function () { times += 1; },
            complete: function () { completeCalled = true; }
        });
        sub.next();
        sub.next();
        sub.unsubscribe();
        sub.next();
        sub.complete();
        chai_1.expect(times).to.equal(2);
        chai_1.expect(completeCalled).to.be.false;
    });
    it('should not be closed when other subscriber with same observer instance completes', function () {
        var observer = {
            next: function () { }
        };
        var sub1 = new rxjs_1.Subscriber(observer);
        var sub2 = new rxjs_1.Subscriber(observer);
        sub2.complete();
        chai_1.expect(sub1.closed).to.be.false;
        chai_1.expect(sub2.closed).to.be.true;
    });
    it('should call complete observer without any arguments', function () {
        var argument = null;
        var observer = {
            complete: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                argument = args;
            }
        };
        var sub1 = new rxjs_1.Subscriber(observer);
        sub1.complete();
        chai_1.expect(argument).to.have.lengthOf(0);
    });
});
//# sourceMappingURL=Subscriber-spec.js.map