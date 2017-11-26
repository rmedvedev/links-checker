export default class ValidatorPagesModule {

    constructor() {
    }

    handle(message) {
        switch (message.name) {
            case 'getPageInfo':
                chrome.runtime.sendMessage({
                    name: 'pageInfo',
                });
                break;
        }
    }
}