import React from 'react';

export default class LinksList extends React.Component {
    render() {
        let links = [];
        this.props.links.forEach(function (url) {
            links.push(<div><a href={url} target="_blank">{url}</a></div>);
        });

        return (<div>
            <div>{links}</div>
        </div>);
    }
}