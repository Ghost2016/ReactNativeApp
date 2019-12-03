import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import DataPic from '../component/data/img';
import FooterDownload from '../component/footerDownload/index.js';

class ImgPrev extends Component {
    render() {
        return (
            <Body>
                <DataPic />
                <FooterDownload />
            </Body>
        )
    }
}

export default ImgPrev;
