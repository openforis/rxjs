"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var sinon = require("sinon");
var operators_1 = require("rxjs/operators");
var test_helper_1 = require("../../helpers/test-helper");
describe('animationFrame', function () {
    var raf;
    var DateStub;
    var now = 1000;
    beforeEach(function () {
        raf = test_helper_1.stubRAF();
        DateStub = sinon.stub(Date, 'now').callsFake(function () {
            return ++now;
        });
    });
    afterEach(function () {
        raf.restore();
        DateStub.restore();
    });
    it('should animate', function () {
        var results = [];
        var source$ = rxjs_1.animationFrames();
        var subs = source$.subscribe({
            next: function (ts) { return results.push(ts); },
            error: function (err) { return results.push(err); },
            complete: function () { return results.push('done'); },
        });
        chai_1.expect(DateStub).to.have.been.calledOnce;
        chai_1.expect(results).to.deep.equal([]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledTwice;
        chai_1.expect(results).to.deep.equal([1]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledThrice;
        chai_1.expect(results).to.deep.equal([1, 2]);
        raf.tick();
        chai_1.expect(results).to.deep.equal([1, 2, 3]);
        subs.unsubscribe();
    });
    it('should use any passed timestampProvider', function () {
        var results = [];
        var i = 0;
        var timestampProvider = {
            now: sinon.stub().callsFake(function () {
                return [100, 200, 210, 300][i++];
            })
        };
        var source$ = rxjs_1.animationFrames(timestampProvider);
        var subs = source$.subscribe({
            next: function (ts) { return results.push(ts); },
            error: function (err) { return results.push(err); },
            complete: function () { return results.push('done'); },
        });
        chai_1.expect(DateStub).not.to.have.been.called;
        chai_1.expect(timestampProvider.now).to.have.been.calledOnce;
        chai_1.expect(results).to.deep.equal([]);
        raf.tick();
        chai_1.expect(DateStub).not.to.have.been.called;
        chai_1.expect(timestampProvider.now).to.have.been.calledTwice;
        chai_1.expect(results).to.deep.equal([100]);
        raf.tick();
        chai_1.expect(DateStub).not.to.have.been.called;
        chai_1.expect(timestampProvider.now).to.have.been.calledThrice;
        chai_1.expect(results).to.deep.equal([100, 110]);
        raf.tick();
        chai_1.expect(results).to.deep.equal([100, 110, 200]);
        subs.unsubscribe();
    });
    it('should compose with take', function () {
        var results = [];
        var source$ = rxjs_1.animationFrames();
        chai_1.expect(requestAnimationFrame).not.to.have.been.called;
        source$.pipe(operators_1.take(2)).subscribe({
            next: function (ts) { return results.push(ts); },
            error: function (err) { return results.push(err); },
            complete: function () { return results.push('done'); },
        });
        chai_1.expect(DateStub).to.have.been.calledOnce;
        chai_1.expect(requestAnimationFrame).to.have.been.calledOnce;
        chai_1.expect(results).to.deep.equal([]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledTwice;
        chai_1.expect(requestAnimationFrame).to.have.been.calledTwice;
        chai_1.expect(results).to.deep.equal([1]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledThrice;
        chai_1.expect(requestAnimationFrame).to.have.been.calledTwice;
        chai_1.expect(results).to.deep.equal([1, 2, 'done']);
        chai_1.expect(cancelAnimationFrame).to.have.been.calledOnce;
    });
    it('should compose with takeUntil', function () {
        var subject = new rxjs_1.Subject();
        var results = [];
        var source$ = rxjs_1.animationFrames();
        chai_1.expect(requestAnimationFrame).not.to.have.been.called;
        source$.pipe(operators_1.takeUntil(subject)).subscribe({
            next: function (ts) { return results.push(ts); },
            error: function (err) { return results.push(err); },
            complete: function () { return results.push('done'); },
        });
        chai_1.expect(DateStub).to.have.been.calledOnce;
        chai_1.expect(requestAnimationFrame).to.have.been.calledOnce;
        chai_1.expect(results).to.deep.equal([]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledTwice;
        chai_1.expect(requestAnimationFrame).to.have.been.calledTwice;
        chai_1.expect(results).to.deep.equal([1]);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledThrice;
        chai_1.expect(requestAnimationFrame).to.have.been.calledThrice;
        chai_1.expect(results).to.deep.equal([1, 2]);
        chai_1.expect(cancelAnimationFrame).not.to.have.been.called;
        subject.next();
        chai_1.expect(cancelAnimationFrame).to.have.been.calledOnce;
        chai_1.expect(results).to.deep.equal([1, 2, 'done']);
        raf.tick();
        chai_1.expect(DateStub).to.have.been.calledThrice;
        chai_1.expect(requestAnimationFrame).to.have.been.calledThrice;
        chai_1.expect(results).to.deep.equal([1, 2, 'done']);
    });
});
//# sourceMappingURL=animationFrames-spec.js.map