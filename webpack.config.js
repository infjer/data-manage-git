const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        git: './index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'umd',
        library: 'Git',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'index.html'
        }),
        new cleanWebpackPlugin(),
    ]
}
