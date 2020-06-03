"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var chai_1 = require("chai");
describe('delayWhen operator', function () {
    it('should delay by duration selector', function () {
        var e1 = marble_testing_1.hot('---a---b---c--|');
        var expected = '-----a------c----(b|)';
        var subs = '^             !';
        var selector = [marble_testing_1.cold('--x--|'),
            marble_testing_1.cold('----------(x|)'),
            marble_testing_1.cold('-x--|')];
        var selectorSubs = ['   ^ !            ',
            '       ^         !',
            '           ^!     '];
        var idx = 0;
        function durationSelector(x) {
            return selector[idx++];
        }
        var result = e1.pipe(operators_1.delayWhen(durationSelector));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector[0].subscriptions).toBe(selectorSubs[0]);
        marble_testing_1.expectSubscriptions(selector[1].subscriptions).toBe(selectorSubs[1]);
        marble_testing_1.expectSubscriptions(selector[2].subscriptions).toBe(selectorSubs[2]);
    });
    it('should delay by selector', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '---a--b-|';
        var subs = '^       !';
        var selector = marble_testing_1.cold('-x--|');
        var selectorSubs = ['  ^!     ',
            '     ^!  '];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should raise error if source raises error', function () {
        var e1 = marble_testing_1.hot('--a--#');
        var expected = '---a-#';
        var subs = '^    !';
        var selector = marble_testing_1.cold('-x--|');
        var selectorSubs = '  ^!     ';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should raise error if selector raises error', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '---#';
        var subs = '^  !';
        var selector = marble_testing_1.cold('-#');
        var selectorSubs = '  ^!     ';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should delay by selector and completes after value emits', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '---------a--(b|)';
        var subs = '^       !';
        var selector = marble_testing_1.cold('-------x--|');
        var selectorSubs = ['  ^      !',
            '     ^      !'];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should delay by selector completes if selector does not emits', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '------a--(b|)';
        var subs = '^       !';
        var selector = marble_testing_1.cold('----|');
        var selectorSubs = ['  ^   !',
            '     ^   !'];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should emit if the selector completes synchronously', function () {
        var e1 = marble_testing_1.hot('a--|');
        var expected = 'a--|';
        var subs = '^  !';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return rxjs_1.EMPTY; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should emit if the source completes synchronously and the selector completes synchronously', function () {
        var e1 = marble_testing_1.hot('(a|)');
        var expected = '(a|)';
        var subs = '(^!)';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return rxjs_1.EMPTY; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should not emit if selector never emits', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '-';
        var subs = '^       !';
        var selector = marble_testing_1.cold('-');
        var selectorSubs = ['  ^      ',
            '     ^   '];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should delay by first value from selector', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '------a--(b|)';
        var subs = '^       !';
        var selector = marble_testing_1.cold('----x--y--|');
        var selectorSubs = ['  ^   !',
            '     ^   !'];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should delay by selector does not completes', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '------a--(b|)';
        var subs = '^       !';
        var selector = marble_testing_1.cold('----x-----y---');
        var selectorSubs = ['  ^   !',
            '     ^   !'];
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
    it('should raise error if selector throws', function () {
        var e1 = marble_testing_1.hot('--a--b--|');
        var expected = '--#';
        var subs = '^ !';
        var err = new Error('error');
        var result = e1.pipe(operators_1.delayWhen((function (x) { throw err; })));
        marble_testing_1.expectObservable(result).toBe(expected, null, err);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should start subscription when subscription delay emits', function () {
        var e1 = marble_testing_1.hot('-----a---b---|');
        var expected = '  -----a---b-|';
        var subs = '  ^          !';
        var selector = marble_testing_1.cold('--x--|');
        var selectorSubs = ['     ^ !',
            '         ^ !'];
        var subDelay = marble_testing_1.cold('--x--|');
        var subDelaySub = '^ !';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }, subDelay));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
        marble_testing_1.expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
    it('should start subscription when subscription delay completes without emit value', function () {
        var e1 = marble_testing_1.hot('-----a---b---|');
        var expected = '  -----a---b-|';
        var subs = '  ^          !';
        var selector = marble_testing_1.cold('--x--|');
        var selectorSubs = ['     ^ !',
            '         ^ !'];
        var subDelay = marble_testing_1.cold('--|');
        var subDelaySub = '^ !';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }, subDelay));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
        marble_testing_1.expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
    it('should raise error when subscription delay raises error', function () {
        var e1 = marble_testing_1.hot('-----a---b---|');
        var expected = '   #          ';
        var selector = marble_testing_1.cold('--x--|');
        var subDelay = marble_testing_1.cold('---#');
        var subDelaySub = '^  !';
        var result = e1.pipe(operators_1.delayWhen(function (x) { return selector; }, subDelay));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([]);
        marble_testing_1.expectSubscriptions(selector.subscriptions).toBe([]);
        marble_testing_1.expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
    it('should complete when duration selector returns synchronous observable', function () {
        var next = false;
        var complete = false;
        rxjs_1.of(1).pipe(operators_1.delayWhen(function () { return rxjs_1.of(2); })).subscribe(function () { return next = true; }, null, function () { return complete = true; });
        chai_1.expect(next).to.be.true;
        chai_1.expect(complete).to.be.true;
    });
    it('should call predicate with indices starting at 0', function () {
        var e1 = marble_testing_1.hot('--a--b--c--|');
        var expected = '--a--b--c--|';
        var selector = marble_testing_1.cold('(x|)');
        var indices = [];
        var predicate = function (value, index) {
            indices.push(index);
            return selector;
        };
        var result = e1.pipe(operators_1.delayWhen(predicate));
        marble_testing_1.expectObservable(result.pipe(operators_1.tap(null, null, function () {
            chai_1.expect(indices).to.deep.equal([0, 1, 2]);
        }))).toBe(expected);
    });
});
//# sourceMappingURL=delayWhen-spec.js.map