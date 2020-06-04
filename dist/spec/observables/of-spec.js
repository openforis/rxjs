"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
describe('of', function () {
    asDiagram('of(1, 2, 3)')('should create a cold observable that emits 1, 2, 3', function () {
        var e1 = rxjs_1.of(1, 2, 3).pipe(operators_1.concatMap(function (x, i) { return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : 20, rxTestScheduler)); }));
        var expected = 'x-y-(z|)';
        marble_testing_1.expectObservable(e1).toBe(expected, { x: 1, y: 2, z: 3 });
    });
    it('should create an observable from the provided values', function (done) {
        var x = { foo: 'bar' };
        var expected = [1, 'a', x];
        var i = 0;
        rxjs_1.of(1, 'a', x)
            .subscribe(function (y) {
            chai_1.expect(y).to.equal(expected[i++]);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should emit one value', function (done) {
        var calls = 0;
        rxjs_1.of(42).subscribe(function (x) {
            chai_1.expect(++calls).to.equal(1);
            chai_1.expect(x).to.equal(42);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should handle an Observable as the only value', function () {
        var source = rxjs_1.of(rxjs_1.of('a', 'b', 'c', rxTestScheduler), rxTestScheduler);
        var result = source.pipe(operators_1.concatAll());
        marble_testing_1.expectObservable(result).toBe('(abc|)');
    });
    it('should handle many Observable as the given values', function () {
        var source = rxjs_1.of(rxjs_1.of('a', 'b', 'c', rxTestScheduler), rxjs_1.of('d', 'e', 'f', rxTestScheduler), rxTestScheduler);
        var result = source.pipe(operators_1.concatAll());
        marble_testing_1.expectObservable(result).toBe('(abcdef|)');
    });
});
//# sourceMappingURL=of-spec.js.map