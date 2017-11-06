import PageInfoProvider from './classes/PageInfoProvider';

export default class PageInfoModule {

    constructor() {
        this.pageInfoProvider = new PageInfoProvider();
    }

    handle(message) {
        switch (message.name) {
            case 'getPageInfo':
                chrome.runtime.sendMessage({
                    name: 'pageInfo',
                    pageInfo: this.pageInfoProvider.getInfo(),
                    cookies: this.pageInfoProvider.getCookies(),
                    metaTags: this.pageInfoProvider.getMetaTags(),
                });
                break;
        }
    }
}