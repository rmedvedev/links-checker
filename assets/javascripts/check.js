function LinksChecker() {
}

LinksChecker.checkOne = function (link, callback) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            callback(xhr.status);
            xhr.abort();
        }
    };
    xhr.open('GET', link);
    xhr.send();
};
