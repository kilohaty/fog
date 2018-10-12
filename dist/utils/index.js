var canvas;
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = resolve.bind(null, img);
        img.onerror = reject;
        img.src = src;
    });
}
function getSkeletonImageURL(fillStyle) {
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
    }
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, 1, 1);
    ctx.restore();
    return canvas.toDataURL();
}
export { loadImage, getSkeletonImageURL };
//# sourceMappingURL=index.js.map