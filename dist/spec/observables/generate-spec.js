"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function err() {
    throw 'error';
}
describe('generate', function () {
    asDiagram('generate(1, x => false, x => x + 1)')('should complete if condition does not meet', function () {
        var source = rxjs_1.generate(1, function (x) { return false; }, function (x) { return x + 1; });
        var expected = '|';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    asDiagram('generate(1, x => x == 1, x => x + 1)')('should produce first value immediately', function () {
        var source = rxjs_1.generate(1, function (x) { return x == 1; }, function (x) { return x + 1; });
        var expected = '(1|)';
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1 });
    });
    asDiagram('generate(1, x => x < 3, x => x + 1)')('should produce all values synchronously', function () {
        var source = rxjs_1.generate(1, function (x) { return x < 3; }, function (x) { return x + 1; });
        var expected = '(12|)';
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1, '2': 2 });
    });
    it('should use result selector', function () {
        var source = rxjs_1.generate(1, function (x) { return x < 3; }, function (x) { return x + 1; }, function (x) { return (x + 1).toString(); });
        var expected = '(23|)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should allow omit condition', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x + 1; },
            resultSelector: function (x) { return x.toString(); }
        }).pipe(operators_1.take(5));
        var expected = '(12345|)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should stop producing when unsubscribed', function () {
        var source = rxjs_1.generate(1, function (x) { return x < 4; }, function (x) { return x + 1; });
        var count = 0;
        var subscriber = new rxjs_1.Subscriber(function (x) {
            count++;
            if (x == 2) {
                subscriber.unsubscribe();
            }
        });
        source.subscribe(subscriber);
        chai_1.expect(count).to.be.equal(2);
    });
    it('should accept a scheduler', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            condition: function (x) { return x < 4; },
            iterate: function (x) { return x + 1; },
            resultSelector: function (x) { return x; },
            scheduler: rxTestScheduler
        });
        var expected = '(123|)';
        var count = 0;
        source.subscribe(function (x) { return count++; });
        chai_1.expect(count).to.be.equal(0);
        rxTestScheduler.flush();
        chai_1.expect(count).to.be.equal(3);
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1, '2': 2, '3': 3 });
    });
    it('should allow minimal possible options', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x * 2; }
        }).pipe(operators_1.take(3));
        var expected = '(124|)';
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1, '2': 2, '4': 4 });
    });
    it('should emit error if result selector throws', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x * 2; },
            resultSelector: err
        });
        var expected = '(#)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should emit error if result selector throws on scheduler', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x * 2; },
            resultSelector: err,
            scheduler: rxTestScheduler
        });
        var expected = '(#)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should emit error after first value if iterate function throws', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: err
        });
        var expected = '(1#)';
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1 });
    });
    it('should emit error after first value if iterate function throws on scheduler', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: err,
            scheduler: rxTestScheduler
        });
        var expected = '(1#)';
        marble_testing_1.expectObservable(source).toBe(expected, { '1': 1 });
    });
    it('should emit error if condition function throws', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x + 1; },
            condition: err
        });
        var expected = '(#)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should emit error if condition function throws on scheduler', function () {
        var source = rxjs_1.generate({
            initialState: 1,
            iterate: function (x) { return x + 1; },
            condition: err,
            scheduler: rxTestScheduler
        });
        var expected = '(#)';
        marble_testing_1.expectObservable(source).toBe(expected);
    });
});
//# sourceMappingURL=generate-spec.js.map