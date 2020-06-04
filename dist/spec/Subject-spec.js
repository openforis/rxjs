"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("./helpers/marble-testing");
var rxjs_1 = require("rxjs");
var Subject_1 = require("rxjs/internal/Subject");
var operators_1 = require("rxjs/operators");
describe('Subject', function () {
    it('should allow next with empty, undefined or any when created with no type', function (done) {
        var subject = new rxjs_1.Subject();
        subject.subscribe(function (x) {
            chai_1.expect(x).to.be.a('undefined');
        }, null, done);
        var data = undefined;
        subject.next();
        subject.next(undefined);
        subject.next(data);
        subject.complete();
    });
    it('should allow empty next when created with void type', function (done) {
        var subject = new rxjs_1.Subject();
        subject.subscribe(function (x) {
            chai_1.expect(x).to.be.a('undefined');
        }, null, done);
        subject.next();
        subject.complete();
    });
    it('should pump values right on through itself', function (done) {
        var subject = new rxjs_1.Subject();
        var expected = ['foo', 'bar'];
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, done);
        subject.next('foo');
        subject.next('bar');
        subject.complete();
    });
    it('should pump values to multiple subscribers', function (done) {
        var subject = new rxjs_1.Subject();
        var expected = ['foo', 'bar'];
        var i = 0;
        var j = 0;
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        });
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[j++]);
        }, null, done);
        chai_1.expect(subject.observers.length).to.equal(2);
        subject.next('foo');
        subject.next('bar');
        subject.complete();
    });
    it('should handle subscribers that arrive and leave at different times, ' +
        'subject does not complete', function () {
        var subject = new rxjs_1.Subject();
        var results1 = [];
        var results2 = [];
        var results3 = [];
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.next(4);
        var subscription1 = subject.subscribe(function (x) { results1.push(x); }, function (e) { results1.push('E'); }, function () { results1.push('C'); });
        subject.next(5);
        var subscription2 = subject.subscribe(function (x) { results2.push(x); }, function (e) { results2.push('E'); }, function () { results2.push('C'); });
        subject.next(6);
        subject.next(7);
        subscription1.unsubscribe();
        subject.next(8);
        subscription2.unsubscribe();
        subject.next(9);
        subject.next(10);
        var subscription3 = subject.subscribe(function (x) { results3.push(x); }, function (e) { results3.push('E'); }, function () { results3.push('C'); });
        subject.next(11);
        subscription3.unsubscribe();
        chai_1.expect(results1).to.deep.equal([5, 6, 7]);
        chai_1.expect(results2).to.deep.equal([6, 7, 8]);
        chai_1.expect(results3).to.deep.equal([11]);
    });
    it('should handle subscribers that arrive and leave at different times, ' +
        'subject completes', function () {
        var subject = new rxjs_1.Subject();
        var results1 = [];
        var results2 = [];
        var results3 = [];
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.next(4);
        var subscription1 = subject.subscribe(function (x) { results1.push(x); }, function (e) { results1.push('E'); }, function () { results1.push('C'); });
        subject.next(5);
        var subscription2 = subject.subscribe(function (x) { results2.push(x); }, function (e) { results2.push('E'); }, function () { results2.push('C'); });
        subject.next(6);
        subject.next(7);
        subscription1.unsubscribe();
        subject.complete();
        subscription2.unsubscribe();
        var subscription3 = subject.subscribe(function (x) { results3.push(x); }, function (e) { results3.push('E'); }, function () { results3.push('C'); });
        subscription3.unsubscribe();
        chai_1.expect(results1).to.deep.equal([5, 6, 7]);
        chai_1.expect(results2).to.deep.equal([6, 7, 'C']);
        chai_1.expect(results3).to.deep.equal(['C']);
    });
    it('should handle subscribers that arrive and leave at different times, ' +
        'subject terminates with an error', function () {
        var subject = new rxjs_1.Subject();
        var results1 = [];
        var results2 = [];
        var results3 = [];
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.next(4);
        var subscription1 = subject.subscribe(function (x) { results1.push(x); }, function (e) { results1.push('E'); }, function () { results1.push('C'); });
        subject.next(5);
        var subscription2 = subject.subscribe(function (x) { results2.push(x); }, function (e) { results2.push('E'); }, function () { results2.push('C'); });
        subject.next(6);
        subject.next(7);
        subscription1.unsubscribe();
        subject.error(new Error('err'));
        subscription2.unsubscribe();
        var subscription3 = subject.subscribe(function (x) { results3.push(x); }, function (e) { results3.push('E'); }, function () { results3.push('C'); });
        subscription3.unsubscribe();
        chai_1.expect(results1).to.deep.equal([5, 6, 7]);
        chai_1.expect(results2).to.deep.equal([6, 7, 'E']);
        chai_1.expect(results3).to.deep.equal(['E']);
    });
    it('should handle subscribers that arrive and leave at different times, ' +
        'subject completes before nexting any value', function () {
        var subject = new rxjs_1.Subject();
        var results1 = [];
        var results2 = [];
        var results3 = [];
        var subscription1 = subject.subscribe(function (x) { results1.push(x); }, function (e) { results1.push('E'); }, function () { results1.push('C'); });
        var subscription2 = subject.subscribe(function (x) { results2.push(x); }, function (e) { results2.push('E'); }, function () { results2.push('C'); });
        subscription1.unsubscribe();
        subject.complete();
        subscription2.unsubscribe();
        var subscription3 = subject.subscribe(function (x) { results3.push(x); }, function (e) { results3.push('E'); }, function () { results3.push('C'); });
        subscription3.unsubscribe();
        chai_1.expect(results1).to.deep.equal([]);
        chai_1.expect(results2).to.deep.equal(['C']);
        chai_1.expect(results3).to.deep.equal(['C']);
    });
    it('should disallow new subscriber once subject has been disposed', function () {
        var subject = new rxjs_1.Subject();
        var results1 = [];
        var results2 = [];
        var results3 = [];
        var subscription1 = subject.subscribe(function (x) { results1.push(x); }, function (e) { results1.push('E'); }, function () { results1.push('C'); });
        subject.next(1);
        subject.next(2);
        var subscription2 = subject.subscribe(function (x) { results2.push(x); }, function (e) { results2.push('E'); }, function () { results2.push('C'); });
        subject.next(3);
        subject.next(4);
        subject.next(5);
        subscription1.unsubscribe();
        subscription2.unsubscribe();
        subject.unsubscribe();
        chai_1.expect(function () {
            subject.subscribe(function (x) { results3.push(x); }, function (err) {
                chai_1.expect(false).to.equal('should not throw error: ' + err.toString());
            });
        }).to.throw(rxjs_1.ObjectUnsubscribedError);
        chai_1.expect(results1).to.deep.equal([1, 2, 3, 4, 5]);
        chai_1.expect(results2).to.deep.equal([3, 4, 5]);
        chai_1.expect(results3).to.deep.equal([]);
    });
    it('should not allow values to be nexted after it is unsubscribed', function (done) {
        var subject = new rxjs_1.Subject();
        var expected = ['foo'];
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        });
        subject.next('foo');
        subject.unsubscribe();
        chai_1.expect(function () { return subject.next('bar'); }).to.throw(rxjs_1.ObjectUnsubscribedError);
        done();
    });
    it('should clean out unsubscribed subscribers', function (done) {
        var subject = new rxjs_1.Subject();
        var sub1 = subject.subscribe(function (x) {
        });
        var sub2 = subject.subscribe(function (x) {
        });
        chai_1.expect(subject.observers.length).to.equal(2);
        sub1.unsubscribe();
        chai_1.expect(subject.observers.length).to.equal(1);
        sub2.unsubscribe();
        chai_1.expect(subject.observers.length).to.equal(0);
        done();
    });
    it('should have a static create function that works', function () {
        chai_1.expect(rxjs_1.Subject.create).to.be.a('function');
        var source = rxjs_1.of(1, 2, 3, 4, 5);
        var nexts = [];
        var output = [];
        var error;
        var complete = false;
        var outputComplete = false;
        var destination = {
            closed: false,
            next: function (x) {
                nexts.push(x);
            },
            error: function (err) {
                error = err;
                this.closed = true;
            },
            complete: function () {
                complete = true;
                this.closed = true;
            }
        };
        var sub = rxjs_1.Subject.create(destination, source);
        sub.subscribe(function (x) {
            output.push(x);
        }, null, function () {
            outputComplete = true;
        });
        sub.next('a');
        sub.next('b');
        sub.next('c');
        sub.complete();
        chai_1.expect(nexts).to.deep.equal(['a', 'b', 'c']);
        chai_1.expect(complete).to.be.true;
        chai_1.expect(error).to.be.a('undefined');
        chai_1.expect(output).to.deep.equal([1, 2, 3, 4, 5]);
        chai_1.expect(outputComplete).to.be.true;
    });
    it('should have a static create function that works also to raise errors', function () {
        chai_1.expect(rxjs_1.Subject.create).to.be.a('function');
        var source = rxjs_1.of(1, 2, 3, 4, 5);
        var nexts = [];
        var output = [];
        var error;
        var complete = false;
        var outputComplete = false;
        var destination = {
            closed: false,
            next: function (x) {
                nexts.push(x);
            },
            error: function (err) {
                error = err;
                this.closed = true;
            },
            complete: function () {
                complete = true;
                this.closed = true;
            }
        };
        var sub = rxjs_1.Subject.create(destination, source);
        sub.subscribe(function (x) {
            output.push(x);
        }, null, function () {
            outputComplete = true;
        });
        sub.next('a');
        sub.next('b');
        sub.next('c');
        sub.error('boom');
        chai_1.expect(nexts).to.deep.equal(['a', 'b', 'c']);
        chai_1.expect(complete).to.be.false;
        chai_1.expect(error).to.equal('boom');
        chai_1.expect(output).to.deep.equal([1, 2, 3, 4, 5]);
        chai_1.expect(outputComplete).to.be.true;
    });
    it('should be an Observer which can be given to Observable.subscribe', function (done) {
        var source = rxjs_1.of(1, 2, 3, 4, 5);
        var subject = new rxjs_1.Subject();
        var expected = [1, 2, 3, 4, 5];
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        source.subscribe(subject);
    });
    it('should be usable as an Observer of a finite delayed Observable', function (done) {
        var source = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(50));
        var subject = new rxjs_1.Subject();
        var expected = [1, 2, 3];
        subject.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        source.subscribe(subject);
    });
    it('should throw ObjectUnsubscribedError when emit after unsubscribed', function () {
        var subject = new rxjs_1.Subject();
        subject.unsubscribe();
        chai_1.expect(function () {
            subject.next('a');
        }).to.throw(rxjs_1.ObjectUnsubscribedError);
        chai_1.expect(function () {
            subject.error('a');
        }).to.throw(rxjs_1.ObjectUnsubscribedError);
        chai_1.expect(function () {
            subject.complete();
        }).to.throw(rxjs_1.ObjectUnsubscribedError);
    });
    it('should not next after completed', function () {
        var subject = new rxjs_1.Subject();
        var results = [];
        subject.subscribe(function (x) { return results.push(x); }, null, function () { return results.push('C'); });
        subject.next('a');
        subject.complete();
        subject.next('b');
        chai_1.expect(results).to.deep.equal(['a', 'C']);
    });
    it('should not next after error', function () {
        var error = new Error('wut?');
        var subject = new rxjs_1.Subject();
        var results = [];
        subject.subscribe(function (x) { return results.push(x); }, function (err) { return results.push(err); });
        subject.next('a');
        subject.error(error);
        subject.next('b');
        chai_1.expect(results).to.deep.equal(['a', error]);
    });
    describe('asObservable', function () {
        it('should hide subject', function () {
            var subject = new rxjs_1.Subject();
            var observable = subject.asObservable();
            chai_1.expect(subject).not.to.equal(observable);
            chai_1.expect(observable instanceof rxjs_1.Observable).to.be.true;
            chai_1.expect(observable instanceof rxjs_1.Subject).to.be.false;
        });
        it('should handle subject never emits', function () {
            var observable = marble_testing_1.hot('-').asObservable();
            marble_testing_1.expectObservable(observable).toBe([]);
        });
        it('should handle subject completes without emits', function () {
            var observable = marble_testing_1.hot('--^--|').asObservable();
            var expected = '---|';
            marble_testing_1.expectObservable(observable).toBe(expected);
        });
        it('should handle subject throws', function () {
            var observable = marble_testing_1.hot('--^--#').asObservable();
            var expected = '---#';
            marble_testing_1.expectObservable(observable).toBe(expected);
        });
        it('should handle subject emits', function () {
            var observable = marble_testing_1.hot('--^--x--|').asObservable();
            var expected = '---x--|';
            marble_testing_1.expectObservable(observable).toBe(expected);
        });
        it('should work with inherited subject', function () {
            var results = [];
            var subject = new rxjs_1.AsyncSubject();
            subject.next(42);
            subject.complete();
            var observable = subject.asObservable();
            observable.subscribe(function (x) { return results.push(x); }, null, function () { return results.push('done'); });
            chai_1.expect(results).to.deep.equal([42, 'done']);
        });
    });
});
describe('AnonymousSubject', function () {
    it('should be exposed', function () {
        chai_1.expect(Subject_1.AnonymousSubject).to.be.a('function');
    });
    it('should not eager', function () {
        var subscribed = false;
        var subject = rxjs_1.Subject.create(null, new rxjs_1.Observable(function (observer) {
            subscribed = true;
            var subscription = rxjs_1.of('x').subscribe(observer);
            return function () {
                subscription.unsubscribe();
            };
        }));
        var observable = subject.asObservable();
        chai_1.expect(subscribed).to.be.false;
        observable.subscribe();
        chai_1.expect(subscribed).to.be.true;
    });
});
//# sourceMappingURL=Subject-spec.js.map