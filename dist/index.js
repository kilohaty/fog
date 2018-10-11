import { setConfig } from './global-config';
import Fog from './fog';
function init(options) {
    return new Fog(options);
}
export default { init: init, setConfig: setConfig };
//# sourceMappingURL=index.js.map