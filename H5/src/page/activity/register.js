import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//import { action } from '../redux/action/index.js';
import Content from '../../component/registerActivity/index'
class RegisterActivity extends Component {
    render() {
        return (
            <div style={{background: '#fed200',textAlign:'center',overflow: 'scroll', height: '100vh'}}>
              <Content />
            </div>
        )
    }
}

export default RegisterActivity;
