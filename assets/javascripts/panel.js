chrome.devtools.panels.create("OMTA",
    null,
    "panel.html",
    function (panel) {
        panel.onShown.addListener(function callback(window) {
            var backgroundPageConnection = chrome.runtime.connect({
                name: "panel"
            });

            backgroundPageConnection.postMessage({
                name: 'init',
                tabId: chrome.devtools.inspectedWindow.tabId
            });

            backgroundPageConnection.onMessage.addListener(function (message) {
                window.document.getElementById('links').innerHTML = message.links.length;
                window.document.getElementById('title').innerHTML = message.title;
                window.document.getElementById('host').innerHTML = message.host;
                window.document.getElementById('path').innerHTML = message.path;
                window.document.getElementById('https').innerHTML = message.https ? 'Yes' : 'No';
            });
        })
    }
);

