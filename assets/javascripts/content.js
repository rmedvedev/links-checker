(function () {

    let linksModule = new Links();
    let pageHelper = new PageHelper();

    let init = function () {
        chrome.runtime.sendMessage({
            name: 'pageInfo',
            pageInfo: pageHelper.getInfo(),
            links: Array.from(linksModule.getLinks()).map(function(link){
                return link.href;
            }),
            cookies: pageHelper.getCookies(),
            metaTags: pageHelper.getMetaTags(),
        });
    };

    chrome.runtime.onMessage.addListener(function (message) {
        linksModule.handle(message.name);
        switch (message.name) {
            case 'init':
                init();
                break;
        }
    });

    //when script load - send info to background
    init();
})();
