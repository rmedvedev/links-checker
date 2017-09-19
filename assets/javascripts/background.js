function validateLinks(links, callback) {
    var results = [];
    callback({ total: links.length, badlinks: results });
}


chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var tabId = request.tabId;
    chrome.tabs.executeScript(tabId, { file: "assets/javascripts/content.js" }, function() {
        chrome.tabs.sendMessage(tabId, {}, function(results) {
            validateLinks(results, callback);
        });
    });
});