function OptionsHelper(){
    let defaults = {
            'links_checker_black_list': [],
            'links_checker_timeout': 30 * 1000,
        };

    this.get = function(callback){
        chrome.storage.sync.get(defaults, callback);
    };
    
    this.set = function (options) {
        chrome.storage.sync.set(options);
    }
}