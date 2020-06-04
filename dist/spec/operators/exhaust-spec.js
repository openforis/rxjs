"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('exhaust operator', function () {
    asDiagram('exhaust')('should handle a hot observable of hot observables', function () {
        var x = marble_testing_1.cold('--a---b---c--|               ');
        var y = marble_testing_1.cold('---d--e---f---|      ');
        var z = marble_testing_1.cold('---g--h---i---|');
        var e1 = marble_testing_1.hot('------x-------y-----z-------------|', { x: x, y: y, z: z });
        var expected = '--------a---b---c------g--h---i---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
    });
    it('should switch to first immediately-scheduled inner Observable', function () {
        var e1 = marble_testing_1.cold('(ab|)');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('(cd|)');
        var e2subs = [];
        var expected = '(ab|)';
        marble_testing_1.expectObservable(rxjs_1.of(e1, e2).pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a hot observable of observables', function () {
        var x = marble_testing_1.cold('--a---b---c--|               ');
        var xsubs = '      ^            !               ';
        var y = marble_testing_1.cold('---d--e---f---|      ');
        var ysubs = [];
        var z = marble_testing_1.cold('---g--h---i---|');
        var zsubs = '                    ^             !';
        var e1 = marble_testing_1.hot('------x-------y-----z-------------|', { x: x, y: y, z: z });
        var expected = '--------a---b---c------g--h---i---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
    });
    it('should handle a hot observable of observables, outer is unsubscribed early', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^         !           ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = [];
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var unsub = '                !            ';
        var expected = '--------a---b---             ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^         !           ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = [];
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var unsub = '                !            ';
        var expected = '--------a---b----            ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.exhaust(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, inner never completes', function () {
        var x = marble_testing_1.cold('--a---b--|              ');
        var xsubs = '   ^        !              ';
        var y = marble_testing_1.cold('-d---e-            ');
        var ysubs = [];
        var z = marble_testing_1.cold('---f--g---h--');
        var zsubs = '              ^            ';
        var e1 = marble_testing_1.hot('---x---y------z----------| ', { x: x, y: y, z: z });
        var expected = '-----a---b-------f--g---h--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(z.subscriptions).toBe(zsubs);
    });
    it('should handle a synchronous switch and stay on the first inner observable', function () {
        var x = marble_testing_1.cold('--a---b---c--|   ');
        var xsubs = '      ^            !   ';
        var y = marble_testing_1.cold('---d--e---f---|  ');
        var ysubs = [];
        var e1 = marble_testing_1.hot('------(xy)------------|', { x: x, y: y });
        var expected = '--------a---b---c-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, one inner throws', function () {
        var x = marble_testing_1.cold('--a---#                ');
        var xsubs = '      ^     !                ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = [];
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var expected = '--------a---#                ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, outer throws', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^            !         ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = [];
        var e1 = marble_testing_1.hot('------x-------y-------#      ', { x: x, y: y });
        var expected = '--------a---b---c-----#      ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle an empty hot observable', function () {
        var e1 = marble_testing_1.hot('------|');
        var e1subs = '^     !';
        var expected = '------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never hot observable', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete not before the outer completes', function () {
        var x = marble_testing_1.cold('--a---b---c--|   ');
        var xsubs = '      ^            !   ';
        var e1 = marble_testing_1.hot('------x---------------|', { x: x });
        var expected = '--------a---b---c-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.exhaust())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
    });
    it('should handle an observable of promises', function (done) {
        var expected = [1];
        rxjs_1.of(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)).pipe(operators_1.exhaust()).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should handle an observable of promises, where one rejects', function (done) {
        rxjs_1.of(Promise.reject(2), Promise.resolve(1)).pipe(operators_1.exhaust()).subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(err).to.equal(2);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.exhaust());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.exhaust());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.exhaust());
    });
    type(function () {
        var source1 = rxjs_1.of(1, 2, 3);
        var source2 = [1, 2, 3];
        var source3 = new Promise(function (d) { return d(1); });
        var result = rxjs_1.of(source1, source2, source3)
            .pipe(operators_1.exhaust());
    });
});
//# sourceMappingURL=exhaust-spec.js.map