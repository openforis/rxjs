"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
describe('mergeMapTo', function () {
    asDiagram('mergeMapTo( 10\u2014\u201410\u2014\u201410\u2014| )')('should map-and-flatten each item to an Observable', function () {
        var e1 = marble_testing_1.hot('--1-----3--5-------|');
        var e1subs = '^                  !';
        var e2 = marble_testing_1.cold('x-x-x|              ', { x: 10 });
        var expected = '--x-x-x-x-xxxx-x---|';
        var values = { x: 10 };
        var result = e1.pipe(operators_1.mergeMapTo(e2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should support the deprecated resultSelector', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.mergeMapTo(rxjs_1.of(4, 5, 6), function (a, b, i, ii) { return [a, b, i, ii]; }))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    [1, 4, 0, 0],
                    [1, 5, 0, 1],
                    [1, 6, 0, 2],
                    [2, 4, 1, 0],
                    [2, 5, 1, 1],
                    [2, 6, 1, 2],
                    [3, 4, 2, 0],
                    [3, 5, 2, 1],
                    [3, 6, 2, 2],
                ]);
            }
        });
    });
    it('should support a void resultSelector (still deprecated)', function () {
        var results = [];
        rxjs_1.of(1, 2, 3).pipe(operators_1.mergeMapTo(rxjs_1.of(4, 5, 6), void 0))
            .subscribe({
            next: function (value) {
                results.push(value);
            },
            error: function (err) {
                throw err;
            },
            complete: function () {
                chai_1.expect(results).to.deep.equal([
                    4, 5, 6, 4, 5, 6, 4, 5, 6
                ]);
            }
        });
    });
    it('should mergeMapTo many regular interval inners', function () {
        var x = marble_testing_1.cold('----1---2---3---(4|)                        ');
        var xsubs = ['^               !                           ',
            '    ^               !                         ',
            '                ^               !             ',
            '                        ^               !     '];
        var e1 = marble_testing_1.hot('a---b-----------c-------d-------|           ');
        var e1subs = '^                               !           ';
        var expected = '----1---(21)(32)(43)(41)2---(31)(42)3---(4|)';
        var source = e1.pipe(operators_1.mergeMapTo(x));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(x.subscriptions).toBe(xsubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map values to constant resolved promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        var results = [];
        source.pipe(operators_1.mergeMapTo(rxjs_1.from(Promise.resolve(42)))).subscribe(function (x) {
            results.push(x);
        }, function (err) {
            done(new Error('Subscriber error handler not supposed to be called.'));
        }, function () {
            chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
            done();
        });
    });
    it('should map values to constant rejected promises and merge', function (done) {
        var source = rxjs_1.from([4, 3, 2, 1]);
        source.pipe(operators_1.mergeMapTo((rxjs_1.from(Promise.reject(42))))).subscribe(function (x) {
            done(new Error('Subscriber next handler not supposed to be called.'));
        }, function (err) {
            chai_1.expect(err).to.equal(42);
            done();
        }, function () {
            done(new Error('Subscriber complete handler not supposed to be called.'));
        });
    });
    it('should mergeMapTo many outer values to many inner values', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|            ');
        var e1subs = '^                                !            ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                        ', values);
        var innersubs = [' ^                   !                        ',
            '         ^                   !                ',
            '                 ^                   !        ',
            '                         ^                   !'];
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l---|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, complete late', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-----------------------|');
        var e1subs = '^                                                !';
        var inner = marble_testing_1.cold('----i---j---k---l---|', values);
        var innersubs = [' ^                   !                            ',
            '         ^                   !                    ',
            '                 ^                   !            ',
            '                         ^                   !    '];
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-------|';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, outer never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------e---------------f------');
        var e1subs = '^                                                      !';
        var inner = marble_testing_1.cold('----i---j---k---l---|', values);
        var innersubs = [' ^                   !                                  ',
            '         ^                   !                          ',
            '                 ^                   !                  ',
            '                         ^                   !          ',
            '                                 ^                   !  ',
            '                                                 ^     !'];
        var unsub = '                                                       !';
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i-';
        var source = e1.pipe(operators_1.mergeMapTo(inner));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------e---------------f------');
        var e1subs = '^                                                      !';
        var inner = marble_testing_1.cold('----i---j---k---l---|', values);
        var innersubs = [' ^                   !                                  ',
            '         ^                   !                          ',
            '                 ^                   !                  ',
            '                         ^                   !          ',
            '                                 ^                   !  ',
            '                                                 ^     !'];
        var unsub = '                                                       !';
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i-';
        var source = e1.pipe(operators_1.map(function (x) { return x; }), operators_1.mergeMapTo(inner), operators_1.map(function (x) { return x; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, inner never completes', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|         ');
        var e1subs = '^                                !         ';
        var inner = marble_testing_1.cold('----i---j---k---l-', values);
        var innersubs = [' ^                                         ',
            '         ^                                 ',
            '                 ^                         ',
            '                         ^                 '];
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, and inner throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------|');
        var e1subs = '^                        !        ';
        var inner = marble_testing_1.cold('----i---j---k---l-------#        ', values);
        var innersubs = [' ^                       !        ',
            '         ^               !        ',
            '                 ^       !        ',
            '                         (^!)     '];
        var expected = '-----i---j---(ki)(lj)(ki)#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, and outer throws', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------#');
        var e1subs = '^                                !';
        var inner = marble_testing_1.cold('----i---j---k---l---|            ', values);
        var innersubs = [' ^                   !            ',
            '         ^                   !    ',
            '                 ^               !',
            '                         ^       !'];
        var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to many inner, both inner and outer throw', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c-------d-------#');
        var e1subs = '^                    !';
        var inner = marble_testing_1.cold('----i---j---k---l---#', values);
        var innersubs = [' ^                   !',
            '         ^           !',
            '                 ^   !'];
        var expected = '-----i---j---(ki)(lj)#';
        marble_testing_1.expectObservable(e1.pipe(operators_1.mergeMapTo(inner))).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many cold Observable, with parameter concurrency=1, without resultSelector', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                                        ');
        var e1subs = '^                    !                                        ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                                        ', values);
        var innersubs = [' ^                   !                                        ',
            '                     ^                   !                    ',
            '                                         ^                   !'];
        var expected = '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
        var result = e1.pipe(operators_1.mergeMapTo(inner, 1));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMap to many cold Observable, with parameter concurrency=2, without resultSelector', function () {
        var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
        var e1 = marble_testing_1.hot('-a-------b-------c---|                    ');
        var e1subs = '^                    !                    ';
        var inner = marble_testing_1.cold('----i---j---k---l---|                    ', values);
        var innersubs = [' ^                   !                    ',
            '         ^                   !            ',
            '                     ^                   !'];
        var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
        var result = e1.pipe(operators_1.mergeMapTo(inner, 2));
        marble_testing_1.expectObservable(result).toBe(expected, values);
        marble_testing_1.expectSubscriptions(inner.subscriptions).toBe(innersubs);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to arrays', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^                               !';
        var expected = '(0123)(0123)---(0123)---(0123)--|';
        var source = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to inner arrays, and outer throws', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------#');
        var e1subs = '^                               !';
        var expected = '(0123)(0123)---(0123)---(0123)--#';
        var source = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should mergeMapTo many outer to inner arrays, outer gets unsubscribed', function () {
        var e1 = marble_testing_1.hot('2-----4--------3--------2-------|');
        var e1subs = '^            !';
        var unsub = '             !';
        var expected = '(0123)(0123)--';
        var source = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
        marble_testing_1.expectObservable(source, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should map and flatten', function () {
        var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.mergeMapTo(rxjs_1.of('!')));
        var expected = ['!', '!', '!', '!'];
        var completed = false;
        source.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            completed = true;
        });
        chai_1.expect(completed).to.be.true;
    });
    it('should map and flatten an Array', function () {
        var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.mergeMapTo(['!']));
        var expected = ['!', '!', '!', '!'];
        var completed = false;
        source.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, null, function () {
            chai_1.expect(expected.length).to.equal(0);
            completed = true;
        });
        chai_1.expect(completed).to.be.true;
    });
    type('should support type signatures', function () {
        var o;
        var m;
        var a1 = o.pipe(operators_1.mergeMapTo(m));
        var a2 = o.pipe(operators_1.mergeMapTo(m, 3));
    });
});
//# sourceMappingURL=mergeMapTo-spec.js.map