document.getElementById('options-page').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function(tab) {
        var tablink = tab.url;

        var url = document.createElement('a'); //use for parse url
        url.href = tablink;

        document.getElementById('protocol_val').innerText =
            url.protocol.slice(0, -1); // remove ":"

        var notifyParams = {
            type: 'basic',
            iconUrl: 'assets/images/icon96.png',
            title: 'NOT HTTPS!!!',
            message: 'SHIT HAPPENS!!!!!!!!!!',
        };

        if (url.protocol === 'http:') {
            chrome.notifications.create('wrongProtocol', notifyParams);
        }

    });
});

document.getElementById('getUrl').addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
        var tablink = tab.url;

        //use for parse url
        var url = document.createElement('a');
        url.href = tablink;

        document.getElementById('protocol_val').innerText =
            url.protocol.slice(0, -1); // remove ":"

        document.getElementById('urlparams').innerText =
            'full URL: ' + url.href + '\n\n' +           // the full URL
            'protocol: ' + url.protocol + '\n\n' +       // http:
            'hostname: ' + url.hostname + '\n\n' +       // site.com
            'port: ' + url.port + '\n\n' +           // 81
            'pathname: ' + url.pathname + '\n\n' +       // /path/page
            'search: ' + url.search + '\n\n' +         // ?a=1&b=2
            'hash: ' + url.hash                    // #hash
        ;
    });
});

/*
use jQuery


$(function(){
    $("#text1").keyup(function(){
        $('#breef').text('Hello '+$('#text1').val());
    });

    console.log($('#breef').val());
});
*/

