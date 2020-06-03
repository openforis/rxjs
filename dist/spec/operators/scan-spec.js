"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('scan operator', function () {
    it('should scan', function () {
        var values = {
            a: 1, b: 3, c: 5,
            x: 1, y: 4, z: 9
        };
        var e1 = marble_testing_1.hot('--a--b--c--|', values);
        var e1subs = '^          !';
        var expected = '--x--y--z--|';
        var scanFunction = function (o, x) {
            return o + x;
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.scan(scanFunction, 0))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should scan things', function () {
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
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should scan with a seed of undefined', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^                    !';
        var expected = '---u--v--w--x--y--z--|';
        var values = {
            u: 'undefined b',
            v: 'undefined b c',
            w: 'undefined b c d',
            x: 'undefined b c d e',
            y: 'undefined b c d e f',
            z: 'undefined b c d e f g'
        };
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc + ' ' + x; }, undefined));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should scan without seed', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--|');
        var e1subs = '^           !';
        var expected = '---x--y--z--|';
        var values = {
            x: 'b',
            y: 'bc',
            z: 'bcd'
        };
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc + x; }));
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
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle errors in the projection function', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^        !            ';
        var expected = '---u--v--#            ';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.scan(function (acc, x) {
            if (x === 'd') {
                throw 'bad!';
            }
            return acc.concat(x);
        }, []));
        marble_testing_1.expectObservable(source).toBe(expected, values, 'bad!');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('handle throw', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var unsub = '              !       ';
        var e1subs = '^             !       ';
        var expected = '---u--v--w--x--       ';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.scan(function (acc, x) { return acc.concat(x); }, []));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var e1subs = '^             !       ';
        var expected = '---u--v--w--x--       ';
        var unsub = '              !       ';
        var values = {
            u: ['b'],
            v: ['b', 'c'],
            w: ['b', 'c', 'd'],
            x: ['b', 'c', 'd', 'e'],
            y: ['b', 'c', 'd', 'e', 'f'],
            z: ['b', 'c', 'd', 'e', 'f', 'g']
        };
        var source = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.scan(function (acc, x) { return acc.concat(x); }, []), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should pass current index to accumulator', function () {
        var values = {
            a: 1, b: 3, c: 5,
            x: 1, y: 4, z: 9
        };
        var idx = [0, 1, 2];
        var e1 = marble_testing_1.hot('--a--b--c--|', values);
        var e1subs = '^          !';
        var expected = '--x--y--z--|';
        var scanFunction = function (o, value, index) {
            chai_1.expect(index).to.equal(idx.shift());
            return o + value;
        };
        var scanObs = e1.pipe(operators_1.scan(scanFunction, 0), operators_1.finalize(function () {
            chai_1.expect(idx).to.be.empty;
        }));
        marble_testing_1.expectObservable(scanObs).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=scan-spec.js.map