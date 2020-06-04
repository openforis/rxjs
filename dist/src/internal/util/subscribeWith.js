"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function subscribeWith(observable, subscriber) {
    var subscription = observable.subscribe(subscriber);
    if (subscription !== subscriber) {
        subscriber.add(subscription);
    }
    return subscriber;
}
exports.subscribeWith = subscribeWith;
//# sourceMappingURL=subscribeWith.js.map