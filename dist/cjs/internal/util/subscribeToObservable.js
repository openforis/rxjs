"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToObservable = void 0;
var observable_1 = require("../symbol/observable");
var subscribeWith_1 = require("./subscribeWith");
exports.subscribeToObservable = function (obj) { return function (subscriber) {
    var obs = obj[observable_1.observable]();
    if (typeof obs.subscribe !== 'function') {
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    }
    else {
        return subscribeWith_1.subscribeWith(obs, subscriber);
    }
}; };
//# sourceMappingURL=subscribeToObservable.js.map