"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('multicast operator', function () {
    it('should mirror a simple source Observable', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = '^              !';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var expected = '--1-2---3-4--5-|';
        marble_testing_1.expectObservable(multicasted).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    it('should accept Subjects', function (done) {
        var expected = [1, 2, 3, 4];
        var connectable = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.multicast((new rxjs_1.Subject())));
        connectable.subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        connectable.connect();
    });
    it('should multicast a ConnectableObservable', function (done) {
        var expected = [1, 2, 3, 4];
        var source = new rxjs_1.Subject();
        var connectable = source.pipe(operators_1.multicast(new rxjs_1.Subject()));
        var replayed = connectable.pipe(operators_1.multicast(new rxjs_1.ReplaySubject()));
        connectable.connect();
        replayed.connect();
        source.next(1);
        source.next(2);
        source.next(3);
        source.next(4);
        source.complete();
        replayed.pipe(operators_1.tap({
            next: function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            },
            complete: function () {
                chai_1.expect(expected.length).to.equal(0);
            }
        })).subscribe(null, done, done);
    });
    it('should accept Subject factory functions', function (done) {
        var expected = [1, 2, 3, 4];
        var connectable = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        connectable.subscribe(function (x) { chai_1.expect(x).to.equal(expected.shift()); }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
        connectable.connect();
    });
    it('should accept a multicast selector and connect to a hot source for each subscriber', function () {
        var source = marble_testing_1.hot('-1-2-3----4-|');
        var sourceSubs = ['^           !',
            '    ^       !',
            '        ^   !'];
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (x) { return rxjs_1.zip(x, x, function (a, b) { return (parseInt(a) + parseInt(b)).toString(); }); }));
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var expected1 = '-2-4-6----8-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var expected2 = '    -6----8-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        var expected3 = '        --8-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should accept a multicast selector and connect to a cold source for each subscriber', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = ['^           !',
            '    ^           !',
            '        ^           !'];
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (x) { return rxjs_1.zip(x, x, function (a, b) { return (parseInt(a) + parseInt(b)).toString(); }); }));
        var expected1 = '-2-4-6----8-|';
        var expected2 = '    -2-4-6----8-|';
        var expected3 = '        -2-4-6----8-|';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should accept a multicast selector and respect the subject\'s messaging semantics', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = ['^           !',
            '    ^           !',
            '        ^           !'];
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.ReplaySubject(1); }, function (x) { return rxjs_1.concat(x, x.pipe(operators_1.takeLast(1))); }));
        var expected1 = '-1-2-3----4-(4|)';
        var expected2 = '    -1-2-3----4-(4|)';
        var expected3 = '        -1-2-3----4-(4|)';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should do nothing if connect is not called, despite subscriptions', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = [];
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var expected = '-';
        marble_testing_1.expectObservable(multicasted).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast the same values to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^           !';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var expected1 = '-1-2-3----4-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var expected2 = '    -3----4-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        var expected3 = '        --4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    it('should multicast an error from the source to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-#');
        var sourceSubs = '^           !';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var expected1 = '-1-2-3----4-#';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var expected2 = '    -3----4-#';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        var expected3 = '        --4-#';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    it('should multicast the same values to multiple observers, ' +
        'but is unsubscribed explicitly and early', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^        !   ';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var unsub = '         u   ';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var expected1 = '-1-2-3----   ';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var expected2 = '    -3----   ';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        var expected3 = '        --   ';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        var connection;
        marble_testing_1.expectObservable(marble_testing_1.hot(unsub).pipe(operators_1.tap(function () {
            connection.unsubscribe();
        }))).toBe(unsub);
        connection = multicasted.connect();
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^        !   ';
        var multicasted = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(multicasted));
        var expected1 = '-1-2-3----   ';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(multicasted));
        var expected2 = '    -3----   ';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(multicasted));
        var expected3 = '        --   ';
        var unsub = '         u   ';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        var connection;
        marble_testing_1.expectObservable(marble_testing_1.hot(unsub).pipe(operators_1.tap(function () {
            connection.unsubscribe();
        }))).toBe(unsub);
        connection = multicasted.connect();
    });
    it('should multicast an empty source', function () {
        var source = marble_testing_1.cold('|');
        var sourceSubs = '(^!)';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var expected = '|';
        marble_testing_1.expectObservable(multicasted).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    it('should multicast a never source', function () {
        var source = marble_testing_1.cold('-');
        var sourceSubs = '^';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var expected = '-';
        marble_testing_1.expectObservable(multicasted).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    it('should multicast a throw source', function () {
        var source = marble_testing_1.cold('#');
        var sourceSubs = '(^!)';
        var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        var expected = '#';
        marble_testing_1.expectObservable(multicasted).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        multicasted.connect();
    });
    describe('with refCount() and subject factory', function () {
        it('should connect when first subscriber subscribes', function () {
            var source = marble_testing_1.cold('-1-2-3----4-|');
            var sourceSubs = '   ^           !';
            var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount());
            var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(multicasted));
            var expected1 = '   -1-2-3----4-|';
            var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(multicasted));
            var expected2 = '       -3----4-|';
            var subscriber3 = marble_testing_1.hot('           c|   ').pipe(operators_1.mergeMapTo(multicasted));
            var expected3 = '           --4-|';
            marble_testing_1.expectObservable(subscriber1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2).toBe(expected2);
            marble_testing_1.expectObservable(subscriber3).toBe(expected3);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should disconnect when last subscriber unsubscribes', function () {
            var source = marble_testing_1.cold('-1-2-3----4-|');
            var sourceSubs = '   ^        !   ';
            var multicasted = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount());
            var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(multicasted));
            var unsub1 = '          !     ';
            var expected1 = '   -1-2-3--     ';
            var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(multicasted));
            var unsub2 = '            !   ';
            var expected2 = '       -3----   ';
            marble_testing_1.expectObservable(subscriber1, unsub1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2, unsub2).toBe(expected2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be retryable when cold source is synchronous', function () {
            function subjectFactory() { return new rxjs_1.Subject(); }
            var source = marble_testing_1.cold('(123#)');
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's               ';
            var expected1 = '(123123123123#) ';
            var subscribe2 = ' s              ';
            var expected2 = ' (123123123123#)';
            var sourceSubs = ['(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)'];
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be retryable with ReplaySubject and cold source is synchronous', function () {
            function subjectFactory() { return new rxjs_1.ReplaySubject(1); }
            var source = marble_testing_1.cold('(123#)');
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's               ';
            var expected1 = '(123123123123#) ';
            var subscribe2 = ' s              ';
            var expected2 = ' (123123123123#)';
            var sourceSubs = ['(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)'];
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be repeatable when cold source is synchronous', function () {
            function subjectFactory() { return new rxjs_1.Subject(); }
            var source = marble_testing_1.cold('(123|)');
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's                  ';
            var expected1 = '(123123123123123|) ';
            var subscribe2 = ' s                 ';
            var expected2 = ' (123123123123123|)';
            var sourceSubs = ['(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)'];
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be repeatable with ReplaySubject and cold source is synchronous', function () {
            function subjectFactory() { return new rxjs_1.ReplaySubject(1); }
            var source = marble_testing_1.cold('(123|)');
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's                  ';
            var expected1 = '(123123123123123|) ';
            var subscribe2 = ' s                 ';
            var expected2 = ' (123123123123123|)';
            var sourceSubs = ['(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                '(^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)',
                ' (^!)'];
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be retryable', function () {
            function subjectFactory() { return new rxjs_1.Subject(); }
            var source = marble_testing_1.cold('-1-2-3----4-#                        ');
            var sourceSubs = ['^           !                        ',
                '            ^           !            ',
                '                        ^           !'];
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's                                    ';
            var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-#';
            var subscribe2 = '    s                                ';
            var expected2 = '    -3----4--1-2-3----4--1-2-3----4-#';
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be retryable using a ReplaySubject', function () {
            function subjectFactory() { return new rxjs_1.ReplaySubject(1); }
            var source = marble_testing_1.cold('-1-2-3----4-#                        ');
            var sourceSubs = ['^           !                        ',
                '            ^           !            ',
                '                        ^           !'];
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-#';
            var subscribe2 = marble_testing_1.time('----|                                ');
            var expected2 = '    23----4--1-2-3----4--1-2-3----4-#';
            marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(expected1);
            rxTestScheduler.schedule(function () {
                return marble_testing_1.expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(expected2);
            }, subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be repeatable', function () {
            function subjectFactory() { return new rxjs_1.Subject(); }
            var source = marble_testing_1.cold('-1-2-3----4-|                        ');
            var sourceSubs = ['^           !                        ',
                '            ^           !            ',
                '                        ^           !'];
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's                                    ';
            var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-|';
            var subscribe2 = '    s                                ';
            var expected2 = '    -3----4--1-2-3----4--1-2-3----4-|';
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should be repeatable using a ReplaySubject', function () {
            function subjectFactory() { return new rxjs_1.ReplaySubject(1); }
            var source = marble_testing_1.cold('-1-2-3----4-|                        ');
            var sourceSubs = ['^           !                        ',
                '            ^           !            ',
                '                        ^           !'];
            var multicasted = source.pipe(operators_1.multicast(subjectFactory), operators_1.refCount());
            var subscribe1 = 's                                    ';
            var expected1 = '-1-2-3----4--1-2-3----4--1-2-3----4-|';
            var subscribe2 = '    s                                ';
            var expected2 = '    23----4--1-2-3----4--1-2-3----4-|';
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe1).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(expected1);
            }))).toBe(subscribe1);
            marble_testing_1.expectObservable(marble_testing_1.hot(subscribe2).pipe(operators_1.tap(function () {
                marble_testing_1.expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(expected2);
            }))).toBe(subscribe2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast one observable to multiple observers', function (done) {
        var results1 = [];
        var results2 = [];
        var subscriptions = 0;
        var source = new rxjs_1.Observable(function (observer) {
            subscriptions++;
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.next(4);
            observer.complete();
        });
        var connectable = source.pipe(operators_1.multicast(function () {
            return new rxjs_1.Subject();
        }));
        connectable.subscribe(function (x) {
            results1.push(x);
        });
        connectable.subscribe(function (x) {
            results2.push(x);
        });
        chai_1.expect(results1).to.deep.equal([]);
        chai_1.expect(results2).to.deep.equal([]);
        connectable.connect();
        chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
        chai_1.expect(results2).to.deep.equal([1, 2, 3, 4]);
        chai_1.expect(subscriptions).to.equal(1);
        done();
    });
    it('should remove all subscribers from the subject when disconnected', function () {
        var subject = new rxjs_1.Subject();
        var expected = [1, 2, 3, 4];
        var i = 0;
        var source = rxjs_1.from([1, 2, 3, 4]).pipe(operators_1.multicast(subject));
        source.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
        });
        source.connect();
        chai_1.expect(subject.observers.length).to.equal(0);
    });
    describe('when given a subject factory', function () {
        it('should allow you to reconnect by subscribing again', function (done) {
            var expected = [1, 2, 3, 4];
            var i = 0;
            var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
            source.subscribe(function (x) {
                chai_1.expect(x).to.equal(expected[i++]);
            }, null, function () {
                i = 0;
                source.subscribe(function (x) {
                    chai_1.expect(x).to.equal(expected[i++]);
                }, null, done);
                source.connect();
            });
            source.connect();
        });
        it('should not throw ObjectUnsubscribedError when used in ' +
            'a switchMap', function (done) {
            var source = rxjs_1.of(1, 2, 3).pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }), operators_1.refCount());
            var expected = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
            rxjs_1.of('a', 'b', 'c').pipe(operators_1.switchMap(function (letter) { return source.pipe(operators_1.map(function (n) { return String(letter + n); })); })).subscribe(function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                chai_1.expect(expected.length).to.equal(0);
                done();
            });
        });
    });
    describe('when given a subject', function () {
        it('should not throw ObjectUnsubscribedError when used in ' +
            'a switchMap', function (done) {
            var source = rxjs_1.of(1, 2, 3).pipe(operators_1.multicast(new rxjs_1.Subject()), operators_1.refCount());
            var expected = ['a1', 'a2', 'a3'];
            rxjs_1.of('a', 'b', 'c').pipe(operators_1.switchMap(function (letter) { return source.pipe(operators_1.map(function (n) { return String(letter + n); })); })).subscribe(function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            }, function (x) {
                done(new Error('should not be called'));
            }, function () {
                chai_1.expect(expected.length).to.equal(0);
                done();
            });
        });
    });
    describe('typings', function () {
        type('should infer the type', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }));
        });
        type('should infer the type with a selector', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (s) { return s.pipe(operators_1.map(function (x) { return x; })); }));
        });
        type('should infer the type with a type-changing selector', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (s) { return s.pipe(operators_1.map(function (x) { return x + '!'; })); }));
        });
        type('should infer the type for the pipeable operator', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = operators_1.multicast(function () { return new rxjs_1.Subject(); })(source);
        });
        type('should infer the type for the pipeable operator with a selector', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (s) { return s.pipe(operators_1.map(function (x) { return x; })); }));
        });
        type('should infer the type for the pipeable operator with a type-changing selector', function () {
            var source = rxjs_1.of(1, 2, 3);
            var result = source.pipe(operators_1.multicast(function () { return new rxjs_1.Subject(); }, function (s) { return s.pipe(operators_1.map(function (x) { return x + '!'; })); }));
        });
    });
});
//# sourceMappingURL=multicast-spec.js.map