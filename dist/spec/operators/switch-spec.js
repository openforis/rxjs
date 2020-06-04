"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('switchAll', function () {
    asDiagram('switchAll')('should switch a hot observable of cold observables', function () {
        var x = marble_testing_1.cold('--a---b--c---d--|      ');
        var y = marble_testing_1.cold('----e---f--g---|');
        var e1 = marble_testing_1.hot('--x------y-------|       ', { x: x, y: y });
        var expected = '----a---b----e---f--g---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
    });
    it('should switch to each immediately-scheduled inner Observable', function (done) {
        var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
        var b = rxjs_1.of(4, 5, 6, rxjs_1.queueScheduler);
        var r = [1, 4, 5, 6];
        var i = 0;
        rxjs_1.of(a, b, rxjs_1.queueScheduler)
            .pipe(operators_1.switchAll())
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(r[i++]);
        }, null, done);
    });
    it('should unsub inner observables', function () {
        var unsubbed = [];
        rxjs_1.of('a', 'b').pipe(operators_1.map(function (x) { return new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
                unsubbed.push(x);
            };
        }); }), operators_1.switchAll()).subscribe();
        chai_1.expect(unsubbed).to.deep.equal(['a', 'b']);
    });
    it('should switch to each inner Observable', function (done) {
        var a = rxjs_1.of(1, 2, 3);
        var b = rxjs_1.of(4, 5, 6);
        var r = [1, 2, 3, 4, 5, 6];
        var i = 0;
        rxjs_1.of(a, b).pipe(operators_1.switchAll()).subscribe(function (x) {
            chai_1.expect(x).to.equal(r[i++]);
        }, null, done);
    });
    it('should handle a hot observable of observables', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^       !              ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = '              ^             !';
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var expected = '--------a---b----d--e---f---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, outer is unsubscribed early', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^       !              ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = '              ^ !            ';
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var unsub = '                !            ';
        var expected = '--------a---b---             ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^       !              ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = '              ^ !            ';
        var e1 = marble_testing_1.hot('------x-------y------|       ', { x: x, y: y });
        var expected = '--------a---b----            ';
        var unsub = '                !            ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.switchAll(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, inner never completes', function () {
        var x = marble_testing_1.cold('--a---b---c--|          ');
        var xsubs = '      ^       !               ';
        var y = marble_testing_1.cold('---d--e---f-----');
        var ysubs = '              ^               ';
        var e1 = marble_testing_1.hot('------x-------y------|        ', { x: x, y: y });
        var expected = '--------a---b----d--e---f-----';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a synchronous switch to the second inner observable', function () {
        var x = marble_testing_1.cold('--a---b---c--|   ');
        var xsubs = '      (^!)             ';
        var y = marble_testing_1.cold('---d--e---f---|  ');
        var ysubs = '      ^             !  ';
        var e1 = marble_testing_1.hot('------(xy)------------|', { x: x, y: y });
        var expected = '---------d--e---f-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
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
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle a hot observable of observables, outer throws', function () {
        var x = marble_testing_1.cold('--a---b---c--|         ');
        var xsubs = '      ^       !              ';
        var y = marble_testing_1.cold('---d--e---f---|');
        var ysubs = '              ^       !      ';
        var e1 = marble_testing_1.hot('------x-------y-------#      ', { x: x, y: y });
        var expected = '--------a---b----d--e-#      ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
    it('should handle an empty hot observable', function () {
        var e1 = marble_testing_1.hot('------|');
        var e1subs = '^     !';
        var expected = '------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never hot observable', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete not before the outer completes', function () {
        var x = marble_testing_1.cold('--a---b---c--|   ');
        var xsubs = '      ^            !   ';
        var e1 = marble_testing_1.hot('------x---------------|', { x: x });
        var e1subs = '^                     !';
        var expected = '--------a---b---c-----|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.switchAll())).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an observable of promises', function (done) {
        var expected = [3];
        rxjs_1.of(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3))
            .pipe(operators_1.switchAll())
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should handle an observable of promises, where last rejects', function (done) {
        rxjs_1.of(Promise.resolve(1), Promise.resolve(2), Promise.reject(3))
            .pipe(operators_1.switchAll())
            .subscribe(function () {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(err).to.equal(3);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should handle an observable with Arrays in it', function () {
        var expected = [1, 2, 3, 4];
        var completed = false;
        rxjs_1.of(rxjs_1.NEVER, rxjs_1.NEVER, [1, 2, 3, 4])
            .pipe(operators_1.switchAll())
            .subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            completed = true;
            chai_1.expect(expected.length).to.equal(0);
        });
        chai_1.expect(completed).to.be.true;
    });
    it('should not leak when child completes before each switch (prevent memory leaks #2355)', function () {
        var iStream;
        var oStreamControl = new rxjs_1.Subject();
        var oStream = oStreamControl.pipe(operators_1.map(function () { return (iStream = new rxjs_1.Subject()); }));
        var switcher = oStream.pipe(operators_1.switchAll());
        var result = [];
        var sub = switcher.subscribe(function (x) { return result.push(x); });
        [0, 1, 2, 3, 4].forEach(function (n) {
            oStreamControl.next(n);
            iStream.complete();
        });
        chai_1.expect(sub._subscriptions[0]._subscriptions.length).to.equal(1);
        sub.unsubscribe();
    });
    it('should not leak if we switch before child completes (prevent memory leaks #2355)', function () {
        var oStreamControl = new rxjs_1.Subject();
        var oStream = oStreamControl.pipe(operators_1.map(function () { return new rxjs_1.Subject(); }));
        var switcher = oStream.pipe(operators_1.switchAll());
        var result = [];
        var sub = switcher.subscribe(function (x) { return result.push(x); });
        [0, 1, 2, 3, 4].forEach(function (n) {
            oStreamControl.next(n);
        });
        chai_1.expect(sub._subscriptions[0]._subscriptions.length).to.equal(1);
        chai_1.expect(sub._subscriptions.length).to.equal(2);
        sub.unsubscribe();
    });
});
//# sourceMappingURL=switch-spec.js.map