import OptionsHelper from './../../../common/OptionsHelper.js';

export default class LinksChecker {

    constructor() {
        this.linksList = [];
        this.linkNodes = new Map();
        this.checkerIndex = null;
        this.optionsHelper = new OptionsHelper;
        this._options = null;
    }

    init() {
        let $this = this;
        this._getOptions().then(function() {
            $this.linksList = $this._filterLinks($this._findLinks());
            chrome.runtime.sendMessage({
                name: 'linksCount',
                count: $this.linksList.length,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    _getOptions() {
        let $this = this;
        return this.optionsHelper.getAll().then(function(options) {
            return $this._options = options;
        });
    }

    getLinks() {
        return this.linksList;
    }

    _findLinks() {
        let links = [];
        let $this = this;
        document.querySelectorAll('a').forEach(function(linkNode) {
            if ($this.linkNodes.has(linkNode.href)) {
                $this.linkNodes.get(linkNode.href).push(linkNode);
                return;
            } else {
                $this.linkNodes.set(linkNode.href, [linkNode]);
            }

            links.push({
                domNode: linkNode,
                status: null,
                parsed_url: {
                    protocol: linkNode.protocol,
                    hostname: linkNode.hostname,
                    pathname: linkNode.pathname,
                    hash: linkNode.hash,
                    search: linkNode.search,
                },
            });
        });

        return links;
    }

    _filterLinks(links) {
        let $this = this;
        return links.filter(function(link) {
            return $this._options.links_checker_black_list.indexOf(
                link.domNode.href) === -1;
        });
    }

    _clearStyles() {
        this.linkNodes.forEach(function(nodes) {
            nodes.forEach(function(node) {
                node.classList.remove('checker-link', 'checker-success',
                    'checker-error', 'checker-progress');
                node.classList.add('checker-link');
            });
        });
    }

    stopCheckLinks() {
        this.checkerIndex = null;
        console.log('Stop checking links.');
    }

    checkLinks(restart = false) {
        if (restart) {
            this.checkerIndex = 0;
            this._clearStyles();
            this.linksList.map(function(link) {
                link.status = null;
            });
        }

        let link = this.linksList[this.checkerIndex];
        if (link) {
            this.linkNodes.get(link.domNode.href).forEach(function(node) {
                node.classList.add('checker-progress');
            });
            chrome.runtime.sendMessage({
                name: 'checkLink',
                link: link.domNode.href,
                index: this.checkerIndex,
            });
            this.checkerIndex++;
        } else {
            console.log('Stop checking links.');
        }
    }

    checkLinksCallback(message) {
        if (this.checkerIndex !== null) {
            let css = 'checker-error', color = 'red';
            if (message.status >= 200 && message.status < 300) {
                css = 'checker-success';
                color = '';
            }

            this.linkNodes.get(this.linksList[message.index].domNode.href).
                forEach(function(node) {
                    node.classList.remove(
                        'checker-success',
                        'checker-error', 'checker-progress');
                    node.classList.add(css);
                });

            console.log('%c' + this.linksList[message.index].domNode.href +
                ' - ' +
                message.status + ' ' + message.requestTime + 'ms', 'color:' +
                color);

            if (this.linksList[message.index].status === null) {
                this.checkLinks();
            }

            this.linksList[message.index].status = message.status;
        }
    }

    rescanTimeoutLinks() {
        console.log('Rechecking timeout links.');
        for (let key in this.linksList) {
            if (this.linksList[key].status === 0 ||
                this.linksList[key].status === 504) {
                this.checkerIndex = 0;
                chrome.runtime.sendMessage({
                    name: 'checkLink',
                    link: this.linksList[key].domNode.href,
                    index: key,
                });
            }
        }
    }

    checkOne(link, callback) {
        let xhr = new XMLHttpRequest();

        let startTime = (new Date).getTime();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                let requestTime = (new Date).getTime() - startTime;
                callback(xhr.status, requestTime);
                xhr.abort();
            }
        };

        xhr.onerror = function() {
            let requestTime = (new Date).getTime() - startTime;
            callback(xhr.status, requestTime);
            xhr.abort();
        };

        xhr.ontimeout = function() {
            let requestTime = (new Date).getTime() - startTime;
            callback(0, requestTime);
            xhr.abort();
        };

        if (this._options) {
            xhr.timeout = this._options.links_checker_timeout;
            xhr.open('GET', link);
            xhr.send();
        } else {
            this.optionsHelper.getAll().then(function(options) {
                xhr.timeout = options.links_checker_timeout;
                xhr.open('GET', link);
                xhr.send();
            });
        }
    };
}