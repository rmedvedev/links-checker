chrome.devtools.panels.create("OMTA",
    null,
    "panel.html",
    function (panel) {
        panel.onShown.addListener(function callback(window) {
            chrome.runtime.sendMessage({ tabId: chrome.devtools.inspectedWindow.tabId },{},
                function(results) {
                    window.document.getElementById('links').innerHTML = 'Ссылок' + results.total;

                    // if (!results.badlinks.length) {
                    //
                    // }
                    // else {
                    //     var details = auditResults.createResult(results.badlinks.length +
                    //         " links out of " + results.total + " are broken");
                    //     for (var i = 0; i < results.badlinks.length; ++i) {
                    //         details.addChild(auditResults.createURL(results.badlinks[i].href,
                    //             results.badlinks[i].text));
                    //     }
                    //     auditResults.addResult("Broken links found (" +
                    //         results.badlinks.length +
                    //         ")", "",
                    //         auditResults.Severity.Severe,
                    //         details);
                    // }
                });
        })
    }
);

