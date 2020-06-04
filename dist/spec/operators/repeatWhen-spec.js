"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('repeatWhen operator', function () {
    asDiagram('repeatWhen')('should handle a source with eventual complete using a hot notifier', function () {
        var source = marble_testing_1.cold('-1--2--|');
        var subs = ['^      !                     ',
            '             ^      !        ',
            '                          ^      !'];
        var notifier = marble_testing_1.hot('-------------r------------r-|');
        var expected = '-1--2---------1--2---------1--2--|';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a source with eventual complete using a hot notifier that raises error', function () {
        var source = marble_testing_1.cold('-1--2--|');
        var subs = ['^      !                    ',
            '           ^      !           ',
            '                   ^      !   '];
        var notifier = marble_testing_1.hot('-----------r-------r---------#');
        var expected = '-1--2-------1--2----1--2-----#';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should repeat when notified via returned notifier on complete', function (done) {
        var retried = false;
        var expected = [1, 2, 1, 2];
        var i = 0;
        try {
            rxjs_1.of(1, 2).pipe(operators_1.map(function (n) {
                return n;
            }), operators_1.repeatWhen(function (notifications) { return notifications.pipe(operators_1.map(function (x) {
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
        }
        catch (err) {
            done(err);
        }
    });
    it('should not repeat when applying an empty notifier', function (done) {
        var expected = [1, 2];
        var nexted = [];
        rxjs_1.of(1, 2).pipe(operators_1.map(function (n) {
            return n;
        }), operators_1.repeatWhen(function (notifications) { return rxjs_1.EMPTY; })).subscribe(function (n) {
            chai_1.expect(n).to.equal(expected.shift());
            nexted.push(n);
        }, function (err) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(nexted).to.deep.equal([1, 2]);
            done();
        });
    });
    it('should not error when applying an empty synchronous notifier', function () {
        var errors = [];
        var originalSubscribe = rxjs_1.Observable.prototype.subscribe;
        rxjs_1.Observable.prototype.subscribe = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var subscriber = args[0];
            if (!(subscriber instanceof rxjs_1.Subscriber)) {
                subscriber = new (rxjs_1.Subscriber.bind.apply(rxjs_1.Subscriber, __spreadArrays([void 0], args)))();
            }
            subscriber.error = function (err) {
                errors.push(err);
                rxjs_1.Subscriber.prototype.error.call(this, err);
            };
            return originalSubscribe.call(this, subscriber);
        };
        rxjs_1.of(1, 2).pipe(operators_1.repeatWhen(function (notifications) { return rxjs_1.EMPTY; })).subscribe(undefined, function (err) { return errors.push(err); });
        rxjs_1.Observable.prototype.subscribe = originalSubscribe;
        chai_1.expect(errors).to.deep.equal([]);
    });
    it('should not error when applying a non-empty synchronous notifier', function () {
        var errors = [];
        var originalSubscribe = rxjs_1.Observable.prototype.subscribe;
        rxjs_1.Observable.prototype.subscribe = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var subscriber = args[0];
            if (!(subscriber instanceof rxjs_1.Subscriber)) {
                subscriber = new (rxjs_1.Subscriber.bind.apply(rxjs_1.Subscriber, __spreadArrays([void 0], args)))();
            }
            subscriber.error = function (err) {
                errors.push(err);
                rxjs_1.Subscriber.prototype.error.call(this, err);
            };
            return originalSubscribe.call(this, subscriber);
        };
        rxjs_1.of(1, 2).pipe(operators_1.repeatWhen(function (notifications) { return rxjs_1.of(1); })).subscribe(undefined, function (err) { return errors.push(err); });
        rxjs_1.Observable.prototype.subscribe = originalSubscribe;
        chai_1.expect(errors).to.deep.equal([]);
    });
    it('should apply an empty notifier on an empty source', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var notifier = marble_testing_1.cold('|');
        var expected = '|';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply a never notifier on an empty source', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var notifier = marble_testing_1.cold('-');
        var expected = '-';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply an empty notifier on a never source', function () {
        var source = marble_testing_1.cold('-');
        var unsub = '                                         !';
        var subs = '^                                        !';
        var notifier = marble_testing_1.cold('|');
        var expected = '-';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should apply a never notifier on a never source', function () {
        var source = marble_testing_1.cold('-');
        var unsub = '                                         !';
        var subs = '^                                        !';
        var notifier = marble_testing_1.cold('-');
        var expected = '-';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return an empty observable given a just-throw source and empty notifier', function () {
        var source = marble_testing_1.cold('#');
        var notifier = marble_testing_1.cold('|');
        var expected = '#';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    it('should return a error observable given a just-throw source and never notifier', function () {
        var source = marble_testing_1.cold('#');
        var notifier = marble_testing_1.cold('-');
        var expected = '#';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
    });
    xit('should hide errors using a never notifier on a source with eventual error', function () {
        var source = marble_testing_1.cold('--a--b--c--#');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('-');
        var expected = '--a--b--c---------------------------------';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    xit('should propagate error thrown from notifierSelector function', function () {
        var source = marble_testing_1.cold('--a--b--c--|');
        var subs = '^          !';
        var expected = '--a--b--c--#';
        var result = source.pipe(operators_1.repeatWhen((function () { throw 'bad!'; })));
        marble_testing_1.expectObservable(result).toBe(expected, undefined, 'bad!');
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    xit('should replace error with complete using an empty notifier on a source ' +
        'with eventual error', function () {
        var source = marble_testing_1.cold('--a--b--c--#');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c--|';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic cold source with complete, given a never notifier', function () {
        var source = marble_testing_1.cold('--a--b--c--|');
        var subs = '^          !';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c--|';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic cold source with no termination, given a never notifier', function () {
        var source = marble_testing_1.cold('--a--b--c---');
        var subs = '^           ';
        var notifier = marble_testing_1.cold('|');
        var expected = '--a--b--c---';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should mirror a basic hot source with complete, given a never notifier', function () {
        var source = marble_testing_1.hot('-a-^--b--c--|');
        var subs = '^        !';
        var notifier = marble_testing_1.cold('|');
        var expected = '---b--c--|';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    xit('should handle a hot source that raises error but eventually completes', function () {
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
        }), operators_1.repeatWhen(function () { return notifier; }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(ssubs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should tear down resources when result is unsubscribed early', function () {
        var source = marble_testing_1.cold('-1--2--|');
        var unsub = '                    !       ';
        var subs = ['^      !                    ',
            '         ^      !           ',
            '                 ^  !       '];
        var notifier = marble_testing_1.hot('---------r-------r---------#');
        var nsubs = '       ^            !       ';
        var expected = '-1--2-----1--2----1--       ';
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifier; }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should not break unsubscription chains when unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('-1--2--|');
        var subs = ['^      !                    ',
            '         ^      !           ',
            '                 ^  !       '];
        var notifier = marble_testing_1.hot('---------r-------r-------r-#');
        var nsubs = '       ^            !       ';
        var expected = '-1--2-----1--2----1--       ';
        var unsub = '                    !       ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.repeatWhen(function (notifications) { return notifier; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        marble_testing_1.expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
    it('should handle a source with eventual error using a dynamic notifier ' +
        'selector which eventually throws', function () {
        var source = marble_testing_1.cold('-1--2--|');
        var subs = ['^      !              ',
            '       ^      !       ',
            '              ^      !'];
        var expected = '-1--2---1--2---1--2--#';
        var invoked = 0;
        var result = source.pipe(operators_1.repeatWhen(function (notifications) {
            return notifications.pipe(operators_1.map(function (err) {
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
        var source = marble_testing_1.cold('-1--2--|');
        var subs = ['^      !              ',
            '       ^      !       ',
            '              ^      !'];
        var expected = '-1--2---1--2---1--2--|';
        var invoked = 0;
        var result = source.pipe(operators_1.repeatWhen(function (notifications) { return notifications.pipe(operators_1.map(function () { return 'x'; }), operators_1.takeUntil(notifications.pipe(operators_1.mergeMap(function () {
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
//# sourceMappingURL=repeatWhen-spec.js.map