const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    css: {
        requireModuleExtension: false
    },
    runtimeCompiler: true,
    transpileDependencies: true,
    chainWebpack: config => {
        config.plugin('polyfills').use(NodePolyfillPlugin)
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },
    }
}