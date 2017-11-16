import React from 'react';

export default class ProgressBar extends React.Component {
    render() {
        let percentSuccess = Math.round(this.props.success / this.props.all *
            100) +
            '%';
        let percentWarning = Math.round(this.props.warning / this.props.all *
            100) +
            '%';
        let percentError = Math.round(this.props.error / this.props.all * 100) +
            '%';

        return (<div class="progress margin-top">
            <div class="progress-bar progress-bar-success"
                 style={{width: percentSuccess}}>
            </div>
            <div class="progress-bar progress-bar-warning"
                 style={{width: percentWarning}}>
            </div>
            <div class="progress-bar progress-bar-danger"
                 style={{width: percentError}}>
            </div>
        </div>);
    }
}