"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('retryWhen operator', function () {
    it('should handle a source with eventual error using a hot notifier', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var subs = ['^      !                     ',
            '             ^      !        ',
            '                          ^ !'];
        var notifier = marble_testing_1.hot('-------------r------------r-|');
        var expected = '-1--2---------1--2---------1|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a source with eventual error using a hot notifier that raises error', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var subs = ['^      !                    ',
            '           ^      !           ',
            '                   ^      !   '];
        var notifier = marble_testing_1.hot('-----------r-------r---------#');
        var expected = '-1--2-------1--2----1--2-----#';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should retry when notified via returned notifier on thrown error', function (done) {
        var retried = false;
        var expected = [1, 2, 1, 2];
        var i = 0;
        rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (n) {
            if (n === 3) {
                throw 'bad';
            }
            return n;
        }), operators_1.retryWhen(function (errors) { return errors.pipe(operators_1.map(function (x) {
            chai_1.expect(x).to.equal('bad');
            if (retried) {
                throw new Error('done');
            }
            retried = true;
            return x;
        })); })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        }, function (err) {
            chai_1.expect(err).to.be.an('error', 'done');
            done();
        });
    });
    it('should retry when notified and complete on returned completion', function (done) {
        var expected = [1, 2, 1, 2];
        rxjs_1.of(1, 2, 3).pipe(operators_1.map(function (n) {
            if (n === 3) {
                throw 'bad';
            }
            return n;
        }), operators_1.retryWhen(function (errors) { return rxjs_1.EMPTY; })).subscribe(function (n) {
            chai_1.expect(n).to.equal(expected.shift());
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
    it('should apply an empty notifier on an empty source', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var notifier = marble_testing_1.cold('|');
        var expected = '|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply a never notifier on an empty source', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var notifier = marble_testing_1.cold('-');
        var expected = '|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply an empty notifier on a never source', function () {
        var source = marble_testing_1.cold('-');
        var unsub = '                                         !';
        var subs = '^                                        !';
        var notifier = marble_testing_1.cold('|');
        var expected = '-';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply a never notifier on a never source', function () {
        var source = marble_testing_1.cold('-');
        var unsub = '                                         !';
        var subs = '^                                        !';
        var notifier = marble_testing_1.cold('-');
        var expected = '-';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return an empty observable given a just-throw source and empty notifier', function () {
        var source = marble_testing_1.cold('#');
        var notifier = marble_testing_1.cold('|');
        var expected = '|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should return a never observable given a just-throw source and never notifier', function () {
        var source = marble_testing_1.cold('#');
        var notifier = marble_testing_1.cold('-');
        var expected = '-';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should hide errors using a never notifier on a source with eventual error', function () {
        var source = marble_testing_1.cold('--a--b--c--#');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('-');
        var expected = '--a--b--c---------------------------------';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should propagate error thrown from notifierSelector function', function () {
        var source = marble_testing_1.cold('--a--b--c--#');
        var subs = '^          !';
        var expected = '--a--b--c--#';
        var result = source.pipe(operators_1.retryWhen((function () { throw 'bad!'; })));
        marble_testing_1.expectObservable(result).toBe(expected, undefined, 'bad!');
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should replace error with complete using an empty notifier on a source ' +
        'with eventual error', function () {
        var source = marble_testing_1.cold('--a--b--c--#');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c--|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic cold source with complete, given a never notifier', function () {
        var source = marble_testing_1.cold('--a--b--c--|');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c--|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic cold source with no termination, given a never notifier', function () {
        var source = marble_testing_1.cold('--a--b--c---');
        var subs = '^           ';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c---';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic hot source with complete, given a never notifier', function () {
        var source = marble_testing_1.hot('-a-^--b--c--|');
        var subs = '^        !';
        var notifier = marble_testing_1.cold('|');
        var expected = '---b--c--|';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a hot source that raises error but eventually completes', function () {
        var source = marble_testing_1.hot('-1--2--3----4--5---|');
        var ssubs = ['^      !            ',
            '              ^    !'];
        var notifier = marble_testing_1.hot('--------------r--------r---r--r--r---|');
        var nsubs = '       ^           !';
        var expected = '-1--2---      -5---|';
        var result = source.pipe(operators_1.map(function (x) {
            if (x === '3') {
                throw 'error';
            }
            return x;
        }), operators_1.retryWhen(function () { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(ssubs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should tear down resources when result is unsubscribed early', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var unsub = '                    !       ';
        var subs = ['^      !                    ',
            '         ^      !           ',
            '                 ^  !       '];
        var notifier = marble_testing_1.hot('---------r-------r---------#');
        var nsubs = '       ^            !       ';
        var expected = '-1--2-----1--2----1--       ';
        var result = source.pipe(operators_1.retryWhen(function (errors) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var subs = ['^      !                    ',
            '         ^      !           ',
            '                 ^  !       '];
        var notifier = marble_testing_1.hot('---------r-------r-------r-#');
        var nsubs = '       ^            !       ';
        var expected = '-1--2-----1--2----1--       ';
        var unsub = '                    !       ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.retryWhen(function (errors) { return notifier; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should handle a source with eventual error using a dynamic notifier ' +
        'selector which eventually throws', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var subs = ['^      !              ',
            '       ^      !       ',
            '              ^      !'];
        var expected = '-1--2---1--2---1--2--#';
        var invoked = 0;
        var result = source.pipe(operators_1.retryWhen(function (errors) {
            return errors.pipe(operators_1.map(function (err) {
                if (++invoked === 3) {
                    throw 'error';
                }
                else {
                    return 'x';
                }
            }));
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a source with eventual error using a dynamic notifier ' +
        'selector which eventually completes', function () {
        var source = marble_testing_1.cold('-1--2--#');
        var subs = ['^      !              ',
            '       ^      !       ',
            '              ^      !'];
        var expected = '-1--2---1--2---1--2--|';
        var invoked = 0;
        var result = source.pipe(operators_1.retryWhen(function (errors) { return errors.pipe(operators_1.map(function () { return 'x'; }), operators_1.takeUntil(errors.pipe(operators_1.mergeMap(function () {
            if (++invoked < 3) {
                return rxjs_1.EMPTY;
            }
            else {
                return rxjs_1.of('stop!');
            }
        })))); }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=retryWhen-spec.js.map