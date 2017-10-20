(function () {
    let connections = {};
    let linksChecker = new LinksChecker();

    chrome.runtime.onConnect.addListener(function (port) {
        let extensionListener = function (message, sender, sendResponse) {
            switch (message.name) {
                case 'init':
                    connections[message.tabId] = port;
                    chrome.tabs.sendMessage(message.tabId, {name: 'init'});
                    break;
                case 'checkLinks':
                    chrome.tabs.sendMessage(message.tabId, {name: 'checkLinks'});
                    break;
                case 'stopCheckLinks':
                    chrome.tabs.sendMessage(message.tabId, {name: 'stopCheckLinks'});
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
                linksChecker.checkOne(message.link, function (httpStatus, requestTime) {
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
                });
                break;
        }

        return true;
    });
})();
