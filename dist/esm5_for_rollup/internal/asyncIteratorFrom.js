import { __asyncGenerator, __await, __generator } from "tslib";
import { Deferred } from './util/deferred';
export function asyncIteratorFrom(source) {
    return coroutine(source);
}
function coroutine(source) {
    return __asyncGenerator(this, arguments, function coroutine_1() {
        var deferreds, values, hasError, error, completed, subs, d, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deferreds = [];
                    values = [];
                    hasError = false;
                    error = null;
                    completed = false;
                    subs = source.subscribe({
                        next: function (value) {
                            if (deferreds.length > 0) {
                                deferreds.shift().resolve({ value: value, done: false });
                            }
                            else {
                                values.push(value);
                            }
                        },
                        error: function (err) {
                            hasError = true;
                            error = err;
                            while (deferreds.length > 0) {
                                deferreds.shift().reject(err);
                            }
                        },
                        complete: function () {
                            completed = true;
                            while (deferreds.length > 0) {
                                deferreds.shift().resolve({ value: undefined, done: true });
                            }
                        },
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 16, 17, 18]);
                    _a.label = 2;
                case 2:
                    if (!true) return [3, 15];
                    if (!(values.length > 0)) return [3, 5];
                    return [4, __await(values.shift())];
                case 3: return [4, _a.sent()];
                case 4:
                    _a.sent();
                    return [3, 14];
                case 5:
                    if (!completed) return [3, 7];
                    return [4, __await(void 0)];
                case 6: return [2, _a.sent()];
                case 7:
                    if (!hasError) return [3, 8];
                    throw error;
                case 8:
                    d = new Deferred();
                    deferreds.push(d);
                    return [4, __await(d.promise)];
                case 9:
                    result = _a.sent();
                    if (!result.done) return [3, 11];
                    return [4, __await(void 0)];
                case 10: return [2, _a.sent()];
                case 11: return [4, __await(result.value)];
                case 12: return [4, _a.sent()];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14: return [3, 2];
                case 15: return [3, 18];
                case 16:
                    err_1 = _a.sent();
                    throw err_1;
                case 17:
                    subs.unsubscribe();
                    return [7];
                case 18: return [2];
            }
        });
    });
}
//# sourceMappingURL=asyncIteratorFrom.js.map