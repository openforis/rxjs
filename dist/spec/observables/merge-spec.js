"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var test_helper_1 = require("../helpers/test-helper");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('static merge(...observables)', function () {
    it('should merge cold and cold', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^                      !';
        var expected = '---a--x--b--y--c--z----|';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should return itself when try to merge single observable', function () {
        var e1 = rxjs_1.of('a');
        var result = rxjs_1.merge(e1);
        chai_1.expect(e1).to.equal(result);
    });
    it('should merge hot and hot', function () {
        var e1 = marble_testing_1.hot('---a---^-b-----c----|');
        var e1subs = '^            !';
        var e2 = marble_testing_1.hot('-----x-^----y-----z----|');
        var e2subs = '^               !';
        var expected = '--b--y--c--z----|';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge hot and cold', function () {
        var e1 = marble_testing_1.hot('---a-^---b-----c----|');
        var e1subs = '^              !';
        var e2 = marble_testing_1.cold('--x-----y-----z----|');
        var e2subs = '^                  !';
        var expected = '--x-b---y-c---z----|';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge parallel emissions', function () {
        var e1 = marble_testing_1.hot('---a----b----c----|');
        var e1subs = '^                 !';
        var e2 = marble_testing_1.hot('---x----y----z----|');
        var e2subs = '^                 !';
        var expected = '---(ax)-(by)-(cz)-|';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge empty and empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('|');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge three empties', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.cold('|');
        var e3subs = '(^!)';
        var result = rxjs_1.merge(e1, e2, e3);
        marble_testing_1.expectObservable(result).toBe('|');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should merge never and empty', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('-');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge never and never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('-');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge empty and throw', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '(^!)';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('#');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge hot and throw', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '(^!)';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('#');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge never and throw', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '(^!)';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe('#');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge empty and eventual error', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.hot('-------#');
        var e2subs = '^------!';
        var expected = '-------#';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge hot and error', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^      !    ';
        var e2 = marble_testing_1.hot('-------#    ');
        var e2subs = '^      !    ';
        var expected = '--a--b-#    ';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge never and error', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^      !';
        var e2 = marble_testing_1.hot('-------#');
        var e2subs = '^      !';
        var expected = '-------#';
        var result = rxjs_1.merge(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should merge single lowerCaseO into RxJS Observable', function () {
        var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
        var result = rxjs_1.merge(e1);
        chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
        marble_testing_1.expectObservable(result).toBe('(abc|)');
    });
    it('should merge two lowerCaseO into RxJS Observable', function () {
        var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
        var e2 = test_helper_1.lowerCaseO('d', 'e', 'f');
        var result = rxjs_1.merge(e1, e2);
        chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
        marble_testing_1.expectObservable(result).toBe('(abcdef|)');
    });
});
describe('merge(...observables, Scheduler)', function () {
    it('should merge single lowerCaseO into RxJS Observable', function () {
        var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
        var result = rxjs_1.merge(e1, rxTestScheduler);
        chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
        marble_testing_1.expectObservable(result).toBe('(abc|)');
    });
});
describe('merge(...observables, Scheduler, number)', function () {
    it('should handle concurrency limits', function () {
        var e1 = marble_testing_1.cold('---a---b---c---|');
        var e2 = marble_testing_1.cold('-d---e---f--|');
        var e3 = marble_testing_1.cold('---x---y---z---|');
        var expected = '-d-a-e-b-f-c---x---y---z---|';
        marble_testing_1.expectObservable(rxjs_1.merge(e1, e2, e3, 2)).toBe(expected);
    });
    it('should handle scheduler', function () {
        var e1 = rxjs_1.of('a');
        var e2 = rxjs_1.of('b').pipe(operators_1.delay(20, rxTestScheduler));
        var expected = 'a-(b|)';
        marble_testing_1.expectObservable(rxjs_1.merge(e1, e2, rxTestScheduler)).toBe(expected);
    });
    it('should handle scheduler with concurrency limits', function () {
        var e1 = marble_testing_1.cold('---a---b---c---|');
        var e2 = marble_testing_1.cold('-d---e---f--|');
        var e3 = marble_testing_1.cold('---x---y---z---|');
        var expected = '-d-a-e-b-f-c---x---y---z---|';
        marble_testing_1.expectObservable(rxjs_1.merge(e1, e2, e3, 2, rxTestScheduler)).toBe(expected);
    });
    it('should use the scheduler even when one Observable is merged', function (done) {
        var e1Subscribed = false;
        var e1 = rxjs_1.defer(function () {
            e1Subscribed = true;
            return rxjs_1.of('a');
        });
        rxjs_1.merge(e1, rxjs_1.asyncScheduler)
            .subscribe({
            error: done,
            complete: function () {
                chai_1.expect(e1Subscribed).to.be.true;
                done();
            }
        });
        chai_1.expect(e1Subscribed).to.be.false;
    });
});
//# sourceMappingURL=merge-spec.js.map