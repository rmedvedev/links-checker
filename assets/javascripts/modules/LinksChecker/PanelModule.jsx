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
        this._scan = this._scan.bind(this);
        this._stop = this._stop.bind(this);
        this._rescan = this._rescan.bind(this);
        this._startSession = this._startSession.bind(this);
        this._stopSession = this._stopSession.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.addLink = this.addLink.bind(this);

        setInterval(() => {
            this.getSessionLinksCount();
        }, 1000);
    }

    render() {
        ReactDOM.render(
            <div className="panel panel-default">
                <div className="panel-heading">Links checker</div>
                <div className="panel-body">
                    <button className="btn btn-success"
                            onClick={this._scan}>Scan
                    </button>
                    <button className="btn btn-danger"
                            onClick={this._stop}>Stop
                    </button>
                    <button className="btn btn-primary"
                            onClick={this._rescan}>Rescan
                    </button>
                    <button className="btn btn-success"
                            onClick={this._startSession}>Start
                        session
                    </button>
                    <button className="btn btn-danger"
                            onClick={this._stopSession}>Stop
                        session
                    </button>
                    <ProgressBar success={this.linksData.statuses.success}
                                 warning={this.linksData.statuses.warning}
                                 error={this.linksData.statuses.error}
                                 all={this.linksData.count}/>

                    <div>
                        <strong>Links: </strong>{this.linksData.count}
                    </div>
                    <div>
                        <strong>Session links: </strong>{this.linksData.sessionCount}
                    </div>
                    <LinksReport list={this.linksData.list}/>

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

        this.linksData.statuses = {
            success: 0,
            warning: 0,
            error: 0,
        };
        this.render();
    }

    _startSession() {
        this.connection.postMessage({
            name: 'startSession',
            tabId: this.tabId,
        });
    }

    _stopSession() {
        this.connection.postMessage({
            name: 'stopSession',
            tabId: this.tabId,
        });
    }

    handleMessage(message) {
        switch (message.name) {
            case 'linksCount':
                this.linksData.count = message.count;
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
}



