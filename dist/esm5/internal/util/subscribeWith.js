export function subscribeWith(observable, subscriber) {
    var subscription = observable.subscribe(subscriber);
    if (subscription !== subscriber) {
        subscriber.add(subscription);
    }
    return subscriber;
}
//# sourceMappingURL=subscribeWith.js.map