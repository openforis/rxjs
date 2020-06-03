"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableMatcher = void 0;
var _ = require("lodash");
var chai = require("chai");
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
exports.observableMatcher = observableMatcher;
//# sourceMappingURL=observableMatcher.js.map