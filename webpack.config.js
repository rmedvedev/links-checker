const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        panel: [
            './assets/javascripts/panel.js'
        ],
        background: [
            './assets/javascripts/background.js',
        ],
        content: [
            "./assets/javascripts/content.js"
        ],
        options: [
            "./assets/javascripts/options.js"
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'extension/dist')
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',             // bootstrap 3.x requires
        }),
        new ExtractTextPlugin("[name].css")
    ]
};
