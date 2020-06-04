import { __asyncGenerator, __await } from "tslib";
import { Deferred } from './util/deferred';
export function asyncIteratorFrom(source) {
    return coroutine(source);
}
function coroutine(source) {
    return __asyncGenerator(this, arguments, function* coroutine_1() {
        const deferreds = [];
        const values = [];
        let hasError = false;
        let error = null;
        let completed = false;
        const subs = source.subscribe({
            next: value => {
                if (deferreds.length > 0) {
                    deferreds.shift().resolve({ value, done: false });
                }
                else {
                    values.push(value);
                }
            },
            error: err => {
                hasError = true;
                error = err;
                while (deferreds.length > 0) {
                    deferreds.shift().reject(err);
                }
            },
            complete: () => {
                completed = true;
                while (deferreds.length > 0) {
                    deferreds.shift().resolve({ value: undefined, done: true });
                }
            },
        });
        try {
            while (true) {
                if (values.length > 0) {
                    yield yield __await(values.shift());
                }
                else if (completed) {
                    return yield __await(void 0);
                }
                else if (hasError) {
                    throw error;
                }
                else {
                    const d = new Deferred();
                    deferreds.push(d);
                    const result = yield __await(d.promise);
                    if (result.done) {
                        return yield __await(void 0);
                    }
                    else {
                        yield yield __await(result.value);
                    }
                }
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            subs.unsubscribe();
        }
    });
}
//# sourceMappingURL=asyncIteratorFrom.js.map