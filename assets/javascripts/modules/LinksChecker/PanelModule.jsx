import React from 'react';
import ReactDOM from 'react-dom';
import ProgressBar from './classes/ProgressBar.jsx';

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
            <div class="panel panel-default">
                <div class="panel-heading">Links checker</div>
                <div class="panel-body">
                    <button id="scan" class="btn btn-success"
                            onClick={this._scan}>Scan
                    </button>
                    <button id="stop" class="btn btn-danger"
                            onClick={this._stop}>Stop
                    </button>
                    <button id="rescan" class="btn btn-primary"
                            onClick={this._rescan}>Rescan
                    </button>
                    <button id="start_session" class="btn btn-success"
                            onClick={this._startSession}>Start
                        session
                    </button>
                    <button id="stop_session" class="btn btn-danger"
                            onClick={this._stopSession}>Stop
                        session
                    </button>
                    <ProgressBar success={this.linksData.statuses.success}
                                 warning={this.linksData.statuses.warning}
                                 error={this.linksData.statuses.error}
                                 all={this.linksData.count}/>

                    <details id="links">
                        <summary>Links: {this.linksData.count}</summary>
                    </details>
                    <div>
                        <strong>Session saved
                            links: {this.linksData.sessionCount}</strong>
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
    }

    getSessionLinksCount() {
        this.connection.postMessage({
            name: 'getSessionLinksCount',
            tabId: this.tabId,
        });
    }
}



