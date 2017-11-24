import {default as LinksCheckerModule} from './modules/LinksChecker/PanelModule.jsx';
import {default as PageInfoModule} from './modules/PageInfo/PanelModule.jsx';
import './common/bootstrap/bootstrap.js'
import './common/bootstrap/bootstrap.less'

(function() {

    let _tabId = chrome.devtools.inspectedWindow.tabId;
    let _panel;

    function init(window) {
        _panel.onShown.removeListener(init);

        let backgroundConnection = new BackgroundConnection();

        backgroundConnection.postMessage({
            name: 'init',
            tabId: _tabId,
        });

        let pageInfoModule = new PageInfoModule(backgroundConnection,
            chrome.devtools.inspectedWindow.tabId,
            window.document.getElementById('page_info_module'));
        pageInfoModule.render();

        let linksCheckerModule = new LinksCheckerModule(backgroundConnection,
            chrome.devtools.inspectedWindow.tabId,
            window.document.getElementById('links_checker_module'));
        linksCheckerModule.render();


        backgroundConnection.addMessageListener(function(message) {
            linksCheckerModule.handleMessage(message);
            pageInfoModule.handleMessage(message);
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
