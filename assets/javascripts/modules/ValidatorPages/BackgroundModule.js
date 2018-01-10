export default class ValidatorPagesModule {

    constructor(){
        this.duplicatedTabs = [];
    }

    handleContentMessage(message, sender, connections) {
        switch (message.name) {
            case 'pageInfo':
                break;
            case 'getDuplicatePage':
                if (this.duplicatedTabs.indexOf(sender.tab.id) !== -1) {
                    chrome.tabs.sendMessage(sender.tab.id, {name: 'duplicate_page', status: true});
                }
                break;
            case 'click':
                this.duplicatedTabs.forEach(function(tabId){
                    if(sender.tab.id === tabId){
                        return;
                    }
                    chrome.tabs.sendMessage(tabId, message);
                });
                break;
            case 'scroll':
                this.duplicatedTabs.forEach(function(tabId){
                    if(sender.tab.id === tabId){
                        return;
                    }
                    chrome.tabs.sendMessage(tabId, message);
                });
                break;
        }
    }

    handlePanelMessage(message, connections) {
        switch(message.name){
            case 'duplicate_page':
                if(message.status){
                    this.duplicatedTabs.push(message.tabId);
                } else{
                    this.duplicatedTabs.splice(this.duplicatedTabs.indexOf(message.tabId), 1);
                }
                chrome.tabs.sendMessage(message.tabId, {name: message.name, status: message.status});
                break;
        }
    }
}
