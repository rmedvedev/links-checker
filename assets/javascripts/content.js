(function () {

    let getPageInfo = function () {
        let pageInfo = {};
        pageInfo.https = location.protocol === 'https:';
        pageInfo.title = document.title;
        pageInfo.host = location.hostname;
        pageInfo.path = location.pathname;
        pageInfo.query_string = location.search;
        pageInfo.url = location.href;

        return pageInfo;
    };

    let getCookies = function () {
        return document.cookie;
    };

    let getLinks = function () {
        const links = document.querySelectorAll("a");
        const results = [];
        let seenLinks = {};
        for (let i = 0; i < links.length; ++i) {
            let text = links[i].textContent;
            if (text.length > 100)
                text = text.substring(0, 100) + "...";
            let link = links[i].href.replace(/(.*)#?/, "$1");
            if (seenLinks[link])
                continue;
            seenLinks[link] = 1;
            results.push({href: link, text: text});
        }
        return results;
    };

    let getMetaTags = function () {
        let metaTags = [];
        Array.from(document.getElementsByTagName('meta')).forEach(function (element) {
            metaTags.push(element.outerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        });

        return metaTags;
    };

    let init = function () {
        chrome.runtime.sendMessage({
            pageInfo: getPageInfo(),
            links: getLinks(),
            cookies: getCookies(),
            metaTags: getMetaTags(),
        });
    };

    document.onreadystatechange = function () {
        if (document.readyState === "interactive") {
            init();
        }
    };

    init();

})();