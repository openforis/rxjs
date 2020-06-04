"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('publish operator', function () {
    asDiagram('publish')('should mirror a simple source Observable', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = '^              !';
        var published = source.pipe(operators_1.publish());
        var expected = '--1-2---3-4--5-|';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
    });
    it('should return a ConnectableObservable-ish', function () {
        var source = rxjs_1.of(1).pipe(operators_1.publish());
        chai_1.expect(typeof source._subscribe === 'function').to.be.true;
        chai_1.expect(typeof source.getSubject === 'function').to.be.true;
        chai_1.expect(typeof source.connect === 'function').to.be.true;
        chai_1.expect(typeof source.refCount === 'function').to.be.true;
    });
    it('should do nothing if connect is not called, despite subscriptions', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = [];
        var published = source.pipe(operators_1.publish());
        var expected = '-';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast the same values to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^           !';
        var published = source.pipe(operators_1.publish());
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
        var expected1 = '-1-2-3----4-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
        var expected2 = '    -3----4-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
        var expected3 = '        --4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
    });
    it('should accept selectors', function () {
        var source = marble_testing_1.hot('-1-2-3----4-|');
        var sourceSubs = ['^           !',
            '    ^       !',
            '        ^   !'];
        var published = source.pipe(operators_1.publish(function (x) { return x.pipe(operators_1.zip(x, function (a, b) { return (parseInt(a) + parseInt(b)).toString(); })); }));
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
        var expected1 = '-2-4-6----8-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
        var expected2 = '    -6----8-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
        var expected3 = '        --8-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast an error from the source to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-#');
        var sourceSubs = '^           !';
        var published = source.pipe(operators_1.publish());
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
        var expected1 = '-1-2-3----4-#';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
        var expected2 = '    -3----4-#';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
        var expected3 = '        --4-#';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
    });
    it('should multicast the same values to multiple observers, ' +
        'but is unsubscribed explicitly and early', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^        !   ';
        var published = source.pipe(operators_1.publish());
        var unsub = '         u   ';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
        var expected1 = '-1-2-3----   ';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
        var expected2 = '    -3----   ';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
        var expected3 = '        --   ';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        var connection;
        marble_testing_1.expectObservable(marble_testing_1.hot(unsub).pipe(operators_1.tap(function () {
            connection.unsubscribe();
        }))).toBe(unsub);
        connection = published.connect();
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var sourceSubs = '^        !   ';
        var published = source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.publish());
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
        var expected1 = '-1-2-3----   ';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
        var expected2 = '    -3----   ';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
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
        connection = published.connect();
    });
    describe('with refCount()', function () {
        it('should connect when first subscriber subscribes', function () {
            var source = marble_testing_1.cold('-1-2-3----4-|');
            var sourceSubs = '   ^           !';
            var replayed = source.pipe(operators_1.publish(), operators_1.refCount());
            var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(replayed));
            var expected1 = '   -1-2-3----4-|';
            var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(replayed));
            var expected2 = '       -3----4-|';
            var subscriber3 = marble_testing_1.hot('           c|   ').pipe(operators_1.mergeMapTo(replayed));
            var expected3 = '           --4-|';
            marble_testing_1.expectObservable(subscriber1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2).toBe(expected2);
            marble_testing_1.expectObservable(subscriber3).toBe(expected3);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should disconnect when last subscriber unsubscribes', function () {
            var source = marble_testing_1.cold('-1-2-3----4-|');
            var sourceSubs = '   ^        !   ';
            var replayed = source.pipe(operators_1.publish(), operators_1.refCount());
            var subscriber1 = marble_testing_1.hot('   a|           ').pipe(operators_1.mergeMapTo(replayed));
            var unsub1 = '          !     ';
            var expected1 = '   -1-2-3--     ';
            var subscriber2 = marble_testing_1.hot('       b|       ').pipe(operators_1.mergeMapTo(replayed));
            var unsub2 = '            !   ';
            var expected2 = '       -3----   ';
            marble_testing_1.expectObservable(subscriber1, unsub1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2, unsub2).toBe(expected2);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should NOT be retryable', function () {
            var source = marble_testing_1.cold('-1-2-3----4-#');
            var sourceSubs = '^           !';
            var published = source.pipe(operators_1.publish(), operators_1.refCount(), operators_1.retry(3));
            var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
            var expected1 = '-1-2-3----4-#';
            var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
            var expected2 = '    -3----4-#';
            var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
            var expected3 = '        --4-#';
            marble_testing_1.expectObservable(subscriber1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2).toBe(expected2);
            marble_testing_1.expectObservable(subscriber3).toBe(expected3);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        it('should NOT be repeatable', function () {
            var source = marble_testing_1.cold('-1-2-3----4-|');
            var sourceSubs = '^           !';
            var published = source.pipe(operators_1.publish(), operators_1.refCount(), operators_1.repeat(3));
            var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(published));
            var expected1 = '-1-2-3----4-|';
            var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(published));
            var expected2 = '    -3----4-|';
            var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(published));
            var expected3 = '        --4-|';
            marble_testing_1.expectObservable(subscriber1).toBe(expected1);
            marble_testing_1.expectObservable(subscriber2).toBe(expected2);
            marble_testing_1.expectObservable(subscriber3).toBe(expected3);
            marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should emit completed when subscribed after completed', function (done) {
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
        var connectable = source.pipe(operators_1.publish());
        connectable.subscribe(function (x) {
            results1.push(x);
        });
        chai_1.expect(results1).to.deep.equal([]);
        chai_1.expect(results2).to.deep.equal([]);
        connectable.connect();
        chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
        chai_1.expect(results2).to.deep.equal([]);
        chai_1.expect(subscriptions).to.equal(1);
        connectable.subscribe(function (x) {
            results2.push(x);
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(results2).to.deep.equal([]);
            done();
        });
    });
    it('should multicast an empty source', function () {
        var source = marble_testing_1.cold('|');
        var sourceSubs = '(^!)';
        var published = source.pipe(operators_1.publish());
        var expected = '|';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
    });
    it('should multicast a never source', function () {
        var source = marble_testing_1.cold('-');
        var sourceSubs = '^';
        var published = source.pipe(operators_1.publish());
        var expected = '-';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
    });
    it('should multicast a throw source', function () {
        var source = marble_testing_1.cold('#');
        var sourceSubs = '(^!)';
        var published = source.pipe(operators_1.publish());
        var expected = '#';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        published.connect();
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
        var connectable = source.pipe(operators_1.publish());
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
    type('should infer the type', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = source.pipe(operators_1.publish());
    });
    type('should infer the type with a selector', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = source.pipe(operators_1.publish(function (s) { return s.pipe(operators_1.map(function (x) { return x; })); }));
    });
    type('should infer the type with a type-changing selector', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = source.pipe(operators_1.publish(function (s) { return s.pipe(operators_1.map(function (x) { return x + '!'; })); }));
    });
    type('should infer the type for the pipeable operator', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = operators_1.publish()(source);
    });
    type('should infer the type for the pipeable operator with a selector', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = source.pipe(operators_1.publish(function (s) { return s.pipe(operators_1.map(function (x) { return x; })); }));
    });
    type('should infer the type for the pipeable operator with a type-changing selector', function () {
        var source = rxjs_1.of(1, 2, 3);
        var result = source.pipe(operators_1.publish(function (s) { return s.pipe(operators_1.map(function (x) { return x + '!'; })); }));
    });
});
//# sourceMappingURL=publish-spec.js.map