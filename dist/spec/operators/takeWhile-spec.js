"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('takeWhile operator', function () {
    it('should take all elements until predicate is false', function () {
        var source = marble_testing_1.hot('-1-^2--3--4--5--6--|');
        var sourceSubs = '^      !         ';
        var expected = '-2--3--|         ';
        var result = source.pipe(operators_1.takeWhile(function (v) { return +v < 4; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should take all elements with predicate returns true', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^             !';
        var expected = '--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take all elements with truthy predicate', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^             !';
        var expected = '--b--c--d--e--|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile((function () { return {}; })))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all elements with predicate returns false', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^ !            ';
        var expected = '--|            ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return false; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should skip all elements with falsy predicate', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^ !            ';
        var expected = '--|            ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return null; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take all elements until predicate return false', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^       !      ';
        var expected = '--b--c--|      ';
        function predicate(value) {
            return value !== 'd';
        }
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take all elements up to and including the element that made ' +
        'the predicate return false', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^       !      ';
        var expected = '--b--c--(d|)   ';
        function predicate(value) {
            return value !== 'd';
        }
        var inclusive = true;
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(predicate, inclusive))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take elements with predicate when source does not complete', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--');
        var e1subs = '^             ';
        var expected = '--b--c--d--e--';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not complete when source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var result = e1.pipe(operators_1.takeWhile(function () { return true; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source does not emit', function () {
        var e1 = marble_testing_1.hot('--a-^------------|');
        var e1subs = '^            !';
        var expected = '-------------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should complete when source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var result = e1.pipe(operators_1.takeWhile(function () { return true; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should pass element index to predicate', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^       !      ';
        var expected = '--b--c--|      ';
        function predicate(value, index) {
            return index < 2;
        }
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source raises error', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--#');
        var e1subs = '^             !';
        var expected = '--b--c--d--e--#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when source throws', function () {
        var source = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.takeWhile(function () { return true; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should invoke predicate until return false', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^       !      ';
        var expected = '--b--c--|      ';
        var invoked = 0;
        function predicate(value) {
            invoked++;
            return value !== 'd';
        }
        var source = e1.pipe(operators_1.takeWhile(predicate), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(3);
        }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error if predicate throws', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var e1subs = '^ !            ';
        var expected = '--#            ';
        function predicate(value) {
            throw 'error';
        }
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should take elements until unsubscribed', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var unsub = '-----!         ';
        var e1subs = '^    !         ';
        var expected = '--b---         ';
        function predicate(value) {
            return value !== 'd';
        }
        marble_testing_1.expectObservable(e1.pipe(operators_1.takeWhile(predicate)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a-^-b--c--d--e--|');
        var unsub = '-----!         ';
        var e1subs = '^    !         ';
        var expected = '--b---         ';
        function predicate(value) {
            return value !== 'd';
        }
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.takeWhile(predicate), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
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
            var foo = new Foo();
            rxjs_1.of(foo).pipe(operators_1.takeWhile(function (foo) { return foo.baz === 42; }))
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.takeWhile(isBar))
                .subscribe(function (x) { return x.bar; });
            var foobar = new Foo();
            rxjs_1.of(foobar).pipe(operators_1.takeWhile(function (foobar) { return foobar.bar === 'name'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.takeWhile(isBar))
                .subscribe(function (x) { return x.bar; });
            var barish = { bar: 'quack', baz: 42 };
            rxjs_1.of(barish).pipe(operators_1.takeWhile(function (x) { return x.bar === 'quack'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(barish).pipe(operators_1.takeWhile(isBar))
                .subscribe(function (bar) { return bar.bar; });
        }
        {
            var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
            var isString = function (x) { return typeof x === 'string'; };
            xs.pipe(operators_1.takeWhile(isString))
                .subscribe(function (s) { return s.length; });
            xs.pipe(operators_1.takeWhile(function (x) { return typeof x === 'number'; }))
                .subscribe(function (x) { return x; });
            xs.pipe(operators_1.takeWhile(function (x, i) { return typeof x === 'number' && x > i; }))
                .subscribe(function (x) { return x; });
        }
    });
});
//# sourceMappingURL=takeWhile-spec.js.map