export interface IConfig {
  display?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  transitionDuration?: number;
  retryTimes?: number;
  retryDuration?: number;
  miniImgRule?: Function;
  errorImage?: string;
}

export const config: IConfig = {
  display: 'inline-block',
  width: 1,
  height: 1,
  transitionDuration: 1,
  retryTimes: 2,
  retryDuration: 3000
};

export function setConfig(options: IConfig) {
  Object.assign(config, options);
}
