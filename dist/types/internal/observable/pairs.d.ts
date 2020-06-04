import { Observable } from '../Observable';
import { SchedulerAction, SchedulerLike } from '../types';
import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
/**
 * Convert an object into an Observable of `[key, value]` pairs.
 *
 * <span class="informal">Turn entries of an object into a stream.</span>
 *
 * ![](pairs.png)
 *
 * `pairs` takes an arbitrary object and returns an Observable that emits arrays. Each
 * emitted array has exactly two elements - the first is a key from the object
 * and the second is a value corresponding to that key. Keys are extracted from
 * an object via `Object.keys` function, which means that they will be only
 * enumerable keys that are present on an object directly - not ones inherited
 * via prototype chain.
 *
 * By default these arrays are emitted synchronously. To change that you can
 * pass a {@link SchedulerLike} as a second argument to `pairs`.
 *
 * ## Example
 * ### Converts an object to an Observable
 * ```ts
 * import { pairs } from 'rxjs';
 *
 * const obj = {
 *   foo: 42,
 *   bar: 56,
 *   baz: 78
 * };
 *
 * pairs(obj).subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('Complete!')
 * });
 *
 * // Logs:
 * // ["foo", 42],
 * // ["bar", 56],
 * // ["baz", 78],
 * // "Complete!"
 * ```
 *
 * @param {Object} obj The object to inspect and turn into an
 * Observable sequence.
 * @param {Scheduler} [scheduler] An optional IScheduler to schedule
 * when resulting Observable will emit values.
 * @returns {(Observable<Array<string|T>>)} An observable sequence of
 * [key, value] pairs from the object.
 */
export declare function pairs<T>(obj: Object, scheduler?: SchedulerLike): Observable<[string, T]>;
/** @internal */
export declare function dispatch<T>(this: SchedulerAction<any>, state: {
    keys: string[];
    index: number;
    subscriber: Subscriber<[string, T]>;
    subscription: Subscription;
    obj: Object;
}): void;
//# sourceMappingURL=pairs.d.ts.map