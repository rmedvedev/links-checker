export default class ValidatorPagesModule {

    constructor() {
        this._duplicatedPage = false;
        chrome.runtime.sendMessage({
            name: 'getDuplicatePage',
        });
    }

    handle(message) {
        switch (message.name) {
            case 'getPageInfo':
                chrome.runtime.sendMessage({
                    name: 'pageInfo',
                });
                break;
            case 'duplicate_page':
                this._duplicatedPage = message.status;
                if (this._duplicatedPage) {
                    window.addEventListener('click', this._clickListener);
                    window.addEventListener('wheel', this._scrollListener);
                } else {
                    window.removeEventListener('click', this._clickListener);
                    window.removeEventListener('wheel', this._scrollListener);
                }
                break;
            case 'click':
                console.log('to', message);
                let element = document.elementFromPoint(message.coordinates.x, message.coordinates.y);
                element.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                break;
            case 'scroll':
                console.log('toScroll', message);
                window.dispatchEvent(new WheelEvent('wheel', {bubbles: true, deltaX: message.deltaX, deltaY: message.deltaY}));
                break;

        }
    }

    _clickListener(event) {
        if (!event.isTrusted) {
            return;
        }

        chrome.runtime.sendMessage({
            name: 'click',
            coordinates: {
                x: event.clientX,
                y: event.clientY
            },
        });
    }

    _scrollListener(event){
        console.log(event);

        if (!event.isTrusted) {
            return;
        }

        chrome.runtime.sendMessage({
            name: 'scroll',
            deltaX: event.deltaX,
            deltaY: event.deltaY
        });
    }
}
