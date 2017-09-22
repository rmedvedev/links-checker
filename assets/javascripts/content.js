function getLinks() {
    var links = document.querySelectorAll("a");
    var results = [];
    var seenLinks = {};
    for (var i = 0; i < links.length; ++i) {
        var text = links[i].textContent;
        if (text.length > 100)
            text = text.substring(0, 100) + "...";
        var link = links[i].href.replace(/(.*)#?/, "$1");
        if (seenLinks[link])
            continue;
        seenLinks[link] = 1;
        results.push({href: link, text: text});
    }
    return results;
};

chrome.runtime.sendMessage({
    links: getLinks(),
    https: location.protocol === 'https:',
    title: document.title,
    host: location.hostname,
    path: location.pathname,
});

// chrome.runtime.onMessage.addListener(function (message, sender) {
//     executeScriptInPageContext(message);
// });
// function executeScriptInPageContext(m) { alert('123');  }