"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
describe('onErrorResumeNext', function () {
    it('should continue with observables', function () {
        var s1 = marble_testing_1.hot('--a--b--#');
        var s2 = marble_testing_1.cold('--c--d--#');
        var s3 = marble_testing_1.cold('--e--#');
        var s4 = marble_testing_1.cold('--f--g--|');
        var subs1 = '^       !';
        var subs2 = '        ^       !';
        var subs3 = '                ^    !';
        var subs4 = '                     ^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext(s1, s2, s3, s4)).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs1);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(subs2);
        marble_testing_1.expectSubscriptions(s3.subscriptions).toBe(subs3);
        marble_testing_1.expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
    it('should continue array of observables', function () {
        var s1 = marble_testing_1.hot('--a--b--#');
        var s2 = marble_testing_1.cold('--c--d--#');
        var s3 = marble_testing_1.cold('--e--#');
        var s4 = marble_testing_1.cold('--f--g--|');
        var subs1 = '^       !';
        var subs2 = '        ^       !';
        var subs3 = '                ^    !';
        var subs4 = '                     ^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext([s1, s2, s3, s4])).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs1);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(subs2);
        marble_testing_1.expectSubscriptions(s3.subscriptions).toBe(subs3);
        marble_testing_1.expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
    it('should complete single observable throws', function () {
        var source = marble_testing_1.hot('#');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext(source)).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
});
//# sourceMappingURL=onErrorResumeNext-spec.js.map