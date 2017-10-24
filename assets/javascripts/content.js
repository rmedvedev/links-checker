(function () {

    let links = new Links();
    let pageHelper = new PageHelper();

    let init = function () {
        chrome.runtime.sendMessage({
            name: 'pageInfo',
            pageInfo: pageHelper.getInfo(),
            links: Array.from(links.getLinks()).map(function(link){
                return link.href;
            }),
            cookies: pageHelper.getCookies(),
            metaTags: pageHelper.getMetaTags(),
        });
    };

    //handler of messages from background
    function ContentMessageHandler(message) {
        switch (message.name) {
            case 'checkLinks':
                //remove styles
                links.clearStyles();
                links.checkLinks(true);
                console.log('Start checking links.');
                break;
            case 'checkingLinksCallback':
                links.checkLinksCallback(message);
                break;
            case 'stopCheckLinks':
                links.stopCheckLinks();
                break;
            case 'rescanTimeoutLinks':
                links.rescanTimeoutLinks();
                break;
            case 'init':
                init();
                break;
        }
    }

    chrome.runtime.onMessage.addListener(function (message) {
        ContentMessageHandler(message);
    });

    //when script load - send info to background
    init();
})();
