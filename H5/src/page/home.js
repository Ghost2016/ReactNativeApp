import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import UserInfo from '../component/userinfo/index.js';
import SkillInfo from '../component/skillInfo/index.js';
import FooterDownload from '../component/footerDownload/index.js';

class HomePage extends Component {
    render() {
        return (
            // <Body>
            //     <Header>
            //         <NavBar />
            //     </Header>
            //     <Container>
            //     </Container>
            //     <Footter />
            // </Body>
            <Body>
                <UserInfo />
                <SkillInfo />
                <FooterDownload />
            </Body>
        )
    }
}

export default HomePage;
