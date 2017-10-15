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
            name: 'pageInfo',
            pageInfo: getPageInfo(),
            links: getLinks(),
            cookies: getCookies(),
            metaTags: getMetaTags(),
        });
    };

    chrome.runtime.onMessage.addListener(function (message) {
        new ContentMessageHandler(message);
    });


    function Links() {
        let links = document.querySelectorAll("a");
        let checkerIndex = null;

        this.getLinks = function () {
            return links;
        };

        this.clearStyles = function () {
            links.forEach(function (link) {
                link.classList.remove('checker-link', 'checker-success', 'checker-error', 'checker-progress');
                link.classList.add('checker-link');
            });
        };

        this.checkLinks = function (restart = false) {
            if (restart) {
                checkerIndex = 0;
            }

            let link = links[checkerIndex];
            if (link) {
                link.classList.add('checker-progress');
                chrome.runtime.sendMessage({
                    name: 'checkLink',
                    link: link.href,
                    index: checkerIndex,
                });
                checkerIndex++;
            } else {
                console.log('Stop checking links.');
            }
        };

        this.checkLinksCallback = function (message) {
            if(checkerIndex !== null) {
                let css = 'checker-error', color = 'red';
                if (message.status >= 200 && message.status < 300) {
                    css = 'checker-success';
                    color = '';
                }

                console.log("%c" + links[message.index].href + ' - ' + message.status + ' ' + message.requestTime + 'ms', 'color:' + color);

                links[message.index].classList.add(css);
                links[message.index].classList.remove('checker-progress');
                this.checkLinks();
            }
        }
    }

    let links = new Links();

    function ContentMessageHandler(message) {
        switch (message.name) {
            case 'checkLinks':
                //remove styles
                links.clearStyles();
                links.checkLinks(true);
                console.log('Restart scanning links.');
                break;
            case 'checkingLinksCallback':
                links.checkLinksCallback(message);
                break;
            case 'init':
                console.log(1);
                init();
                break;
        }
    }

    init();
})();


