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

class FormBody extends React.Component {
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

  }

  onChange = (name, type, e) => {
    let value = {}
    let _type = '';
    let _temp = '';
    if(typeof type == "string" && type.match(/^([a-z]+)$/i)){
      _type = RegExp.$1;
    }

    switch (_type) {
      case 'mobile':
        value[name] = e.target.value.replace(/[^0-9]/gi, '')
        break;
      case 'code':
        _temp = e.target.value.replace(/[^0-9]/gi, '')
        value[name] = _temp
        break;
      case 'password':
        _temp = e.target.value
        value[name] = _temp
        break;
      case 'info':
        _temp = e.target.value
        value[name] = _temp
        break;
      default:
        value[name] = e.target.value
        break;
    }
    console.log("onchange", e.target.value, name)

    this.setState(value);
  }

  onPressBack(){
    history.go(-1);
  }

  onPressSubmit(){
    if(notValidField(this.state.phone, 'phone')){
      return
    }
    if(notValidField(this.state.code, 'code')){
      return
    }
    if(notValidField(this.state.password, 'password')){
      return
    }
    if(notValidField(this.state.nickname, 'nickname')){
      return
    }
    this.props.signupAction({
      phone: this.state.phone,
      password: this.state.password,
      code: this.state.code,
      nickname: this.state.nickname,
      type: "phone"
    }, res => {
      checkResult(res).then(res=>{
        this.setState({
          isRegisterOk: true,
        })
      }).catch(err=>{
        openNotificationWithIcon('error', '出错啦！', err)
      })
    });

  }

  onPressDownload() {
    downloadApp()
  }

  async onPressGetCode(){
    await _onPressGetCode(this, () => {
      return new Promise((resolve, reject) => {
        if (notValidField(this.state.phone, 'phone', "请先输入手机号，再获取验证码！")) {
          reject(null);
        } else {
          resolve({
            phone: this.state.phone,
            type: "signup"
          });
        }
      });
    });
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
        background: '#fff',width:'100%',height:'100%',
        zIndex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

          <div>
            <div style={{
              display: 'flex',
              width: '100%',
              height: '42px',
              background: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              border: '0px #00f solid',
            }}>
              <Row type="flex" style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                border: '0px #f00 solid',
                background: '#fff',
              }}>
                <Col span={6}>
                  <a href="javascript:void(0);" style={{
                      display: 'inline-block',
                      width: '25px',
                      height: '25px',
                      border: '0px #f00 solid',
                      position: 'relative',
                      left: '-30px',
                  }} onClick={this.onPressBack.bind(this)}>
                    <img src={require('../images/icons/home_Salary_back.png')} style={{ color: 'rgba(0,0,0,.25)' }} />
                  </a>
                </Col>
                <Col span={12}><span style={{
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#333',
                }}>职么开门</span></Col>
                <Col span={6}></Col>
              </Row>
            </div>

            <div style={{
              background: '#f3f3f3',
              height: '15px',
              width: '100%',
            }}></div>

            {this.state.isRegisterOk ? null : <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          paddingTop: '42px',
                        }}>
                          <div style={{
                            display: 'flex',
                            width: '275px',
                            alignSelf: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            }} >
                              <Input
                                placeholder="输入手机号"
                                prefix={<img src={require('../images/icons/login_ico_phone@2x.png')} style={{
                                  color: 'rgba(0,0,0,.25)',
                                  width: CSS.px(22),
                                  height: CSS.px(36),
                                   }} />}
                                //suffix={suffix}
                                value={this.state.phone}
                                onChange={this.onChange.bind(this, 'phone', 'mobile')}
                                ref={node => this.phoneInput = node}
                                maxLength="11"
                                style={{
                                  display: 'flex',
                                  width: '100%',
                                  marginBottom: '18px',
                                }}
                              />

                              <div gutter={0}
                                style={{
                                  display: 'flex',
                                  marginBottom: '18px',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  position: 'relative',
                                  left: '-11px',
                                }}>
                                  <Input
                                    placeholder="输入短信验证码"
                                    prefix={<img src={require('../images/icons/login_ico_code@2x.png')} style={{
                                      color: 'rgba(0,0,0,.25)',
                                      width: CSS.px(26),
                                      height: CSS.px(22),
                                       }} />}
                                    //suffix={suffix}
                                    value={this.state.code}
                                    onChange={this.onChange.bind(this, 'code', 'code')}
                                    ref={node => this.codeInput = node}
                                    maxLength="4"
                                    style={{
                                      display: 'flex',
                                      width: '167px',
                                    }}
                                  />
                                  <div className="btn-no-border-radius" style={{
                                    display: 'flex',
                                    width: '85px',
                                  }}>
                                    {/* <Button type="primary" block
                                      onClick={this.onPressGetCode.bind(this)}
                                    >获取验证码</Button> */}
                                    <CountDownButton
                                      isLoadCode={this.state.isLoadCode}
                                      isActive={this.state.isValidPhone && this.state.isActive}
                                      currLeftTime={this.state.currLeftTime}
                                      isNeedReLoad={this.state.isNeedReLoa}
                                      onPress={this.onPressGetCode.bind(this)}
                                    />
                                  </div>
                              </div>

                              <Input
                                placeholder="设置登录密码"
                                prefix={<img src={require('../images/icons/login_ico_password@2x.png')} style={{ color: 'rgba(0,0,0,.25)',
                                  width: CSS.px(26),
                                  height: CSS.px(29),
                                 }} />}
                                //suffix={suffix}
                                type="password"
                                value={this.state.password}
                                onChange={this.onChange.bind(this, 'password', 'password')}
                                ref={node => this.passwordInput = node}
                                maxLength="20"
                                style={{
                                  marginBottom: '18px',
                                }}
                              />

                              <Input
                                placeholder="设置昵称"
                                prefix={<img src={require('../images/icons/login_ico_name@2x.png')} style={{ color: 'rgba(0,0,0,.25)',
                                  width: CSS.px(26),
                                  height: CSS.px(26),
                                 }} />}
                                //suffix={suffix}
                                value={this.state.nickname}
                                onChange={this.onChange.bind(this, 'nickname', 'info')}
                                ref={node => this.nicknameInput = node}
                                maxLength="20"
                                style={{
                                  marginBottom: '60px',
                                }}
                              />

                              <div className="btn-border-radius">
                                <Button type="primary" style={{
                                  width: '275px',
                                }}  onClick={this.onPressSubmit.bind(this)}>确定</Button>
                              </div>
                          </div>
                        </div>}

            {this.state.isRegisterOk ? <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          paddingTop: '99px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignSelf: 'center',
                            width: '77px',
                            height: '77px',
                          }}>
                            <img src={require('../images/icons/ming_ico_Success@2x.png')} style={{
                              color: 'rgba(0,0,0,.25)',
                              width: '77px',
                              height: '77px',
                               }} />
                          </div>
                          <div style={{
                            display: 'flex',
                            alignSelf: 'center',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '28px',
                          }}>
                            <span style={{
                              display: 'flex',
                              alignSelf: 'center',
                              fontSize: '18px',
                              fontWeight: '300',
                              color: '#333',
                            }}>注册成功！</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignSelf: 'center',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '12px',
                          }}>
                            <span style={{
                              display: 'flex',
                              alignSelf: 'center',
                              fontSize: '15px',
                              fontWeight: '100',
                              color: '#666',
                            }}>职么开门期待与你一起成长，追寻最理想的人生</span>
                          </div>
                          <div className="btn-border-radius orange-border" style={{
                            marginTop: '56px',
                          }}>
                            <Button type="primary" style={{
                              width: '275px',
                            }}  onClick={this.onPressDownload.bind(this)}>立即下载</Button>
                          </div>
                        </div> : null}
          </div>

      </div>);
    }
    return (
      <div className="postbody">

      </div>
    );
  }
}

const maptodispatchaction = dispatch => ({
  signupAction: (param, success) => {
    dispatch(action.resgister(param, success));
  },
  signupCodeAction: (param, success) => {
    dispatch(action.signupCode(param, success));
  }
});

class CountDownButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      backgroundColor: "#bfbfbf",
    }
  }

  onPressGetCode = () => {
    const { isLoadCode } = this.props;
    // 如果还在倒计时，则不会发送
    !isLoadCode && this.props.onPress();
  }

  componentWillReceiveProps(nextProp){
    const { isLoadCode, isActive } = nextProp;
    this.setState({
      backgroundColor: isLoadCode ?  "#bfbfbf" : isActive?sdStyles.SDMainColor : "#bfbfbf",
    })
  }

  render() {
    const { isLoadCode, currLeftTime, isNeedReLoad } = this.props;
    return (
      <div className="count-down-btn"><Button
        type="primary" block
        onClick={this.onPressGetCode.bind(this)}
        disabled={isLoadCode}
        >{isLoadCode
          ? "重新获取(" + currLeftTime + ")"
          : isNeedReLoad
            ? "重新获取"
            : "获取验证码"}</Button></div>
    );
  }
}

export default connect(
  null,
  maptodispatchaction
)(FormBody);
