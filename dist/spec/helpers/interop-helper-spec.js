"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var observable_1 = require("rxjs/internal/symbol/observable");
var rxSubscriber_1 = require("rxjs/internal/symbol/rxSubscriber");
var interop_helper_1 = require("./interop-helper");
describe('interop helper', function () {
    it('should simulate interop observables', function () {
        var observable = interop_helper_1.asInteropObservable(rxjs_1.of(42));
        chai_1.expect(observable).to.not.be.instanceOf(rxjs_1.Observable);
        chai_1.expect(observable[observable_1.observable]).to.be.a('function');
    });
    it('should simulate interop subscribers', function () {
        var subscriber = interop_helper_1.asInteropSubscriber(new rxjs_1.Subscriber());
        chai_1.expect(subscriber).to.not.be.instanceOf(rxjs_1.Subscriber);
        chai_1.expect(subscriber[rxSubscriber_1.rxSubscriber]).to.be.undefined;
    });
});
//# sourceMappingURL=interop-helper-spec.js.map