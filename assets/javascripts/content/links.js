function Links() {
    let links = [];
    let checkerIndex = null;
    let optionsHelper = new OptionsHelper();

    document.querySelectorAll("a").forEach(function (linkNode) {
        links.push({
            domNode: linkNode,
            status: null,
            parsed_url: {
                protocol: linkNode.protocol,
                hostname: linkNode.hostname,
                pathname: linkNode.pathname,
                hash: linkNode.hash,
                search: linkNode.search,
            }
        });
    });

    optionsHelper.get(function (options) {
        links = links.filter(function (link) {
            return options.links_checker_black_list.indexOf(link.domNode.href) === -1;
        });
    });

    this.getLinks = function () {
        return links;
    };

    this.clearStyles = function () {
        links.forEach(function (link) {
            link.domNode.classList.remove('checker-link', 'checker-success', 'checker-error', 'checker-progress');
            link.domNode.classList.add('checker-link');
        });
    };

    this.stopCheckLinks = function () {
        checkerIndex = null;
        console.log('Stop checking links.');
    };

    this.checkLinks = function (restart = false) {
        if (restart) {
            checkerIndex = 0;
            links.map(function (link) {
                link.status = null;
            });
        }

        let link = links[checkerIndex];
        if (link) {
            link.domNode.classList.add('checker-progress');
            chrome.runtime.sendMessage({
                name: 'checkLink',
                link: link.domNode.href,
                index: checkerIndex,
            });
            checkerIndex++;
        } else {
            console.log('Stop checking links.');
        }
    };

    this.checkLinksCallback = function (message) {
        if (checkerIndex !== null) {
            let css = 'checker-error', color = 'red';
            if (message.status >= 200 && message.status < 300) {
                css = 'checker-success';
                color = '';
            }
            links[message.index].domNode.classList.remove('checker-success', 'checker-error', 'checker-progress');
            links[message.index].domNode.classList.add(css);

            console.log("%c" + links[message.index].domNode.href + ' - ' + message.status + ' ' + message.requestTime + 'ms', 'color:' + color);

            if (links[message.index].status === null) {
                this.checkLinks();
            }

            links[message.index].status = message.status;
        }
    };

    this.rescanTimeoutLinks = function () {
        console.log('Rechecking timeout links.');
        for (let key in links) {
            if (links[key].status === 0 || links[key].status === 504) {
                checkerIndex = 0;
                chrome.runtime.sendMessage({
                    name: 'checkLink',
                    link: links[key].domNode.href,
                    index: key,
                });
            }
        }
    };

    function _validateLinks(links) {
        links.forEach(function (link) {
            if (link.parsed_url.hash && document.getElementById(link.parsed_url.hash) === undefined) {
                return false;
            }
        });
    }
}
