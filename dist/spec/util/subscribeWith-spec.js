"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var subscribeWith_1 = require("rxjs/internal/util/subscribeWith");
var interop_helper_1 = require("../helpers/interop-helper");
describe('subscribeWith', function () {
    it('should return the subscriber for interop observables', function () {
        var observable = interop_helper_1.asInteropObservable(rxjs_1.of(42));
        var subscriber = new rxjs_1.Subscriber();
        var subscription = subscribeWith_1.subscribeWith(observable, subscriber);
        chai_1.expect(subscription).to.equal(subscriber);
    });
    it('should return the subscriber for interop subscribers', function () {
        var observable = rxjs_1.of(42);
        var subscriber = interop_helper_1.asInteropSubscriber(new rxjs_1.Subscriber());
        var subscription = subscribeWith_1.subscribeWith(observable, subscriber);
        chai_1.expect(subscription).to.equal(subscriber);
    });
});
//# sourceMappingURL=subscribeWith-spec.js.map