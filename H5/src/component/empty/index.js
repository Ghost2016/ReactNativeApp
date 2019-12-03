import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { action } from "../../redux/action/index.js";
import "./index.less";
import { Row, Col, Input, Button, Tooltip } from 'antd';
import { Config, CSS, isMobile, checkResult,
  openNotificationWithIcon,
  notValidField,
  _onPressGetCode,
  downloadApp,
 } from '../../libs/func'

class EmptyBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      password: '',
      nickname: '',
      isRegisterOk: false,

      isLoadCode: false, // 是否在获取code
      isNeedReLoad: false, //重新获取
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      currLeftTime: 60,
    };
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  componentDidMount() {
    let url = Config.website
    if(isMobile.Android()){
      //微信里面下载不了androidWebsite
      url = 'http://android.myapp.com/myapp/detail.htm?apkName=com.shandudata.zhimekaimen'//Config.androidWebsite;
    } else if(isMobile.iOS()){
        url = 'https://itunes.apple.com/cn/app/%E8%81%8C%E4%B9%88%E5%BC%80%E9%97%A8-%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%9A%84%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92%E5%B8%88/id1434294728?mt=8';
    }
    console.log('url', url)
    window.location = url;
  }


  render() {
    if (
      !this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}"
    ) {
      return (<div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        background: '#fff',width:'100%',height:'15rem',
        zIndex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          padding: '25% 0',
        }}>即将跳转到APP下载页面。。。请稍后</div>
      </div>);
    }
    return (
      <div className="postbody"></div>
    );
  }
}

const maptodispatchaction = dispatch => ({
});

export default connect(
  null,
  maptodispatchaction
)(EmptyBody);
