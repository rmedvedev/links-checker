(function () {
    let _tabId = chrome.devtools.inspectedWindow.tabId;
    let _panel;

    function init(window) {
        _panel.onShown.removeListener(init);
        let linksDOM = window.document.getElementById('links');

        function addLinkToPanel(url, status) {
            let detailsElement = window.document.getElementById('links' + status);
            if (detailsElement === null) {
                detailsElement = window.document.createElement('details');
                detailsElement.id = 'links' + status;
                let summaryElement = window.document.createElement('summary');
                summaryElement.innerHTML = status;
                detailsElement.appendChild(summaryElement);
                linksDOM.appendChild(detailsElement);
            }

            let linkElement = window.document.createElement('div');
            linkElement.innerHTML = url;
            detailsElement.appendChild(linkElement);
        }

        let backgroundConnection = new BackgroundConnection();

        backgroundConnection.postMessage({
            name: 'init',
            tabId: _tabId
        });

        window.document.getElementById('scan').addEventListener('click', function () {
            backgroundConnection.postMessage({
                name: 'checkLinks',
                tabId: _tabId
            });

            clearLinksBlock();
        });

        window.document.getElementById('stop').addEventListener('click', function () {
            backgroundConnection.postMessage({
                name: 'stopCheckLinks',
                tabId: _tabId
            });
        });

        window.document.getElementById('rescan').addEventListener('click', function () {
            backgroundConnection.postMessage({
                name: 'rescanTimeoutLinks',
                tabId: _tabId
            });
            linksDOM.removeChild(window.document.getElementById('links0'));
            linksDOM.removeChild(window.document.getElementById('links504'));
        });

        function clearLinksBlock() {
            //init
            let detailsElements = linksDOM.getElementsByTagName('details');
            if (detailsElements.length > 0) {
                for (let i in detailsElements) {
                    linksDOM.removeChild(detailsElements[i]);
                }
            }
        }

        backgroundConnection.addMessageListener(function (message) {
            switch (message.name) {
                case 'fromContent':
                    window.document.getElementById('links_count').innerHTML = message.links.length;
                    window.document.getElementById('title').innerHTML = message.pageInfo.title;
                    window.document.getElementById('host').innerHTML = message.pageInfo.host;
                    window.document.getElementById('path').innerHTML = message.pageInfo.path;
                    window.document.getElementById('query_string').innerHTML = message.pageInfo.query_string;
                    window.document.getElementById('https').innerHTML = message.pageInfo.https ? 'Yes' : 'No';
                    window.document.getElementById('cookies_count').innerHTML = message.cookies.length;
                    window.document.getElementById('cookies').innerHTML = '';
                    message.cookies.forEach(function (cookie) {
                        window.document.getElementById('cookies').innerHTML += '<div><strong>' + cookie.name + ':</strong> ' + cookie.value + '</div>';
                    });

                    window.document.getElementById('meta_tags').innerHTML = '';
                    message.metaTags.forEach(function (metaTag) {
                        window.document.getElementById('meta_tags').innerHTML += '<div>' + metaTag + '</div>';
                    });

                    clearLinksBlock();
                    break;
                case 'checkedLink':
                    addLinkToPanel(message.url, message.status);
                    break;

            }

        });
    }

    chrome.devtools.panels.create("OMTA",
        null,
        "panel.html",
        function (panel) {
            _panel = panel;
            panel.onShown.addListener(init);
        }
    );

})();

function BackgroundConnection() {
    let _connection = chrome.runtime.connect({
        name: "panel"
    });

    this.postMessage = function (message) {
        _connection.postMessage(message)
    };

    this.addMessageListener = function (callback) {
        _connection.onMessage.addListener(callback);
    }
}
