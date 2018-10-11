export var config = {
    display: 'inline-block',
    width: 1,
    height: 1,
    transitionDuration: 1,
    retryTimes: 2,
    retryDuration: 3000
};
export function setConfig(options) {
    Object.assign(config, options);
}
//# sourceMappingURL=global-config.js.map