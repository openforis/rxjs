"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('throttle operator', function () {
    it('should immediately emit the first value in each time window', function () {
        var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx-|');
        var e1subs = '^                    !';
        var e2 = marble_testing_1.cold('----|                ');
        var e2subs = [' ^   !                ',
            '          ^   !       ',
            '                ^   ! '];
        var expected = '-a--------b-----c----|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should simply mirror the source if values are not emitted often enough', function () {
        var e1 = marble_testing_1.hot('-a--------b-----c----|');
        var e1subs = '^                    !';
        var e2 = marble_testing_1.cold('----|                ');
        var e2subs = [' ^   !                ',
            '          ^   !       ',
            '                ^   ! '];
        var expected = '-a--------b-----c----|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should throttle with duration Observable using next to close the duration', function () {
        var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx-|');
        var e1subs = '^                    !';
        var e2 = marble_testing_1.cold('----x-y-z            ');
        var e2subs = [' ^   !                ',
            '          ^   !       ',
            '                ^   ! '];
        var expected = '-a--------b-----c----|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should interrupt source and duration when result is unsubscribed early', function () {
        var e1 = marble_testing_1.hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
        var unsub = '              !               ';
        var e1subs = '^             !               ';
        var e2 = marble_testing_1.cold('------------------|          ');
        var e2subs = ' ^            !               ';
        var expected = '-a-------------               ';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
        var e1subs = '^             !               ';
        var e2 = marble_testing_1.cold('------------------|          ');
        var e2subs = ' ^            !               ';
        var expected = '-a-------------               ';
        var unsub = '              !               ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.throttle(function () { return e2; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should handle a busy producer emitting a regular repeating sequence', function () {
        var e1 = marble_testing_1.hot('abcdefabcdefabcdefabcdefa|');
        var e1subs = '^                        !';
        var e2 = marble_testing_1.cold('-----|                    ');
        var e2subs = ['^    !                    ',
            '      ^    !              ',
            '            ^    !        ',
            '                  ^    !  ',
            '                        ^!'];
        var expected = 'a-----a-----a-----a-----a|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should mirror source if durations are always empty', function () {
        var e1 = marble_testing_1.hot('abcdefabcdefabcdefabcdefa|');
        var e1subs = '^                        !';
        var e2 = marble_testing_1.cold('|');
        var expected = 'abcdefabcdefabcdefabcdefa|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take only the first value emitted if duration is a never', function () {
        var e1 = marble_testing_1.hot('----abcdefabcdefabcdefabcdefa|');
        var e1subs = '^                            !';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '    ^                        !';
        var expected = '----a------------------------|';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should unsubscribe duration Observable when source raise error', function () {
        var e1 = marble_testing_1.hot('----abcdefabcdefabcdefabcdefa#');
        var e1subs = '^                            !';
        var e2 = marble_testing_1.cold('-');
        var e2subs = '    ^                        !';
        var expected = '----a------------------------#';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should raise error as soon as just-throw duration is used', function () {
        var e1 = marble_testing_1.hot('----abcdefabcdefabcdefabcdefa|');
        var e1subs = '^   !                         ';
        var e2 = marble_testing_1.cold('#');
        var e2subs = '    (^!)                      ';
        var expected = '----(a#)                      ';
        var result = e1.pipe(operators_1.throttle(function () { return e2; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
    it('should throttle using durations of constying lengths', function () {
        var e1 = marble_testing_1.hot('abcdefabcdabcdefghabca|   ');
        var e1subs = '^                     !   ';
        var e2 = [marble_testing_1.cold('-----|                    '),
            marble_testing_1.cold('---|                '),
            marble_testing_1.cold('-------|        '),
            marble_testing_1.cold('--|     '),
            marble_testing_1.cold('----|')];
        var e2subs = ['^    !                    ',
            '      ^  !                ',
            '          ^      !        ',
            '                  ^ !     ',
            '                     ^!   '];
        var expected = 'a-----a---a-------a--a|   ';
        var i = 0;
        var result = e1.pipe(operators_1.throttle(function () { return e2[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var j = 0; j < e2.length; j++) {
            marble_testing_1.expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
        }
    });
    it('should propagate error from duration Observable', function () {
        var e1 = marble_testing_1.hot('abcdefabcdabcdefghabca|   ');
        var e1subs = '^                !        ';
        var e2 = [marble_testing_1.cold('-----|                    '),
            marble_testing_1.cold('---|                '),
            marble_testing_1.cold('-------#        ')];
        var e2subs = ['^    !                    ',
            '      ^  !                ',
            '          ^      !        '];
        var expected = 'a-----a---a------#        ';
        var i = 0;
        var result = e1.pipe(operators_1.throttle(function () { return e2[i++]; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (var j = 0; j < e2.length; j++) {
            marble_testing_1.expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
        }
    });
    it('should propagate error thrown from durationSelector function', function () {
        var s1 = marble_testing_1.hot('--^--x--x--x--x--x--x--e--x--x--x--|');
        var s1Subs = '^                    !';
        var n1 = marble_testing_1.cold('----|');
        var n1Subs = ['   ^   !                          ',
            '         ^   !                    ',
            '               ^   !              '];
        var exp = '---x-----x-----x-----(e#)';
        var i = 0;
        var result = s1.pipe(operators_1.throttle(function () {
            if (i++ === 3) {
                throw new Error('lol');
            }
            return n1;
        }));
        marble_testing_1.expectObservable(result).toBe(exp, undefined, new Error('lol'));
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        marble_testing_1.expectSubscriptions(n1.subscriptions).toBe(n1Subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.hot('-----|');
        var subs = '^    !';
        var expected = '-----|';
        function durationSelector() { return marble_testing_1.cold('-----|'); }
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should raise error when source does not emit and raises error', function () {
        var e1 = marble_testing_1.hot('-----#');
        var subs = '^    !';
        var expected = '-----#';
        function durationSelector() { return marble_testing_1.cold('-----|'); }
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle an empty source', function () {
        var e1 = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        function durationSelector() { return marble_testing_1.cold('-----|'); }
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle a never source', function () {
        var e1 = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        function durationSelector() { return marble_testing_1.cold('-----|'); }
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should handle a throw source', function () {
        var e1 = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        function durationSelector() { return marble_testing_1.cold('-----|'); }
        marble_testing_1.expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should throttle by promise resolves', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(50).pipe(operators_1.mapTo(4)));
        var expected = [1, 2, 3, 4];
        e1.pipe(operators_1.throttle(function () {
            return new Promise(function (resolve) { resolve(42); });
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function () {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should raise error when promise rejects', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(50).pipe(operators_1.mapTo(4)));
        var expected = [1, 2, 3];
        var error = new Error('error');
        e1.pipe(operators_1.throttle(function (x) {
            if (x === 3) {
                return new Promise(function (resolve, reject) { reject(error); });
            }
            else {
                return new Promise(function (resolve) { resolve(42); });
            }
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (err) {
            chai_1.expect(err).to.be.an('error', 'error');
            chai_1.expect(expected.length).to.equal(0);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    type('should support selectors of the same type', function () {
        var o;
        var s;
        var r = o.pipe(operators_1.throttle(function (n) { return s; }));
    });
    type('should support selectors of a different type', function () {
        var o;
        var s;
        var r = o.pipe(operators_1.throttle(function (n) { return s; }));
    });
    describe('throttle(fn, { leading: true, trailing: true })', function () {
        it('should immediately emit the first value in each time window', function () {
            var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx------|');
            var e1subs = '^                         !';
            var e2 = marble_testing_1.cold('----|                     ');
            var e2subs = [' ^   !                     ',
                '     ^   !                 ',
                '          ^   !            ',
                '              ^   !        ',
                '                  ^   !    ',
                '                      ^   !'];
            var expected = '-a---y----b---x---x---x---|';
            var result = e1.pipe(operators_1.throttle(function () { return e2; }, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
        it('should work for individual values', function () {
            var s1 = marble_testing_1.hot('-^-x------------------|');
            var s1Subs = '^                    !';
            var n1 = marble_testing_1.cold('------------------------|');
            var n1Subs = ['  ^                  !'];
            var exp = '--x------------------|';
            var result = s1.pipe(operators_1.throttle(function () { return n1; }, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(exp);
            marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1Subs);
            marble_testing_1.expectSubscriptions(n1.subscriptions).toBe(n1Subs);
        });
    });
    describe('throttle(fn, { leading: false, trailing: true })', function () {
        it('should immediately emit the first value in each time window', function () {
            var e1 = marble_testing_1.hot('-a-xy-----b--x--cxxx------|');
            var e1subs = '^                         !';
            var e2 = marble_testing_1.cold('----|                     ');
            var e2subs = [' ^   !                     ',
                '     ^   !                 ',
                '          ^   !            ',
                '              ^   !        ',
                '                  ^   !    ',
                '                      ^   !'];
            var expected = '-a---y----b---x---x---x---|';
            var result = e1.pipe(operators_1.throttle(function () { return e2; }, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(expected);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
            marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
        it('should work for individual values', function () {
            var s1 = marble_testing_1.hot('-^-x------------------|');
            var s1Subs = '^                    !';
            var n1 = marble_testing_1.cold('------------------------|');
            var n1Subs = ['  ^                  !'];
            var exp = '--x------------------|';
            var result = s1.pipe(operators_1.throttle(function () { return n1; }, { leading: true, trailing: true }));
            marble_testing_1.expectObservable(result).toBe(exp);
            marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1Subs);
            marble_testing_1.expectSubscriptions(n1.subscriptions).toBe(n1Subs);
        });
    });
});
//# sourceMappingURL=throttle-spec.js.map