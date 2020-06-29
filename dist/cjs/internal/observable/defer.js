"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
var Observable_1 = require("../Observable");
var from_1 = require("./from");
var empty_1 = require("./empty");
function defer(observableFactory) {
    return new Observable_1.Observable(function (subscriber) {
        var input;
        try {
            input = observableFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = input ? from_1.from(input) : empty_1.EMPTY;
        return source.subscribe(subscriber);
    });
}
exports.defer = defer;
//# sourceMappingURL=defer.js.map