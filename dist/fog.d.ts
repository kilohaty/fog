export interface IFogOptions {
    el: HTMLImageElement;
    onFail?: Function;
    onSuccess?: Function;
    onComplete?: Function;
}
export default class Fog {
    readonly el: HTMLImageElement;
    readonly width: number;
    readonly height: number;
    readonly miniImgUrl: string;
    readonly fullImgUrl: string;
    readonly onFail: Function;
    readonly onSuccess: Function;
    readonly onComplete: Function;
    private elDiv;
    private elCanvas;
    private miniImgRetryCount;
    private fullImgRetryCount;
    private miniImgLoaded;
    private fullImgLoaded;
    private hasLoadErrImg;
    constructor(options: IFogOptions | HTMLImageElement);
    private getMiniImgUrl;
    private createDiv;
    private createCanvas;
    private isFullImgFail;
    private isMiniImgFail;
    private prepareDOM;
    private onMiniImgLoad;
    private loadMiniImg;
    private onFullImgLoad;
    private loadFullImg;
    private loadErrorImg;
}
