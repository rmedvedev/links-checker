import {default as LinksCheckerModule} from './modules/LinksChecker/ContentModule.js'
import {default as PageInfoModule} from './modules/PageInfo/ContentModule'

(function () {
    let linksCheckerModule = new LinksCheckerModule();
    let pageInfoModule = new PageInfoModule();

    let init = function () {
        pageInfoModule.handle({name: 'getPageInfo'});
    };

    chrome.runtime.onMessage.addListener(function (message) {
        switch (message.name) {
            case 'init':
                init();
                break;
        }
        linksCheckerModule.handle(message);
        pageInfoModule.handle(message);
    });

    //when script load - send info to background
    init();
})();
