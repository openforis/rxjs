"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('Observable.prototype.buffer', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit buffers that close and reopen', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('   -a-b-c-d-e-f-g-h-i-|');
            var b = hot('   -----B-----B-----B-|');
            var expected = '-----x-----y-----z-|';
            var expectedValues = {
                x: ['a', 'b', 'c'],
                y: ['d', 'e', 'f'],
                z: ['g', 'h', 'i']
            };
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, expectedValues);
        });
    });
    it('should work with empty and empty selector', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var a = rxjs_1.EMPTY;
            var b = rxjs_1.EMPTY;
            var expected = '|';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with empty and non-empty selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = rxjs_1.EMPTY;
            var b = hot('-----a-----');
            var expected = '|';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with non-empty and empty selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var b = rxjs_1.EMPTY;
            var expected = '|';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with never and never selector', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var a = rxjs_1.NEVER;
            var b = rxjs_1.NEVER;
            var expected = '-';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with never and empty selector', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var a = rxjs_1.NEVER;
            var b = rxjs_1.EMPTY;
            var expected = '|';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with empty and never selector', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var a = rxjs_1.EMPTY;
            var b = rxjs_1.NEVER;
            var expected = '|';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected);
        });
    });
    it('should work with non-empty and throw selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('---^--a--');
            var b = rxjs_1.throwError(new Error('too bad'));
            var expected = '#';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, null, new Error('too bad'));
        });
    });
    it('should work with throw and non-empty selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = rxjs_1.throwError(new Error('too bad'));
            var b = hot('---^--a--');
            var expected = '#';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, null, new Error('too bad'));
        });
    });
    it('should work with error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('---^-------#', undefined, new Error('too bad'));
            var b = hot('---^--------');
            var expected = '--------#';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, null, new Error('too bad'));
        });
    });
    it('should work with error and non-empty selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('---^-------#', undefined, new Error('too bad'));
            var b = hot('---^---a----');
            var expected = '----a---#';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, { a: [] }, new Error('too bad'));
        });
    });
    it('should work with selector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var b = hot('--------^--a-------b---cd---------e---f---|');
            var expected = '     ---a-------b---cd---------e---f-|';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5'],
                c: ['6'],
                d: [],
                e: ['7', '8', '9'],
                f: ['0']
            };
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, expectedValues);
        });
    });
    it(' work with selector completed', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var subs = '         ^----------------!               ';
            var b = hot('--------^--a-------b---cd|               ');
            var expected = '     ---a-------b---cd|               ';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5'],
                c: ['6'],
                d: []
            };
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, expectedValues);
            expectSubscriptions(a.subscriptions).toBe(subs);
        });
    });
    it('should allow unsubscribing the result Observable early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var unsub = '        --------------!                  ';
            var subs = '         ^-------------!                  ';
            var b = hot('--------^--a-------b---cd|               ');
            var expected = '     ---a-------b---                  ';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5']
            };
            expectObservable(a.pipe(operators_1.buffer(b)), unsub).toBe(expected, expectedValues);
            expectSubscriptions(a.subscriptions).toBe(subs);
        });
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var subs = '         ^-------------!                  ';
            var b = hot('--------^--a-------b---cd|               ');
            var expected = '     ---a-------b---                  ';
            var unsub = '        --------------!                  ';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5']
            };
            var result = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.buffer(b), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, expectedValues);
            expectSubscriptions(a.subscriptions).toBe(subs);
        });
    });
    it('should work with non-empty and selector error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('--1--2--^--3-----#', { '3': 3 }, new Error('too bad'));
            var subs = '         ^--------!';
            var b = hot('--------^--a--b---');
            var expected = '     ---a--b--#';
            var expectedValues = {
                a: [3],
                b: []
            };
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, expectedValues, new Error('too bad'));
            expectSubscriptions(a.subscriptions).toBe(subs);
        });
    });
    it('should work with non-empty and empty selector error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var b = hot('--------^----------------#', undefined, new Error('too bad'));
            var expected = '     -----------------#';
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, null, new Error('too bad'));
        });
    });
    it('should work with non-empty and selector error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var obj = { a: true, b: true, c: true };
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var subs = '         ^----------------!';
            var b = hot('--------^--a-------b---c-#', obj, new Error('too bad'));
            var expected = '     ---a-------b---c-#';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5'],
                c: ['6']
            };
            expectObservable(a.pipe(operators_1.buffer(b))).toBe(expected, expectedValues, new Error('too bad'));
            expectSubscriptions(a.subscriptions).toBe(subs);
        });
    });
    it('should unsubscribe notifier when source unsubscribed', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
            var unsub = '        --------------!                  ';
            var subs = '         ^-------------!                  ';
            var b = hot('--------^--a-------b---cd|               ');
            var bsubs = '        ^-------------!                  ';
            var expected = '     ---a-------b---                  ';
            var expectedValues = {
                a: ['3'],
                b: ['4', '5']
            };
            expectObservable(a.pipe(operators_1.buffer(b)), unsub).toBe(expected, expectedValues);
            expectSubscriptions(a.subscriptions).toBe(subs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should unsubscribe notifier when source unsubscribed', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   -a-b-c-d-e-f-g-h-i-|');
            var b = hot('   -----1-----2-----3-|');
            var bsubs = '   ^----!';
            var expected = '-----(x|)';
            var expectedValues = {
                x: ['a', 'b', 'c'],
            };
            expectObservable(a.pipe(operators_1.buffer(b), operators_1.take(1))).toBe(expected, expectedValues);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
});
//# sourceMappingURL=buffer-spec.js.map