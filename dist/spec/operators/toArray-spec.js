"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('toArray operator', function () {
    asDiagram('toArray')('should reduce the values of an observable into an array', function () {
        var e1 = marble_testing_1.hot('---a--b--|');
        var e1subs = '^        !';
        var expected = '---------(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, { w: ['a', 'b'] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be never when source is never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be never when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, { w: [] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should be never when source doesn\'t complete', function () {
        var e1 = marble_testing_1.hot('--x--^--y--');
        var e1subs = '^     ';
        var expected = '------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce observable without values into an array of length zero', function () {
        var e1 = marble_testing_1.hot('-x-^---|');
        var e1subs = '^   !';
        var expected = '----(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, { w: [] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should reduce the a single value of an observable into an array', function () {
        var e1 = marble_testing_1.hot('-x-^--y--|');
        var e1subs = '^     !';
        var expected = '------(w|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, { w: ['y'] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow multiple subscriptions', function () {
        var e1 = marble_testing_1.hot('-x-^--y--|');
        var e1subs = '^     !';
        var expected = '------(w|)';
        var result = e1.pipe(operators_1.toArray());
        marble_testing_1.expectObservable(result).toBe(expected, { w: ['y'] });
        marble_testing_1.expectObservable(result).toBe(expected, { w: ['y'] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b----c-----d----e---|');
        var unsub = '        !                 ';
        var e1subs = '^       !                 ';
        var expected = '---------                 ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b----c-----d----e---|');
        var e1subs = '^       !                 ';
        var expected = '---------                 ';
        var unsub = '        !                 ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.toArray(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with error', function () {
        var e1 = marble_testing_1.hot('-x-^--y--z--#', { x: 1, y: 2, z: 3 }, 'too bad');
        var e1subs = '^        !';
        var expected = '---------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should work with throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    type('should infer the element type', function () {
        var typeValue = {
            val: 3
        };
        rxjs_1.of(typeValue).pipe(operators_1.toArray()).subscribe(function (x) { x[0].val.toString(); });
    });
});
//# sourceMappingURL=toArray-spec.js.map