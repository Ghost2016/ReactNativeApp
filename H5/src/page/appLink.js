import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import { action } from '../redux/action/index.js';
//import Body from '../component/layout/body';
import Empty from '../component/empty/link';
//import FooterDownload from '../component/footerDownload/index.js';

class AppLink extends Component {
    render() {
        return (
            <div style={{background: '#fff',textAlign:'center',}}>
                <Empty />
            </div>
        )
    }
}

export default AppLink;
