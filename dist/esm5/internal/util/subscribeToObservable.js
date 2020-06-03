import { observable as Symbol_observable } from '../symbol/observable';
import { subscribeWith } from './subscribeWith';
export var subscribeToObservable = function (obj) { return function (subscriber) {
    var obs = obj[Symbol_observable]();
    if (typeof obs.subscribe !== 'function') {
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    }
    else {
        return subscribeWith(obs, subscriber);
    }
}; };
//# sourceMappingURL=subscribeToObservable.js.map