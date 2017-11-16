import {default as LinksCheckerModule} from './modules/LinksChecker/BackgroundModule.js';
import {default as PageInfoModule} from './modules/PageInfo/BackgroundModule.js';

let linksCheckerModule = new LinksCheckerModule();
let pageInfoModule = new PageInfoModule();

(function() {
    let connections = {};
    chrome.runtime.onConnect.addListener(function(port) {
        let extensionListener = function(message, sender, sendResponse) {
            linksCheckerModule.handlePanelMessage(message, connections);

            switch (message.name) {
                case 'init':
                    connections[message.tabId] = port;
                    chrome.tabs.sendMessage(message.tabId, {name: 'init'});
                    break;
            }
        };

        port.onMessage.addListener(extensionListener);

        port.onDisconnect.addListener(function(port) {
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

    chrome.runtime.onMessage.addListener(
        function(message, sender) {

            linksCheckerModule.handleContentMessage(message, sender,
                connections);
            pageInfoModule.handleContentMessage(message, sender,
                connections);

            return true;
        });
})();
