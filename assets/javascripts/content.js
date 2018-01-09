import {default as LinksCheckerModule} from './modules/LinksChecker/ContentModule.js'
import {default as PageInfoModule} from './modules/PageInfo/ContentModule'
import {default as ValidatorPagesModule} from './modules/ValidatorPages/ContentModule'

(function () {
    let linksCheckerModule = new LinksCheckerModule();
    let pageInfoModule = new PageInfoModule();
    let validatorPageModule = new ValidatorPagesModule();

    chrome.runtime.onMessage.addListener(function (message) {
        linksCheckerModule.handle(message);
        pageInfoModule.handle(message);
        validatorPageModule.handle(message);
    });

    pageInfoModule.handle({name: 'init'});
})();
