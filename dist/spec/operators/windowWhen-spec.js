"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('windowWhen operator', function () {
    it('should emit windows that close and reopen', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--h--i--|');
        var e1subs = '^                          !';
        var e2 = marble_testing_1.cold('-----------|                ');
        var e2subs = ['^          !                ',
            '           ^          !     ',
            '                      ^    !'];
        var a = marble_testing_1.cold('---b--c--d-|                ');
        var b = marble_testing_1.cold('-e--f--g--h|     ');
        var c = marble_testing_1.cold('--i--|');
        var expected = 'a----------b----------c----|';
        var values = { a: a, b: b, c: c };
        var source = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should emit windows using constying cold closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                                  !     ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('-----(s|)               '),
            marble_testing_1.cold('---------------(s|)')
        ];
        var closeSubs = ['^                !                       ',
            '                 ^    !                  ',
            '                      ^            !     '];
        var expected = 'x----------------y----z------------|     ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('---f-|                  ');
        var z = marble_testing_1.cold('--g---h------|     ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        marble_testing_1.expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
    });
    it('should emit windows using constying hot closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|   ');
        var subs = '^                                  !   ';
        var closings = [
            { obs: marble_testing_1.hot('-1--^----------------s-|                   '),
                sub: '^                !                     ' },
            { obs: marble_testing_1.hot('-----3----4-----------(s|)             '),
                sub: '                 ^    !                ' },
            { obs: marble_testing_1.hot('-------3----4-------5----------------s|'),
                sub: '                      ^            !   ' }
        ];
        var expected = 'x----------------y----z------------|   ';
        var x = marble_testing_1.cold('----b---c---d---e|                     ');
        var y = marble_testing_1.cold('---f-|                ');
        var z = marble_testing_1.cold('--g---h------|   ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++].obs; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(closings[0].obs.subscriptions).toBe(closings[0].sub);
        marble_testing_1.expectSubscriptions(closings[1].obs.subscriptions).toBe(closings[1].sub);
        marble_testing_1.expectSubscriptions(closings[2].obs.subscriptions).toBe(closings[2].sub);
    });
    it('should emit windows using constying empty delayed closings', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|  ');
        var e1subs = '^                                  !  ';
        var closings = [
            marble_testing_1.cold('-----------------|                    '),
            marble_testing_1.cold('-----|               '),
            marble_testing_1.cold('---------------|')
        ];
        var closeSubs = ['^                !                    ',
            '                 ^    !               ',
            '                      ^            !  '];
        var expected = 'x----------------y----z------------|  ';
        var x = marble_testing_1.cold('----b---c---d---e|                    ');
        var y = marble_testing_1.cold('---f-|               ');
        var z = marble_testing_1.cold('--g---h------|  ');
        var values = { x: x, y: y, z: z };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        marble_testing_1.expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
    });
    it('should emit windows using constying cold closings, outer unsubscribed early', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                    !                   ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('---------(s|)           ')
        ];
        var closeSubs = ['^                !                       ',
            '                 ^   !                   '];
        var expected = 'x----------------y----                   ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('---f-                   ');
        var unsub = '                     !                   ';
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                    !                   ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('---------(s|)           ')
        ];
        var closeSubs = ['^                !                       ',
            '                 ^   !                   '];
        var expected = 'x----------------y----                   ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('---f-                   ');
        var unsub = '                     !                   ';
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.windowWhen(function () { return closings[i++]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should propagate error thrown from closingSelector', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                !                       ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('-----(s|)               '),
            marble_testing_1.cold('---------------(s|)')
        ];
        var closeSubs = ['^                !                       '];
        var expected = 'x----------------(y#)                    ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('#                       ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () {
            if (i === 1) {
                throw 'error';
            }
            return closings[i++];
        }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
    });
    it('should propagate error emitted from a closing', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                !                       ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('#                       ')
        ];
        var closeSubs = ['^                !                       ',
            '                 (^!)                    '];
        var expected = 'x----------------(y#)                    ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('#                       ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should propagate error emitted late from a closing', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|     ');
        var e1subs = '^                     !                  ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('-----#                  ')
        ];
        var closeSubs = ['^                !                       ',
            '                 ^    !                  '];
        var expected = 'x----------------y----#                  ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('---f-#                  ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should propagate errors emitted from the source', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f-#                  ');
        var e1subs = '^                     !                  ';
        var closings = [
            marble_testing_1.cold('-----------------s--|                    '),
            marble_testing_1.cold('-------(s|)             ')
        ];
        var closeSubs = ['^                !                       ',
            '                 ^    !                  '];
        var expected = 'x----------------y----#                  ';
        var x = marble_testing_1.cold('----b---c---d---e|                       ');
        var y = marble_testing_1.cold('---f-#                  ');
        var values = { x: x, y: y };
        var i = 0;
        var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        marble_testing_1.expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
    });
    it('should handle empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('-----c--|');
        var e2subs = '(^!)';
        var expected = '(w|)';
        var values = { w: marble_testing_1.cold('|') };
        var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a never source', function () {
        var e1 = marble_testing_1.cold('-');
        var unsub = '                 !';
        var e1subs = '^                !';
        var e2 = marble_testing_1.cold('-----c--|');
        var e2subs = ['^    !            ',
            '     ^    !       ',
            '          ^    !  ',
            '               ^ !'];
        var win = marble_testing_1.cold('-----|');
        var d = marble_testing_1.cold('---');
        var expected = 'a----b----c----d--';
        var values = { a: win, b: win, c: win, d: d };
        var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var e2 = marble_testing_1.cold('-----c--|');
        var e2subs = '(^!)';
        var win = marble_testing_1.cold('#');
        var expected = '(w#)';
        var values = { w: win };
        var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a never closing Observable', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '^                                  !';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '^                                  !';
        var expected = 'x----------------------------------|';
        var x = marble_testing_1.cold('----b---c---d---e---f---g---h------|');
        var values = { x: x };
        var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a throw closing Observable', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e---f---g---h------|');
        var e1subs = '(^!)                                ';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '(^!)                                ';
        var expected = '(x#)                                ';
        var x = marble_testing_1.cold('#                                   ');
        var values = { x: x };
        var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
});
//# sourceMappingURL=windowWhen-spec.js.map