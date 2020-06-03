"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('tap operator', function () {
    it('should mirror multiple values and complete', function () {
        var e1 = marble_testing_1.cold('--1--2--3--|');
        var e1subs = '^          !';
        var expected = '--1--2--3--|';
        var result = e1.pipe(operators_1.tap(function () {
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should next with a callback', function () {
        var value = null;
        rxjs_1.of(42).pipe(operators_1.tap(function (x) {
            value = x;
        }))
            .subscribe();
        chai_1.expect(value).to.equal(42);
    });
    it('should error with a callback', function () {
        var err = null;
        rxjs_1.throwError('bad').pipe(operators_1.tap(null, function (x) {
            err = x;
        }))
            .subscribe(null, function (ex) {
            chai_1.expect(ex).to.equal('bad');
        });
        chai_1.expect(err).to.equal('bad');
    });
    it('should handle everything with an observer', function (done) {
        var expected = [1, 2, 3];
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.tap({
            next: function (x) {
                results.push(x);
            },
            error: function (err) {
                done(new Error('should not be called'));
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal(expected);
                done();
            }
        })).subscribe();
    });
    it('should handle everything with a Subject', function (done) {
        var expected = [1, 2, 3];
        var results = [];
        var subject = new rxjs_1.Subject();
        subject.subscribe({
            next: function (x) {
                results.push(x);
            },
            error: function (err) {
                done(new Error('should not be called'));
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal(expected);
                done();
            }
        });
        rxjs_1.of(1, 2, 3).pipe(operators_1.tap(subject)).subscribe();
    });
    it('should handle an error with a callback', function () {
        var errored = false;
        rxjs_1.throwError('bad').pipe(operators_1.tap(null, function (err) {
            chai_1.expect(err).to.equal('bad');
        }))
            .subscribe(null, function (err) {
            errored = true;
            chai_1.expect(err).to.equal('bad');
        });
        chai_1.expect(errored).to.be.true;
    });
    it('should handle an error with observer', function () {
        var errored = false;
        rxjs_1.throwError('bad').pipe(operators_1.tap({ error: function (err) {
                chai_1.expect(err).to.equal('bad');
            } }))
            .subscribe(null, function (err) {
            errored = true;
            chai_1.expect(err).to.equal('bad');
        });
        chai_1.expect(errored).to.be.true;
    });
    it('should handle complete with observer', function () {
        var completed = false;
        rxjs_1.EMPTY.pipe(operators_1.tap({
            complete: function () {
                completed = true;
            }
        })).subscribe();
        chai_1.expect(completed).to.be.true;
    });
    it('should handle next with observer', function () {
        var value = null;
        rxjs_1.of('hi').pipe(operators_1.tap({
            next: function (x) {
                value = x;
            }
        })).subscribe();
        chai_1.expect(value).to.equal('hi');
    });
    it('should raise error if next handler raises error', function () {
        rxjs_1.of('hi').pipe(operators_1.tap({
            next: function (x) {
                throw new Error('bad');
            }
        })).subscribe(null, function (err) {
            chai_1.expect(err.message).to.equal('bad');
        });
    });
    it('should raise error if error handler raises error', function () {
        rxjs_1.throwError('ops').pipe(operators_1.tap({
            error: function (x) {
                throw new Error('bad');
            }
        })).subscribe(null, function (err) {
            chai_1.expect(err.message).to.equal('bad');
        });
    });
    it('should raise error if complete handler raises error', function () {
        rxjs_1.EMPTY.pipe(operators_1.tap({
            complete: function () {
                throw new Error('bad');
            }
        })).subscribe(null, function (err) {
            chai_1.expect(err.message).to.equal('bad');
        });
    });
    it('should allow unsubscribing explicitly and early', function () {
        var e1 = marble_testing_1.hot('--1--2--3--#');
        var unsub = '       !    ';
        var e1subs = '^      !    ';
        var expected = '--1--2--    ';
        var result = e1.pipe(operators_1.tap(function () {
        }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--1--2--3--#');
        var e1subs = '^      !    ';
        var expected = '--1--2--    ';
        var unsub = '       !    ';
        var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.tap(function () {
        }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        marble_testing_1.expectObservable(result, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mirror multiple values and complete', function () {
        var e1 = marble_testing_1.cold('--1--2--3--|');
        var e1subs = '^          !';
        var expected = '--1--2--3--|';
        var result = e1.pipe(operators_1.tap(function () {
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mirror multiple values and terminate with error', function () {
        var e1 = marble_testing_1.cold('--1--2--3--#');
        var e1subs = '^          !';
        var expected = '--1--2--3--#';
        var result = e1.pipe(operators_1.tap(function () {
        }));
        marble_testing_1.expectObservable(result).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
});
//# sourceMappingURL=tap-spec.js.map