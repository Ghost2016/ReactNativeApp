import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import FormBody from '../component/form/index';
//import FooterDownload from '../component/footerDownload/index.js';

class Register extends Component {
    render() {
        return (
            <div style={{background: '#fff',textAlign:'center',}}>
                <FormBody />
            </div>
        )
    }
}

export default Register;
