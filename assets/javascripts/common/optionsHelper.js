function OptionsHelper(){
    let defaults = {
            'links_checker_black_list': [],
            'links_checker_timeout': 30 * 1000,
        };

    this.get = function(){
        return new Promise(function(resolve){
            chrome.storage.sync.get(defaults, resolve);
        });
    };
    
    this.set = function (options) {
        return new Promise(function(resolve){
            chrome.storage.sync.set(options, resolve);
        });
    }
}