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
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('groupBy operator', function () {
    asDiagram('groupBy(i => i % 2)')('should group numbers by odd/even', function () {
        var e1 = marble_testing_1.hot('--1---2---3---4---5---|');
        var expected = '--x---y---------------|';
        var x = marble_testing_1.cold('1-------3-------5---|');
        var y = marble_testing_1.cold('2-------4-------|');
        var expectedValues = { x: x, y: y };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return parseInt(val) % 2; }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
    });
    function reverseString(str) {
        return str.split('').reverse().join('');
    }
    function mapObject(obj, fn) {
        var out = {};
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                out[p] = fn(obj[p]);
            }
        }
        return out;
    }
    it('should group values', function (done) {
        var expectedGroups = [
            { key: 1, values: [1, 3] },
            { key: 0, values: [2] }
        ];
        rxjs_1.of(1, 2, 3).pipe(operators_1.groupBy(function (x) { return x % 2; })).subscribe(function (g) {
            var expectedGroup = expectedGroups.shift();
            chai_1.expect(g.key).to.equal(expectedGroup.key);
            g.subscribe(function (x) {
                chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
            });
        }, null, done);
    });
    it('should group values with an element selector', function (done) {
        var expectedGroups = [
            { key: 1, values: ['1!', '3!'] },
            { key: 0, values: ['2!'] }
        ];
        rxjs_1.of(1, 2, 3).pipe(operators_1.groupBy(function (x) { return x % 2; }, function (x) { return x + '!'; })).subscribe(function (g) {
            var expectedGroup = expectedGroups.shift();
            chai_1.expect(g.key).to.equal(expectedGroup.key);
            g.subscribe(function (x) {
                chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
            });
        }, null, done);
    });
    it('should group values with a duration selector', function () {
        var expectedGroups = [
            { key: 1, values: [1, 3] },
            { key: 0, values: [2, 4] },
            { key: 1, values: [5] },
            { key: 0, values: [6] }
        ];
        var resultingGroups = [];
        rxjs_1.of(1, 2, 3, 4, 5, 6).pipe(operators_1.groupBy(function (x) { return x % 2; }, function (x) { return x; }, function (g) { return g.pipe(operators_1.skip(1)); })).subscribe(function (g) {
            var group = { key: g.key, values: [] };
            g.subscribe(function (x) {
                group.values.push(x);
            });
            resultingGroups.push(group);
        });
        chai_1.expect(resultingGroups).to.deep.equal(expectedGroups);
    });
    it('should group values with a subject selector', function (done) {
        var expectedGroups = [
            { key: 1, values: [3] },
            { key: 0, values: [2] }
        ];
        rxjs_1.of(1, 2, 3).pipe(operators_1.groupBy(function (x) { return x % 2; }, null, null, function () { return new rxjs_1.ReplaySubject(1); }), operators_1.delay(5)).subscribe(function (g) {
            var expectedGroup = expectedGroups.shift();
            chai_1.expect(g.key).to.equal(expectedGroup.key);
            g.subscribe(function (x) {
                chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
            });
        }, null, done);
    });
    it('should handle an empty Observable', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = '|';
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a never Observable', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = '-';
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle a just-throw Observable', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = '#';
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should handle an Observable with a single value', function () {
        var values = { a: '  foo' };
        var e1 = marble_testing_1.hot('^--a--|', values);
        var e1subs = '^     !';
        var expected = '---g--|';
        var g = marble_testing_1.cold('a--|', values);
        var expectedValues = { g: g };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                         !';
        var expected = '--w---x---y-z-------------|';
        var w = marble_testing_1.cold('a-b---d---------i-----l-|', values);
        var x = marble_testing_1.cold('c-------g-h---------|', values);
        var y = marble_testing_1.cold('e---------j-k---|', values);
        var z = marble_testing_1.cold('f-------------|', values);
        var expectedValues = { w: w, x: x, y: y, z: z };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should emit GroupObservables', function () {
        var values = {
            a: '  foo',
            b: ' FoO '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b----|', values);
        var e1subs = '^        !';
        var expected = '--g------|';
        var expectedValues = { g: 'foo' };
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.tap(function (group) {
            chai_1.expect(group.key).to.equal('foo');
            chai_1.expect(group instanceof rxjs_1.GroupedObservable).to.be.true;
        }), operators_1.map(function (group) { return group.key; }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector, assert GroupSubject key', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                         !';
        var expected = '--w---x---y-z-------------|';
        var expectedValues = { w: 'foo', x: 'bar', y: 'baz', z: 'qux' };
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.map(function (g) { return g.key; }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector, but outer throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
        var e1subs = '^                         !';
        var expected = '--w---x---y-z-------------#';
        var expectedValues = { w: 'foo', x: 'bar', y: 'baz', z: 'qux' };
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.map(function (g) { return g.key; }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector, inners propagate error from outer', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
        var e1subs = '^                         !';
        var expected = '--w---x---y-z-------------#';
        var w = marble_testing_1.cold('a-b---d---------i-----l-#', values);
        var x = marble_testing_1.cold('c-------g-h---------#', values);
        var y = marble_testing_1.cold('e---------j-k---#', values);
        var z = marble_testing_1.cold('f-------------#', values);
        var expectedValues = { w: w, x: x, y: y, z: z };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow outer to be unsubscribed early', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var unsub = '           !';
        var e1subs = '^          !';
        var expected = '--w---x---y-';
        var expectedValues = { w: 'foo', x: 'bar', y: 'baz' };
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.map(function (group) { return group.key; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should unsubscribe from the source when the outer and inner subscriptions are disposed', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^ !';
        var expected = '--(a|)';
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.take(1), operators_1.mergeMap(function (group) { return group.pipe(operators_1.take(1)); }));
        marble_testing_1.expectObservable(source).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^          !';
        var expected = '--w---x---y-';
        var unsub = '           !';
        var expectedValues = { w: 'foo', x: 'bar', y: 'baz' };
        var source = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.groupBy(function (x) { return x.toLowerCase().trim(); }), operators_1.mergeMap(function (group) { return rxjs_1.of(group.key); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector which eventually throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                   !';
        var expected = '--w---x---y-z-------#';
        var w = marble_testing_1.cold('a-b---d---------i-#', values);
        var x = marble_testing_1.cold('c-------g-h---#', values);
        var y = marble_testing_1.cold('e---------#', values);
        var z = marble_testing_1.cold('f-------#', values);
        var expectedValues = { w: w, x: x, y: y, z: z };
        var invoked = 0;
        var source = e1
            .pipe(operators_1.groupBy(function (val) {
            invoked++;
            if (invoked === 10) {
                throw 'error';
            }
            return val.toLowerCase().trim();
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should group values with a keySelector and elementSelector, ' +
        'but elementSelector throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var reversedValues = mapObject(values, reverseString);
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                   !';
        var expected = '--w---x---y-z-------#';
        var w = marble_testing_1.cold('a-b---d---------i-#', reversedValues);
        var x = marble_testing_1.cold('c-------g-h---#', reversedValues);
        var y = marble_testing_1.cold('e---------#', reversedValues);
        var z = marble_testing_1.cold('f-------#', reversedValues);
        var expectedValues = { w: w, x: x, y: y, z: z };
        var invoked = 0;
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) {
            invoked++;
            if (invoked === 10) {
                throw 'error';
            }
            return reverseString(val);
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow the outer to be unsubscribed early but inners continue', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var unsub = '         !';
        var expected = '--w---x---';
        var w = marble_testing_1.cold('a-b---d---------i-----l-|', values);
        var x = marble_testing_1.cold('c-------g-h---------|', values);
        var expectedValues = { w: w, x: x };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedValues);
    });
    it('should allow an inner to be unsubscribed early but other inners continue', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var expected = '--w---x---y-z-------------|';
        var w = '--a-b---d-';
        var unsubw = '         !';
        var x = '------c-------g-h---------|';
        var y = '----------e---------j-k---|';
        var z = '------------f-------------|';
        var expectedGroups = {
            w: testing_1.TestScheduler.parseMarbles(w, values),
            x: testing_1.TestScheduler.parseMarbles(x, values),
            y: testing_1.TestScheduler.parseMarbles(y, values),
            z: testing_1.TestScheduler.parseMarbles(z, values)
        };
        var fooUnsubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(unsubw)
            .unsubscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.map(function (group) {
            var arr = [];
            var subscription = group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                return { frame: rxTestScheduler.frame, notification: notification };
            })).subscribe(function (value) {
                arr.push(value);
            });
            if (group.key === 'foo') {
                rxTestScheduler.schedule(function () {
                    subscription.unsubscribe();
                }, fooUnsubscriptionFrame - rxTestScheduler.frame);
            }
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
    });
    it('should allow inners to be unsubscribed early at different times', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var expected = '--w---x---y-z-------------|';
        var w = '--a-b---d-';
        var unsubw = '         !';
        var x = '------c------';
        var unsubx = '            !';
        var y = '----------e------';
        var unsuby = '                !';
        var z = '------------f-------';
        var unsubz = '                   !';
        var expectedGroups = {
            w: testing_1.TestScheduler.parseMarbles(w, values),
            x: testing_1.TestScheduler.parseMarbles(x, values),
            y: testing_1.TestScheduler.parseMarbles(y, values),
            z: testing_1.TestScheduler.parseMarbles(z, values)
        };
        var unsubscriptionFrames = {
            foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubw).unsubscribedFrame,
            bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubx).unsubscribedFrame,
            baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsuby).unsubscribedFrame,
            qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubz).unsubscribedFrame
        };
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.map(function (group) {
            var arr = [];
            var subscription = group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                return { frame: rxTestScheduler.frame, notification: notification };
            })).subscribe(function (value) {
                arr.push(value);
            });
            rxTestScheduler.schedule(function () {
                subscription.unsubscribe();
            }, unsubscriptionFrames[group.key] - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
    });
    it('should allow subscribing late to an inner Observable, outer completes', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('--a-b---d---------i-----l-|', values);
        var subs = '^                         !';
        var expected = '----------------------------|';
        e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }))
            .subscribe(function (group) {
            rxTestScheduler.schedule(function () {
                marble_testing_1.expectObservable(group).toBe(expected);
            }, 260);
        });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should allow subscribing late to an inner Observable, outer throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('--a-b---d---------i-----l-#', values);
        var subs = '^                         !';
        var expected = '----------------------------#';
        e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }))
            .subscribe(function (group) {
            rxTestScheduler.schedule(function () {
                marble_testing_1.expectObservable(group).toBe(expected);
            }, 260);
        }, function () {
        });
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(subs);
    });
    it('should allow subscribing late to inner, unsubscribe outer early', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('--a-b---d---------i-----l-#', values);
        var unsub = '            !';
        var e1subs = '^           !';
        var expectedOuter = '--w----------';
        var expectedInner = '-------------';
        var outerValues = { w: 'foo' };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }), operators_1.tap(function (group) {
            rxTestScheduler.schedule(function () {
                marble_testing_1.expectObservable(group).toBe(expectedInner);
            }, 260);
        }), operators_1.map(function (group) { return group.key; }));
        marble_testing_1.expectObservable(source, unsub).toBe(expectedOuter, outerValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow using a keySelector, elementSelector, and durationSelector', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var reversedValues = mapObject(values, reverseString);
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                         !';
        var expected = '--v---w---x-y-----z-------|';
        var v = marble_testing_1.cold('a-b---(d|)', reversedValues);
        var w = marble_testing_1.cold('c-------g-(h|)', reversedValues);
        var x = marble_testing_1.cold('e---------j-(k|)', reversedValues);
        var y = marble_testing_1.cold('f-------------|', reversedValues);
        var z = marble_testing_1.cold('i-----l-|', reversedValues);
        var expectedValues = { v: v, w: w, x: x, y: y, z: z };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return reverseString(val); }, function (group) { return group.pipe(operators_1.skip(2)); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow using a keySelector, elementSelector, and durationSelector that throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var reversedValues = mapObject(values, reverseString);
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var expected = '--v---w---x-y-----z-------|';
        var v = marble_testing_1.cold('a-b---(d#)', reversedValues);
        var w = marble_testing_1.cold('c-------g-(h#)', reversedValues);
        var x = marble_testing_1.cold('e---------j-(k#)', reversedValues);
        var y = marble_testing_1.cold('f-------------|', reversedValues);
        var z = marble_testing_1.cold('i-----l-|', reversedValues);
        var expectedValues = { v: v, w: w, x: x, y: y, z: z };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return reverseString(val); }, function (group) { return group.pipe(operators_1.skip(2), operators_1.map(function () { throw 'error'; })); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
    });
    it('should allow using a keySelector and a durationSelector, outer throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
        var e1subs = '^                         !';
        var expected = '--v---w---x-y-----z-------#';
        var v = marble_testing_1.cold('a-b---(d|)', values);
        var w = marble_testing_1.cold('c-------g-(h|)', values);
        var x = marble_testing_1.cold('e---------j-(k|)', values);
        var y = marble_testing_1.cold('f-------------#', values);
        var z = marble_testing_1.cold('i-----l-#', values);
        var expectedValues = { v: v, w: w, x: x, y: y, z: z };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(2)); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow using a durationSelector, and outer unsubscribed early', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var unsub = '           !';
        var expected = '--v---w---x-';
        var v = marble_testing_1.cold('a-b---(d|)', values);
        var w = marble_testing_1.cold('c-------g-(h|)', values);
        var x = marble_testing_1.cold('e---------j-(k|)', values);
        var expectedValues = { v: v, w: w, x: x };
        var source = e1
            .pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(2)); }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedValues);
    });
    it('should allow using a durationSelector, outer and all inners unsubscribed early', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var unsub = '           !';
        var expected = '--v---w---x-';
        var v = '--a-b---(d|)';
        var w = '------c-----';
        var x = '----------e-';
        var expectedGroups = {
            v: testing_1.TestScheduler.parseMarbles(v, values),
            w: testing_1.TestScheduler.parseMarbles(w, values),
            x: testing_1.TestScheduler.parseMarbles(x, values)
        };
        var unsubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(unsub)
            .unsubscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(2)); }), operators_1.map(function (group) {
            var arr = [];
            var subscription = group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                return { frame: rxTestScheduler.frame, notification: notification };
            })).subscribe(function (value) {
                arr.push(value);
            });
            rxTestScheduler.schedule(function () {
                subscription.unsubscribe();
            }, unsubscriptionFrame - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedGroups);
    });
    it('should dispose a durationSelector after closing the group', function () {
        var obs = marble_testing_1.hot('-0-1--------2-|');
        var sub = '^              !';
        var unsubs = [
            '-^--!',
            '---^--!',
            '------------^-!',
        ];
        var dur = '---s';
        var durations = [
            marble_testing_1.cold(dur),
            marble_testing_1.cold(dur),
            marble_testing_1.cold(dur)
        ];
        var unsubscribedFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(sub)
            .unsubscribedFrame;
        obs.pipe(operators_1.groupBy(function (val) { return val; }, function (val) { return val; }, function (group) { return durations[group.key]; })).subscribe();
        rxTestScheduler.schedule(function () {
            durations.forEach(function (d, i) {
                marble_testing_1.expectSubscriptions(d.subscriptions).toBe(unsubs[i]);
            });
        }, unsubscribedFrame);
    });
    it('should allow using a durationSelector, but keySelector throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                   !';
        var expected = '--v---w---x-y-----z-#';
        var v = marble_testing_1.cold('a-b---(d|)', values);
        var w = marble_testing_1.cold('c-------g-(h|)', values);
        var x = marble_testing_1.cold('e---------#', values);
        var y = marble_testing_1.cold('f-------#', values);
        var z = marble_testing_1.cold('i-#', values);
        var expectedValues = { v: v, w: w, x: x, y: y, z: z };
        var invoked = 0;
        var source = e1.pipe(operators_1.groupBy(function (val) {
            invoked++;
            if (invoked === 10) {
                throw 'error';
            }
            return val.toLowerCase().trim();
        }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(2)); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow using a durationSelector, but elementSelector throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                   !      ';
        var expected = '--v---w---x-y-----z-#      ';
        var v = marble_testing_1.cold('a-b---(d|)               ', values);
        var w = marble_testing_1.cold('c-------g-(h|)       ', values);
        var x = marble_testing_1.cold('e---------#      ', values);
        var y = marble_testing_1.cold('f-------#      ', values);
        var z = marble_testing_1.cold('i-#      ', values);
        var expectedValues = { v: v, w: w, x: x, y: y, z: z };
        var invoked = 0;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) {
            invoked++;
            if (invoked === 10) {
                throw 'error';
            }
            return val;
        }, function (group) { return group.pipe(operators_1.skip(2)); }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow using a durationSelector which eventually throws', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^           !              ';
        var expected = '--v---w---x-(y#)              ';
        var v = marble_testing_1.cold('a-b---(d|)               ', values);
        var w = marble_testing_1.cold('c-----#              ', values);
        var x = marble_testing_1.cold('e-#              ', values);
        var y = marble_testing_1.cold('#              ', values);
        var expectedValues = { v: v, w: w, x: x, y: y };
        var invoked = 0;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) {
            invoked++;
            if (invoked === 4) {
                throw 'error';
            }
            return group.pipe(operators_1.skip(2));
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedValues);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow an inner to be unsubscribed early but other inners continue, ' +
        'with durationSelector', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var reversedValues = mapObject(values, reverseString);
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                         !';
        var expected = '--v---w---x-y-----z-------|';
        var v = '--a-b---';
        var unsubv = '       !';
        var w = '------c-------g-(h|)';
        var x = '----------e---------j-(k|)';
        var y = '------------f-------------|';
        var z = '------------------i-----l-|';
        var expectedGroups = {
            v: testing_1.TestScheduler.parseMarbles(v, reversedValues),
            w: testing_1.TestScheduler.parseMarbles(w, reversedValues),
            x: testing_1.TestScheduler.parseMarbles(x, reversedValues),
            y: testing_1.TestScheduler.parseMarbles(y, reversedValues),
            z: testing_1.TestScheduler.parseMarbles(z, reversedValues)
        };
        var fooUnsubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(unsubv)
            .unsubscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return reverseString(val); }, function (group) { return group.pipe(operators_1.skip(2)); }), operators_1.map(function (group, index) {
            var arr = [];
            var subscription = group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                return { frame: rxTestScheduler.frame, notification: notification };
            })).subscribe(function (value) {
                arr.push(value);
            });
            if (group.key === 'foo' && index === 0) {
                rxTestScheduler.schedule(function () {
                    subscription.unsubscribe();
                }, fooUnsubscriptionFrame - rxTestScheduler.frame);
            }
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should allow inners to be unsubscribed early at different times, with durationSelector', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
        var e1subs = '^                         !';
        var expected = '--v---w---x-y-----z-------|';
        var v = '--a-b---';
        var unsubv = '       !';
        var w = '------c---';
        var unsubw = '         !';
        var x = '----------e---------j-';
        var unsubx = '                     !';
        var y = '------------f----';
        var unsuby = '                !';
        var z = '------------------i----';
        var unsubz = '                      !';
        var expectedGroups = {
            v: testing_1.TestScheduler.parseMarbles(v, values),
            w: testing_1.TestScheduler.parseMarbles(w, values),
            x: testing_1.TestScheduler.parseMarbles(x, values),
            y: testing_1.TestScheduler.parseMarbles(y, values),
            z: testing_1.TestScheduler.parseMarbles(z, values)
        };
        var unsubscriptionFrames = {
            foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubv).unsubscribedFrame,
            bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubw).unsubscribedFrame,
            baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubx).unsubscribedFrame,
            qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsuby).unsubscribedFrame,
            foo2: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubz).unsubscribedFrame
        };
        var hasUnsubscribed = {};
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(2)); }), operators_1.map(function (group) {
            var arr = [];
            var subscription = group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                return { frame: rxTestScheduler.frame, notification: notification };
            })).subscribe(function (value) {
                arr.push(value);
            });
            var unsubscriptionFrame = hasUnsubscribed[group.key] ?
                unsubscriptionFrames[group.key + '2'] :
                unsubscriptionFrames[group.key];
            rxTestScheduler.schedule(function () {
                subscription.unsubscribe();
                hasUnsubscribed[group.key] = true;
            }, unsubscriptionFrame - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return inners that when subscribed late exhibit hot behavior', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            c: 'baR  ',
            d: 'foO ',
            e: ' Baz   ',
            f: '  qux ',
            g: '   bar',
            h: ' BAR  ',
            i: 'FOO ',
            j: 'baz  ',
            k: ' bAZ ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|    ', values);
        var e1subs = '^                         !    ';
        var expected = '--v---w---x-y-------------|    ';
        var subv = '   ^                           ';
        var v = '  --b---d---------i-----l-|    ';
        var subw = '         ^                     ';
        var w = '      --------g-h---------|    ';
        var subx = '                   ^           ';
        var x = '          ----------j-k---|    ';
        var suby = '                              ^';
        var y = '            ------------------|';
        var expectedGroups = {
            v: testing_1.TestScheduler.parseMarbles(v, values),
            w: testing_1.TestScheduler.parseMarbles(w, values),
            x: testing_1.TestScheduler.parseMarbles(x, values),
            y: testing_1.TestScheduler.parseMarbles(y, values),
        };
        var subscriptionFrames = {
            foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(subv).subscribedFrame,
            bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(subw).subscribedFrame,
            baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(subx).subscribedFrame,
            qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(suby).subscribedFrame,
        };
        var result = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }), operators_1.map(function (group) {
            var innerNotifications = [];
            var subscriptionFrame = subscriptionFrames[group.key];
            rxTestScheduler.schedule(function () {
                group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                    return { frame: rxTestScheduler.frame, notification: notification };
                })).subscribe(function (value) {
                    innerNotifications.push(value);
                });
            }, subscriptionFrame - rxTestScheduler.frame);
            return innerNotifications;
        }));
        marble_testing_1.expectObservable(result).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return inner group that when subscribed late emits complete()', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b---d---------i-----l-|', values);
        var e1subs = '^                         !';
        var expected = '--g-----------------------|';
        var innerSub = '                                ^';
        var g = '--------------------------------|';
        var expectedGroups = {
            g: testing_1.TestScheduler.parseMarbles(g, values)
        };
        var innerSubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(innerSub)
            .subscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(7)); }), operators_1.map(function (group) {
            var arr = [];
            rxTestScheduler.schedule(function () {
                group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                    return { frame: rxTestScheduler.frame, notification: notification };
                })).subscribe(function (value) {
                    arr.push(value);
                });
            }, innerSubscriptionFrame - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return inner group that when subscribed late emits error()', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b---d---------i-----l-#', values);
        var e1subs = '^                         !';
        var expected = '--g-----------------------#';
        var innerSub = '                                ^';
        var g = '--------------------------------#';
        var expectedGroups = {
            g: testing_1.TestScheduler.parseMarbles(g, values)
        };
        var innerSubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(innerSub)
            .subscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(7)); }), operators_1.map(function (group) {
            var arr = [];
            rxTestScheduler.schedule(function () {
                group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                    return { frame: rxTestScheduler.frame, notification: notification };
                })).subscribe(function (value) {
                    arr.push(value);
                });
            }, innerSubscriptionFrame - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
    it('should return inner that does not throw when faulty outer is unsubscribed early', function () {
        var values = {
            a: '  foo',
            b: ' FoO ',
            d: 'foO ',
            i: 'FOO ',
            l: '    fOo    '
        };
        var e1 = marble_testing_1.hot('-1--2--^-a-b---d---------i-----l-#', values);
        var unsub = '      !';
        var expectedSubs = '^     !';
        var expected = '--g----';
        var innerSub = '                                ^';
        var g = '-';
        var expectedGroups = {
            g: testing_1.TestScheduler.parseMarbles(g, values)
        };
        var innerSubscriptionFrame = testing_1.TestScheduler
            .parseMarblesAsSubscriptions(innerSub)
            .subscribedFrame;
        var source = e1.pipe(operators_1.groupBy(function (val) { return val.toLowerCase().trim(); }, function (val) { return val; }, function (group) { return group.pipe(operators_1.skip(7)); }), operators_1.map(function (group) {
            var arr = [];
            rxTestScheduler.schedule(function () {
                group.pipe(operators_1.materialize(), operators_1.map(function (notification) {
                    return { frame: rxTestScheduler.frame, notification: notification };
                })).subscribe(function (value) {
                    arr.push(value);
                });
            }, innerSubscriptionFrame - rxTestScheduler.frame);
            return arr;
        }));
        marble_testing_1.expectObservable(source, unsub).toBe(expected, expectedGroups);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(expectedSubs);
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
        }).pipe(operators_1.groupBy(function (x) { return x % 2; }, function (x) { return x + '!'; }));
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expectedGroups = [
            { key: 1, values: ['1!', '3!'] },
            { key: 0, values: ['2!'] }
        ];
        result
            .subscribe(function (g) {
            var expectedGroup = expectedGroups.shift();
            chai_1.expect(g.key).to.equal(expectedGroup.key);
            g.subscribe(function (x) {
                chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
            });
        }, function (x) {
            done(new Error('should not be called'));
        }, function () {
            done();
        });
    });
});
//# sourceMappingURL=groupBy-spec.js.map