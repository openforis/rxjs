"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('throwIfEmpty', function () {
    describe('with errorFactory', function () {
        it('should error when empty', function () {
            var source = marble_testing_1.cold('----|');
            var expected = '----#';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty(function () { return new Error('test'); }))).toBe(expected, undefined, new Error('test'));
        });
        it('should throw if empty', function () {
            var error = new Error('So empty inside');
            var thrown;
            rxjs_1.EMPTY.pipe(operators_1.throwIfEmpty(function () { return error; }))
                .subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.equal(error);
        });
        it('should NOT throw if NOT empty', function () {
            var error = new Error('So empty inside');
            var thrown;
            rxjs_1.of('test').pipe(operators_1.throwIfEmpty(function () { return error; }))
                .subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.be.undefined;
        });
        it('should pass values through', function () {
            var source = marble_testing_1.cold('----a---b---c---|');
            var sub1 = '^               !';
            var expected = '----a---b---c---|';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty(function () { return new Error('test'); }))).toBe(expected);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should never when never', function () {
            var source = marble_testing_1.cold('-');
            var sub1 = '^';
            var expected = '-';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty(function () { return new Error('test'); }))).toBe(expected);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should error when empty', function () {
            var source = marble_testing_1.cold('----|');
            var sub1 = '^   !';
            var expected = '----#';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty(function () { return new Error('test'); }))).toBe(expected, undefined, new Error('test'));
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should throw if empty after retry', function () {
            var error = new Error('So empty inside');
            var thrown;
            var sourceIsEmpty = false;
            var source = rxjs_1.defer(function () {
                if (sourceIsEmpty) {
                    return rxjs_1.EMPTY;
                }
                sourceIsEmpty = true;
                return rxjs_1.of(1, 2);
            });
            source.pipe(operators_1.throwIfEmpty(function () { return error; }), operators_1.mergeMap(function (value) {
                if (value > 1) {
                    return rxjs_1.throwError(new Error());
                }
                return rxjs_1.of(value);
            }), operators_1.retry(1)).subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.equal(error);
        });
    });
    describe('without errorFactory', function () {
        it('should throw EmptyError if empty', function () {
            var thrown;
            rxjs_1.EMPTY.pipe(operators_1.throwIfEmpty())
                .subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.be.instanceof(rxjs_1.EmptyError);
        });
        it('should NOT throw if NOT empty', function () {
            var thrown;
            rxjs_1.of('test').pipe(operators_1.throwIfEmpty())
                .subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.be.undefined;
        });
        it('should pass values through', function () {
            var source = marble_testing_1.cold('----a---b---c---|');
            var sub1 = '^               !';
            var expected = '----a---b---c---|';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty())).toBe(expected);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should never when never', function () {
            var source = marble_testing_1.cold('-');
            var sub1 = '^';
            var expected = '-';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty())).toBe(expected);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should error when empty', function () {
            var source = marble_testing_1.cold('----|');
            var sub1 = '^   !';
            var expected = '----#';
            marble_testing_1.expectObservable(source.pipe(operators_1.throwIfEmpty())).toBe(expected, undefined, new rxjs_1.EmptyError());
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sub1]);
        });
        it('should throw if empty after retry', function () {
            var thrown;
            var sourceIsEmpty = false;
            var source = rxjs_1.defer(function () {
                if (sourceIsEmpty) {
                    return rxjs_1.EMPTY;
                }
                sourceIsEmpty = true;
                return rxjs_1.of(1, 2);
            });
            source.pipe(operators_1.throwIfEmpty(), operators_1.mergeMap(function (value) {
                if (value > 1) {
                    return rxjs_1.throwError(new Error());
                }
                return rxjs_1.of(value);
            }), operators_1.retry(1)).subscribe({
                error: function (err) {
                    thrown = err;
                }
            });
            chai_1.expect(thrown).to.be.instanceof(rxjs_1.EmptyError);
        });
    });
});
//# sourceMappingURL=throwIfEmpty-spec.js.map