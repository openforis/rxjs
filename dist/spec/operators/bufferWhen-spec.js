"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('bufferWhen operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit buffers that close and reopen', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('--a--^---b---c---d---e---f---g---------|   ');
            var e2 = cold('    --------------(s|)                    ');
            var expected = '   --------------x-------------y-----(z|)';
            var values = {
                x: ['b', 'c', 'd'],
                y: ['e', 'f', 'g'],
                z: []
            };
            expectObservable(e1.pipe(operators_1.bufferWhen(function () { return e2; }))).toBe(expected, values);
        });
    });
    it('should emit buffers using varying cold closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var subs = '       ^----------------------------------!      ';
            var closings = [
                cold('             ---------------s--|                       '),
                cold('                            ----------(s|)             '),
                cold('                                      -------------(s|)')
            ];
            var expected = '   ---------------x---------y---------(z|)   ';
            var values = {
                x: ['b', 'c', 'd'],
                y: ['e', 'f', 'g'],
                z: ['h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should emit buffers using varying hot closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|   ');
            var subs = '       ^----------------------------------!   ';
            var closings = [
                {
                    obs: hot('   -1--^--------------s---|                   '),
                    sub: '           ^--------------!                       '
                },
                {
                    obs: hot('   --1-^----3--------4----------s-|           '),
                    sub: '           ---------------^---------!             '
                },
                {
                    obs: hot('   1-2-^------3----4-------5--6-----------s--|'),
                    sub: '           -------------------------^---------!   '
                }
            ];
            var expected = '   ---------------x---------y---------(z|)';
            var values = {
                x: ['b', 'c', 'd'],
                y: ['e', 'f', 'g'],
                z: ['h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++].obs; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            for (var j = 0; j < closings.length; j++) {
                expectSubscriptions(closings[j].obs.subscriptions).toBe(closings[j].sub);
            }
        });
    });
    it('should emit buffers using varying empty delayed closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|   ');
            var subs = '       ^----------------------------------!   ';
            var closings = [
                cold('             ---------------|                       '),
                cold('                            ----------|             '),
                cold('                                      -------------|')
            ];
            var closeSubs = [
                '                  ^--------------!                       ',
                '                  ---------------^---------!             ',
                '                  -------------------------^---------!   '
            ];
            var expected = '   ---------------x---------y---------(z|)';
            var values = {
                x: ['b', 'c', 'd'],
                y: ['e', 'f', 'g'],
                z: ['h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
        });
    });
    it('should emit buffers using varying cold closings, outer unsubscribed early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var unsub = '      ------------------!                       ';
            var subs = '       ^-----------------!                       ';
            var closings = [
                cold('             ---------------(s|)                       '),
                cold('                            ----------(s|)             '),
                cold('                                      -------------(s|)')
            ];
            var closeSubs = [
                '                  ^--------------!                          ',
                '                  ---------------^--!                       '
            ];
            var expected = '   ---------------x---                       ';
            var values = {
                x: ['b', 'c', 'd']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++]; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe([]);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var subs = '       ^-----------------!                       ';
            var closings = [
                cold('             ---------------(s|)                       '),
                cold('                            ----------(s|)             '),
                cold('                                      -------------(s|)')
            ];
            var closeSubs = [
                '                  ^--------------!                          ',
                '                  ---------------^--!                       '
            ];
            var expected = '   ---------------x---                       ';
            var unsub = '      ------------------!                       ';
            var values = {
                x: ['b', 'c', 'd']
            };
            var i = 0;
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.bufferWhen(function () { return closings[i++]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe([]);
        });
    });
    it('should propagate error thrown from closingSelector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var subs = '       ^--------------!                          ';
            var closings = [
                cold('             ---------------s--|                       '),
                cold('                            ----------(s|)             '),
                cold('                                      -------------(s|)')
            ];
            var closeSubs0 = ' ^--------------!                          ';
            var expected = '   ---------------(x#)                       ';
            var values = { x: ['b', 'c', 'd'] };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () {
                if (i === 1) {
                    throw 'error';
                }
                return closings[i++];
            }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs0);
        });
    });
    it('should propagate error emitted from a closing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var subs = '       ^--------------!                    ';
            var closings = [
                cold('             ---------------s--|                 '),
                cold('                            #                    ')
            ];
            var closeSubs = [
                '                  ^--------------!                    ',
                '                  ---------------(^!)                 '
            ];
            var expected = '   ---------------(x#)                 ';
            var values = {
                x: ['b', 'c', 'd']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should propagate error emitted late from a closing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var subs = '       ^--------------------!              ';
            var closings = [
                cold('             ---------------s--|                 '),
                cold('                            ------#              ')
            ];
            var closeSubs = [
                '                  ^--------------!                    ',
                '                  ---------------^-----!              '
            ];
            var expected = '---------------x-----#              ';
            var values = { x: ['b', 'c', 'd'] };
            var i = 0;
            var result = e1.pipe(operators_1.bufferWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should handle errors', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---#');
            var e2 = cold('    ---------------(s|)      ');
            var e2subs = [
                '                  ^--------------!         ',
                '                  ---------------^--------!'
            ];
            var expected = '   ---------------x--------#';
            var values = {
                x: ['b', 'c', 'd']
            };
            var result = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle empty', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var e2 = cold(' --------(s|)');
            var e1subs = '  (^!)';
            var expected = '(x|)';
            var values = {
                x: []
            };
            var result = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should handle throw', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var e2 = cold(' --------(s|)');
            var e1subs = '  (^!)';
            var expected = '#';
            var values = {
                x: []
            };
            var result = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should handle never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -');
            var unsub = '   --------------------------------------------!';
            var e1subs = '  ^-------------------------------------------!';
            var e2 = cold(' --------(s|)                                 ');
            var e2subs = [
                '               ^-------!                                    ',
                '               --------^-------!                            ',
                '               ----------------^-------!                    ',
                '               ------------------------^-------!            ',
                '               --------------------------------^-------!    ',
                '               ----------------------------------------^---!'
            ];
            var expected = '--------x-------x-------x-------x-------x----';
            var values = {
                x: []
            };
            var source = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(source, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle an inner never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e2 = cold('-');
            var expected = '   -----------------------------------(x|)';
            var values = {
                x: ['b', 'c', 'd', 'e', 'f', 'g', 'h']
            };
            expectObservable(e1.pipe(operators_1.bufferWhen(function () { return e2; }))).toBe(expected, values);
        });
    });
    it('should NOT handle hot inner empty', function (done) {
        var source = rxjs_1.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
        var closing = rxjs_1.EMPTY;
        var TOO_MANY_INVOCATIONS = 30;
        source.pipe(operators_1.bufferWhen(function () { return closing; }), operators_1.takeWhile(function (val, index) { return index < TOO_MANY_INVOCATIONS; })).subscribe(function (val) {
            chai_1.expect(Array.isArray(val)).to.be.true;
            chai_1.expect(val.length).to.equal(0);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should handle inner throw', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e1subs = '     (^!)';
            var e2 = cold('    #');
            var e2subs = '     (^!)';
            var expected = '   #';
            var values = {
                x: ['b', 'c', 'd', 'e', 'f', 'g', 'h']
            };
            var result = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle disposing of source', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var subs = '       ^-------------------!';
            var unsub = '      --------------------!';
            var e2 = cold('    ---------------(s|)');
            var expected = '   ---------------x-----';
            var values = {
                x: ['b', 'c', 'd'],
                y: ['e', 'f', 'g', 'h'],
                z: []
            };
            var source = e1.pipe(operators_1.bufferWhen(function () { return e2; }));
            expectObservable(source, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
});
//# sourceMappingURL=bufferWhen-spec.js.map