export default class OptionsHelper {
    constructor() {
        this.LINKS_CHECKER_BLACK_LIST = 'links_checker_black_list';
        this.LINKS_CHECKER_TIMEOUT = 'links_checker_timeout';

        this.defaultOptions = {};
        this.defaultOptions[this.LINKS_CHECKER_BLACK_LIST] = [];
        this.defaultOptions[this.LINKS_CHECKER_TIMEOUT] = 30 * 1000;
    }

    getAll() {
        let $this = this;
        return new Promise(function(resolve) {
            chrome.storage.sync.get($this.defaultOptions, resolve);
        });
    }

    setAll(options) {
        return new Promise(function(resolve) {
            chrome.storage.sync.set(options, resolve);
        });
    }
}