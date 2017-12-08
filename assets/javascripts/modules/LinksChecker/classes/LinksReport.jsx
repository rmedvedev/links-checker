import React from 'react';

export default class LinksReport extends React.Component {
    render() {

        let statuses = new Map();

        this.props.list.forEach(function (status, url) {
            if (!statuses.has(status)) {
                statuses.set(status, {name: status, urls: []});
            }
            statuses.get(status).urls.push(<div><a href={url} target="_blank">{url}</a></div>);
        });

        let tabs = [];
        let tabsContent = [];

        statuses.forEach(function (obj, status) {
            tabs.push(<li role="presentation">
                <a href={'#status' + status} aria-controls={'status' + status} role="tab"
                   data-toggle="pill">{obj.name} <span className="label label-default">{obj.urls.length}</span></a>
            </li>);
            tabsContent.push(<div role="tabpanel" className="tab-pane" id={'status' + status}><p>{obj.urls}</p></div>);

        });

        return (<div>
            <ul className="nav nav-pills" role="tablist">{tabs}</ul>
            <div className="tab-content">{tabsContent}</div>
        </div>);
    }
}