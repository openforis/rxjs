"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var chai = require("chai");
var sinonChai = require("sinon-chai");
var marble = require("./marble-testing");
var testing_1 = require("rxjs/testing");
var commonInterface = require('mocha/lib/interfaces/common');
var escapeRe = require('escape-string-regexp');
(function (window) {
    window = window || this;
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}(global));
chai.use(sinonChai);
if (global && !(typeof window !== 'undefined')) {
    global.mocha = require('mocha');
    global.Suite = global.mocha.Suite;
    global.Test = global.mocha.Test;
}
var diagramFunction = global.asDiagram;
module.exports = function (suite) {
    var suites = [suite];
    suite.on('pre-require', function (context, file, mocha) {
        var common = commonInterface(suites, context);
        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha.options.delay && common.runWithSuite(suite);
        context.rxTestScheduler = null;
        context.hot = marble.hot;
        context.cold = marble.cold;
        context.expectObservable = marble.expectObservable;
        context.expectSubscriptions = marble.expectSubscriptions;
        context.time = marble.time;
        context.describe = context.context = function (title, fn) {
            var suite = Suite.create(suites[0], title);
            suite.file = file;
            suites.unshift(suite);
            fn.call(suite);
            suites.shift();
            return suite;
        };
        context.xdescribe = context.xcontext = context.describe.skip = function (title, fn) {
            var suite = Suite.create(suites[0], title);
            suite.pending = true;
            suites.unshift(suite);
            fn.call(suite);
            suites.shift();
        };
        context.describe.only = function (title, fn) {
            var suite = context.describe(title, fn);
            mocha.grep(suite.fullTitle());
            return suite;
        };
        context.type = function (title, fn) {
        };
        function stringify(x) {
            return JSON.stringify(x, function (key, value) {
                if (Array.isArray(value)) {
                    return '[' + value
                        .map(function (i) {
                        return '\n\t' + stringify(i);
                    }) + '\n]';
                }
                return value;
            })
                .replace(/\\"/g, '"')
                .replace(/\\t/g, '\t')
                .replace(/\\n/g, '\n');
        }
        function deleteErrorNotificationStack(marble) {
            var notification = marble.notification;
            if (notification) {
                var kind = notification.kind, error = notification.error;
                if (kind === 'E' && error instanceof Error) {
                    notification.error = { name: error.name, message: error.message };
                }
            }
            return marble;
        }
        function observableMatcher(actual, expected) {
            if (Array.isArray(actual) && Array.isArray(expected)) {
                actual = actual.map(deleteErrorNotificationStack);
                expected = expected.map(deleteErrorNotificationStack);
                var passed = _.isEqual(actual, expected);
                if (passed) {
                    return;
                }
                var message_1 = '\nExpected \n';
                actual.forEach(function (x) { return message_1 += "\t" + stringify(x) + "\n"; });
                message_1 += '\t\nto deep equal \n';
                expected.forEach(function (x) { return message_1 += "\t" + stringify(x) + "\n"; });
                chai.assert(passed, message_1);
            }
            else {
                chai.assert.deepEqual(actual, expected);
            }
        }
        var it = context.it = context.specify = function (title, fn) {
            context.rxTestScheduler = null;
            var modified = fn;
            if (fn && fn.length === 0) {
                modified = function () {
                    context.rxTestScheduler = new testing_1.TestScheduler(observableMatcher);
                    try {
                        fn();
                        context.rxTestScheduler.flush();
                    }
                    finally {
                        context.rxTestScheduler = null;
                    }
                };
            }
            var suite = suites[0];
            if (suite.pending) {
                modified = null;
            }
            var test = new Test(title, modified);
            test.file = file;
            suite.addTest(test);
            return test;
        };
        context.asDiagram = function (label) {
            if (diagramFunction) {
                return diagramFunction(label, it);
            }
            return it;
        };
        context.it.only = function (title, fn) {
            var test = it(title, fn);
            var reString = '^' + escapeRe(test.fullTitle()) + '$';
            mocha.grep(new RegExp(reString));
            return test;
        };
        context.xit = context.xspecify = context.it.skip = function (title) {
            context.it(title);
        };
        context.it.retries = function (n) {
            context.retries(n);
        };
    });
};
if (global.Mocha) {
    window.Mocha.interfaces['testschedulerui'] = module.exports;
}
else {
    mocha.interfaces['testschedulerui'] = module.exports;
}
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (key !== 'stack') {
                alt[key] = this[key];
            }
        }, this);
        return alt;
    },
    configurable: true
});
//# sourceMappingURL=testScheduler-ui.js.map