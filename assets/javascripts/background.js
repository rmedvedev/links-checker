(function () {
    let connections = {};
    let linksChecker = new LinksChecker();

    let enableSession = false;
    let sessionLinks = [];

    chrome.runtime.onConnect.addListener(function (port) {
        let extensionListener = function (message, sender, sendResponse) {
            switch (message.name) {
                case 'init':
                    connections[message.tabId] = port;
                    chrome.tabs.sendMessage(message.tabId, {name: 'init'});
                    break;
                case 'checkLinks':
                case 'stopCheckLinks':
                case 'rescanTimeoutLinks':
                    chrome.tabs.sendMessage(message.tabId, {name: message.name});
                    break;
                case 'startSession':
                    enableSession = true;
                    break;
                case 'stopSession':
                    enableSession = false;
                    sessionLinks = [];
                    break;
                case 'getSessionLinksCount':
                    connections[message.tabId].postMessage({
                        name: 'getSessionLinksCount',
                        count: Object.keys(sessionLinks).length,
                    });
                    break;

            }
        };

        port.onMessage.addListener(extensionListener);

        port.onDisconnect.addListener(function (port) {
            port.onMessage.removeListener(extensionListener);

            let tabs = Object.keys(connections);
            for (let i = 0, len = tabs.length; i < len; i++) {
                if (connections[tabs[i]] === port) {
                    delete connections[tabs[i]];
                    break;
                }
            }
        });
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        switch (message.name) {
            case 'pageInfo':
                if (sender.tab) {
                    let tabId = sender.tab.id;
                    if (tabId in connections) {
                        message.name = 'fromContent';
                        chrome.cookies.getAll({url: message.pageInfo.url}, function (cookies) {
                            message.cookies = cookies;
                            connections[tabId].postMessage(message);
                        });
                    } else {
                        console.log("Tab not found in connection list.");
                    }
                } else {
                    console.log("sender.tab not defined.");
                }
                break;
            case 'checkLink':
                let resultLink = sessionLinks[message.link];
                if (enableSession && resultLink && resultLink.httpStatus >= 200 && resultLink.httpStatus < 400) {
                    resultCallback(resultLink.requestTime, resultLink.httpStatus);
                } else {
                    linksChecker.checkOne(message.link, function (httpStatus, requestTime) {
                        if (enableSession) {
                            sessionLinks[message.link] = {requestTime: requestTime, httpStatus: httpStatus};
                        }

                        resultCallback(requestTime, httpStatus);
                    });
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

                break;
        }

        return true;
    });
})();
