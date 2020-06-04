"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('Observable.prototype.first', function () {
    asDiagram('first')('should take the first value of an observable with many values', function () {
        var e1 = marble_testing_1.hot('-----a--b--c---d---|');
        var expected = '-----(a|)           ';
        var sub = '^    !              ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should take the first value of an observable with one value', function () {
        var e1 = marble_testing_1.hot('---(a|)');
        var expected = '---(a|)';
        var sub = '^  !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should error on empty', function () {
        var e1 = marble_testing_1.hot('--a--^----|');
        var expected = '-----#';
        var sub = '^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first())).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should return the default value if source observable was empty', function () {
        var e1 = marble_testing_1.hot('-----^----|');
        var expected = '-----(a|)';
        var sub = '^    !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(null, 'a'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should only emit one value in recursive cases', function () {
        var subject = new rxjs_1.Subject();
        var results = [];
        subject.pipe(operators_1.first()).subscribe(function (x) {
            results.push(x);
            subject.next(x + 1);
        });
        subject.next(0);
        chai_1.expect(results).to.deep.equal([0]);
    });
    it('should propagate error from the source observable', function () {
        var e1 = marble_testing_1.hot('---^---#');
        var expected = '----#';
        var sub = '^   !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should go on forever on never', function () {
        var e1 = marble_testing_1.hot('--^-------');
        var expected = '--------';
        var sub = '^       ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first())).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^-----b----c---d--|');
        var e1subs = '^  !               ';
        var expected = '----               ';
        var unsub = '   !               ';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first()), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a--^-----b----c---d--|');
        var e1subs = '^  !               ';
        var expected = '----               ';
        var unsub = '   !               ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.first(), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should unsubscribe when the first value is receiv', function () {
        var source = marble_testing_1.hot('--a--b---c-|');
        var subs = '^ !';
        var expected = '----(a|)';
        var duration = rxTestScheduler.createTime('--|');
        marble_testing_1.expectObservable(source.pipe(operators_1.first(), operators_1.delay(duration, rxTestScheduler))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return first value that matches a predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--a--c--|');
        var expected = '------(c|)';
        var sub = '^     !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (value) { return value === 'c'; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should return first value that matches a predicate for odd numbers', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--d--e--|', { a: 1, b: 2, c: 3, d: 4, e: 5 });
        var expected = '------(c|)';
        var sub = '^     !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (x) { return x % 2 === 1; }))).toBe(expected, { c: 3 });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should error when no value matches the predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--a--c--|');
        var expected = '---------------#';
        var sub = '^              !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (x) { return x === 's'; }))).toBe(expected, null, new rxjs_1.EmptyError());
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should return the default value when no value matches the predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--a--c--|');
        var expected = '---------------(d|)';
        var sub = '^              !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (x) { return x === 's'; }, 'd'))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should propagate error when no value matches the predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--a--#');
        var expected = '------------#';
        var sub = '^           !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (x) { return x === 's'; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should return first value that matches the index in the predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--a--c--|');
        var expected = '---------(a|)';
        var sub = '^        !';
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(function (_, i) { return i === 2; }))).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
    });
    it('should propagate error from predicate', function () {
        var e1 = marble_testing_1.hot('--a-^--b--c--d--e--|', { a: 1, b: 2, c: 3, d: 4, e: 5 });
        var expected = '---------#';
        var sub = '^        !';
        var predicate = function (value) {
            if (value < 4) {
                return false;
            }
            else {
                throw 'error';
            }
        };
        marble_testing_1.expectObservable(e1.pipe(operators_1.first(predicate))).toBe(expected, null, 'error');
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(sub);
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
            rxjs_1.of(foo).pipe(operators_1.first())
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.first(function (foo) { return foo.bar === 'name'; }))
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.first(isBar))
                .subscribe(function (x) { return x.bar; });
            var foobar = new Foo();
            rxjs_1.of(foobar).pipe(operators_1.first())
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.first(function (foobar) { return foobar.bar === 'name'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.first(isBaz))
                .subscribe(function (x) { return x.baz; });
            var barish = { bar: 'quack', baz: 42 };
            rxjs_1.of(barish).pipe(operators_1.first())
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(barish).pipe(operators_1.first(function (x) { return x.bar === 'quack'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(barish).pipe(operators_1.first(isBar))
                .subscribe(function (x) { return x.bar; });
        }
        {
            var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
            var isString = function (x) { return typeof x === 'string'; };
            xs.pipe(operators_1.first()).subscribe(function (x) { return x; });
            xs.pipe(operators_1.first(null)).subscribe(function (x) { return x; });
            xs.pipe(operators_1.first(undefined)).subscribe(function (x) { return x; });
            xs.pipe(operators_1.first(isString))
                .subscribe(function (s) { return s.length; });
            xs.pipe(operators_1.first(function (x) { return typeof x === 'string'; }))
                .subscribe(function (x) { return x; });
        }
    });
});
//# sourceMappingURL=first-spec.js.map