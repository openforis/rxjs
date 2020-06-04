import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
import { subscribeWith } from '../util/subscribeWith';
export function finalize(callback) {
    return (source) => source.lift(new FinallyOperator(callback));
}
class FinallyOperator {
    constructor(callback) {
        this.callback = callback;
    }
    call(subscriber, source) {
        return subscribeWith(source, new FinallySubscriber(subscriber, this.callback));
    }
}
class FinallySubscriber extends Subscriber {
    constructor(destination, callback) {
        super(destination);
        this.add(new Subscription(callback));
    }
}
//# sourceMappingURL=finalize.js.map