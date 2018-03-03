import React from 'react';
import ReactDOM from 'react-dom';

export default class PanelModule {

    constructor(connection, tabId, domNode) {
        this.connection = connection;
        this.tabId = tabId;
        this.mainBlockNode = domNode;

        this.pageInfo = {};
        this.cookies = [];
        this.metaTags = [];
        this.handleMessage = this.handleMessage.bind(this);
    }

    render() {
        ReactDOM.render(
            <div className="row margin-top-small">
                <div className="col-md-6 col-xs-12">
                    <div className="panel panel-primary">
                        <div className="panel-heading" role="tab"
                             id="pageInfo">
                            <h5 className="panel-title">
                                <a role="button" data-toggle="collapse"
                                   href="#pageInfoPanel"
                                   aria-expanded="true"
                                   aria-controls="pageInfoPanel">
                                    Page info
                                </a>
                            </h5>
                        </div>
                        <div id="pageInfoPanel"
                             className="panel-collapse collapse in"
                             role="tabpanel"
                             aria-labelledby="pageInfo">
                            <div className="panel-body">
                                <div>
                                    <b>Title:</b>
                                    <span
                                        id="title"> {this.pageInfo.title}</span>
                                </div>

                                <div>
                                    <b>Https:</b>
                                    <span id="https"> {this.pageInfo.https ?
                                        'Yes' :
                                        'No'}</span>
                                </div>

                                <div>
                                    <b>Host:</b>
                                    <span
                                        id="host"> {this.pageInfo.host}</span>
                                </div>

                                <div>
                                    <b>Path:</b>
                                    <span
                                        id="path"> {this.pageInfo.path}</span>
                                </div>

                                <div>
                                    <b>Query string:</b>
                                    <span
                                        id="query_string"> {this.pageInfo.query_string}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-primary">
                        <div className="panel-heading" role="tab"
                             id="metaTags">
                            <h5 className="panel-title">
                                <a role="button" data-toggle="collapse"
                                   href="#metatagsPanel"
                                   aria-expanded="true"
                                   aria-controls="metatagsPanel">
                                    Meta tags
                                </a>
                            </h5>
                        </div>
                        <div id="metatagsPanel"
                             className="panel-collapse collapse in"
                             role="tabpanel" aria-labelledby="metaTags">
                            <div className="panel-body">
                            <span id="meta_tags">
                                   {this.metaTags.map(function(metaTag) {
                                       return <div>{metaTag}</div>;
                                   })}
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xs-12">
                    <div className="panel panel-primary">
                        <div className="panel-heading" role="tab"
                             id="cookiesInfo">
                            <h5 className="panel-title">
                                <a role="button" data-toggle="collapse"
                                   href="#cookiesPanel"
                                   aria-expanded="true"
                                   aria-controls="cookiesPanel">
                                    Cookies
                                </a>
                            </h5>
                        </div>
                        <div id="cookiesPanel"
                             className="panel-collapse collapse in"
                             role="tabpanel"
                             aria-labelledby="cookiesInfo">
                            <div className="panel-body">
                            <span id="cookies"
                                  style={{overflowWrap: 'break-word'}}>
                                {this.cookies.map(function(cookie) {
                                    return <div>
                                        <b>{cookie.name}: </b>{cookie.value}
                                    </div>;
                                })}
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ,
            this.mainBlockNode,
        );
    }

    handleMessage(message) {
        switch (message.name) {
            case 'pageInfo':
                this.pageInfo = message.pageInfo;
                this.cookies = message.cookies;
                this.metaTags = message.metaTags;

                this.render();
                break;
        }
        this.render();
    }
}



