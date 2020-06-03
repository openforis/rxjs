"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var booleans = { T: true, F: false };
describe('sequenceEqual operator', function () {
    it('should return true for two equal sequences', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var s1subs = '^                    !';
        var s2 = marble_testing_1.hot('-----^-----b--c--d-e-f------g-|');
        var s2subs = '^                        !';
        var expected = '-------------------------(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false for two sync observables that are unequal in length', function () {
        var s1 = marble_testing_1.cold('(abcdefg|)');
        var s2 = marble_testing_1.cold('(abc|)');
        var expected = '(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
    });
    it('should return true for two sync observables that match', function () {
        var s1 = marble_testing_1.cold('(abcdefg|)');
        var s2 = marble_testing_1.cold('(abcdefg|)');
        var expected = '(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
    });
    it('should return true for two observables that match when the last one emits and completes in the same frame', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var s1subs = '^                    !';
        var s2 = marble_testing_1.hot('-----^--b--c--d--e--f--g------|');
        var s2subs = '^                        !';
        var expected = '-------------------------(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return true for two observables that match when the last one emits and completes in the same frame', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var s1subs = '^                    !';
        var s2 = marble_testing_1.hot('-----^--b--c--d--e--f---------(g|)');
        var s2subs = '^                        !';
        var expected = '-------------------------(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should error with an errored source', function () {
        var s1 = marble_testing_1.hot('--a--^--b---c---#');
        var s2 = marble_testing_1.hot('--a--^--b---c-----|');
        var expected = '-----------#';
        var sub = '^          !';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(sub);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(sub);
    });
    it('should error with an errored compareTo', function () {
        var s1 = marble_testing_1.hot('--a--^--b---c-----|');
        var s2 = marble_testing_1.hot('--a--^--b---c---#');
        var expected = '-----------#';
        var sub = '^          !';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(sub);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(sub);
    });
    it('should error if the source is a throw', function () {
        var s1 = marble_testing_1.cold('#');
        var s2 = marble_testing_1.cold('---a--b--c--|');
        var expected = '#';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should never return if source is a never', function () {
        var s1 = marble_testing_1.cold('------------');
        var s2 = marble_testing_1.cold('--a--b--c--|');
        var expected = '------------';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should never return if compareTo is a never', function () {
        var s1 = marble_testing_1.cold('--a--b--c--|');
        var s2 = marble_testing_1.cold('------------');
        var expected = '------------';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should return false if source is empty and compareTo is not', function () {
        var s1 = marble_testing_1.cold('|');
        var s2 = marble_testing_1.cold('------a------');
        var expected = '------(F|)';
        var s1subs = '(^!)';
        var s2subs = '^     !';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false if compareTo is empty and source is not', function () {
        var s1 = marble_testing_1.cold('------a------');
        var s2 = marble_testing_1.cold('|');
        var expected = '------(F|)';
        var s1subs = '^     !';
        var s2subs = '(^!)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return never if compareTo is empty and source is never', function () {
        var s1 = marble_testing_1.cold('-');
        var s2 = marble_testing_1.cold('|');
        var expected = '-';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should return never if source is empty and compareTo is never', function () {
        var s1 = marble_testing_1.cold('|');
        var s2 = marble_testing_1.cold('-');
        var expected = '-';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected);
    });
    it('should error if the comparor errors', function () {
        var s1 = marble_testing_1.hot('--a--^--b-----c------d--|');
        var s1subs = '^            !';
        var s2 = marble_testing_1.hot('-----^--------x---y---z-------|');
        var s2subs = '^            !';
        var expected = '-------------#';
        var i = 0;
        var source = s1.pipe(operators_1.sequenceEqual(s2, function (a, b) {
            if (++i === 2) {
                throw new Error('shazbot');
            }
            return a.value === b.value;
        }));
        var values = {
            a: null,
            b: { value: 'bees knees' },
            c: { value: 'carpy dumb' },
            d: { value: 'derp' },
            x: { value: 'bees knees', foo: 'lol' },
            y: { value: 'carpy dumb', scooby: 'doo' },
            z: { value: 'derp', weCouldBe: 'dancin, yeah' }
        };
        marble_testing_1.expectObservable(source).toBe(expected, _.assign(booleans, values), new Error('shazbot'));
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should use the provided comparor', function () {
        var s1 = marble_testing_1.hot('--a--^--b-----c------d--|');
        var s1subs = '^                  !';
        var s2 = marble_testing_1.hot('-----^--------x---y---z-------|');
        var s2subs = '^                        !';
        var expected = '-------------------------(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2, function (a, b) { return a.value === b.value; }));
        var values = {
            a: null,
            b: { value: 'bees knees' },
            c: { value: 'carpy dumb' },
            d: { value: 'derp' },
            x: { value: 'bees knees', foo: 'lol' },
            y: { value: 'carpy dumb', scooby: 'doo' },
            z: { value: 'derp', weCouldBe: 'dancin, yeah' }
        };
        marble_testing_1.expectObservable(source).toBe(expected, _.assign(booleans, values));
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false for two unequal sequences, compareTo finishing last', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--|');
        var s1subs = '^                    !';
        var s2 = marble_testing_1.hot('-----^-----b--c--d-e-f------z-|');
        var s2subs = '^                      !';
        var expected = '-----------------------(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false for two unequal sequences, early wrong value from source', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c---x-----------|');
        var s1subs = '^         !';
        var s2 = marble_testing_1.hot('-----^--b--c--d--e--f--|');
        var s2subs = '^         !';
        var expected = '----------(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false when the source emits an extra value after the compareTo completes', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d--e--f--g--h--|');
        var s1subs = '^           !';
        var s2 = marble_testing_1.hot('-----^--b--c--d-|');
        var s2subs = '^          !';
        var expected = '------------(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return false when the compareTo emits an extra value after the source completes', function () {
        var s1 = marble_testing_1.hot('--a--^--b--c--d-|');
        var s1subs = '^          !';
        var s2 = marble_testing_1.hot('-----^--b--c--d--e--f--g--h--|');
        var s2subs = '^           !';
        var expected = '------------(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(s1subs);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
    it('should return true for two empty observables', function () {
        var s1 = marble_testing_1.cold('|');
        var s2 = marble_testing_1.cold('|');
        var expected = '(T|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
    });
    it('should return false for an empty observable and an observable that emits', function () {
        var s1 = marble_testing_1.cold('|');
        var s2 = marble_testing_1.cold('---a--|');
        var expected = '---(F|)';
        var source = s1.pipe(operators_1.sequenceEqual(s2));
        marble_testing_1.expectObservable(source).toBe(expected, booleans);
    });
    it('should return compare hot and cold observables', function () {
        var s1 = marble_testing_1.hot('---a--^---b---c---d---e---f---g---h---i---j---|');
        var s2 = marble_testing_1.cold('----b---c-|');
        var expected1 = '------------(F|)';
        var s2subs = '^         !';
        var delay = '-------------------|';
        var s3 = marble_testing_1.cold('-f---g---h---i---j---|');
        var expected2 = '                   ---------------------(T|)';
        var s3subs = '                   ^                    !';
        var test1 = s1.pipe(operators_1.sequenceEqual(s2));
        var test2 = s1.pipe(operators_1.sequenceEqual(s3));
        marble_testing_1.expectObservable(test1).toBe(expected1, booleans);
        rxTestScheduler.schedule(function () { return marble_testing_1.expectObservable(test2).toBe(expected2, booleans); }, marble_testing_1.time(delay));
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(s2subs);
        marble_testing_1.expectSubscriptions(s3.subscriptions).toBe(s3subs);
    });
});
//# sourceMappingURL=sequenceEqual-spec.js.map