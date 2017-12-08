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
            statuses: {
                success: 0,
                warning: 0,
                error: 0,
            },
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
            this.getSessionLinksCount();
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
                                success={this.linksData.statuses.success}
                                warning={this.linksData.statuses.warning}
                                error={this.linksData.statuses.error}
                                all={this.linksData.count}/>
                            <div>
                                <strong>Links: </strong>{this.linksData.count}
                            </div>

                            <LinksReport list={this.linksData.list}/>
                        </div>
                        <div className="col-xs-2">
                            <label className="checkbox-inline">
                                <input type="checkbox" name="session"
                                       onChange={this._sessionChange}/>Session
                            </label>
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
                this.render();
                break;
            case 'checkedLink':
                this.addLink(message.url, message.status);
                break;
            case 'getSessionLinksCount':
                this.linksData.sessionCount = message.count;
                this.render();
                break;
        }
        this.render();
    }

    addLink(url, status) {
        if (status >= 200 && status < 300) {
            this.linksData.statuses.success++;
        } else if (status < 400 && status !== 0) {
            this.linksData.statuses.warning++;
        } else {
            this.linksData.statuses.error++;
        }

        this.linksData.list.set(url, status);
    }

    getSessionLinksCount() {
        this.connection.postMessage({
            name: 'getSessionLinksCount',
            tabId: this.tabId,
        });
    }

    _sessionChange(event) {
        this._sessionState = !!event.target.checked;

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
        this.linksData.statuses = {
            success: 0,
            warning: 0,
            error: 0,
        };
        this.linksData.list = new Map();
    }
}



