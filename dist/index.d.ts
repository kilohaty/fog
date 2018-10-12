import { setConfig } from './global-config';
import Fog, { IFogOptions } from './fog';
declare function init(options: IFogOptions | HTMLImageElement): Fog;
declare const _default: {
    init: typeof init;
    setConfig: typeof setConfig;
};
export default _default;
