"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var test_helper_1 = require("../helpers/test-helper");
describe('single operator', function () {
    var rxTest;
    beforeEach(function () {
        rxTest = new testing_1.TestScheduler(test_helper_1.assertDeepEquals);
    });
    it('should raise error from empty predicate if observable emits multiple time', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----!      ';
            var expected = '-----#      ';
            expectObservable(e1.pipe(operators_1.single())).toBe(expected, null, new rxjs_1.SequenceError('Too many matching values'));
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error from empty predicate if observable does not emit', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--|');
            var e1subs = '     ^--!';
            var expected = '   ---#';
            expectObservable(e1.pipe(operators_1.single())).toBe(expected, null, new rxjs_1.EmptyError());
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return only element from empty predicate if observable emits only once', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--|');
            var e1subs = '  ^----!';
            var expected = '-----(a|)';
            expectObservable(e1.pipe(operators_1.single())).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var unsub = '   ----!        ';
            var e1subs = '  ^---!        ';
            var expected = '------------';
            expectObservable(e1.pipe(operators_1.single()), unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^--!        ';
            var expected = '----        ';
            var unsub = '   ---!        ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.single(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error from empty predicate if observable emits error', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b^--#');
            var e1subs = '        ^--!';
            var expected = '      ---#';
            expectObservable(e1.pipe(operators_1.single())).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error from predicate if observable emits error', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--b^--#');
            var e1subs = '      ^--!';
            var expected = '    ---#';
            expectObservable(e1.pipe(operators_1.single(function (v) { return v === 'c'; }))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error if predicate throws error', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--d--|');
            var e1subs = '  ^----------!   ';
            var expected = '-----------#   ';
            expectObservable(e1.pipe(operators_1.single(function (v) {
                if (v !== 'd') {
                    return false;
                }
                throw 'error';
            }))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return element from predicate if observable have single matching element', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----------!';
            var expected = '-----------(b|)';
            expectObservable(e1.pipe(operators_1.single(function (v) { return v === 'b'; }))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error from predicate if observable have multiple matching element', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--a--b--b--|');
            var e1subs = '  ^----------!      ';
            var expected = '-----------#      ';
            expectObservable(e1.pipe(operators_1.single(function (v) { return v === 'b'; }))).toBe(expected, null, new rxjs_1.SequenceError('Too many matching values'));
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error from predicate if observable does not emit', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^--|');
            var e1subs = '     ^--!';
            var expected = '   ---#';
            expectObservable(e1.pipe(operators_1.single(function (v) { return v === 'a'; }))).toBe(expected, null, new rxjs_1.EmptyError());
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return undefined from predicate if observable does not contain matching element', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----------!';
            var expected = '-----------#';
            expectObservable(e1.pipe(operators_1.single(function (v) { return v === 'x'; }))).toBe(expected, undefined, new rxjs_1.NotFoundError('No matching values'));
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should call predicate with indices starting at 0', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  --a--b--c--|');
            var e1subs = '  ^----------!';
            var expected = '-----------(b|)';
            var indices = [];
            var predicate = function (value, index) {
                indices.push(index);
                return value === 'b';
            };
            expectObservable(e1.pipe(operators_1.single(predicate), operators_1.tap(null, null, function () {
                chai_1.expect(indices).to.deep.equal([0, 1, 2]);
            }))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should error for synchronous empty observables when no arguments are provided', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('|');
            var expected = '   #';
            var subs = ['      (^!)'];
            var result = source.pipe(operators_1.single());
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for async empty observables when no arguments are provided', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('-------|');
            var expected = '   -------#';
            var subs = ['      ^------!'];
            var result = source.pipe(operators_1.single());
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for hot observables that do not emit while active when no arguments are provided', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--a--b--^----|');
            var expected = '          -----#';
            var subs = ['             ^----!'];
            var result = source.pipe(operators_1.single());
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for synchronous empty observables when predicate never passes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('|');
            var expected = '   #';
            var subs = ['      (^!)'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for async empty observables when predicate never passes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('-------|');
            var expected = '   -------#';
            var subs = ['      ^------!'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for hot observables that do not emit while active when predicate never passes', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--a--b--^----|');
            var expected = '          -----#';
            var subs = ['             ^----!'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.EmptyError());
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for synchronous observables that emit when predicate never passes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('(a|)');
            var expected = '   #';
            var subs = ['      (^!)'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.NotFoundError('No matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for async observables that emit when predicate never passes', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('--a--b-|');
            var expected = '   -------#';
            var subs = ['      ^------!'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.NotFoundError('No matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for hot observables that emit while active when predicate never passes', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--a--b--^--c--d--|');
            var expected = '          ---------#';
            var subs = ['             ^--------!'];
            var result = source.pipe(operators_1.single(function () { return false; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.NotFoundError('No matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for synchronous observables when the predicate passes more than once', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('(axbxc|)');
            var expected = '   #';
            var subs = ['      (^!)'];
            var result = source.pipe(operators_1.single(function (v) { return v === 'x'; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.SequenceError('Too many matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for async observables that emit when the predicate passes more than once', function () {
        rxTest.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('--a-x-b-x-c-|');
            var expected = '   --------#';
            var subs = ['      ^-------!'];
            var result = source.pipe(operators_1.single(function (v) { return v === 'x'; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.SequenceError('Too many matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('should error for hot observables that emit while active when the predicate passes more than once', function () {
        rxTest.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = hot('--a--b--^--c--x--d--x--|');
            var expected = '          ------------#';
            var subs = ['             ^-----------!'];
            var result = source.pipe(operators_1.single(function (v) { return v === 'x'; }));
            expectObservable(result).toBe(expected, undefined, new rxjs_1.SequenceError('Too many matching values'));
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
});
//# sourceMappingURL=single-spec.js.map