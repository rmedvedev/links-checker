import React from 'react';

export default class ProgressBar extends React.Component {
    render() {

        let success = 0;
        let warning = 0;
        let error = 0;

        this.props.list.forEach(function(status){
            if (status >= 200 && status < 300) {
                success++;
            } else if (status < 400 && status !== 0) {
                warning++;
            } else {
                error++;
            }
        });

        let percentSuccess = Math.round(success / this.props.allcount *
            100) +
            '%';
        let percentWarning = Math.round(warning / this.props.allcount *
            100) +
            '%';
        let percentError = Math.round(error / this.props.allcount * 100) +
            '%';

        return (<div className="progress margin-top">
            <div className="progress-bar progress-bar-success"
                 style={{width: percentSuccess}}>
            </div>
            <div className="progress-bar progress-bar-warning"
                 style={{width: percentWarning}}>
            </div>
            <div className="progress-bar progress-bar-danger"
                 style={{width: percentError}}>
            </div>
        </div>);
    }
}