(function () {
    let _tabId = chrome.devtools.inspectedWindow.tabId;
    let _panel;

    let all_links_count = 0;
    let links = {
        success: 0,
        warning: 0,
        error: 0,
    };

    function init(window) {
        setInterval(getSessionLinksCount, 1000);

        _panel.onShown.removeListener(init);
        let linksDOM = window.document.getElementById('links');

        function addLink(url, status) {
            if (status >= 200 && status < 300) {
                links.success++;
            } else if (status < 400 && status !== 0) {
                links.warning++;
            } else {
                links.error++;
            }

            renderLinksProgressBar();
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

        function renderLinksProgressBar() {
            let percentSuccess = Math.round(links.success / all_links_count * 100) + '%';
            let percentWarning = Math.round(links.warning / all_links_count * 100) + '%';
            let percentError = Math.round(links.error / all_links_count * 100) + '%';

            window.document.getElementById('links_checker_progressbar_success').style.width = percentSuccess;
            window.document.getElementById('links_checker_progressbar_success').innerHTML = percentSuccess;

            window.document.getElementById('links_checker_progressbar_warning').style.width = percentWarning;
            window.document.getElementById('links_checker_progressbar_warning').innerHTML = percentWarning;

            window.document.getElementById('links_checker_progressbar_danger').style.width = percentError;
            window.document.getElementById('links_checker_progressbar_danger').innerHTML = percentError;
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

            links = {
                success: 0,
                warning: 0,
                error: 0,
            };
            renderLinksProgressBar();
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

        window.document.getElementById('start_session').addEventListener('click', function () {
            backgroundConnection.postMessage({
                name: 'startSession',
                tabId: _tabId
            });
        });

        window.document.getElementById('stop_session').addEventListener('click', function () {
            backgroundConnection.postMessage({
                name: 'stopSession',
                tabId: _tabId
            });
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

        function getSessionLinksCount() {
            backgroundConnection.postMessage({
                name: 'getSessionLinksCount',
                tabId: _tabId
            });
        }

        backgroundConnection.addMessageListener(function (message) {
            switch (message.name) {
                case 'fromContent':
                    // all_links_count = message.links.length;
                    // window.document.getElementById('links_count').innerHTML = message.links.length;
                    window.document.getElementById('title').innerHTML = message.pageInfo.title;
                    window.document.getElementById('host').innerHTML = message.pageInfo.host;
                    window.document.getElementById('path').innerHTML = message.pageInfo.path;
                    window.document.getElementById('query_string').innerHTML = message.pageInfo.query_string;
                    window.document.getElementById('https').innerHTML = message.pageInfo.https ? 'Yes' : 'No';
                    // window.document.getElementById('cookies_count').innerHTML = message.cookies.length;
                    window.document.getElementById('cookies').innerHTML = '';
                    message.cookies.forEach(function (cookie) {
                        window.document.getElementById('cookies').innerHTML += '<div><strong>' + cookie.name + ':</strong> ' + cookie.value + '</div>';
                    });

                    window.document.getElementById('meta_tags').innerHTML = '';
                    message.metaTags.forEach(function (metaTag) {
                        window.document.getElementById('meta_tags').innerHTML += '<div>' + metaTag + '</div>';
                    });

                    links = {
                        success: 0,
                        warning: 0,
                        error: 0,
                    };
                    renderLinksProgressBar();
                    clearLinksBlock();
                    break;
                case 'checkedLink':
                    addLink(message.url, message.status);
                    break;
                case 'getSessionLinksCount':
                    window.document.getElementById('session_saved_links_count').innerHTML = message.count;
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
