import React from 'react';
import ReactDOM from 'react-dom';

export default class ValidatorPagesModule {

    constructor(connection, tabId, domNode) {
        this.connection = connection;
        this.tabId = tabId;
        this.mainBlockNode = domNode;

        this.handleMessage = this.handleMessage.bind(this);
    }

    render() {
        ReactDOM.render(
            <div></div>
            ,
            this.mainBlockNode,
        );
    }

    handleMessage(message) {
        switch (message.name) {
            case 'pageInfo':
                this.render();
                break;
        }
        this.render();
    }
}



