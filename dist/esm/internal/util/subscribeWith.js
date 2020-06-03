export function subscribeWith(observable, subscriber) {
    const subscription = observable.subscribe(subscriber);
    if (subscription !== subscriber) {
        subscriber.add(subscription);
    }
    return subscriber;
}
//# sourceMappingURL=subscribeWith.js.map