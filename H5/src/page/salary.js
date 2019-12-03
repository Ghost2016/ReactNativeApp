import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import SalaryPic from '../component/salary/index';
import FooterDownload from '../component/footerDownload/index.js';

class SalaryPage extends Component {
    render() {
        return (
            <Body>
                <SalaryPic />
                <FooterDownload />
            </Body>
        )
    }
}

export default SalaryPage;
