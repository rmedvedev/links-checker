function Links() {
    let links = Array.from(document.querySelectorAll("a"));
    let checkerIndex = null;

    let optionsHelper = new OptionsHelper();
    optionsHelper.get(function(options){
        links = links.filter(function(link){
            return options.links_checker_black_list.indexOf(link.href) === -1;
        });
    });

    this.getLinks = function () {
        return links;
    };

    this.clearStyles = function () {
        links.forEach(function (link) {
            link.classList.remove('checker-link', 'checker-success', 'checker-error', 'checker-progress');
            link.classList.add('checker-link');
        });
    };

    this.stopCheckLinks = function () {
        checkerIndex = null;
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
        if (checkerIndex !== null) {
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
