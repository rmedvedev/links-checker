(function () {
    let connections = {};

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
                LinksChecker.checkOne(message.link, function (http_status) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        name: 'checkingLinksCallback',
                        status: http_status,
                        index: message.index
                    });
                });
                break;
        }

        return true;
    });
})();
