function LinksChecker() {
}

LinksChecker.checkOne = function (link, callback) {
    let xhr = new XMLHttpRequest();

    let startTime = (new Date).getTime();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            let requestTime = (new Date).getTime() - startTime;
            callback(xhr.status, requestTime);
            xhr.abort();
        }
    };

    xhr.timeout = 30 * 1000;
    xhr.open('GET', link);
    xhr.send();
};
