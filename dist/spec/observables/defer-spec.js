"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
describe('defer', function () {
    asDiagram('defer(() => Observable.of(a, b, c))')('should defer the creation of a simple Observable', function () {
        var expected = '-a--b--c--|';
        var e1 = rxjs_1.defer(function () { return marble_testing_1.cold('-a--b--c--|'); });
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should create an observable from the provided observable factory', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var sourceSubs = '^          !';
        var expected = '--a--b--c--|';
        var e1 = rxjs_1.defer(function () { return source; });
        marble_testing_1.expectObservable(e1).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should create an observable from completed', function () {
        var source = marble_testing_1.hot('|');
        var sourceSubs = '(^!)';
        var expected = '|';
        var e1 = rxjs_1.defer(function () { return source; });
        marble_testing_1.expectObservable(e1).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should accept factory returns promise resolves', function (done) {
        var expected = 42;
        var e1 = rxjs_1.defer(function () {
            return new Promise(function (resolve) { resolve(expected); });
        });
        e1.subscribe(function (x) {
            chai_1.expect(x).to.equal(expected);
            done();
        }, function (x) {
            done(new Error('should not be called'));
        });
    });
    it('should accept factory returns promise rejects', function (done) {
        var expected = 42;
        var e1 = rxjs_1.defer(function () {
            return new Promise(function (resolve, reject) { reject(expected); });
        });
        e1.subscribe(function (x) {
            done(new Error('should not be called'));
        }, function (x) {
            chai_1.expect(x).to.equal(expected);
            done();
        }, function () {
            done(new Error('should not be called'));
        });
    });
    it('should create an observable from error', function () {
        var source = marble_testing_1.hot('#');
        var sourceSubs = '(^!)';
        var expected = '#';
        var e1 = rxjs_1.defer(function () { return source; });
        marble_testing_1.expectObservable(e1).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should create an observable when factory throws', function () {
        var e1 = rxjs_1.defer(function () {
            throw 'error';
        });
        var expected = '#';
        marble_testing_1.expectObservable(e1).toBe(expected);
    });
    it('should allow unsubscribing early and explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var sourceSubs = '^     !     ';
        var expected = '--a--b-     ';
        var unsub = '      !     ';
        var e1 = rxjs_1.defer(function () { return source; });
        marble_testing_1.expectObservable(e1, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var source = marble_testing_1.hot('--a--b--c--|');
        var sourceSubs = '^     !     ';
        var expected = '--a--b-     ';
        var unsub = '      !     ';
        var e1 = rxjs_1.defer(function () { return source.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); })); });
        marble_testing_1.expectObservable(e1, unsub).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
});
//# sourceMappingURL=defer-spec.js.map