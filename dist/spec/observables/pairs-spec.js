"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('pairs', function () {
    asDiagram('pairs({a: 1, b:2})')('should create an observable emits key-value pair', function () {
        var e1 = rxjs_1.pairs({ a: 1, b: 2 }, rxTestScheduler);
        var expected = '(ab|)';
        var values = {
            a: ['a', 1],
            b: ['b', 2]
        };
        marble_testing_1.expectObservable(e1).toBe(expected, values);
    });
    it('should create an observable without scheduler', function (done) {
        var expected = [
            ['a', 1],
            ['b', 2],
            ['c', 3]
        ];
        rxjs_1.pairs({ a: 1, b: 2, c: 3 }).subscribe(function (x) {
            chai_1.expect(x).to.deep.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected).to.be.empty;
            done();
        });
    });
    it('should work with empty object', function () {
        var e1 = rxjs_1.pairs({}, rxTestScheduler);
        var expected = '|';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
});
//# sourceMappingURL=pairs-spec.js.map