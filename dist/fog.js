import { config as conf } from './global-config';
import { getSkeletonImageURL, loadImage } from './utils';
var emptyImgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
function noop() {
    return false;
}
var Fog = /** @class */ (function () {
    function Fog(options) {
        this.miniImgRetryCount = 0;
        this.fullImgRetryCount = 0;
        this.miniImgLoaded = false;
        this.fullImgLoaded = false;
        this.hasLoadErrImg = false;
        if (options instanceof HTMLElement) {
            options = { el: options };
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
    Fog.prototype.getMiniImgUrl = function () {
        var url = this.el.getAttribute('data-src-mini');
        if (!url && conf.miniImgRule) {
            var src = this.el.getAttribute('data-src');
            url = conf.miniImgRule(src);
        }
        return url;
    };
    Fog.prototype.createDiv = function () {
        var div = document.createElement('div');
        div.setAttribute('class', 'fog-wrapper');
        div.style.cssText = "\n      display: " + conf.display + "; \n      position: relative;\n      width: " + this.width + ";\n      height: " + this.height + ";\n      font-size: 0;";
        return div;
    };
    Fog.prototype.createCanvas = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.cssText = "\n      position: absolute; \n      z-index: 1;\n      left: 0;\n      top:0;\n      opacity: 0;\n      transition: opacity linear " + conf.transitionDuration + "s;";
        return canvas;
    };
    Fog.prototype.isFullImgFail = function () {
        return !this.fullImgLoaded && this.fullImgRetryCount >= conf.retryTimes;
    };
    Fog.prototype.isMiniImgFail = function () {
        return !this.miniImgLoaded && this.miniImgRetryCount >= conf.retryTimes;
    };
    Fog.prototype.prepareDOM = function () {
        if (conf.backgroundColor) {
            this.el.src = getSkeletonImageURL(conf.backgroundColor);
        }
        else {
            this.el.src = emptyImgUrl;
        }
        this.el.style.width = this.width + 'px';
        this.el.style.height = this.height + 'px';
        this.elDiv = this.createDiv();
        this.elCanvas = this.createCanvas();
        if (this.el.nextElementSibling) {
            this.el.parentNode.insertBefore(this.elDiv, this.el.nextElementSibling);
        }
        else {
            this.el.parentNode.appendChild(this.elDiv);
        }
        this.elDiv.appendChild(this.el);
        this.elDiv.appendChild(this.elCanvas);
    };
    Fog.prototype.onMiniImgLoad = function (img) {
        this.miniImgLoaded = true;
        if (this.fullImgLoaded) {
            return;
        }
        var ctx = this.elCanvas.getContext('2d');
        ctx.save();
        var radio = this.width / img.width;
        ctx.scale(radio, radio);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        this.elCanvas.style.opacity = '1';
    };
    Fog.prototype.loadMiniImg = function () {
        var _this = this;
        if (!this.miniImgUrl) {
            return;
        }
        loadImage(this.miniImgUrl)
            .then(this.onMiniImgLoad.bind(this))
            .catch(function (err) {
            console.error(err);
            if (_this.isMiniImgFail() && _this.isFullImgFail()) {
                _this.loadErrorImg();
            }
            else {
                setTimeout(function () {
                    // retry util full img loaded success
                    if (_this.miniImgRetryCount < conf.retryTimes && !_this.fullImgLoaded) {
                        _this.miniImgRetryCount++;
                        _this.loadMiniImg();
                    }
                }, conf.retryDuration);
            }
        });
    };
    Fog.prototype.onFullImgLoad = function () {
        this.el.src = this.fullImgUrl;
        this.elCanvas.style.opacity = '0';
        this.el.setAttribute('data-fog-status', 'success');
        this.fullImgLoaded = true;
        this.onSuccess();
        this.onComplete();
    };
    Fog.prototype.loadFullImg = function () {
        var _this = this;
        if (!this.fullImgUrl) {
            throw Error('full img url is not found!');
        }
        loadImage(this.fullImgUrl)
            .then(this.onFullImgLoad.bind(this))
            .catch(function (err) {
            console.error(err);
            if (_this.fullImgRetryCount < conf.retryTimes) {
                _this.fullImgRetryCount++;
                setTimeout(function () {
                    _this.loadFullImg();
                }, conf.retryDuration);
            }
            else {
                _this.onFail();
                _this.onComplete();
                if (_this.isMiniImgFail()) {
                    // load error img when mini and full img were all failed
                    _this.loadErrorImg();
                }
            }
        });
    };
    Fog.prototype.loadErrorImg = function () {
        var _this = this;
        if (!conf.errorImage || this.hasLoadErrImg) {
            return;
        }
        this.hasLoadErrImg = true;
        loadImage(conf.errorImage)
            .then(function () {
            _this.el.src = conf.errorImage;
            _this.elCanvas.style.opacity = '0';
        })
            .catch(console.error);
    };
    return Fog;
}());
export default Fog;
//# sourceMappingURL=fog.js.map