import {default as OptionsHelper} from './common/OptionsHelper.js';

(function() {

    let optionsHelper = new OptionsHelper();

    let links_list = [];

    optionsHelper.getAll().then(function(options) {
        renderOptions(options);
    });

    function renderOptions(options) {
        document.getElementById(
            'links_checker_timeout').value = options.links_checker_timeout;
        document.getElementById(
            'links_checker_black_list').innerHTML = options.links_checker_black_list.join(
            '\n');
    }

    function saveOptions() {
        let options = {
            links_checker_timeout: document.getElementById(
                'links_checker_timeout').value * 1,
            links_checker_black_list: document.getElementById(
                'links_checker_black_list').value.split('\n'),
            links_list: links_list
        };

        optionsHelper.setAll(options).then(() => {
            alert('Save success');
        });
    }

    document.getElementById('save').addEventListener('click', function() {
        saveOptions();
    });

    document.getElementById('save_to_file').addEventListener('click', function() {
        saveToFile();
    });

    document.querySelector('#links_file').onchange = function(e) {
        let files = this.files;
        let reader = new FileReader();

        reader.onload = function(e) {
            let listFile = JSON.parse(e.target.result);
            listFile['pages'].forEach(function(page) {
                links_list.push(page['url']);
            });
            console.log(links_list);
        };

        reader.readAsText(files[0]);
    };

    function saveToFile(){
        let textToWrite = JSON.stringify({
            version: 1,
            pages: links_list.map(function(url) {
                return {url: url};
            })
        });
        let textFileAsBlob = new Blob([textToWrite], {type:'application/json'});
        let fileNameToSaveAs ="links_list.json";

        let downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }

})();



