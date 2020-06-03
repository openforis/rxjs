"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('find operator', function () {
    function truePredicate(x) {
        return true;
    }
    it('should return matching element from source emits single element', function () {
        var values = { a: 3, b: 9, c: 15, d: 20 };
        var source = marble_testing_1.hot('---a--b--c--d---|', values);
        var subs = '^        !       ';
        var expected = '---------(c|)    ';
        var predicate = function (x) { return x % 5 === 0; };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should throw if not provided a function', function () {
        chai_1.expect(function () {
            rxjs_1.of('yut', 'yee', 'sam').pipe(operators_1.find('yee'));
        }).to.throw(TypeError, 'predicate is not a function');
    });
    it('should not emit if source does not emit', function () {
        var source = marble_testing_1.hot('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.find(truePredicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return undefined if source is empty to match predicate', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '(x|)';
        var result = source.pipe(operators_1.find(truePredicate));
        marble_testing_1.expectObservable(result).toBe(expected, { x: undefined });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return matching element from source emits single element', function () {
        var source = marble_testing_1.hot('--a--|');
        var subs = '^ !';
        var expected = '--(a|)';
        var predicate = function (value) {
            return value === 'a';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return matching element from source emits multiple elements', function () {
        var source = marble_testing_1.hot('--a--b---c-|');
        var subs = '^    !';
        var expected = '-----(b|)';
        var predicate = function (value) {
            return value === 'b';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should work with a custom thisArg', function () {
        var source = marble_testing_1.hot('--a--b---c-|');
        var subs = '^    !';
        var expected = '-----(b|)';
        var finder = {
            target: 'b'
        };
        var predicate = function (value) {
            return value === this.target;
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate, finder))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return undefined if element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^          !';
        var expected = '-----------(x|)';
        var predicate = function (value) {
            return value === 'z';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected, { x: undefined });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.find(function (value) { return value === 'z'; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^     !     ';
        var expected = '-------     ';
        var unsub = '      !     ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.find(function (value) { return value === 'z'; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should unsubscribe when the predicate is matched', function () {
        var source = marble_testing_1.hot('--a--b---c-|');
        var subs = '^    !';
        var expected = '-------(b|)';
        var duration = rxTestScheduler.createTime('--|');
        marble_testing_1.expectObservable(source.pipe(operators_1.find(function (value) { return value === 'b'; }), operators_1.delay(duration, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise if source raise error while element does not match with predicate', function () {
        var source = marble_testing_1.hot('--a--b--#');
        var subs = '^       !';
        var expected = '--------#';
        var predicate = function (value) {
            return value === 'z';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should raise error if predicate throws error', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var subs = '^ !';
        var expected = '--#';
        var predicate = function (value) {
            throw 'error';
        };
        marble_testing_1.expectObservable(source.pipe(operators_1.find(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support type guards without breaking previous behavior', function () {
        {
            var Foo = (function () {
                function Foo(bar, baz) {
                    if (bar === void 0) { bar = 'name'; }
                    if (baz === void 0) { baz = 42; }
                    this.bar = bar;
                    this.baz = baz;
                }
                return Foo;
            }());
            var isBar = function (x) { return x && x.bar !== undefined; };
            var isBaz = function (x) { return x && x.baz !== undefined; };
            var foo = new Foo();
            rxjs_1.of(foo).pipe(operators_1.find(function (foo) { return foo.baz === 42; }))
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.find(isBar))
                .subscribe(function (x) { return x.bar; });
            var foobar = new Foo();
            rxjs_1.of(foobar).pipe(operators_1.find(function (foobar) { return foobar.bar === 'name'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.find(isBar))
                .subscribe(function (x) { return x.bar; });
            var barish = { bar: 'quack', baz: 42 };
            rxjs_1.of(barish).pipe(operators_1.find(function (x) { return x.bar === 'quack'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(barish).pipe(operators_1.find(isBar))
                .subscribe(function (bar) { return bar.bar; });
        }
        {
            var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
            var isString = function (x) { return typeof x === 'string'; };
            xs.pipe(operators_1.find(isString))
                .subscribe(function (s) { return s.length; });
            xs.pipe(operators_1.find(function (x) { return typeof x === 'number'; }))
                .subscribe(function (x) { return x; });
            xs.pipe(operators_1.find(function (x, i) { return typeof x === 'number' && x > i; }))
                .subscribe(function (x) { return x; });
        }
    });
});
//# sourceMappingURL=find-spec.js.map