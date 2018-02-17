import React from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from './classes/ProgressBar.jsx';
import LinksReport from './classes/LinksReport.jsx';

export default class PanelModule {

    constructor(connection, tabId, domNode) {
        this.connection = connection;
        this.tabId = tabId;
        this.mainBlockNode = domNode;
        this.linksData = {
            sessionCount: 0,
            count: 0,
            list: new Map(),
        };

        this._sessionState = false;

        this._scan = this._scan.bind(this);
        this._stop = this._stop.bind(this);
        this._rescan = this._rescan.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.addLink = this.addLink.bind(this);
        this._sessionChange = this._sessionChange.bind(this);
        this._resetLinksData = this._resetLinksData.bind(this);

        setInterval(() => {
            this.getCommonInfo();
        }, 1000);
    }

    render() {
        ReactDOM.render(
            <div className="panel panel-default margin-top-small">
                <div className="panel-heading">Links checker</div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-5">
                            <div className="btn-group" role="group">
                                <button className="btn btn-success"
                                        onClick={this._scan}
                                        title="Scan all links on page">
                                    <i className="glyphicon glyphicon-search"></i> Scan
                                </button>
                                <button className="btn btn-danger"
                                        onClick={this._stop}>
                                    <i className="glyphicon glyphicon-stop"></i> Stop
                                </button>
                                <button className="btn btn-primary"
                                        onClick={this._rescan}>
                                    <i className="glyphicon glyphicon-refresh"></i> Rescan
                                </button>
                            </div>
                            <ProgressBar
                                list={this.linksData.list} allcount={this.linksData.count}/>
                            <div>
                                <strong>Links: </strong>{this.linksData.count}
                            </div>

                            <LinksReport list={this.linksData.list}/>
                        </div>
                        <div className="col-xs-2">
                            <input type="checkbox" className="checkbox" name="session" id="session"
                                   checked={this._sessionState}
                                   onChange={this._sessionChange}/>
                            <label htmlFor="session">Session</label>
                            <div className="margin-top">
                                <strong>Saved
                                    links: </strong>{this.linksData.sessionCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            this.mainBlockNode,
        );
    }

    _rescan() {
        this.connection.postMessage({
            name: 'rescanTimeoutLinks',
            tabId: this.tabId,
        });
    }

    _stop() {
        this.connection.postMessage({
            name: 'stopCheckLinks',
            tabId: this.tabId,
        });
    }

    _scan() {
        this.connection.postMessage({
            name: 'checkLinks',
            tabId: this.tabId,
        });

        this._resetLinksData();
        this.render();
    }

    handleMessage(message) {
        switch (message.name) {
            case 'linksCount':
                this.linksData.count = message.count;
                this._resetLinksData();
                break;
            case 'refreshLinksCount':
                this.linksData.count = message.count;
                break;
            case 'checkedLink':
                this.addLink(message.url, message.status);
                break;
            case 'getCommonInfo':
                this.linksData.sessionCount = message.data.sessionLinksCount;
                this._sessionState = message.data.enableSession;
                break;
        }
        this.render();
    }

    addLink(url, status) {
        this.linksData.list.set(url, status);
    }

    getCommonInfo() {
        this.connection.postMessage({
            name: 'getCommonInfo',
            tabId: this.tabId,
        });
    }

    _sessionChange(event) {
        this._sessionState = event.target.checked;
        this.render();
        let messageName = 'stopSession';
        if (this._sessionState) {
            messageName = 'startSession';
        }

        this.connection.postMessage({
            name: messageName,
            tabId: this.tabId,
        });
    }

    _resetLinksData() {
        this.linksData.list = new Map();
    }
}