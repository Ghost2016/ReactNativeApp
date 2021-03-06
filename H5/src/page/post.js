import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { action } from '../redux/action/index.js';
import Body from '../component/layout/body';
import PostBody from '../component/post/index';
import FooterDownload from '../component/footerDownload/index.js';

class PostPage extends Component {
    render() {
        return (
            <div style={{background: '#fff'}}>
                <PostBody />
                <FooterDownload />
            </div>
        )
    }
}

export default PostPage;
