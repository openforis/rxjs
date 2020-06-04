"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var marble_testing_1 = require("../helpers/marble-testing");
var AsyncScheduler_1 = require("rxjs/internal/scheduler/AsyncScheduler");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('TestScheduler', function () {
    it('should exist', function () {
        chai_1.expect(testing_1.TestScheduler).exist;
        chai_1.expect(testing_1.TestScheduler).to.be.a('function');
    });
    it('should have frameTimeFactor set initially', function () {
        chai_1.expect(testing_1.TestScheduler.frameTimeFactor).to.equal(10);
    });
    describe('parseMarbles()', function () {
        it('should parse a marble string into a series of notifications and types', function () {
            var result = testing_1.TestScheduler.parseMarbles('-------a---b---|', { a: 'A', b: 'B' });
            chai_1.expect(result).deep.equal([
                { frame: 70, notification: rxjs_1.Notification.createNext('A') },
                { frame: 110, notification: rxjs_1.Notification.createNext('B') },
                { frame: 150, notification: rxjs_1.Notification.createComplete() }
            ]);
        });
        it('should parse a marble string, allowing spaces too', function () {
            var result = testing_1.TestScheduler.parseMarbles('--a--b--|   ', { a: 'A', b: 'B' });
            chai_1.expect(result).deep.equal([
                { frame: 20, notification: rxjs_1.Notification.createNext('A') },
                { frame: 50, notification: rxjs_1.Notification.createNext('B') },
                { frame: 80, notification: rxjs_1.Notification.createComplete() }
            ]);
        });
        it('should parse a marble string with a subscription point', function () {
            var result = testing_1.TestScheduler.parseMarbles('---^---a---b---|', { a: 'A', b: 'B' });
            chai_1.expect(result).deep.equal([
                { frame: 40, notification: rxjs_1.Notification.createNext('A') },
                { frame: 80, notification: rxjs_1.Notification.createNext('B') },
                { frame: 120, notification: rxjs_1.Notification.createComplete() }
            ]);
        });
        it('should parse a marble string with an error', function () {
            var result = testing_1.TestScheduler.parseMarbles('-------a---b---#', { a: 'A', b: 'B' }, 'omg error!');
            chai_1.expect(result).deep.equal([
                { frame: 70, notification: rxjs_1.Notification.createNext('A') },
                { frame: 110, notification: rxjs_1.Notification.createNext('B') },
                { frame: 150, notification: rxjs_1.Notification.createError('omg error!') }
            ]);
        });
        it('should default in the letter for the value if no value hash was passed', function () {
            var result = testing_1.TestScheduler.parseMarbles('--a--b--c--');
            chai_1.expect(result).deep.equal([
                { frame: 20, notification: rxjs_1.Notification.createNext('a') },
                { frame: 50, notification: rxjs_1.Notification.createNext('b') },
                { frame: 80, notification: rxjs_1.Notification.createNext('c') },
            ]);
        });
        it('should handle grouped values', function () {
            var result = testing_1.TestScheduler.parseMarbles('---(abc)---');
            chai_1.expect(result).deep.equal([
                { frame: 30, notification: rxjs_1.Notification.createNext('a') },
                { frame: 30, notification: rxjs_1.Notification.createNext('b') },
                { frame: 30, notification: rxjs_1.Notification.createNext('c') }
            ]);
        });
        it('should ignore whitespace when runMode=true', function () {
            var runMode = true;
            var result = testing_1.TestScheduler.parseMarbles('  -a - b -    c |       ', { a: 'A', b: 'B', c: 'C' }, undefined, undefined, runMode);
            chai_1.expect(result).deep.equal([
                { frame: 10, notification: rxjs_1.Notification.createNext('A') },
                { frame: 30, notification: rxjs_1.Notification.createNext('B') },
                { frame: 50, notification: rxjs_1.Notification.createNext('C') },
                { frame: 60, notification: rxjs_1.Notification.createComplete() }
            ]);
        });
        it('should suppport time progression syntax when runMode=true', function () {
            var runMode = true;
            var result = testing_1.TestScheduler.parseMarbles('10.2ms a 1.2s b 1m c|', { a: 'A', b: 'B', c: 'C' }, undefined, undefined, runMode);
            chai_1.expect(result).deep.equal([
                { frame: 10.2, notification: rxjs_1.Notification.createNext('A') },
                { frame: 10.2 + 10 + (1.2 * 1000), notification: rxjs_1.Notification.createNext('B') },
                { frame: 10.2 + 10 + (1.2 * 1000) + 10 + (1000 * 60), notification: rxjs_1.Notification.createNext('C') },
                { frame: 10.2 + 10 + (1.2 * 1000) + 10 + (1000 * 60) + 10, notification: rxjs_1.Notification.createComplete() }
            ]);
        });
    });
    describe('parseMarblesAsSubscriptions()', function () {
        it('should parse a subscription marble string into a subscriptionLog', function () {
            var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('---^---!-');
            chai_1.expect(result.subscribedFrame).to.equal(30);
            chai_1.expect(result.unsubscribedFrame).to.equal(70);
        });
        it('should parse a subscription marble string with an unsubscription', function () {
            var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('---^-');
            chai_1.expect(result.subscribedFrame).to.equal(30);
            chai_1.expect(result.unsubscribedFrame).to.equal(Number.POSITIVE_INFINITY);
        });
        it('should parse a subscription marble string with a synchronous unsubscription', function () {
            var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('---(^!)-');
            chai_1.expect(result.subscribedFrame).to.equal(30);
            chai_1.expect(result.unsubscribedFrame).to.equal(30);
        });
        it('should ignore whitespace when runMode=true', function () {
            var runMode = true;
            var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('  - -  - -  ^ -   - !  -- -      ', runMode);
            chai_1.expect(result.subscribedFrame).to.equal(40);
            chai_1.expect(result.unsubscribedFrame).to.equal(70);
        });
        it('should suppport time progression syntax when runMode=true', function () {
            var runMode = true;
            var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('10.2ms ^ 1.2s - 1m !', runMode);
            chai_1.expect(result.subscribedFrame).to.equal(10.2);
            chai_1.expect(result.unsubscribedFrame).to.equal(10.2 + 10 + (1.2 * 1000) + 10 + (1000 * 60));
        });
    });
    describe('createTime()', function () {
        it('should parse a simple time marble string to a number', function () {
            var scheduler = new testing_1.TestScheduler(null);
            var time = scheduler.createTime('-----|');
            chai_1.expect(time).to.equal(50);
        });
        it('should throw if not given good marble input', function () {
            var scheduler = new testing_1.TestScheduler(null);
            chai_1.expect(function () {
                scheduler.createTime('-a-b-#');
            }).to.throw();
        });
    });
    describe('createColdObservable()', function () {
        it('should create a cold observable', function () {
            var expected = ['A', 'B'];
            var scheduler = new testing_1.TestScheduler(null);
            var source = scheduler.createColdObservable('--a---b--|', { a: 'A', b: 'B' });
            chai_1.expect(source).to.be.an.instanceOf(rxjs_1.Observable);
            source.subscribe(function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            });
            scheduler.flush();
            chai_1.expect(expected.length).to.equal(0);
        });
    });
    describe('createHotObservable()', function () {
        it('should create a hot observable', function () {
            var expected = ['A', 'B'];
            var scheduler = new testing_1.TestScheduler(null);
            var source = scheduler.createHotObservable('--a---b--|', { a: 'A', b: 'B' });
            chai_1.expect(source).to.be.an.instanceof(rxjs_1.Subject);
            source.subscribe(function (x) {
                chai_1.expect(x).to.equal(expected.shift());
            });
            scheduler.flush();
            chai_1.expect(expected.length).to.equal(0);
        });
    });
    describe('jasmine helpers', function () {
        describe('rxTestScheduler', function () {
            it('should exist', function () {
                chai_1.expect(rxTestScheduler).to.be.an.instanceof(testing_1.TestScheduler);
            });
        });
        describe('cold()', function () {
            it('should exist', function () {
                chai_1.expect(marble_testing_1.cold).to.exist;
                chai_1.expect(marble_testing_1.cold).to.be.a('function');
            });
            it('should create a cold observable', function () {
                var expected = [1, 2];
                var source = marble_testing_1.cold('-a-b-|', { a: 1, b: 2 });
                source.subscribe(function (x) {
                    chai_1.expect(x).to.equal(expected.shift());
                }, null, function () {
                    chai_1.expect(expected.length).to.equal(0);
                });
                marble_testing_1.expectObservable(source).toBe('-a-b-|', { a: 1, b: 2 });
            });
        });
        describe('hot()', function () {
            it('should exist', function () {
                chai_1.expect(marble_testing_1.hot).to.exist;
                chai_1.expect(marble_testing_1.hot).to.be.a('function');
            });
            it('should create a hot observable', function () {
                var source = marble_testing_1.hot('---^-a-b-|', { a: 1, b: 2 });
                chai_1.expect(source).to.be.an.instanceOf(rxjs_1.Subject);
                marble_testing_1.expectObservable(source).toBe('--a-b-|', { a: 1, b: 2 });
            });
        });
        describe('time()', function () {
            it('should exist', function () {
                chai_1.expect(marble_testing_1.time).to.exist;
                chai_1.expect(marble_testing_1.time).to.be.a('function');
            });
            it('should parse a simple time marble string to a number', function () {
                chai_1.expect(marble_testing_1.time('-----|')).to.equal(50);
            });
        });
        describe('expectObservable()', function () {
            it('should exist', function () {
                chai_1.expect(marble_testing_1.expectObservable).to.exist;
                chai_1.expect(marble_testing_1.expectObservable).to.be.a('function');
            });
            it('should return an object with a toBe function', function () {
                chai_1.expect(marble_testing_1.expectObservable(rxjs_1.of(1)).toBe).to.be.a('function');
            });
            it('should append to flushTests array', function () {
                marble_testing_1.expectObservable(rxjs_1.EMPTY);
                chai_1.expect(rxTestScheduler.flushTests.length).to.equal(1);
            });
            it('should handle empty', function () {
                marble_testing_1.expectObservable(rxjs_1.EMPTY).toBe('|', {});
            });
            it('should handle never', function () {
                marble_testing_1.expectObservable(rxjs_1.NEVER).toBe('-', {});
                marble_testing_1.expectObservable(rxjs_1.NEVER).toBe('---', {});
            });
            it('should accept an unsubscription marble diagram', function () {
                var source = marble_testing_1.hot('---^-a-b-|');
                var unsubscribe = '---!';
                var expected = '--a';
                marble_testing_1.expectObservable(source, unsubscribe).toBe(expected);
            });
            it('should accept a subscription marble diagram', function () {
                var source = marble_testing_1.hot('-a-b-c|');
                var subscribe = '---^';
                var expected = '---b-c|';
                marble_testing_1.expectObservable(source, subscribe).toBe(expected);
            });
        });
        describe('expectSubscriptions()', function () {
            it('should exist', function () {
                chai_1.expect(marble_testing_1.expectSubscriptions).to.exist;
                chai_1.expect(marble_testing_1.expectSubscriptions).to.be.a('function');
            });
            it('should return an object with a toBe function', function () {
                chai_1.expect(marble_testing_1.expectSubscriptions([]).toBe).to.be.a('function');
            });
            it('should append to flushTests array', function () {
                marble_testing_1.expectSubscriptions([]);
                chai_1.expect(rxTestScheduler.flushTests.length).to.equal(1);
            });
            it('should assert subscriptions of a cold observable', function () {
                var source = marble_testing_1.cold('---a---b-|');
                var subs = '^--------!';
                marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
                source.subscribe();
            });
        });
        describe('end-to-end helper tests', function () {
            it('should be awesome', function () {
                var values = { a: 1, b: 2 };
                var myObservable = marble_testing_1.cold('---a---b--|', values);
                var subs = '^---------!';
                marble_testing_1.expectObservable(myObservable).toBe('---a---b--|', values);
                marble_testing_1.expectSubscriptions(myObservable.subscriptions).toBe(subs);
            });
            it('should support testing metastreams', function () {
                var x = marble_testing_1.cold('-a-b|');
                var y = marble_testing_1.cold('-c-d|');
                var myObservable = marble_testing_1.hot('---x---y----|', { x: x, y: y });
                var expected = '---x---y----|';
                var expectedx = marble_testing_1.cold('-a-b|');
                var expectedy = marble_testing_1.cold('-c-d|');
                marble_testing_1.expectObservable(myObservable).toBe(expected, { x: expectedx, y: expectedy });
            });
        });
    });
    describe('TestScheduler.run()', function () {
        var assertDeepEquals = function (actual, expected) {
            chai_1.expect(actual).deep.equal(expected);
        };
        describe('marble diagrams', function () {
            it('should ignore whitespace', function () {
                var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
                testScheduler.run(function (_a) {
                    var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                    var input = cold('  -a - b -    c |       ');
                    var output = input.pipe(operators_1.concatMap(function (d) { return rxjs_1.of(d).pipe(operators_1.delay(10)); }));
                    var expected = '     -- 9ms a 9ms b 9ms (c|) ';
                    expectObservable(output).toBe(expected);
                    expectSubscriptions(input.subscriptions).toBe('  ^- - - - - !');
                });
            });
            it('should support time progression syntax', function () {
                var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
                testScheduler.run(function (_a) {
                    var cold = _a.cold, hot = _a.hot, flush = _a.flush, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                    var output = cold('10.2ms a 1.2s b 1m c|');
                    var expected = '   10.2ms a 1.2s b 1m c|';
                    expectObservable(output).toBe(expected);
                });
            });
        });
        it('should provide the correct helpers', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function (_a) {
                var cold = _a.cold, hot = _a.hot, flush = _a.flush, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                chai_1.expect(cold).to.be.a('function');
                chai_1.expect(hot).to.be.a('function');
                chai_1.expect(flush).to.be.a('function');
                chai_1.expect(expectObservable).to.be.a('function');
                chai_1.expect(expectSubscriptions).to.be.a('function');
                var obs1 = cold('-a-c-e|');
                var obs2 = hot(' ^-b-d-f|');
                var output = rxjs_1.merge(obs1, obs2);
                var expected = ' -abcdef|';
                expectObservable(output).toBe(expected);
                expectSubscriptions(obs1.subscriptions).toBe('^-----!');
                expectSubscriptions(obs2.subscriptions).toBe('^------!');
            });
        });
        it('should have each frame represent a single virtual millisecond', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable;
                var output = cold('-a-b-c--------|').pipe(operators_1.debounceTime(5));
                var expected = '   ------ 4ms c---|';
                expectObservable(output).toBe(expected);
            });
        });
        it('should have no maximum frame count', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable;
                var output = cold('-a|').pipe(operators_1.delay(1000 * 10));
                var expected = '   - 10s (a|)';
                expectObservable(output).toBe(expected);
            });
        });
        it('should make operators that use AsyncScheduler automatically use TestScheduler for actual scheduling', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable;
                var output = cold('-a-b-c--------|').pipe(operators_1.debounceTime(5));
                var expected = '   ----------c---|';
                expectObservable(output).toBe(expected);
            });
        });
        it('should flush automatically', function () {
            var testScheduler = new testing_1.TestScheduler(function (actual, expected) {
                chai_1.expect(actual).deep.equal(expected);
            });
            testScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable;
                var output = cold('-a-b-c|').pipe(operators_1.concatMap(function (d) { return rxjs_1.of(d).pipe(operators_1.delay(10)); }));
                var expected = '   -- 9ms a 9ms b 9ms (c|)';
                expectObservable(output).toBe(expected);
                chai_1.expect(testScheduler['flushTests'].length).to.equal(1);
                chai_1.expect(testScheduler['actions'].length).to.equal(1);
            });
            chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
            chai_1.expect(testScheduler['actions'].length).to.equal(0);
        });
        it('should support explicit flushing', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, flush = _a.flush;
                var output = cold('-a-b-c|').pipe(operators_1.concatMap(function (d) { return rxjs_1.of(d).pipe(operators_1.delay(10)); }));
                var expected = '   -- 9ms a 9ms b 9ms (c|)';
                expectObservable(output).toBe(expected);
                chai_1.expect(testScheduler['flushTests'].length).to.equal(1);
                chai_1.expect(testScheduler['actions'].length).to.equal(1);
                flush();
                chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
                chai_1.expect(testScheduler['actions'].length).to.equal(0);
            });
            chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
            chai_1.expect(testScheduler['actions'].length).to.equal(0);
        });
        it('should pass-through return values, e.g. Promises', function (done) {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            testScheduler.run(function () {
                return Promise.resolve('foo');
            }).then(function (value) {
                chai_1.expect(value).to.equal('foo');
                done();
            });
        });
        it('should restore changes upon thrown errors', function () {
            var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
            var frameTimeFactor = testing_1.TestScheduler['frameTimeFactor'];
            var maxFrames = testScheduler.maxFrames;
            var runMode = testScheduler['runMode'];
            var delegate = AsyncScheduler_1.AsyncScheduler.delegate;
            try {
                testScheduler.run(function () {
                    throw new Error('kaboom!');
                });
            }
            catch (_a) { }
            chai_1.expect(testing_1.TestScheduler['frameTimeFactor']).to.equal(frameTimeFactor);
            chai_1.expect(testScheduler.maxFrames).to.equal(maxFrames);
            chai_1.expect(testScheduler['runMode']).to.equal(runMode);
            chai_1.expect(AsyncScheduler_1.AsyncScheduler.delegate).to.equal(delegate);
        });
        it('should flush expectations correctly', function () {
            chai_1.expect(function () {
                var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
                testScheduler.run(function (_a) {
                    var cold = _a.cold, expectObservable = _a.expectObservable, flush = _a.flush;
                    expectObservable(cold('-x')).toBe('-x');
                    expectObservable(cold('-y')).toBe('-y');
                    var expectation = expectObservable(cold('-z'));
                    flush();
                    expectation.toBe('-q');
                });
            }).to.throw();
        });
    });
});
//# sourceMappingURL=TestScheduler-spec.js.map