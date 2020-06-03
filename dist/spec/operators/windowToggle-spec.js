"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('windowToggle', function () {
    it('should emit windows governed by openings and closings', function () {
        var source = marble_testing_1.hot('--1--2--^-a--b--c--d--e--f--g--h-|');
        var subs = '^                        !';
        var e2 = marble_testing_1.cold('----w--------w--------w--|');
        var e2subs = '^                        !';
        var e3 = marble_testing_1.cold('-----|                ');
        var e3subs = ['    ^    !                ',
            '             ^    !       ',
            '                      ^  !'];
        var expected = '----x--------y--------z--|';
        var x = marble_testing_1.cold('-b--c|                ');
        var y = marble_testing_1.cold('-e--f|       ');
        var z = marble_testing_1.cold('-h-|');
        var values = { x: x, y: y, z: z };
        var result = source.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should emit windows that are opened by an observable from the first argument ' +
        'and closed by an observable returned by the function in the second argument', function () {
        var e1 = marble_testing_1.hot('--1--2--^--a--b--c--d--e--f--g--h--|');
        var e1subs = '^                          !';
        var e2 = marble_testing_1.cold('--------x-------x-------x--|');
        var e2subs = '^                          !';
        var e3 = marble_testing_1.cold('----------(x|)      ');
        var e3subs = ['        ^         !         ',
            '                ^         ! ',
            '                        ^  !'];
        var expected = '--------x-------y-------z--|';
        var x = marble_testing_1.cold('-c--d--e--(f|)      ');
        var y = marble_testing_1.cold('--f--g--h-| ');
        var z = marble_testing_1.cold('---|');
        var values = { x: x, y: y, z: z };
        var source = e1.pipe(operators_1.windowToggle(e2, function (value) {
            chai_1.expect(value).to.equal('x');
            return e3;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should emit windows using constying cold closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|      ');
        var e1subs = '^                                  !      ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|              ');
        var e2subs = '^                          !              ';
        var close = [
            marble_testing_1.cold('---------------s--|                     '),
            marble_testing_1.cold('----(s|)                    '),
            marble_testing_1.cold('---------------(s|)')
        ];
        var closeSubs = ['  ^              !                        ',
            '              ^   !                       ',
            '                       ^           !      '];
        var expected = '--x-----------y--------z-----------|      ';
        var x = marble_testing_1.cold('--b---c---d---e|                        ');
        var y = marble_testing_1.cold('--e-|                       ');
        var z = marble_testing_1.cold('-g---h------|      ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
        marble_testing_1.expectSubscriptions(close[2].subscriptions).toBe(closeSubs[2]);
    });
    it('should emit windows using constying hot closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|   ');
        var e1subs = '^                                  !   ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|           ');
        var e2subs = '^                          !           ';
        var closings = [
            { obs: marble_testing_1.hot('-1--^----------------s-|                   '),
                sub: '  ^              !                     ' },
            { obs: marble_testing_1.hot('-----3----4-------(s|)                 '),
                sub: '              ^   !                    ' },
            { obs: marble_testing_1.hot('-------3----4-------5----------------s|'),
                sub: '                       ^           !   ' }
        ];
        var expected = '--x-----------y--------z-----------|   ';
        var x = marble_testing_1.cold('--b---c---d---e|                     ');
        var y = marble_testing_1.cold('--e-|                    ');
        var z = marble_testing_1.cold('-g---h------|   ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return closings[i++].obs; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(closings[0].obs.subscriptions).toBe(closings[0].sub);
        marble_testing_1.expectSubscriptions(closings[1].obs.subscriptions).toBe(closings[1].sub);
        marble_testing_1.expectSubscriptions(closings[2].obs.subscriptions).toBe(closings[2].sub);
    });
    it('should emit windows using constying empty delayed closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|   ');
        var e1subs = '^                                  !   ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|           ');
        var e2subs = '^                          !           ';
        var close = [marble_testing_1.cold('---------------|                     '),
            marble_testing_1.cold('----|                    '),
            marble_testing_1.cold('---------------|')];
        var expected = '--x-----------y--------z-----------|   ';
        var x = marble_testing_1.cold('--b---c---d---e|                     ');
        var y = marble_testing_1.cold('--e-|                    ');
        var z = marble_testing_1.cold('-g---h------|   ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit windows using constying cold closings, outer unsubscribed early', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|      ');
        var e1subs = '^                !                        ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|              ');
        var e2subs = '^                !                        ';
        var close = [marble_testing_1.cold('-------------s---|                     '),
            marble_testing_1.cold('-----(s|)                   '),
            marble_testing_1.cold('---------------(s|)')];
        var closeSubs = ['  ^            !                          ',
            '              ^  !                        '];
        var expected = '--x-----------y---                        ';
        var x = marble_testing_1.cold('--b---c---d--|                          ');
        var y = marble_testing_1.cold('--e-                        ');
        var unsub = '                 !                        ';
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
        marble_testing_1.expectSubscriptions(close[2].subscriptions).toBe([]);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|      ');
        var e1subs = '^              !                          ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|              ');
        var e2subs = '^              !                          ';
        var close = [marble_testing_1.cold('---------------s--|                     '),
            marble_testing_1.cold('----(s|)                    '),
            marble_testing_1.cold('---------------(s|)')];
        var closeSubs = ['  ^            !                          ',
            '              ^!                          '];
        var expected = '--x-----------y-                          ';
        var x = marble_testing_1.cold('--b---c---d---                          ');
        var y = marble_testing_1.cold('--                          ');
        var unsub = '               !                          ';
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.windowToggle(e2, function () { return close[i++]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should dispose window Subjects if the outer is unsubscribed early', function () {
        var source = marble_testing_1.hot('--a--b--c--d--e--f--g--h--|');
        var open = marble_testing_1.cold('o-------------------------|');
        var sourceSubs = '^        !                 ';
        var expected = 'x---------                 ';
        var x = marble_testing_1.cold('--a--b--c-                 ');
        var unsub = '         !                 ';
        var late = marble_testing_1.time('---------------|           ');
        var values = { x: x };
        var window;
        var result = source.pipe(operators_1.windowToggle(open, function () { return rxjs_1.NEVER; }), operators_1.tap(function (w) { window = w; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        rxTestScheduler.schedule(function () {
            chai_1.expect(function () {
                window.subscribe();
            }).to.throw(rxjs_1.ObjectUnsubscribedError);
        }, late);
    });
    it('should propagate error thrown from closingSelector', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|      ');
        var e1subs = '^             !                           ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|              ');
        var e2subs = '^             !                           ';
        var close = [marble_testing_1.cold('---------------s--|                     '),
            marble_testing_1.cold('----(s|)                    '),
            marble_testing_1.cold('---------------(s|)')];
        var expected = '--x-----------#----                       ';
        var x = marble_testing_1.cold('--b---c---d-#                           ');
        var values = { x: x };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () {
            if (i === 1) {
                throw 'error';
            }
            return close[i++];
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should propagate error emitted from a closing', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^             !                     ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|        ');
        var e2subs = '^             !                     ';
        var close = [marble_testing_1.cold('---------------s--|               '),
            marble_testing_1.cold('#                     ')];
        var expected = '--x-----------(y#)                  ';
        var x = marble_testing_1.cold('--b---c---d-#                     ');
        var y = marble_testing_1.cold('#                     ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should propagate error emitted late from a closing', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^                  !                ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|        ');
        var e2subs = '^                  !                ';
        var close = [marble_testing_1.cold('---------------s--|               '),
            marble_testing_1.cold('-----#                ')];
        var expected = '--x-----------y----#                ';
        var x = marble_testing_1.cold('--b---c---d---e|                  ');
        var y = marble_testing_1.cold('--e--#                ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle errors', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e--#                ');
        var e1subs = '^                  !                ';
        var e2 = marble_testing_1.cold('--x-----------y--------z---|        ');
        var e2subs = '^                  !                ';
        var close = [marble_testing_1.cold('---------------s--|               '),
            marble_testing_1.cold('-------s|             ')];
        var expected = '--x-----------y----#                ';
        var x = marble_testing_1.cold('--b---c---d---e|                  ');
        var y = marble_testing_1.cold('--e--#                ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return close[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('--o-----|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.cold('-----c--|');
        var expected = '|';
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('--o-----|');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.cold('-----c--|');
        var expected = '#';
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle never', function () {
        var e1 = marble_testing_1.hot('-');
        var e1subs = '^                                           !';
        var e2 = marble_testing_1.cold('--o-----o------o-----o---o-----|             ');
        var e2subs = '^                              !             ';
        var e3 = marble_testing_1.cold('--c-|                                      ');
        var expected = '--u-----v------x-----y---z-------------------';
        var u = marble_testing_1.cold('--|                                        ');
        var v = marble_testing_1.cold('--|                                  ');
        var x = marble_testing_1.cold('--|                           ');
        var y = marble_testing_1.cold('--|                     ');
        var z = marble_testing_1.cold('--|                 ');
        var unsub = '                                            !';
        var values = { u: u, v: v, x: x, y: y, z: z };
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a never opening Observable', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^                                  !';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^                                  !';
        var e3 = marble_testing_1.cold('--c-|                               ');
        var expected = '-----------------------------------|';
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a never closing Observable', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^                                  !';
        var e2 = marble_testing_1.cold('---o---------------o-----------|    ');
        var e2subs = '^                              !    ';
        var e3 = marble_testing_1.cold('-');
        var expected = '---x---------------y---------------|';
        var x = marble_testing_1.cold('-b---c---d---e---f---g---h------|');
        var y = marble_testing_1.cold('-f---g---h------|');
        var values = { x: x, y: y };
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle opening Observable that just throws', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '(^!)';
        var e3 = marble_testing_1.cold('--c-|');
        var subs = '(^!)';
        var expected = '#';
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle empty closing observable', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^                                  !';
        var e2 = marble_testing_1.cold('---o---------------o-----------|    ');
        var e2subs = '^                              !    ';
        var e3 = rxjs_1.EMPTY;
        var expected = '---x---------------y---------------|';
        var x = marble_testing_1.cold('|');
        var y = marble_testing_1.cold('|');
        var values = { x: x, y: y };
        var result = e1.pipe(operators_1.windowToggle(e2, function () { return e3; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=windowToggle-spec.js.map