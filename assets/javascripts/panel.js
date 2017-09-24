(function () {
    chrome.devtools.panels.create("OMTA",
        null,
        "panel.html",
        function (panel) {
            panel.onShown.addListener(function callback(window) {
                let linksDOM = window.document.getElementById('links');
                let checkedLinks = [];

                function checkLinks(links) {
                    //init
                    let detailsElements = linksDOM.getElementsByTagName('details');
                    if (detailsElements.length > 0) {
                        for (let i in detailsElements) {
                            linksDOM.removeChild(detailsElements[i]);
                        }
                    }

                    links.forEach(function (link) {
                        backgroundPageConnection.postMessage({
                            'name': 'checkLink',
                            'url': link.href,
                            'tabId': chrome.devtools.inspectedWindow.tabId,
                        });
                    });
                }

                function addLinkToPanel(url, status) {
                    if (checkedLinks[status] === undefined) {
                        checkedLinks[status] = [];
                    }

                    checkedLinks[status].push(url);

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

                let backgroundPageConnection = chrome.runtime.connect({
                    name: "panel"
                });

                backgroundPageConnection.postMessage({
                    name: 'init',
                    tabId: chrome.devtools.inspectedWindow.tabId
                });

                backgroundPageConnection.onMessage.addListener(function (message) {
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

                            // checkLinks(message.links);
                            break;
                        case 'checkedLink':
                            addLinkToPanel(message.url, message.status);
                            break;

                    }

                });

            })
        }
    );
})();




