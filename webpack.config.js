const path = require('path');

module.exports = {
    entry: {
        panel: [
            './assets/javascripts/panel.js'
        ],
        background: [
            './assets/javascripts/common/optionsHelper.js',
            './assets/javascripts/check.js',
            './assets/javascripts/background.js',
        ],
        content: [
            "./assets/javascripts/common/optionsHelper.js",
            "./assets/javascripts/content/links.js",
            "./assets/javascripts/content/pageHelper.js",
            "./assets/javascripts/content.js"
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};