const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        vendor: ['vue', 'vue-router']
    },
    output: {
        path: path.join(__dirname, './static'),
        filename: 'dll.[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'static', '[name]-manifest.json'),
            name: '[name]',         // 此处的名字的值必须要和output中library的值相等
        })
    ]
}