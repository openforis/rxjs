"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('retry operator', function () {
    it('should handle a basic source that emits next then errors, count=3', function () {
        var source = marble_testing_1.cold('--1-2-3-#');
        var subs = ['^       !                ',
            '        ^       !        ',
            '                ^       !'];
        var expected = '--1-2-3---1-2-3---1-2-3-#';
        var result = source.pipe(operators_1.retry(2));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should retry a number of times, without error, then complete', function (done) {
        var errors = 0;
        var retries = 2;
        rxjs_1.Observable.create(function (observer) {
            observer.next(42);
            observer.complete();
        }).pipe(operators_1.map(function (x) {
            if (++errors < retries) {
                throw 'bad';
            }
            errors = 0;
            return x;
        }), operators_1.retry(retries)).subscribe(function (x) {
            chai_1.expect(x).to.equal(42);
        }, function (err) {
            chai_1.expect('this was called').to.be.true;
        }, done);
    });
    it('should retry a number of times, then call error handler', function (done) {
        var errors = 0;
        var retries = 2;
        rxjs_1.Observable.create(function (observer) {
            observer.next(42);
            observer.complete();
        }).pipe(operators_1.map(function (x) {
            errors += 1;
            throw 'bad';
        }), operators_1.retry(retries - 1)).subscribe(function (x) {
            done("shouldn't next");
        }, function (err) {
            chai_1.expect(errors).to.equal(2);
            done();
        }, function () {
            done("shouldn't complete");
        });
    });
    it('should retry a number of times, then call error handler (with resetOnSuccess)', function (done) {
        var errors = 0;
        var retries = 2;
        rxjs_1.Observable.create(function (observer) {
            observer.next(42);
            observer.complete();
        }).pipe(operators_1.map(function (x) {
            errors += 1;
            throw 'bad';
        }), operators_1.retry({ count: retries - 1, resetOnSuccess: true })).subscribe(function (x) {
            done("shouldn't next");
        }, function (err) {
            chai_1.expect(errors).to.equal(2);
            done();
        }, function () {
            done("shouldn't complete");
        });
    });
    it('should retry a number of times, then call next handler without error, then retry and complete', function (done) {
        var index = 0;
        var errors = 0;
        var retries = 2;
        rxjs_1.defer(function () { return rxjs_1.range(0, 4 - index); }).pipe(operators_1.mergeMap(function () {
            index++;
            if (index === 1 || index === 3) {
                errors++;
                return rxjs_1.throwError('bad');
            }
            else {
                return rxjs_1.of(42);
            }
        }), operators_1.retry({ count: retries - 1, resetOnSuccess: true })).subscribe(function (x) {
            chai_1.expect(x).to.equal(42);
        }, function (err) {
            done("shouldn't error");
        }, function () {
            chai_1.expect(errors).to.equal(retries);
            done();
        });
    });
    it('should retry a number of times, then call next handler without error, then retry and error', function (done) {
        var index = 0;
        var errors = 0;
        var retries = 2;
        rxjs_1.defer(function () { return rxjs_1.range(0, 4 - index); }).pipe(operators_1.mergeMap(function () {
            index++;
            if (index === 1 || index === 3) {
                errors++;
                return rxjs_1.throwError('bad');
            }
            else {
                return rxjs_1.of(42);
            }
        }), operators_1.retry({ count: retries - 1, resetOnSuccess: false })).subscribe(function (x) {
            chai_1.expect(x).to.equal(42);
        }, function (err) {
            chai_1.expect(errors).to.equal(retries);
            done();
        }, function () {
            done("shouldn't complete");
        });
    });
    it('should retry until successful completion', function (done) {
        var errors = 0;
        var retries = 10;
        rxjs_1.Observable.create(function (observer) {
            observer.next(42);
            observer.complete();
        }).pipe(operators_1.map(function (x) {
            if (++errors < retries) {
                throw 'bad';
            }
            errors = 0;
            return x;
        }), operators_1.retry(), operators_1.take(retries)).subscribe(function (x) {
            chai_1.expect(x).to.equal(42);
        }, function (err) {
            chai_1.expect('this was called').to.be.true;
        }, done);
    });
    it('should handle an empty source', function () {
        var source = marble_testing_1.cold('|');
        var subs = '(^!)';
        var expected = '|';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a never source', function () {
        var source = marble_testing_1.cold('-');
        var subs = '^';
        var expected = '-';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should return a never observable given an async just-throw source and no count', function () {
        var source = marble_testing_1.cold('-#');
        var unsub = '                                     !';
        var expected = '--------------------------------------';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
    });
    it('should handle a basic source that emits next then completes', function () {
        var source = marble_testing_1.hot('--1--2--^--3--4--5---|');
        var subs = '^            !';
        var expected = '---3--4--5---|';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a basic source that emits next but does not complete', function () {
        var source = marble_testing_1.hot('--1--2--^--3--4--5---');
        var subs = '^            ';
        var expected = '---3--4--5---';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a basic source that emits next then errors, no count', function () {
        var source = marble_testing_1.cold('--1-2-3-#');
        var unsub = '                                     !';
        var subs = ['^       !                             ',
            '        ^       !                     ',
            '                ^       !             ',
            '                        ^       !     ',
            '                                ^    !'];
        var expected = '--1-2-3---1-2-3---1-2-3---1-2-3---1-2-';
        var result = source.pipe(operators_1.retry());
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should handle a source which eventually throws, count=3, and result is ' +
        'unsubscribed early', function () {
        var source = marble_testing_1.cold('--1-2-3-#');
        var unsub = '             !           ';
        var subs = ['^       !                ',
            '        ^    !           '];
        var expected = '--1-2-3---1-2-';
        var result = source.pipe(operators_1.retry(3));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('--1-2-3-#');
        var subs = ['^       !                ',
            '        ^    !           '];
        var expected = '--1-2-3---1-2-';
        var unsub = '             !           ';
        var result = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.retry(100), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should retry a synchronous source (multicasted and refCounted) multiple times', function (done) {
        var expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        rxjs_1.of(1, 2, 3).pipe(operators_1.concat(rxjs_1.throwError('bad!')), operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount(), operators_1.retry(4)).subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (err) {
            chai_1.expect(err).to.equal('bad!');
            chai_1.expect(expected.length).to.equal(0);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
});
//# sourceMappingURL=retry-spec.js.map