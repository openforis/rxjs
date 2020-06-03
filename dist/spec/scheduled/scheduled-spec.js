"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var test_helper_1 = require("../helpers/test-helper");
var observableMatcher_1 = require("../helpers/observableMatcher");
var chai_1 = require("chai");
describe('scheduled', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should schedule a sync observable', function () {
        var input = rxjs_1.of('a', 'b', 'c');
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            expectObservable(rxjs_1.scheduled(input, testScheduler)).toBe('(abc|)');
        });
    });
    it('should schedule an array', function () {
        var input = ['a', 'b', 'c'];
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            expectObservable(rxjs_1.scheduled(input, testScheduler)).toBe('(abc|)');
        });
    });
    it('should schedule an iterable', function () {
        var input = 'abc';
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            expectObservable(rxjs_1.scheduled(input, testScheduler)).toBe('(abc|)');
        });
    });
    it('should schedule an observable-like', function () {
        var input = test_helper_1.lowerCaseO('a', 'b', 'c');
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            expectObservable(rxjs_1.scheduled(input, testScheduler)).toBe('(abc|)');
        });
    });
    it('should schedule a promise', function (done) {
        var results = [];
        var input = Promise.resolve('x');
        rxjs_1.scheduled(input, testScheduler).subscribe({
            next: function (value) { results.push(value); },
            complete: function () { results.push('done'); },
        });
        chai_1.expect(results).to.deep.equal([]);
        testScheduler.flush();
        chai_1.expect(results).to.deep.equal([]);
        Promise.resolve().then(function () {
            testScheduler.flush();
            chai_1.expect(results).to.deep.equal(['x', 'done']);
            done();
        });
    });
});
//# sourceMappingURL=scheduled-spec.js.map