import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import DataPic from '../component/data/index';
import FooterDownload from '../component/footerDownload/index.js';

class DataPage extends Component {
    render() {
        return (
            <Body>
                <DataPic />
                <FooterDownload />
            </Body>
        )
    }
}

export default DataPage;
