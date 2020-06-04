"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('mergeAll oeprator', function () {
    asDiagram('mergeAll')('should merge a hot observable of cold observables', function () {
        var x = marble_testing_1.cold('--a---b--c---d--|      ');
        var y = marble_testing_1.cold('----e---f--g---|');
        var e1 = marble_testing_1.hot('--x------y-------|       ', { x: x, y: y });
        var expected = '----a---b--c-e-d-f--g---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
    });
    it('should merge all observables in an observable', function () {
        var e1 = rxjs_1.from([
            rxjs_1.of('a'),
            rxjs_1.of('b'),
            rxjs_1.of('c')
        ]);
        var expected = '(abc|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
    });
    it('should throw if any child observable throws', function () {
        var e1 = rxjs_1.from([
            rxjs_1.of('a'),
            rxjs_1.throwError('error'),
            rxjs_1.of('c')
        ]);
        var expected = '(a#)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
    });
    it('should handle merging a hot observable of observables', function () {
        var x = marble_testing_1.cold('a---b---c---|   ');
        var xsubs = '  ^           !   ';
        var y = marble_testing_1.cold('d---e---f---|');
        var ysubs = '     ^           !';
        var e1 = marble_testing_1.hot('--x--y--|         ', { x: x, y: y });
        var e1subs = '^       !         ';
        var expected = '--a--db--ec--f---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge one cold Observable at a time with parameter concurrency=1', function () {
        var x = marble_testing_1.cold('a---b---c---|            ');
        var xsubs = '  ^           !            ';
        var y = marble_testing_1.cold('d---e---f---|');
        var ysubs = '              ^           !';
        var e1 = marble_testing_1.hot('--x--y--|                  ', { x: x, y: y });
        var e1subs = '^       !                  ';
        var expected = '--a---b---c---d---e---f---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge two cold Observables at a time with parameter concurrency=2', function () {
        var x = marble_testing_1.cold('a---b---c---|        ');
        var xsubs = '  ^           !        ';
        var y = marble_testing_1.cold('d---e---f---|     ');
        var ysubs = '     ^           !     ';
        var z = marble_testing_1.cold('--g---h-|');
        var zsubs = '              ^       !';
        var e1 = marble_testing_1.hot('--x--y--z--|           ', { x: x, y: y, z: z });
        var e1subs = '^          !           ';
        var expected = '--a--db--ec--f--g---h-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge one hot Observable at a time with parameter concurrency=1', function () {
        var x = marble_testing_1.hot('---a---b---c---|          ');
        var xsubs = '  ^            !          ';
        var y = marble_testing_1.hot('-------------d---e---f---|');
        var ysubs = '               ^         !';
        var e1 = marble_testing_1.hot('--x--y--|                 ', { x: x, y: y });
        var e1subs = '^       !                 ';
        var expected = '---a---b---c-----e---f---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll(1))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge two hot Observables at a time with parameter concurrency=2', function () {
        var x = marble_testing_1.hot('i--a---b---c---|        ');
        var xsubs = '  ^            !        ';
        var y = marble_testing_1.hot('-i-i--d---e---f---|     ');
        var ysubs = '     ^            !     ';
        var z = marble_testing_1.hot('--i--i--i--i-----g---h-|');
        var zsubs = '               ^       !';
        var e1 = marble_testing_1.hot('--x--y--z--|            ', { x: x, y: y, z: z });
        var e1subs = '^          !            ';
        var expected = '---a--db--ec--f--g---h-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll(2))).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle merging a hot observable of observables, outer unsubscribed early', function () {
        var x = marble_testing_1.cold('a---b---c---|   ');
        var xsubs = '  ^         !     ';
        var y = marble_testing_1.cold('d---e---f---|');
        var ysubs = '     ^      !     ';
        var e1 = marble_testing_1.hot('--x--y--|         ', { x: x, y: y });
        var e1subs = '^       !         ';
        var unsub = '            !     ';
        var expected = '--a--db--ec--     ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('a---b---c---|   ');
        var xsubs = '  ^         !     ';
        var y = marble_testing_1.cold('d---e---f---|');
        var ysubs = '     ^      !     ';
        var e1 = marble_testing_1.hot('--x--y--|         ', { x: x, y: y });
        var e1subs = '^       !         ';
        var expected = '--a--db--ec--     ';
        var unsub = '            !     ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.mergeAll(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge parallel emissions', function () {
        var x = marble_testing_1.cold('----a----b----c---|');
        var xsubs = '  ^                 !';
        var y = marble_testing_1.cold('-d----e----f---|');
        var ysubs = '     ^              !';
        var e1 = marble_testing_1.hot('--x--y--|            ', { x: x, y: y });
        var e1subs = '^       !            ';
        var expected = '------(ad)-(be)-(cf)|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge empty and empty', function () {
        var x = marble_testing_1.cold('|');
        var xsubs = '  (^!)   ';
        var y = marble_testing_1.cold('|');
        var ysubs = '     (^!)';
        var e1 = marble_testing_1.hot('--x--y--|', { x: x, y: y });
        var e1subs = '^       !';
        var expected = '--------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge three empties', function () {
        var x = marble_testing_1.cold('|');
        var xsubs = '  (^!)     ';
        var y = marble_testing_1.cold('|');
        var ysubs = '     (^!)  ';
        var z = marble_testing_1.cold('|');
        var zsubs = '       (^!)';
        var e1 = marble_testing_1.hot('--x--y-z---|', { x: x, y: y, z: z });
        var e1subs = '^          !';
        var expected = '-----------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge never and empty', function () {
        var x = marble_testing_1.cold('-');
        var xsubs = '  ^';
        var y = marble_testing_1.cold('|');
        var ysubs = '     (^!)';
        var e1 = marble_testing_1.hot('--x--y--|', { x: x, y: y });
        var e1subs = '^       !';
        var expected = '---------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge never and never', function () {
        var x = marble_testing_1.cold('-');
        var xsubs = '  ^';
        var y = marble_testing_1.cold('-');
        var ysubs = '     ^';
        var e1 = marble_testing_1.hot('--x--y--|', { x: x, y: y });
        var e1subs = '^       !';
        var expected = '---------';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge empty and throw', function () {
        var x = marble_testing_1.cold('|');
        var xsubs = '  (^!)   ';
        var y = marble_testing_1.cold('#');
        var ysubs = '     (^!)';
        var e1 = marble_testing_1.hot('--x--y--|', { x: x, y: y });
        var e1subs = '^    !   ';
        var expected = '-----#   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge never and throw', function () {
        var x = marble_testing_1.cold('-');
        var xsubs = '  ^  !';
        var y = marble_testing_1.cold('#');
        var ysubs = '     (^!)';
        var e1 = marble_testing_1.hot('--x--y--|', { x: x, y: y });
        var e1subs = '^    !   ';
        var expected = '-----#   ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge empty and eventual error', function () {
        var x = marble_testing_1.cold('|');
        var xsubs = '  (^!)';
        var y = marble_testing_1.cold('------#');
        var ysubs = '     ^     !';
        var e1 = marble_testing_1.hot('--x--y--|   ', { x: x, y: y });
        var e1subs = '^       !   ';
        var expected = '-----------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge never and eventual error', function () {
        var x = marble_testing_1.cold('-');
        var xsubs = '  ^        !';
        var y = marble_testing_1.cold('------#');
        var ysubs = '     ^     !';
        var e1 = marble_testing_1.hot('--x--y--|   ', { x: x, y: y });
        var e1subs = '^       !   ';
        var expected = '-----------#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take an empty source and return empty too', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take a never source and return never too', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take a throw source and return throw too', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle merging a hot observable of non-overlapped observables', function () {
        var x = marble_testing_1.cold('a-b---------|                 ');
        var xsubs = '  ^           !                 ';
        var y = marble_testing_1.cold('c-d-e-f-|           ');
        var ysubs = '            ^       !           ';
        var z = marble_testing_1.cold('g-h-i-j-k-|');
        var zsubs = '                     ^         !';
        var e1 = marble_testing_1.hot('--x---------y--------z--------| ', { x: x, y: y, z: z });
        var e1subs = '^                             ! ';
        var expected = '--a-b-------c-d-e-f--g-h-i-j-k-|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if inner observable raises error', function () {
        var x = marble_testing_1.cold('a-b---------|                 ');
        var xsubs = '  ^           !                 ';
        var y = marble_testing_1.cold('c-d-e-f-#           ');
        var ysubs = '            ^       !           ';
        var z = marble_testing_1.cold('g-h-i-j-k-|');
        var zsubs = [];
        var e1 = marble_testing_1.hot('--x---------y--------z--------| ', { x: x, y: y, z: z });
        var e1subs = '^                   !           ';
        var expected = '--a-b-------c-d-e-f-#           ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if outer observable raises error', function () {
        var y = marble_testing_1.cold('a-b---------|                ');
        var ysubs = '  ^           !                ';
        var z = marble_testing_1.cold('c-d-e-f-|          ');
        var zsubs = '            ^   !              ';
        var e1 = marble_testing_1.hot('--y---------z---#              ', { y: y, z: z });
        var e1subs = '^               !              ';
        var expected = '--a-b-------c-d-#              ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should merge all promises in an observable', function (done) {
        var e1 = rxjs_1.from([
            new Promise(function (res) { res('a'); }),
            new Promise(function (res) { res('b'); }),
            new Promise(function (res) { res('c'); }),
            new Promise(function (res) { res('d'); }),
        ]);
        var expected = ['a', 'b', 'c', 'd'];
        var res = [];
        e1.pipe(operators_1.mergeAll()).subscribe(function (x) { res.push(x); }, function (err) { done(new Error('should not be called')); }, function () {
            chai_1.expect(res).to.deep.equal(expected);
            done();
        });
    });
    it('should raise error when promise rejects', function (done) {
        var error = 'error';
        var e1 = rxjs_1.from([
            new Promise(function (res) { res('a'); }),
            new Promise(function (res, rej) { rej(error); }),
            new Promise(function (res) { res('c'); }),
            new Promise(function (res) { res('d'); }),
        ]);
        var res = [];
        e1.pipe(operators_1.mergeAll()).subscribe(function (x) { res.push(x); }, function (err) {
            chai_1.expect(res.length).to.equal(1);
            chai_1.expect(err).to.equal('error');
            done();
        }, function () { done(new Error('should not be called')); });
    });
    it('should finalize generators when merged if the subscription ends', function () {
        var _a;
        var iterable = (_a = {
                finalized: false,
                next: function () {
                    return { value: 'duck', done: false };
                },
                return: function () {
                    this.finalized = true;
                }
            },
            _a[Symbol.iterator] = function () {
                return this;
            },
            _a);
        var results = [];
        var iterableObservable = rxjs_1.from(iterable);
        rxjs_1.of(iterableObservable).pipe(operators_1.mergeAll(), operators_1.take(3)).subscribe(function (x) { return results.push(x); }, null, function () { return results.push('GOOSE!'); });
        chai_1.expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
        chai_1.expect(iterable.finalized).to.be.true;
    });
    it('should merge two observables', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var b = rxjs_1.of(4, 5, 6, 7, 8);
        var r = [1, 2, 3, 4, 5, 6, 7, 8];
        rxjs_1.of(a, b).pipe(operators_1.mergeAll()).subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, null, done);
    });
    it('should merge two immediately-scheduled observables', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
        var r = [1, 2, 4, 3, 5, 6, 7, 8];
        rxjs_1.of(a, b, rxjs_1.queueScheduler).pipe(operators_1.mergeAll()).subscribe(function (val) {
            chai_1.expect(val).to.equal(r.shift());
        }, null, done);
    });
});
//# sourceMappingURL=mergeAll-spec.js.map