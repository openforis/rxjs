"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var painter_1 = require("./painter");
var testing_1 = require("rxjs/testing");
exports.rxTestScheduler = global.rxTestScheduler;
function getInputStreams(rxTestScheduler) {
    return Array.prototype.concat.call([], rxTestScheduler.hotObservables
        .map(function (hot) {
        return {
            messages: hot.messages,
            subscription: { start: 0, end: '100%' },
        };
    })
        .slice(), rxTestScheduler.coldObservables
        .map(function (cold) {
        return {
            messages: cold.messages,
            cold: cold,
        };
    })
        .slice());
}
function updateInputStreamsPostFlush(inputStreams) {
    return inputStreams.map(function (singleInputStream) {
        if (singleInputStream.cold && singleInputStream.cold.subscriptions.length) {
            singleInputStream.subscription = {
                start: singleInputStream.cold.subscriptions[0].subscribedFrame,
                end: singleInputStream.cold.subscriptions[0].unsubscribedFrame,
            };
        }
        return singleInputStream;
    });
}
function postProcessOutputMessage(msg) {
    if (Array.isArray(msg.notification.value)
        && msg.notification.value.length
        && typeof msg.notification.value[0] === 'object') {
        msg.notification.value = {
            messages: msg.notification.value,
            subscription: { start: msg.frame, end: '100%' },
        };
        var completionFrame = msg.notification.value.messages
            .reduce(function (prev, x) {
            if (x.notification && x.notification.kind === 'C' && x.frame > prev) {
                return x.frame;
            }
            else {
                return prev;
            }
        }, -1);
        if (completionFrame > -1) {
            msg.notification.value.subscription.end = msg.frame + completionFrame;
        }
    }
    return msg;
}
function makeFilename(operatorLabel) {
    return /^(\w+)/.exec(operatorLabel)[1] + '.png';
}
global.asDiagram = function asDiagram(operatorLabel, glit) {
    return function specFnWithPainter(description, specFn) {
        if (specFn.length === 0) {
            glit(description, function () {
                var outputStreams = [];
                global.rxTestScheduler = new testing_1.TestScheduler(function (actual) {
                    if (Array.isArray(actual) && actual.length > 0 && typeof actual[0].frame === 'number') {
                        outputStreams.push({
                            messages: actual.map(postProcessOutputMessage),
                            subscription: { start: 0, end: '100%' }
                        });
                    }
                    else if (Array.isArray(actual) && actual.length === 0) {
                        outputStreams.push({
                            messages: [],
                            subscription: { start: 0, end: '100%' }
                        });
                    }
                    return true;
                });
                specFn();
                var inputStreams = getInputStreams(global.rxTestScheduler);
                global.rxTestScheduler.flush();
                inputStreams = updateInputStreamsPostFlush(inputStreams);
                var filename = './docs_app/content/img/' + makeFilename(operatorLabel);
                painter_1.painter(inputStreams, operatorLabel, outputStreams, filename);
                console.log('Painted ' + filename);
            });
        }
        else {
            throw new Error('cannot generate PNG marble diagram for async test ' + description);
        }
    };
};
//# sourceMappingURL=diagram-test-runner.js.map