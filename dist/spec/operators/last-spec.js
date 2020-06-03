"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('Observable.prototype.last', function () {
    it('should take the last value of an observable', function () {
        var e1 = marble_testing_1.hot('--a----b--c--|');
        var e1subs = '^            !';
        var expected = '-------------(c|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should error on nothing sent but completed', function () {
        var e1 = marble_testing_1.hot('--a--^----|');
        var e1subs = '^    !';
        var expected = '-----#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last())).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should error on empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last())).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should go on forever on never', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return last element matches with predicate', function () {
        var e1 = marble_testing_1.hot('--a--b--a--b--|');
        var e1subs = '^             !';
        var expected = '--------------(b|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last(function (value) { return value === 'b'; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--|');
        var unsub = '       !       ';
        var e1subs = '^      !       ';
        var expected = '--------       ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--b--c--d--|');
        var e1subs = '^      !       ';
        var expected = '--------       ';
        var unsub = '       !       ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.last(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return a default value if no element found', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '(a|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last(null, 'a'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not return default value if an element is found', function () {
        var e1 = marble_testing_1.hot('--a---^---b---c---d---|');
        var e1subs = '^               !';
        var expected = '----------------(d|)';
        marble_testing_1.expectObservable(e1.pipe(operators_1.last(null, 'x'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should raise error when predicate throws', function () {
        var e1 = marble_testing_1.hot('--a--^---b---c---d---e--|');
        var e1subs = '^       !           ';
        var expected = '--------#           ';
        var predicate = function (x) {
            if (x === 'c') {
                throw 'error';
            }
            else {
                return false;
            }
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.last(predicate))).toBe(expected);
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
            var isBaz = function (x) { return x && x.baz !== undefined; };
            var foo = new Foo();
            rxjs_1.of(foo).pipe(operators_1.last())
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.last(function (foo) { return foo.bar === 'name'; }))
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.last(isBar))
                .subscribe(function (x) { return x.bar; });
            var foobar = new Foo();
            rxjs_1.of(foobar).pipe(operators_1.last())
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.last(function (foobar) { return foobar.bar === 'name'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.last(isBaz))
                .subscribe(function (x) { return x.baz; });
            var barish = { bar: 'quack', baz: 42 };
            rxjs_1.of(barish).pipe(operators_1.last())
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(barish).pipe(operators_1.last(function (x) { return x.bar === 'quack'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(barish).pipe(operators_1.last(isBar))
                .subscribe(function (x) { return x.bar; });
        }
        {
            var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
            var isString = function (x) { return typeof x === 'string'; };
            xs.pipe(operators_1.last()).subscribe(function (x) { return x; });
            xs.pipe(operators_1.last(null)).subscribe(function (x) { return x; });
            xs.pipe(operators_1.last(undefined)).subscribe(function (x) { return x; });
            xs.pipe(operators_1.last(isString))
                .subscribe(function (s) { return s.length; });
            xs.pipe(operators_1.last(function (x) { return typeof x === 'string'; }))
                .subscribe(function (x) { return x; });
        }
    });
});
//# sourceMappingURL=last-spec.js.map