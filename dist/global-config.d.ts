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
export declare const config: IConfig;
export declare function setConfig(options: IConfig): void;
