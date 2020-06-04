"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var chai_1 = require("chai");
describe('static race', function () {
    it('should race a single observable', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race(e1);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should race cold and cold', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should race with array of observable', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race([e1, e2]);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should race hot and hot', function () {
        var e1 = marble_testing_1.hot('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.hot('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should race hot and cold', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^                   !';
        var e2 = marble_testing_1.hot('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should race 2nd and 1st', function () {
        var e1 = marble_testing_1.cold('------x-----y-----z----|');
        var e1subs = '^  !';
        var e2 = marble_testing_1.cold('---a-----b-----c----|');
        var e2subs = '^                   !';
        var expected = '---a-----b-----c----|';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should race emit and complete', function () {
        var e1 = marble_testing_1.cold('-----|');
        var e1subs = '^    !';
        var e2 = marble_testing_1.hot('------x-----y-----z----|');
        var e2subs = '^    !';
        var expected = '-----|';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.cold('---a-----b-----c----|');
        var e1subs = '^           !';
        var e2 = marble_testing_1.hot('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----b---';
        var unsub = '            !';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
        var e1subs = '^        !    ';
        var e2 = marble_testing_1.hot('---e-^---f--g---h-|');
        var e2subs = '^  !    ';
        var expected = '---b--c---    ';
        var unsub = '         !    ';
        var result = rxjs_1.race(e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); })), e2.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }))).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should never emit when given non emitting sources', function () {
        var e1 = marble_testing_1.cold('---|');
        var e2 = marble_testing_1.cold('---|');
        var e1subs = '^  !';
        var expected = '---|';
        var source = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should throw when error occurs mid stream', function () {
        var e1 = marble_testing_1.cold('---a-----#');
        var e1subs = '^        !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---a-----#';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should throw when error occurs before a winner is found', function () {
        var e1 = marble_testing_1.cold('---#');
        var e1subs = '^  !';
        var e2 = marble_testing_1.cold('------x-----y-----z----|');
        var e2subs = '^  !';
        var expected = '---#';
        var result = rxjs_1.race(e1, e2);
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var source = rxjs_1.race(e1);
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var source = rxjs_1.race(e1);
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var source = rxjs_1.race(e1);
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support a single ObservableInput argument', function (done) {
        var source = rxjs_1.race(Promise.resolve(42));
        source.subscribe(function (value) {
            chai_1.expect(value).to.equal(42);
        }, done, done);
    });
});
//# sourceMappingURL=race-spec.js.map