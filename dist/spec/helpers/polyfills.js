"use strict";
if (typeof Symbol !== 'function') {
    var id_1 = 0;
    var symbolFn = function (description) {
        return "Symbol_" + id_1++ + " " + description + " (RxJS Testing Polyfill)";
    };
    Symbol = symbolFn;
}
if (!Symbol.observable) {
    Symbol.observable = Symbol('Symbol.observable polyfill from RxJS Testing');
}
//# sourceMappingURL=polyfills.js.map