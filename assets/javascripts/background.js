let connections = {};

chrome.runtime.onConnect.addListener(function (port) {
    let extensionListener = function (message, sender, sendResponse) {
        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name === "init") {
            connections[message.tabId] = port;
            chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
                //     Send message to content script
                if (tabs) {
                    chrome.tabs.executeScript(tabs[0].id, {file: "assets/javascripts/content.js"});
                }
            });
        }

        if (message.name === 'checkLink') {
            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                    connections[message.tabId].postMessage({
                        name: 'checkedLink',
                        url: message.url,
                        status: xhr.status,
                    });
                    xhr.abort();
                }
            };
            xhr.open('GET', message.url);
            xhr.send();
        }
    };

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener);

        let tabs = Object.keys(connections);
        for (let i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] === port) {
                delete connections[tabs[i]]
                break;
            }
        }
    });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
        let tabId = sender.tab.id;
        if (tabId in connections) {
            request.name = 'fromContent';
            chrome.cookies.getAll({url: request.pageInfo.url}, function (cookies) {
                request.cookies = cookies;
                connections[tabId].postMessage(request);
            });
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
    return true;
});