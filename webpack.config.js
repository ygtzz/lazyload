var webpack = require('webpack');
var path = require('path');
var libraryName = 'lazyload';

var config = {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: libraryName + '.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|test)/,
                query: {
                    presets: ['es2015']
                }
             }
        ]
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        })
    ],
    resolve: {
        extensions: ['.js']
    }
}

module.exports = config;