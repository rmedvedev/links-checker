import {default as OptionsHelper} from './common/OptionsHelper.js';
import './common/bootstrap/bootstrap.js'
import './common/bootstrap/bootstrap.less'

(function() {

    let optionsHelper = new OptionsHelper();

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
        };

        optionsHelper.setAll(options).then(() => {
            alert('Save success');
        });
    }

    document.getElementById('save').addEventListener('click', function() {
        saveOptions();
    });

})();



