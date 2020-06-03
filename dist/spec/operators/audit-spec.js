"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('audit operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit the last value in each time window', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('    -a-xy-----b--x--cxxx-|');
            var e1subs = '    ^--------------------!';
            var e2 = cold('    ----|                ');
            var e2subs = [
                '                 -^---!                ',
                '                 ----------^---!        ',
                '                 ----------------^---!  '
            ];
            var expected = '  -----y--------x-----x|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should delay the source if values are not emitted often enough', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a--------b-----c----|');
            var e1subs = '  ^--------------------!';
            var e2 = cold('  ----|                ');
            var e2subs = [
                '               -^---!                ',
                '               ----------^---!       ',
                '               ----------------^---! '
            ];
            var expected = '-----a--------b-----c|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should audit with duration Observable using next to close the duration', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('   -a-xy-----b--x--cxxx-|');
            var e1subs = '   ^--------------------!';
            var e2 = cold('   ----x-y-z            ');
            var e2subs = [
                '                -^---!                ',
                '                ----------^---!       ',
                '                ----------------^---! '
            ];
            var expected = ' -----y--------x-----x|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should interrupt source and duration when result is unsubscribed early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a-x-y-z-xyz-x-y-z----b--x-x-|');
            var unsub = '   --------------!               ';
            var e1subs = '  ^-------------!               ';
            var e2 = cold('  -----x------------|          ');
            var e2subs = [
                '               -^----!                       ',
                '               -------^----!                 ',
                '               -------------^!               '
            ];
            var expected = '------y-----z--               ';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -a-x-y-z-xyz-x-y-z----b--x-x-|');
            var e1subs = '  ^-------------!               ';
            var e2 = cold('  -----x------------|          ');
            var e2subs = [
                '               -^----!                       ',
                '               -------^----!                 ',
                '               -------------^!               '
            ];
            var expected = '------y-----z--               ';
            var unsub = '   --------------!               ';
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.audit(function () { return e2; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle a busy producer emitting a regular repeating sequence', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdefabcdefabcdefa|');
            var e1subs = '  ^------------------------!';
            var e2 = cold(' -----|                    ');
            var e2subs = [
                '               ^----!                    ',
                '               ------^----!              ',
                '               ------------^----!        ',
                '               ------------------^----!  ',
                '               ------------------------^!'
            ];
            var expected = '-----f-----f-----f-----f-|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should mirror source if durations are always empty', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdefabcdefabcdefa|');
            var e1subs = '  ^------------------------!';
            var e2 = cold(' |');
            var expected = 'abcdefabcdefabcdefabcdefa|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should mirror source if durations are EMPTY', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('abcdefabcdefabcdefabcdefa|');
            var e1subs = '^------------------------!';
            var e2 = rxjs_1.EMPTY;
            var expected = 'abcdefabcdefabcdefabcdefa|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should emit no values if duration is a never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ----abcdefabcdefabcdefabcdefa|');
            var e1subs = '  ^----------------------------!';
            var e2 = cold(' -');
            var e2subs = '  ----^------------------------!';
            var expected = '-----------------------------|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should unsubscribe duration Observable when source raise error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ----abcdefabcdefabcdefabcdefa#');
            var e1subs = '  ^----------------------------!';
            var e2 = cold(' -');
            var e2subs = '  ----^------------------------!';
            var expected = '-----------------------------#';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should mirror source if durations are synchronous observables', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdefabcdefabcdefa|');
            var e1subs = '  ^------------------------!';
            var e2 = rxjs_1.of('one single value');
            var expected = 'abcdefabcdefabcdefabcdefa|';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error as soon as just-throw duration is used', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ----abcdefabcdefabcdefabcdefa|');
            var e1subs = '  ^---!                         ';
            var e2 = cold(' #');
            var e2subs = '  ----(^!)                      ';
            var expected = '----(-#)                      ';
            var result = e1.pipe(operators_1.audit(function () { return e2; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should audit using durations of varying lengths', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdabcdefghabca|');
            var e1subs = '  ^---------------------!';
            var e2 = [
                cold('          -----|                 '),
                cold('              ---|               '),
                cold('                  -------|       '),
                cold('                        --|      '),
                cold('                           ----| ')
            ];
            var e2subs = [
                '               ^----!                  ',
                '               ------^--!              ',
                '               ----------^------!      ',
                '               ------------------^-!   ',
                '               ---------------------^! '
            ];
            var expected = '-----f---d-------h--c-| ';
            var i = 0;
            var result = e1.pipe(operators_1.audit(function () { return e2[i++]; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            for (var j = 0; j < e2.length; j++) {
                expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
            }
        });
    });
    it('should propagate error from duration Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  abcdefabcdabcdefghabca|');
            var e1subs = '  ^----------------!     ';
            var e2 = [
                cold('          -----|                 '),
                cold('              ---|               '),
                cold('                  -------#       ')
            ];
            var e2subs = [
                '               ^----!                 ',
                '               ------^--!             ',
                '               ----------^------!     '
            ];
            var expected = '-----f---d-------#     ';
            var i = 0;
            var result = e1.pipe(operators_1.audit(function () { return e2[i++]; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            for (var j = 0; j < e2.length; j++) {
                expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
            }
        });
    });
    it('should propagate error thrown from durationSelector function', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('abcdefabcdabcdefghabca|   ');
            var e1subs = '^---------!               ';
            var e2 = [
                cold('          -----|                    '),
                cold('              ---|                  '),
                cold('                  -------|          ')
            ];
            var e2subs = [
                '               ^----!                     ',
                '               ------^--!                   '
            ];
            var expected = '-----f---d#                ';
            var i = 0;
            var result = e1.pipe(operators_1.audit(function () {
                if (i === 2) {
                    throw 'error';
                }
                return e2[i++];
            }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            for (var j = 0; j < e2subs.length; j++) {
                expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
            }
        });
    });
    it('should complete when source does not emit', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -----|');
            var subs = '    ^----!';
            var expected = '-----|';
            function durationSelector() { return cold('-----|'); }
            expectObservable(e1.pipe(operators_1.audit(durationSelector))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should raise error when source does not emit and raises error', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -----#');
            var subs = '    ^----!';
            var expected = '-----#';
            function durationSelector() {
                return cold('   -----|');
            }
            expectObservable(e1.pipe(operators_1.audit(durationSelector))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle an empty source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' |');
            var subs = '    (^!)';
            var expected = '|';
            function durationSelector() {
                return cold('   -----|');
            }
            expectObservable(e1.pipe(operators_1.audit(durationSelector))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a never source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' -');
            var subs = '    ^';
            var expected = '-';
            function durationSelector() {
                return cold('   -----|');
            }
            expectObservable(e1.pipe(operators_1.audit(durationSelector))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a throw source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = cold(' #');
            var subs = '    (^!)';
            var expected = '#';
            function durationSelector() {
                return cold('   -----|');
            }
            expectObservable(e1.pipe(operators_1.audit(durationSelector))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should audit by promise resolves', function (done) {
        var e1 = rxjs_1.interval(10).pipe(operators_1.take(5));
        var expected = [0, 1, 2, 3];
        e1.pipe(operators_1.audit(function () {
            return new Promise(function (resolve) { resolve(42); });
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function () {
            done(new Error('should not be called'));
        }, function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
        });
    });
    it('should raise error when promise rejects', function (done) {
        var e1 = rxjs_1.interval(10).pipe(operators_1.take(10));
        var expected = [0, 1, 2];
        var error = new Error('error');
        e1.pipe(operators_1.audit(function (x) {
            if (x === 3) {
                return new Promise(function (resolve, reject) { reject(error); });
            }
            else {
                return new Promise(function (resolve) { resolve(42); });
            }
        })).subscribe(function (x) {
            chai_1.expect(x).to.equal(expected.shift());
        }, function (err) {
            chai_1.expect(err).to.be.an('error', 'error');
            chai_1.expect(expected.length).to.equal(0);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
});
//# sourceMappingURL=audit-spec.js.map