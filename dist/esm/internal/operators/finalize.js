import { subscribeWith } from '../util/subscribeWith';
export function finalize(callback) {
    return (source) => source.lift(new FinallyOperator(callback));
}
class FinallyOperator {
    constructor(callback) {
        this.callback = callback;
    }
    call(subscriber, source) {
        const subscription = subscribeWith(source, subscriber);
        subscription.add(this.callback);
        return subscription;
    }
}
//# sourceMappingURL=finalize.js.map