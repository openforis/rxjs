"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
describe('Subscription', function () {
    describe('Subscription.add()', function () {
        it('Should return self if the self is passed', function () {
            var sub = new rxjs_1.Subscription();
            var ret = sub.add(sub);
            chai_1.expect(ret).to.equal(sub);
        });
        it('Should return Subscription.EMPTY if it is passed', function () {
            var sub = new rxjs_1.Subscription();
            var ret = sub.add(rxjs_1.Subscription.EMPTY);
            chai_1.expect(ret).to.equal(rxjs_1.Subscription.EMPTY);
        });
        it('Should return Subscription.EMPTY if it is called with `void` value', function () {
            var sub = new rxjs_1.Subscription();
            var ret = sub.add(undefined);
            chai_1.expect(ret).to.equal(rxjs_1.Subscription.EMPTY);
        });
        it('Should return a new Subscription created with teardown function if it is passed a function', function () {
            var sub = new rxjs_1.Subscription();
            var isCalled = false;
            var ret = sub.add(function () {
                isCalled = true;
            });
            ret.unsubscribe();
            chai_1.expect(isCalled).to.equal(true);
        });
        it('Should wrap the AnonymousSubscription and return a subscription that unsubscribes and removes it when unsubbed', function () {
            var sub = new rxjs_1.Subscription();
            var called = false;
            var arg = {
                unsubscribe: function () { return called = true; },
            };
            var ret = sub.add(arg);
            chai_1.expect(called).to.equal(false);
            chai_1.expect(sub._subscriptions.length).to.equal(1);
            ret.unsubscribe();
            chai_1.expect(called).to.equal(true);
            chai_1.expect(sub._subscriptions.length).to.equal(0);
        });
        it('Should return the passed one if passed a AnonymousSubscription having not function `unsubscribe` member', function () {
            var sub = new rxjs_1.Subscription();
            var arg = {
                isUnsubscribed: false,
                unsubscribe: undefined,
            };
            var ret = sub.add(arg);
            chai_1.expect(ret).to.equal(arg);
        });
        it('Should return the passed one if the self has been unsubscribed', function () {
            var main = new rxjs_1.Subscription();
            main.unsubscribe();
            var child = new rxjs_1.Subscription();
            var ret = main.add(child);
            chai_1.expect(ret).to.equal(child);
        });
        it('Should unsubscribe the passed one if the self has been unsubscribed', function () {
            var main = new rxjs_1.Subscription();
            main.unsubscribe();
            var isCalled = false;
            var child = new rxjs_1.Subscription(function () {
                isCalled = true;
            });
            main.add(child);
            chai_1.expect(isCalled).to.equal(true);
        });
    });
    describe('Subscription.unsubscribe()', function () {
        it('Should unsubscribe from all subscriptions, when some of them throw', function (done) {
            var tearDowns = [];
            var source1 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(1);
                };
            });
            var source2 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(2);
                    throw new Error('oops, I am a bad unsubscribe!');
                };
            });
            var source3 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(3);
                };
            });
            var subscription = rxjs_1.merge(source1, source2, source3).subscribe();
            setTimeout(function () {
                chai_1.expect(function () {
                    subscription.unsubscribe();
                }).to.throw(rxjs_1.UnsubscriptionError);
                chai_1.expect(tearDowns).to.deep.equal([1, 2, 3]);
                done();
            });
        });
        it('Should unsubscribe from all subscriptions, when adding a bad custom subscription to a subscription', function (done) {
            var tearDowns = [];
            var sub = new rxjs_1.Subscription();
            var source1 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(1);
                };
            });
            var source2 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(2);
                    sub.add(({
                        unsubscribe: function () {
                            chai_1.expect(sub.closed).to.be.true;
                            throw new Error('Who is your daddy, and what does he do?');
                        }
                    }));
                };
            });
            var source3 = new rxjs_1.Observable(function () {
                return function () {
                    tearDowns.push(3);
                };
            });
            sub.add(rxjs_1.merge(source1, source2, source3).subscribe());
            setTimeout(function () {
                chai_1.expect(function () {
                    sub.unsubscribe();
                }).to.throw(rxjs_1.UnsubscriptionError);
                chai_1.expect(tearDowns).to.deep.equal([1, 2, 3]);
                done();
            });
        });
    });
});
//# sourceMappingURL=Subscription-spec.js.map