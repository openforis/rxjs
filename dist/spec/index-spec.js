"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require("../src/index");
var chai_1 = require("chai");
describe('index', function () {
    it('should export Observable', function () {
        chai_1.expect(index.Observable).to.exist;
        chai_1.expect(index.ConnectableObservable).to.exist;
        var operator;
    });
    it('should export the Subject types', function () {
        chai_1.expect(index.Subject).to.exist;
        chai_1.expect(index.BehaviorSubject).to.exist;
        chai_1.expect(index.ReplaySubject).to.exist;
        chai_1.expect(index.AsyncSubject).to.exist;
    });
    it('should export the schedulers', function () {
        chai_1.expect(index.asapScheduler).to.exist;
        chai_1.expect(index.asyncScheduler).to.exist;
        chai_1.expect(index.queueScheduler).to.exist;
        chai_1.expect(index.animationFrameScheduler).to.exist;
        chai_1.expect(index.VirtualTimeScheduler).to.exist;
        chai_1.expect(index.VirtualAction).to.exist;
    });
    it('should export Subscription', function () {
        chai_1.expect(index.Subscription).to.exist;
        chai_1.expect(index.Subscriber).to.exist;
    });
    it('should export Notification', function () {
        chai_1.expect(index.Notification).to.exist;
    });
    it('should export the appropriate utilities', function () {
        chai_1.expect(index.pipe).to.exist;
        chai_1.expect(index.noop).to.exist;
        chai_1.expect(index.identity).to.exist;
    });
    it('should export error types', function () {
        chai_1.expect(index.ArgumentOutOfRangeError).to.exist;
        chai_1.expect(index.EmptyError).to.exist;
        chai_1.expect(index.ObjectUnsubscribedError).to.exist;
        chai_1.expect(index.UnsubscriptionError).to.exist;
        chai_1.expect(index.TimeoutError).to.exist;
    });
    it('should export constants', function () {
        chai_1.expect(index.EMPTY).to.exist;
        chai_1.expect(index.NEVER).to.exist;
    });
    it('should export static observable creator functions', function () {
        chai_1.expect(index.bindCallback).to.exist;
        chai_1.expect(index.bindNodeCallback).to.exist;
        chai_1.expect(index.combineLatest).to.exist;
        chai_1.expect(index.concat).to.exist;
        chai_1.expect(index.defer).to.exist;
        chai_1.expect(index.empty).to.exist;
        chai_1.expect(index.forkJoin).to.exist;
        chai_1.expect(index.from).to.exist;
        chai_1.expect(index.fromEvent).to.exist;
        chai_1.expect(index.fromEventPattern).to.exist;
        chai_1.expect(index.generate).to.exist;
        chai_1.expect(index.iif).to.exist;
        chai_1.expect(index.interval).to.exist;
        chai_1.expect(index.merge).to.exist;
        chai_1.expect(index.of).to.exist;
        chai_1.expect(index.onErrorResumeNext).to.exist;
        chai_1.expect(index.pairs).to.exist;
        chai_1.expect(index.race).to.exist;
        chai_1.expect(index.range).to.exist;
        chai_1.expect(index.throwError).to.exist;
        chai_1.expect(index.timer).to.exist;
        chai_1.expect(index.using).to.exist;
        chai_1.expect(index.zip).to.exist;
    });
    it('should expose configuration', function () {
        chai_1.expect(index.config).to.exist;
    });
});
//# sourceMappingURL=index-spec.js.map