import {config as conf} from './global-config';
import {getSkeletonImageURL, loadImage} from './utils';

const emptyImgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

export interface IFogOptions {
  el: HTMLImageElement;
  onFail?: Function; // full img fail
  onSuccess?: Function; // full img success
  onComplete?: Function; // full img complete (fail or success)
}

function noop() {
  return false;
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
  private elDiv: HTMLDivElement;
  private elCanvas: HTMLCanvasElement;
  private miniImgRetryCount: number = 0;
  private fullImgRetryCount: number = 0;
  private miniImgLoaded: boolean = false;
  private fullImgLoaded: boolean = false;
  private hasLoadErrImg: boolean = false;

  constructor(options: IFogOptions | HTMLImageElement) {
    if (options instanceof HTMLElement) {
      options = {el: options};
    }
    this.el = options.el;
    this.width = +this.el.getAttribute('data-width') || conf.width;
    this.height = +this.el.getAttribute('data-height') || conf.height;
    this.fullImgUrl = this.el.getAttribute('data-src');
    this.miniImgUrl = this.getMiniImgUrl();
    this.onFail = options.onFail || noop;
    this.onSuccess = options.onSuccess || noop;
    this.onComplete = options.onComplete || noop;

    this.prepareDOM();
    this.loadMiniImg();
    this.loadFullImg();
  }

  private getMiniImgUrl(): string {
    let url = this.el.getAttribute('data-src-mini');
    if (!url && conf.miniImgRule) {
      const src = this.el.getAttribute('data-src');
      url = conf.miniImgRule(src);
    }
    return url;
  }

  private createDiv(): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.setAttribute('class', 'fog-wrapper');
    div.style.cssText = `
      display: ${conf.display}; 
      position: relative;
      width: ${this.width};
      height: ${this.height};
      font-size: 0;`;
    return div;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.cssText = `
      position: absolute; 
      z-index: 1;
      left: 0;
      top:0;
      opacity: 0;
      transition: opacity linear ${conf.transitionDuration}s;`;
    return canvas;
  }

  private isFullImgFail() {
    return !this.fullImgLoaded && this.fullImgRetryCount >= conf.retryTimes;
  }

  private isMiniImgFail() {
    return !this.miniImgLoaded && this.miniImgRetryCount >= conf.retryTimes;
  }

  private prepareDOM() {
    if (conf.backgroundColor) {
      this.el.src = getSkeletonImageURL(conf.backgroundColor);
    } else {
      this.el.src = emptyImgUrl;
    }
    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';

    this.elDiv = this.createDiv();
    this.elCanvas = this.createCanvas();
    if (this.el.nextElementSibling) {
      this.el.parentNode.insertBefore(this.elDiv, this.el.nextElementSibling)
    } else {
      this.el.parentNode.appendChild(this.elDiv)
    }

    this.elDiv.appendChild(this.el);
    this.elDiv.appendChild(this.elCanvas);
  }

  private onMiniImgLoad(img) {
    this.miniImgLoaded = true;

    if (this.fullImgLoaded) {
      return;
    }

    const ctx = this.elCanvas.getContext('2d');
    ctx.save();
    const radio = this.width / img.width;
    ctx.scale(radio, radio);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    this.elCanvas.style.opacity = '1';
  }

  private loadMiniImg() {
    if (!this.miniImgUrl) {
      return;
    }
    loadImage(this.miniImgUrl)
      .then(this.onMiniImgLoad.bind(this))
      .catch(err => {
        console.error(err);
        if (this.isMiniImgFail() && this.isFullImgFail()) {
          this.loadErrorImg();
        } else {
          setTimeout(() => {
            // retry util full img loaded success
            if (this.miniImgRetryCount < conf.retryTimes && !this.fullImgLoaded) {
              this.miniImgRetryCount++;
              this.loadMiniImg();
            }
          }, conf.retryDuration);
        }
      });
  }

  private onFullImgLoad() {
    this.el.src = this.fullImgUrl;
    this.elCanvas.style.opacity = '0';
    this.el.setAttribute('data-fog-status', 'success');
    this.fullImgLoaded = true;
    this.onSuccess();
    this.onComplete();
  }

  private loadFullImg() {
    if (!this.fullImgUrl) {
      throw Error('full img url is not found!');
    }
    loadImage(this.fullImgUrl)
      .then(this.onFullImgLoad.bind(this))
      .catch(err => {
        console.error(err);
        if (this.fullImgRetryCount < conf.retryTimes) {
          this.fullImgRetryCount++;
          setTimeout(() => {
            this.loadFullImg();
          }, conf.retryDuration);
        } else {
          this.onFail();
          this.onComplete();
          if (this.isMiniImgFail()) {
            // load error img when mini and full img were all failed
            this.loadErrorImg();
          }
        }
      });
  }

  private loadErrorImg() {
    if (!conf.errorImage || this.hasLoadErrImg) {
      return;
    }
    this.hasLoadErrImg = true;
    loadImage(conf.errorImage)
      .then(() => {
        this.el.src = conf.errorImage;
        this.elCanvas.style.opacity = '0';
      })
      .catch(console.error);
  }
}
