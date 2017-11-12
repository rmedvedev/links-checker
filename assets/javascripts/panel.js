import {default as LinksCheckerModule} from './modules/LinksChecker/PanelModule.jsx';

(function() {

    let _tabId = chrome.devtools.inspectedWindow.tabId;
    let _panel;

    function init(window) {
        _panel.onShown.removeListener(init);

        let backgroundConnection = new BackgroundConnection();

        let linksCheckerModule = new LinksCheckerModule(backgroundConnection,
            chrome.devtools.inspectedWindow.tabId,
            window.document.getElementById('links_checker_module'));
        linksCheckerModule.render();

        backgroundConnection.postMessage({
            name: 'init',
            tabId: _tabId,
        });

        backgroundConnection.addMessageListener(function(message) {
            linksCheckerModule.handleMessage(message);
            switch (message.name) {
                case 'fromContent':
                    // window.document.getElementById('links_count').innerHTML = message.links.length;
                    window.document.getElementById(
                        'title').innerHTML = message.pageInfo.title;
                    window.document.getElementById(
                        'host').innerHTML = message.pageInfo.host;
                    window.document.getElementById(
                        'path').innerHTML = message.pageInfo.path;
                    window.document.getElementById(
                        'query_string').innerHTML = message.pageInfo.query_string;
                    window.document.getElementById(
                        'https').innerHTML = message.pageInfo.https ?
                        'Yes' :
                        'No';
                    // window.document.getElementById('cookies_count').innerHTML = message.cookies.length;
                    window.document.getElementById('cookies').innerHTML = '';
                    message.cookies.forEach(function(cookie) {
                        window.document.getElementById(
                            'cookies').innerHTML += '<div><strong>' +
                            cookie.name + ':</strong> ' + cookie.value +
                            '</div>';
                    });

                    window.document.getElementById('meta_tags').innerHTML = '';
                    message.metaTags.forEach(function(metaTag) {
                        window.document.getElementById(
                            'meta_tags').innerHTML += '<div>' + metaTag +
                            '</div>';
                    });
                    break;

            }
        });
    }

    chrome.devtools.panels.create('OMTA',
        null,
        'panel.html',
        function(panel) {
            _panel = panel;
            panel.onShown.addListener(init);
        },
    );

})();

function BackgroundConnection() {
    let _connection = chrome.runtime.connect({
        name: 'panel',
    });

    this.postMessage = function(message) {
        _connection.postMessage(message);
    };

    this.addMessageListener = function(callback) {
        _connection.onMessage.addListener(callback);
    };
}
