export default class PageInfoProvider {

    //common info about page
    getInfo() {
        let pageInfo = {};
        pageInfo.https = location.protocol === 'https:';
        pageInfo.title = document.title;
        pageInfo.host = location.hostname;
        pageInfo.path = location.pathname;
        pageInfo.query_string = location.search;
        pageInfo.url = location.href;

        return pageInfo;
    };

    //cookies
    getCookies() {
        return document.cookie;
    };

    //array of page's meta tags
    getMetaTags() {
        let metaTags = [];
        Array.from(document.getElementsByTagName('meta')).
            forEach(function(element) {
                metaTags.push(element.outerHTML.replace(/</g, '&lt;').
                    replace(/>/g, '&gt;'));
            });

        return metaTags;
    };
}