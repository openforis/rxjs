import { subscribeWith } from '../util/subscribeWith';
export function finalize(callback) {
    return function (source) { return source.lift(new FinallyOperator(callback)); };
}
var FinallyOperator = (function () {
    function FinallyOperator(callback) {
        this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
        var subscription = subscribeWith(source, subscriber);
        subscription.add(this.callback);
        return subscription;
    };
    return FinallyOperator;
}());
//# sourceMappingURL=finalize.js.map