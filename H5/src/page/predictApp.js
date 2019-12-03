import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import GameBody from '../component/game/index';
//import FooterDownload from '../component/footerDownload/index.js';

class PredictApp extends Component {
    render() {
        return (
            <div style={{background: '#fff',textAlign:'center',}}>
                <GameBody showDownload={false} />
            </div>
        )
    }
}

export default PredictApp;