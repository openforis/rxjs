"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
describe('filter operator', function () {
    function oddFilter(x) {
        return (+x) % 2 === 1;
    }
    function isPrime(i) {
        if (+i <= 1) {
            return false;
        }
        var max = Math.floor(Math.sqrt(+i));
        for (var j = 2; j <= max; ++j) {
            if (+i % j === 0) {
                return false;
            }
        }
        return true;
    }
    asDiagram('filter(x => x % 2 === 1)')('should filter out even values', function () {
        var source = marble_testing_1.hot('--0--1--2--3--4--|');
        var subs = '^                !';
        var expected = '-----1-----3-----|';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(oddFilter))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^                  !';
        var expected = '--3---5----7-------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(isPrime))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter with an always-true predicate', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '--3-4-5-6--7-8--9--|';
        var predicate = function () { return true; };
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
    });
    it('should filter with an always-false predicate', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '-------------------|';
        var predicate = function () { return false; };
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
    });
    it('should filter in only prime numbers, source unsubscribes early', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^           !       ';
        var unsub = '            !       ';
        var expected = '--3---5----7-       ';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(isPrime)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers, source throws', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--#');
        var subs = '^                  !';
        var expected = '--3---5----7-------#';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(isPrime))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers, but predicate throws', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^       !           ';
        var expected = '--3---5-#           ';
        var invoked = 0;
        function predicate(x, index) {
            invoked++;
            if (invoked === 4) {
                throw 'error';
            }
            return isPrime(x);
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers, predicate with index', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^                  !';
        var expected = '--3--------7-------|';
        function predicate(x, i) {
            return isPrime((+x) + i * 10);
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should invoke predicate once for each checked value', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '--3---5----7-------|';
        var invoked = 0;
        var predicate = function (x) {
            invoked++;
            return isPrime(x);
        };
        var r = source.pipe(operators_1.filter(predicate), operators_1.tap(null, null, function () {
            chai_1.expect(invoked).to.equal(7);
        }));
        marble_testing_1.expectObservable(r).toBe(expected);
    });
    it('should filter in only prime numbers, predicate with index, ' +
        'source unsubscribes early', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^           !       ';
        var unsub = '            !       ';
        var expected = '--3--------7-       ';
        function predicate(x, i) {
            return isPrime((+x) + i * 10);
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate)), unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers, predicate with index, source throws', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--#');
        var subs = '^                  !';
        var expected = '--3--------7-------#';
        function predicate(x, i) {
            return isPrime((+x) + i * 10);
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should filter in only prime numbers, predicate with index and throws', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^       !           ';
        var expected = '--3-----#           ';
        var invoked = 0;
        function predicate(x, i) {
            invoked++;
            if (invoked === 4) {
                throw 'error';
            }
            return isPrime((+x) + i * 10);
        }
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(predicate))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should compose with another filter to allow multiples of six', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '--------6----------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(function (x) { return (+x) % 2 === 0; }), operators_1.filter(function (x) { return (+x) % 3 === 0; }))).toBe(expected);
    });
    it('should be able to accept and use a thisArg', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '--------6----------|';
        var Filterer = (function () {
            function Filterer() {
                this.filter1 = function (x) { return (+x) % 2 === 0; };
                this.filter2 = function (x) { return (+x) % 3 === 0; };
            }
            return Filterer;
        }());
        var filterer = new Filterer();
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(function (x) { return this.filter1(x); }, filterer), operators_1.filter(function (x) { return this.filter2(x); }, filterer), operators_1.filter(function (x) { return this.filter1(x); }, filterer))).toBe(expected);
    });
    it('should be able to use filter and map composed', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var expected = '----a---b----c-----|';
        var values = { a: 16, b: 36, c: 64 };
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(function (x) { return (+x) % 2 === 0; }), operators_1.map(function (x) { return (+x) * (+x); }))).toBe(expected, values);
    });
    it('should propagate errors from the source', function () {
        var source = marble_testing_1.hot('--0--1--2--3--4--#');
        var subs = '^                !';
        var expected = '-----1-----3-----#';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(oddFilter))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.empty', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(oddFilter))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.never', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(oddFilter))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should support Observable.throw', function () {
        var source = marble_testing_1.cold('#');
        var subs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(oddFilter))).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should send errors down the error path', function (done) {
        rxjs_1.of(42).pipe(operators_1.filter((function (x, index) {
            throw 'bad';
        }))).subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (err) {
            chai_1.expect(err).to.equal('bad');
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('-1--2--^-3-4-5-6--7-8--9--|');
        var subs = '^           !       ';
        var unsub = '            !       ';
        var expected = '--3---5----7-       ';
        var r = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.filter(isPrime), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(r, unsub).toBe(expected);
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
            rxjs_1.of(foo).pipe(operators_1.filter(function (foo) { return foo.baz === 42; }))
                .subscribe(function (x) { return x.baz; });
            rxjs_1.of(foo).pipe(operators_1.filter(isBar))
                .subscribe(function (x) { return x.bar; });
            var foobar = new Foo();
            rxjs_1.of(foobar).pipe(operators_1.filter(function (foobar) { return foobar.bar === 'name'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(foobar).pipe(operators_1.filter(isBar))
                .subscribe(function (x) { return x.bar; });
            var barish = { bar: 'quack', baz: 42 };
            rxjs_1.of(barish).pipe(operators_1.filter(function (x) { return x.bar === 'quack'; }))
                .subscribe(function (x) { return x.bar; });
            rxjs_1.of(barish).pipe(operators_1.filter(isBar))
                .subscribe(function (bar) { return bar.bar; });
        }
        {
            var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
            var isString = function (x) { return typeof x === 'string'; };
            xs.pipe(operators_1.filter(isString))
                .subscribe(function (s) { return s.length; });
            xs.pipe(operators_1.filter(function (x) { return typeof x === 'number'; }))
                .subscribe(function (x) { return x; });
            xs.pipe(operators_1.filter(function (x, i) { return typeof x === 'number' && x > i; }))
                .subscribe(function (x) { return x; });
        }
    });
    it('should support Boolean as a predicate', function () {
        var source = marble_testing_1.hot('-t--f--^-t-f-t-f--t-f--f--|', { t: 1, f: 0 });
        var subs = '^                  !';
        var expected = '--t---t----t-------|';
        marble_testing_1.expectObservable(source.pipe(operators_1.filter(Boolean))).toBe(expected, { t: 1, f: 0 });
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=filter-spec.js.map