import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import { action } from '../redux/action/index.js';
//import Body from '../component/layout/body';
import Empty from '../component/empty/index';
//import FooterDownload from '../component/footerDownload/index.js';

class DownloadApp extends Component {
    render() {
        return (
            <div style={{background: '#fff',textAlign:'center',}}>
                <Empty />
            </div>
        )
    }
}

export default DownloadApp;
