import { Subject } from '../Subject';
import { multicast } from './multicast';
export function publish(selector) {
    return selector ?
        multicast(function () { return new Subject(); }, selector) :
        multicast(new Subject());
}
//# sourceMappingURL=publish.js.map