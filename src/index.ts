import {setConfig} from './global-config';
import Fog, {IFogOptions} from './fog';

function init(options: IFogOptions | HTMLImageElement) {
  return new Fog(options);
}

export default {init, setConfig};
