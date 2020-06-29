"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var queueScheduler = rxjs_1.queueScheduler;
describe('static combineLatest', function () {
    it('should combineLatest the provided observables', function () {
        var firstSource = marble_testing_1.hot('----a----b----c----|');
        var secondSource = marble_testing_1.hot('--d--e--f--g--|');
        var expected = '----uv--wx-y--z----|';
        var combined = rxjs_1.combineLatest(firstSource, secondSource, function (a, b) { return '' + a + b; });
        marble_testing_1.expectObservable(combined).toBe(expected, { u: 'ad', v: 'ae', w: 'af', x: 'bf', y: 'bg', z: 'cg' });
    });
    it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, queueScheduler);
        var r = [[1, 4], [2, 4], [2, 5], [3, 5], [3, 6], [3, 7], [3, 8]];
        rxjs_1.combineLatest(a, b, queueScheduler).subscribe(function (vals) {
            chai_1.expect(vals).to.deep.equal(r.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(r.length).to.equal(0);
            done();
        });
    });
    it('should accept array of observables', function () {
        var firstSource = marble_testing_1.hot('----a----b----c----|');
        var secondSource = marble_testing_1.hot('--d--e--f--g--|');
        var expected = '----uv--wx-y--z----|';
        var combined = rxjs_1.combineLatest([firstSource, secondSource], function (a, b) { return '' + a + b; });
        marble_testing_1.expectObservable(combined).toBe(expected, { u: 'ad', v: 'ae', w: 'af', x: 'bf', y: 'bg', z: 'cg' });
    });
    it('should work with two nevers', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^';
        var expected = '-';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with never and empty', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var expected = '-';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with empty and never', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^';
        var expected = '-';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with empty and empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('|');
        var e2subs = '(^!)';
        var expected = '|';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with hot-empty and hot-single', function () {
        var values = {
            a: 1,
            b: 2,
            c: 3,
            r: 1 + 3
        };
        var e1 = marble_testing_1.hot('-a-^-|', values);
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('-b-^-c-|', values);
        var e2subs = '^   !';
        var expected = '----|';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with hot-single and hot-empty', function () {
        var values = {
            a: 1, b: 2, c: 3
        };
        var e1 = marble_testing_1.hot('-a-^-|', values);
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('-b-^-c-|', values);
        var e2subs = '^   !';
        var expected = '----|';
        var result = rxjs_1.combineLatest(e2, e1, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with hot-single and never', function () {
        var values = {
            a: 1
        };
        var e1 = marble_testing_1.hot('-a-^-|', values);
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('------', values);
        var e2subs = '^  ';
        var expected = '-';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with never and hot-single', function () {
        var values = {
            a: 1, b: 2
        };
        var e1 = marble_testing_1.hot('--------', values);
        var e1subs = '^    ';
        var e2 = marble_testing_1.hot('-a-^-b-|', values);
        var e2subs = '^   !';
        var expected = '-----';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with hot and hot', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
        var e1subs = '^        !';
        var e2 = marble_testing_1.hot('---e-^---f--g--|', { e: 'e', f: 'f', g: 'g' });
        var e2subs = '^         !';
        var expected = '----x-yz--|';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { x: 'bf', y: 'cf', z: 'cg' });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with empty and error', function () {
        var e1 = marble_testing_1.hot('----------|');
        var e1subs = '^     !';
        var e2 = marble_testing_1.hot('------#', undefined, 'shazbot!');
        var e2subs = '^     !';
        var expected = '------#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'shazbot!');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with error and empty', function () {
        var e1 = marble_testing_1.hot('--^---#', undefined, 'too bad, honk');
        var e1subs = '^   !';
        var e2 = marble_testing_1.hot('--^--------|');
        var e2subs = '^   !';
        var expected = '----#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'too bad, honk');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with hot and throw', function () {
        var e1 = marble_testing_1.hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('---^-#', undefined, 'bazinga');
        var e2subs = '^ !';
        var expected = '--#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'bazinga');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with throw and hot', function () {
        var e1 = marble_testing_1.hot('---^-#', undefined, 'bazinga');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
        var e2subs = '^ !';
        var expected = '--#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'bazinga');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with throw and throw', function () {
        var e1 = marble_testing_1.hot('---^----#', undefined, 'jenga');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('---^-#', undefined, 'bazinga');
        var e2subs = '^ !';
        var expected = '--#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'bazinga');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with error and throw', function () {
        var e1 = marble_testing_1.hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('---^-#', undefined, 'flurp');
        var e2subs = '^ !';
        var expected = '--#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'flurp');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with throw and error', function () {
        var e1 = marble_testing_1.hot('---^-#', undefined, 'flurp');
        var e1subs = '^ !';
        var e2 = marble_testing_1.hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
        var e2subs = '^ !';
        var expected = '--#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'flurp');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with never and throw', function () {
        var e1 = marble_testing_1.hot('---^-----------');
        var e1subs = '^     !';
        var e2 = marble_testing_1.hot('---^-----#', undefined, 'wokka wokka');
        var e2subs = '^     !';
        var expected = '------#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'wokka wokka');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with throw and never', function () {
        var e1 = marble_testing_1.hot('---^----#', undefined, 'wokka wokka');
        var e1subs = '^    !';
        var e2 = marble_testing_1.hot('---^-----------');
        var e2subs = '^    !';
        var expected = '-----#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'wokka wokka');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with some and throw', function () {
        var e1 = marble_testing_1.hot('---^----a---b--|', { a: 1, b: 2 });
        var e1subs = '^  !';
        var e2 = marble_testing_1.hot('---^--#', undefined, 'wokka wokka');
        var e2subs = '^  !';
        var expected = '---#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should work with throw and some', function () {
        var e1 = marble_testing_1.hot('---^--#', undefined, 'wokka wokka');
        var e1subs = '^  !';
        var e2 = marble_testing_1.hot('---^----a---b--|', { a: 1, b: 2 });
        var e2subs = '^  !';
        var expected = '---#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle throw after complete left', function () {
        var left = marble_testing_1.hot('--a--^--b---|', { a: 1, b: 2 });
        var leftSubs = '^      !';
        var right = marble_testing_1.hot('-----^--------#', undefined, 'bad things');
        var rightSubs = '^        !';
        var expected = '---------#';
        var result = rxjs_1.combineLatest(left, right, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'bad things');
        marble_testing_1.expectSubscriptions(left.subscriptions).toBe(leftSubs);
        marble_testing_1.expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
    it('should handle throw after complete right', function () {
        var left = marble_testing_1.hot('-----^--------#', undefined, 'bad things');
        var leftSubs = '^        !';
        var right = marble_testing_1.hot('--a--^--b---|', { a: 1, b: 2 });
        var rightSubs = '^      !';
        var expected = '---------#';
        var result = rxjs_1.combineLatest(left, right, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'bad things');
        marble_testing_1.expectSubscriptions(left.subscriptions).toBe(leftSubs);
        marble_testing_1.expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
    it('should handle interleaved with tail', function () {
        var e1 = marble_testing_1.hot('-a--^--b---c---|', { a: 'a', b: 'b', c: 'c' });
        var e1subs = '^          !';
        var e2 = marble_testing_1.hot('--d-^----e---f--|', { d: 'd', e: 'e', f: 'f' });
        var e2subs = '^           !';
        var expected = '-----x-y-z--|';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { x: 'be', y: 'ce', z: 'cf' });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle two consecutive hot observables', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
        var e1subs = '^        !';
        var e2 = marble_testing_1.hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
        var e2subs = '^                   !';
        var expected = '-----------x--y--z--|';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle two consecutive hot observables with error left', function () {
        var left = marble_testing_1.hot('--a--^--b--c--#', { a: 'a', b: 'b', c: 'c' }, 'jenga');
        var leftSubs = '^        !';
        var right = marble_testing_1.hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
        var rightSubs = '^        !';
        var expected = '---------#';
        var result = rxjs_1.combineLatest(left, right, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'jenga');
        marble_testing_1.expectSubscriptions(left.subscriptions).toBe(leftSubs);
        marble_testing_1.expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
    it('should handle two consecutive hot observables with error right', function () {
        var left = marble_testing_1.hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
        var leftSubs = '^        !';
        var right = marble_testing_1.hot('-----^----------d--e--f--#', { d: 'd', e: 'e', f: 'f' }, 'dun dun dun');
        var rightSubs = '^                   !';
        var expected = '-----------x--y--z--#';
        var result = rxjs_1.combineLatest(left, right, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' }, 'dun dun dun');
        marble_testing_1.expectSubscriptions(left.subscriptions).toBe(leftSubs);
        marble_testing_1.expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
    it('should handle selector throwing', function () {
        var e1 = marble_testing_1.hot('--a--^--b--|', { a: 1, b: 2 });
        var e1subs = '^  !';
        var e2 = marble_testing_1.hot('--c--^--d--|', { c: 3, d: 4 });
        var e2subs = '^  !';
        var expected = '---#';
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { throw 'ha ha ' + x + ', ' + y; });
        marble_testing_1.expectObservable(result).toBe(expected, null, 'ha ha 2, 4');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
        var e1subs = '^        !    ';
        var e2 = marble_testing_1.hot('---e-^---f--g---h-|');
        var e2subs = '^        !    ';
        var expected = '----x-yz--    ';
        var unsub = '         !    ';
        var values = { x: 'bf', y: 'cf', z: 'cg' };
        var result = rxjs_1.combineLatest(e1, e2, function (x, y) { return x + y; });
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c---d-| ');
        var e1subs = '^        !    ';
        var e2 = marble_testing_1.hot('---e-^---f--g---h-|');
        var e2subs = '^        !    ';
        var expected = '----x-yz--    ';
        var unsub = '         !    ';
        var values = { x: 'bf', y: 'cf', z: 'cg' };
        var result = rxjs_1.combineLatest(e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); })), e2.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); })), function (x, y) { return x + y; }).pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=combineLatest-spec.js.map