import LinksChecker from './classes/LinksChecker.js';

export default class BackgroundModule {

    constructor() {
        this.enableSession = false;
        this.sessionLinks = [];
        this.linksChecker = new LinksChecker();
    }

    handlePanelMessage(message, connections) {
        switch (message.name) {
            case 'checkLinks':
            case 'stopCheckLinks':
            case 'rescanTimeoutLinks':
                chrome.tabs.sendMessage(message.tabId, {name: message.name});
                break;
            case 'startSession':
                this.enableSession = true;
                break;
            case 'stopSession':
                this.enableSession = false;
                this.sessionLinks = [];
                break;
            case 'getCommonInfo':
                connections[message.tabId].postMessage({
                    name: 'getCommonInfo',
                    data: {
                        sessionLinksCount: Object.keys(this.sessionLinks).length,
                        enableSession: this.enableSession,
                    },
                });
                break;
        }
    }

    handleContentMessage(message, sender, connections) {
        let $this = this;
        switch (message.name) {
            case 'linksCount':
                connections[sender.tab.id].postMessage(message);
                break;
            case 'checkLink':
                let resultLink = $this.sessionLinks[message.link];
                if ($this.enableSession && resultLink &&
                    resultLink.httpStatus >= 200 &&
                    resultLink.httpStatus < 400) {
                    resultCallback(resultLink.requestTime,
                        resultLink.httpStatus);
                } else {
                    $this.linksChecker.checkOne(message.link,
                        function(httpStatus, requestTime) {
                            if ($this.enableSession) {
                                $this.sessionLinks[message.link] = {
                                    requestTime: requestTime,
                                    httpStatus: httpStatus,
                                };
                            }

                            resultCallback(requestTime, httpStatus);
                        });
                }

                break;
        }

        function resultCallback(requestTime, httpStatus) {
            chrome.tabs.sendMessage(sender.tab.id, {
                name: 'checkingLinksCallback',
                status: httpStatus,
                requestTime: requestTime,
                index: message.index,
            });

            connections[sender.tab.id].postMessage({
                name: 'checkedLink',
                url: message.link,
                requestTime: requestTime,
                status: httpStatus,
            });
        }

    }

}