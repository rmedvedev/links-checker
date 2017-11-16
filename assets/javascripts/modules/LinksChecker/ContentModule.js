import LinksChecker from './classes/LinksChecker.js';

export default class ContentModule {

    constructor() {
        this.linksChecker = new LinksChecker();
        this.linksChecker.init();
    }

    getLinks(){
        this.linksChecker.getLinks();
    }

    handle(message) {
        switch (message.name) {
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