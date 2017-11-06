const path = require('path');

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
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};