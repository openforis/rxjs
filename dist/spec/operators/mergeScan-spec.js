"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var chai_1 = require("chai");
describe('mergeScan', function () {
    it('should mergeScan things', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---u--v--w--x--y--z--|';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle errors', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--#');
        var e1subs = '^           !';
        var expected = '---u--v--w--#';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd']
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeScan values and be able to asynchronously project them', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '-----u--v--w--x--y--z|';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(20, rxTestScheduler));
        }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not stop ongoing async projections when source completes', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '--------u--v--w--x--y--(z|)';
        var values = {
            u: ['b'],
            v: ['c'],
            w: ['b', 'd'],
            x: ['c', 'e'],
            y: ['b', 'd', 'f'],
            z: ['c', 'e', 'g'],
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(50, rxTestScheduler));
        }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should interrupt ongoing async projections when result is unsubscribed early', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^               !     ';
        var expected = '--------u--v--w--     ';
        var values = {
            u: ['b'],
            v: ['c'],
            w: ['b', 'd'],
            x: ['c', 'e'],
            y: ['b', 'd', 'f'],
            z: ['c', 'e', 'g'],
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(50, rxTestScheduler));
        }, []));
        marble_testing_1.expectObservable(source, e1subs).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^               !     ';
        var expected = '--------u--v--w--     ';
        var unsub = '                !     ';
        var values = {
            u: ['b'],
            v: ['c'],
            w: ['b', 'd'],
            x: ['c', 'e'],
            y: ['b', 'd', 'f'],
            z: ['c', 'e', 'g'],
        };
        var source = e1
            .pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.mergeScan(function (acc, x) {
            return rxjs_1.of(__spreadArrays(acc, [x])).pipe(operators_1.delay(50, rxTestScheduler));
        }, []), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should stop listening to a synchronous observable when unsubscribed', function () {
        var sideEffects = [];
        var synchronousObservable = rxjs_1.concat(rxjs_1.defer(function () {
            sideEffects.push(1);
            return rxjs_1.of(1);
        }), rxjs_1.defer(function () {
            sideEffects.push(2);
            return rxjs_1.of(2);
        }), rxjs_1.defer(function () {
            sideEffects.push(3);
            return rxjs_1.of(3);
        }));
        rxjs_1.of(null).pipe(operators_1.mergeScan(function () { return synchronousObservable; }, 0), operators_1.takeWhile(function (x) { return x != 2; })).subscribe(function () { });
        chai_1.expect(sideEffects).to.deep.equal([1, 2]);
    });
    it('should handle errors in the projection function', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^        !';
        var expected = '---u--v--#';
        var values = {
            u: ['b'],
            v: ['b', 'c']
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            if (x === 'd') {
                throw new Error('bad!');
            }
            return rxjs_1.of(acc.concat(x));
        }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values, new Error('bad!'));
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should propagate errors from the projected Observable', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^  !';
        var expected = '---#';
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.throwError(new Error('bad!')); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, undefined, new Error('bad!'));
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an empty projected Observable', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---------------------(x|)';
        var values = { x: [] };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.EMPTY; }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never projected Observable', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '----------------------';
        var values = { x: [] };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.NEVER; }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(u|)';
        var values = {
            u: []
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeScan unsubscription', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var expected = '---u--v--w--x--';
        var sub = '^             !';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.of(acc.concat(x)); }, []));
        marble_testing_1.expectObservable(source, sub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should mergescan projects cold Observable with single concurrency', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var e1subs = '^          !';
        var inner = [
            marble_testing_1.cold('--d--e--f--|                      '),
            marble_testing_1.cold('--g--h--i--|           '),
            marble_testing_1.cold('--j--k--l--|')
        ];
        var xsubs = '  ^          !';
        var ysubs = '             ^          !';
        var zsubs = '                        ^          !';
        var expected = '--x-d--e--f--f-g--h--i--i-j--k--l--|';
        var index = 0;
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            var value = inner[index++];
            return value.pipe(operators_1.startWith(acc));
        }, 'x', 1));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
    it('should emit accumulator if inner completes without value', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---------------------(x|)';
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.EMPTY; }, ['1']));
        marble_testing_1.expectObservable(source).toBe(expected, { x: ['1'] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit accumulator if inner completes without value after source completes', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---------------------(x|)';
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) { return rxjs_1.EMPTY.pipe(operators_1.delay(50, rxTestScheduler)); }, ['1']));
        marble_testing_1.expectObservable(source).toBe(expected, { x: ['1'] });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergescan projects hot Observable with single concurrency', function () {
        var e1 = marble_testing_1.hot('---a---b---c---|');
        var e1subs = '^              !';
        var inner = [
            marble_testing_1.hot('--d--e--f--|'),
            marble_testing_1.hot('----g----h----i----|'),
            marble_testing_1.hot('------j------k-------l------|')
        ];
        var xsubs = '   ^       !';
        var ysubs = '           ^       !';
        var zsubs = '                   ^        !';
        var expected = '---x-e--f--f--i----i-l------|';
        var index = 0;
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            var value = inner[index++];
            return value.pipe(operators_1.startWith(acc));
        }, 'x', 1));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
    it('should mergescan projects cold Observable with dual concurrency', function () {
        var e1 = marble_testing_1.hot('----a----b----c----|');
        var e1subs = '^                  !';
        var inner = [
            marble_testing_1.cold('---d---e---f---|               '),
            marble_testing_1.cold('---g---h---i---|          '),
            marble_testing_1.cold('---j---k---l---|')
        ];
        var xsubs = '    ^              !';
        var ysubs = '         ^              !';
        var zsubs = '                   ^              !';
        var expected = '----x--d-d-eg--fh--hi-j---k---l---|';
        var index = 0;
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            var value = inner[index++];
            return value.pipe(operators_1.startWith(acc));
        }, 'x', 2));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
    it('should mergescan projects hot Observable with dual concurrency', function () {
        var e1 = marble_testing_1.hot('---a---b---c---|');
        var e1subs = '^              !';
        var inner = [
            marble_testing_1.hot('--d--e--f--|'),
            marble_testing_1.hot('----g----h----i----|'),
            marble_testing_1.hot('------j------k-------l------|')
        ];
        var xsubs = '   ^       !';
        var ysubs = '       ^           !';
        var zsubs = '           ^                !';
        var expected = '---x-e-efh-h-ki------l------|';
        var index = 0;
        var source = e1.pipe(operators_1.mergeScan(function (acc, x) {
            var value = inner[index++];
            return value.pipe(operators_1.startWith(acc));
        }, 'x', 2));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
        marble_testing_1.expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
    it('should pass current index to accumulator', function () {
        var recorded = [];
        var e1 = rxjs_1.of('a', 'b', 'c', 'd');
        e1.pipe(operators_1.mergeScan(function (acc, x, index) {
            recorded.push(index);
            return rxjs_1.of(index);
        }, 0)).subscribe();
        chai_1.expect(recorded).to.deep.equal([0, 1, 2, 3]);
    });
});
//# sourceMappingURL=mergeScan-spec.js.map