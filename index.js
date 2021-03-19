const { parentPort } = require('worker_threads');

const MeteorBabel = require('meteor-babel');

const babel = {
    validateExtraFeatures: () => true,

    getDefaultOptions: (extraFeatures) => MeteorBabel.getDefaultOptions(extraFeatures),
    parse: (source) => MeteorBabel.parse(source),
    compile: (source, babelOptions = MeteorBabel.getDefaultOptions(), cacheOptions) => MeteorBabel.compile(
        source,
        babelOptions,
        cacheOptions,
    ),
    setCacheDir: (cacheDir) => MeteorBabel.setCacheDir(cacheDir),
    minify: (source, options = MeteorBabel.getMinifierOptions()) => MeteorBabel.minify(source, options),
    getMinifierOptions: (extraFeatures) => MeteorBabel.getMinifierOptions(extraFeatures),
    getMinimumModernBrowserVersions: () => require('meteor-babel/modern-versions.js').get(),
};

function compile ({ source, features, babelOptions, cacheOptions }) {
    const { code, map } = babel.compile(source,
        { ...babel.getDefaultOptions(features), ...babelOptions },
        cacheOptions);

    parentPort.postMessage({ code, map });
}

if (parentPort) {
    parentPort.on('message', compile);
    parentPort.postMessage('ready');
}

module.exports = { path: __filename };
