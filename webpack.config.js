const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        panel: [
            './assets/javascripts/panel.js'
        ],
        devtools: [
            './assets/javascripts/devtools.js'
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
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitError: true,
                    fix: true
                }
            },
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
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',             // bootstrap 3.x requires
            jQuery: 'jquery',             // bootstrap 3.x requires
        }),
        new ExtractTextPlugin("[name].css")
    ],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};
