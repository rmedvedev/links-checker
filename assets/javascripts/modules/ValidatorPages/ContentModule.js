export default class ValidatorPagesModule {

    constructor() {
        this._duplicatedPage = false;

    }

    handle(message) {
        switch (message.name) {
            case 'getPageInfo':
                chrome.runtime.sendMessage({
                    name: 'pageInfo',
                });
                break;
            case 'duplicatePage':
                this._duplicatedPage = message.status;
                if (this._duplicatedPage) {
                    window.addEventListener('click', this._clickListener);
                } else {
                    window.removeEventListener('click', this._clickListener);
                }
                break;
            case 'click':

                break;
        }
    }

    _clickListener(event) {
        chrome.runtime.sendMessage({
            name: 'click',
            coordinates: {
                x: event.screenX,
                y: event.screenY
            },
        });
    }
}