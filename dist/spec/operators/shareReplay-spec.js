"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('shareReplay operator', function () {
    it('should mirror a simple source Observable', function () {
        var source = marble_testing_1.cold('--1-2---3-4--5-|');
        var sourceSubs = '^              !';
        var published = source.pipe(operators_1.shareReplay());
        var expected = '--1-2---3-4--5-|';
        marble_testing_1.expectObservable(published).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should do nothing if result is not subscribed', function () {
        var subscribed = false;
        var source = new rxjs_1.Observable(function () {
            subscribed = true;
        });
        source.pipe(operators_1.shareReplay());
        chai_1.expect(subscribed).to.be.false;
    });
    it('should multicast the same values to multiple observers, bufferSize=1', function () {
        var source = marble_testing_1.cold('-1-2-3----4-|');
        var shared = source.pipe(operators_1.shareReplay(1));
        var sourceSubs = '^           !';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-3----4-|';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    23----4-|';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '        3-4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast the same values to multiple observers, bufferSize=2', function () {
        var source = marble_testing_1.cold('-1-2-----3------4-|');
        var shared = source.pipe(operators_1.shareReplay(2));
        var sourceSubs = '^                 !';
        var subscriber1 = marble_testing_1.hot('a|                 ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-----3------4-|';
        var subscriber2 = marble_testing_1.hot('    b|             ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    (12)-3------4-|';
        var subscriber3 = marble_testing_1.hot('           c|       ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '           (23)-4-|';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast an error from the source to multiple observers', function () {
        var source = marble_testing_1.cold('-1-2-3----4-#');
        var shared = source.pipe(operators_1.shareReplay(1));
        var sourceSubs = '^           !';
        var subscriber1 = marble_testing_1.hot('a|           ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-3----4-#';
        var subscriber2 = marble_testing_1.hot('    b|       ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    23----4-#';
        var subscriber3 = marble_testing_1.hot('        c|   ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '        3-4-#';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast an empty source', function () {
        var source = marble_testing_1.cold('|');
        var sourceSubs = '(^!)';
        var shared = source.pipe(operators_1.shareReplay(1));
        var expected = '|';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast a never source', function () {
        var source = marble_testing_1.cold('-');
        var sourceSubs = '^';
        var shared = source.pipe(operators_1.shareReplay(1));
        var expected = '-';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should multicast a throw source', function () {
        var source = marble_testing_1.cold('#');
        var sourceSubs = '(^!)';
        var shared = source.pipe(operators_1.shareReplay(1));
        var expected = '#';
        marble_testing_1.expectObservable(shared).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should replay results to subsequent subscriptions if source completes, bufferSize=2', function () {
        var source = marble_testing_1.cold('-1-2-----3-|        ');
        var shared = source.pipe(operators_1.shareReplay(2));
        var sourceSubs = '^          !        ';
        var subscriber1 = marble_testing_1.hot('a|                  ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-----3-|        ';
        var subscriber2 = marble_testing_1.hot('    b|              ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    (12)-3-|        ';
        var subscriber3 = marble_testing_1.hot('               (c|) ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '               (23|)';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should completely restart for subsequent subscriptions if source errors, bufferSize=2', function () {
        var source = marble_testing_1.cold('-1-2-----3-#               ');
        var shared = source.pipe(operators_1.shareReplay(2));
        var sourceSubs1 = '^          !               ';
        var subscriber1 = marble_testing_1.hot('a|                         ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-----3-#               ';
        var subscriber2 = marble_testing_1.hot('    b|                     ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    (12)-3-#               ';
        var subscriber3 = marble_testing_1.hot('               (c|)        ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '               -1-2-----3-#';
        var sourceSubs2 = '               ^          !';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe([sourceSubs1, sourceSubs2]);
    });
    it('should be retryable, bufferSize=2', function () {
        var subs = [];
        var source = marble_testing_1.cold('-1-2-----3-#                      ');
        var shared = source.pipe(operators_1.shareReplay(2), operators_1.retry(1));
        subs.push('^          !                      ');
        subs.push('           ^          !           ');
        subs.push('                      ^          !');
        var subscriber1 = marble_testing_1.hot('a|                                ').pipe(operators_1.mergeMapTo(shared));
        var expected1 = '-1-2-----3--1-2-----3-#           ';
        var subscriber2 = marble_testing_1.hot('    b|                            ').pipe(operators_1.mergeMapTo(shared));
        var expected2 = '    (12)-3--1-2-----3-#           ';
        var subscriber3 = marble_testing_1.hot('               (c|)               ').pipe(operators_1.mergeMapTo(shared));
        var expected3 = '               (12)-3--1-2-----3-#';
        marble_testing_1.expectObservable(subscriber1).toBe(expected1);
        marble_testing_1.expectObservable(subscriber2).toBe(expected2);
        marble_testing_1.expectObservable(subscriber3).toBe(expected3);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('when no windowTime is given ReplaySubject should be in _infiniteTimeWindow mode', function () {
        var spy = sinon.spy(rxTestScheduler, 'now');
        rxjs_1.of(1)
            .pipe(operators_1.shareReplay(1, undefined, rxTestScheduler))
            .subscribe();
        spy.restore();
        chai_1.expect(spy, 'ReplaySubject should not call scheduler.now() when no windowTime is given').to.be.not.called;
    });
    it('should not restart due to unsubscriptions if refCount is false', function () {
        var source = marble_testing_1.cold('a-b-c-d-e-f-g-h-i-j');
        var sub1 = '^------!';
        var expected1 = 'a-b-c-d-';
        var sub2 = '-----------^-------';
        var expected2 = '-----------fg-h-i-j';
        var shared = source.pipe(operators_1.shareReplay({ bufferSize: 1, refCount: false }));
        marble_testing_1.expectObservable(shared, sub1).toBe(expected1);
        marble_testing_1.expectObservable(shared, sub2).toBe(expected2);
    });
    it('should restart due to unsubscriptions if refCount is true', function () {
        var source = marble_testing_1.cold('a-b-c-d-e-f-g-h-i-j');
        var sub1 = '^------!';
        var expected1 = 'a-b-c-d-';
        var sub2 = '-----------^------------------';
        var expected2 = '-----------a-b-c-d-e-f-g-h-i-j';
        var shared = source.pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        marble_testing_1.expectObservable(shared, sub1).toBe(expected1);
        marble_testing_1.expectObservable(shared, sub2).toBe(expected2);
    });
    it('should default to refCount being false', function () {
        var source = marble_testing_1.cold('a-b-c-d-e-f-g-h-i-j');
        var sub1 = '^------!';
        var expected1 = 'a-b-c-d-';
        var sub2 = '-----------^-------';
        var expected2 = '-----------fg-h-i-j';
        var shared = source.pipe(operators_1.shareReplay(1));
        marble_testing_1.expectObservable(shared, sub1).toBe(expected1);
        marble_testing_1.expectObservable(shared, sub2).toBe(expected2);
    });
    it('should not break lift() composability', function (done) {
        var MyCustomObservable = (function (_super) {
            __extends(MyCustomObservable, _super);
            function MyCustomObservable() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyCustomObservable.prototype.lift = function (operator) {
                var observable = new MyCustomObservable();
                observable.source = this;
                observable.operator = operator;
                return observable;
            };
            return MyCustomObservable;
        }(rxjs_1.Observable));
        var result = new MyCustomObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.shareReplay());
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expected = [1, 2, 3];
        result
            .subscribe(function (n) {
            chai_1.expect(expected.length).to.be.greaterThan(0);
            chai_1.expect(n).to.equal(expected.shift());
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
});
//# sourceMappingURL=shareReplay-spec.js.map