export default class PageInfoModule {

    handleContentMessage(message, sender, connections) {
        switch (message.name) {
            case 'pageInfo':
                if (sender.tab) {
                    let tabId = sender.tab.id;
                    if (tabId in connections) {
                        chrome.cookies.getAll({url: message.pageInfo.url},
                            function(cookies) {
                                message.cookies = cookies;
                                connections[tabId].postMessage(message);
                            });
                    } else {
                        console.log('Tab not found in connection list.');
                    }
                } else {
                    console.log('sender.tab not defined.');
                }
                break;
        }
    }
}