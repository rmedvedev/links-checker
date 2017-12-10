import LinksChecker from './classes/LinksChecker.js';
import './content.css';

export default class ContentModule {

    constructor() {
        this.linksChecker = new LinksChecker();
        this.linksChecker.init();
    }

    handle(message) {
        switch (message.name) {
            case 'init':
                chrome.runtime.sendMessage({
                    name: 'linksCount',
                    count: this.linksChecker.getLinks().length,
                });
                break;
            case 'checkLinks':
                this.linksChecker.checkLinks(true);
                console.log('Start checking links.');
                break;
            case 'checkingLinksCallback':
                this.linksChecker.checkLinksCallback(message);
                break;
            case 'stopCheckLinks':
                this.linksChecker.stopCheckLinks();
                break;
            case 'rescanTimeoutLinks':
                this.linksChecker.rescanTimeoutLinks();
                break;
        }
    };
}