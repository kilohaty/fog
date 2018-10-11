import {setConfig} from './global-config';
import Fog, {IFogOptions} from './fog';

function init(options: IFogOptions) {
  return new Fog(options);
}

export default {init, setConfig};
