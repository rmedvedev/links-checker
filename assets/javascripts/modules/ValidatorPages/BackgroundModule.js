export default class ValidatorPagesModule {

    constructor(){
        this.duplicatedTabs = [];
    }

    handleContentMessage(message, sender, connections) {
        switch (message.name) {
            case 'pageInfo':
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