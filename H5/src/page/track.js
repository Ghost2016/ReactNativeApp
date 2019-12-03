import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import UserInfo from '../component/userinfo/trackinfo';
import SkillInfo from '../component/skillInfo/track';
import FooterDownload from '../component/footerDownload/index.js';

class TrackPage extends Component {
    render() {
        return (
            <Body>
                <UserInfo />
                <SkillInfo />
                <FooterDownload />
            </Body>
        )
    }
}

export default TrackPage;
