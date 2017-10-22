function LinksChecker() {
    let timeout = 30 * 1000;

    let optionsHelper = new OptionsHelper();
    optionsHelper.get(function(options){
        timeout = options.links_checker_timeout;
    });

    this.checkOne = function (link, callback) {
        let xhr = new XMLHttpRequest();

        let startTime = (new Date).getTime();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                let requestTime = (new Date).getTime() - startTime;
                callback(xhr.status, requestTime);
                xhr.abort();
            }
        };

        xhr.onerror = function () {
            let requestTime = (new Date).getTime() - startTime;
            callback(xhr.status, requestTime);
            xhr.abort();
        };

        xhr.ontimeout = function () {
            let requestTime = (new Date).getTime() - startTime;
            callback(0, requestTime);
            xhr.abort();
        };

        xhr.timeout = timeout;
        xhr.open('GET', link);
        xhr.send();
    };
}