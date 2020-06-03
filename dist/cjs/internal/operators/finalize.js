"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalize = void 0;
var subscribeWith_1 = require("../util/subscribeWith");
function finalize(callback) {
    return function (source) { return source.lift(new FinallyOperator(callback)); };
}
exports.finalize = finalize;
var FinallyOperator = (function () {
    function FinallyOperator(callback) {
        this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
        var subscription = subscribeWith_1.subscribeWith(source, subscriber);
        subscription.add(this.callback);
        return subscription;
    };
    return FinallyOperator;
}());
//# sourceMappingURL=finalize.js.map