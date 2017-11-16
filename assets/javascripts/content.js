import {default as LinksCheckerModule} from './modules/LinksChecker/ContentModule.js'
import {default as PageInfoModule} from './modules/PageInfo/ContentModule'

(function () {
    let linksCheckerModule = new LinksCheckerModule();
    let pageInfoModule = new PageInfoModule();

    chrome.runtime.onMessage.addListener(function (message) {
        linksCheckerModule.handle(message);
        pageInfoModule.handle(message);
    });

    pageInfoModule.handle({name: 'init'});
})();
