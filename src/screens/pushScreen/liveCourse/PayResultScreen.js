import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen } from "../../../styles";
import IMChatctcScreen from "../imchat/IMChatctcScreen";
import IMChat from "../../../boot/IMChat";
import { Toast } from 'antd-mobile';
import { SERVER_TIME_CONFIG } from "../../AppLaunchScreen";
import { getServerTime } from "../../../api";

// 我的-支付结果
class PayResultScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
        success: this.props.success
    }
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null,
    refs: () => null
  };

  rePay() {
    if (this.props.payWay == 'ali') {
        // 如果是支付宝支付
        this.props.actions.getAlipayUrlAction({
            object_id: this.props.liveData.id
        }).then(res => {
            if (res.status == 'ok') {
                IMChat.aliPay(res.results).then(res => {
                    Toast.loading("返回支付结果中", 1);
                    setTimeout(() => {
                        this.props.actions.addLiveCourseStudentAction({
                            id: this.props.liveData.id
                        }).then(res => {
                            // 跳转到支付成功界面
                            this.props.getDetailThis && this.props.getDetailThis().fetNewData();
                            this.setState({
                                success: true
                            })
                        }).catch(err => {
                            if(err && err.status_code == '400') {
                                Toast.fail(err.msg || "参与失败");
                            }
                        })
                    }, 1000);
                }).catch(errr => {
                    Toast.fail("支付失败");
                });
            } else {
    
            }
        }).catch(err => {
    
        })
    } else {
        // 如果是微信支付
        this.props.actions.getWxpayUrlAction({
            object_id: this.props.liveData.id
        }).then(res => {
            if (res.status == 'ok') {
                IMChat.wxPay(res.results).then(res => {
                    // console.warn(res)
                    // console.warn("成功")
                    if (res.errCode == 0) {
                        Toast.loading("返回支付结果中", 1);
                        setTimeout(() => {
                            this.props.actions.addLiveCourseStudentAction({
                                id: this.props.liveData.id
                            }).then(res => {
                                // 跳转到支付成功界面
                                this.props.getDetailThis && this.props.getDetailThis().fetNewData();
                                this.setState({
                                    success: true
                                })
                            }).catch(err => {
                                if(err && err.status_code == '400') {
                                    Toast.fail(err.msg || "参与失败");
                                }
                            })
                        }, 1000);
                    } else {
                        Toast.fail("支付失败");
                    }
                }).catch(errr => {
                    Toast.fail("支付失败");
                });
            } else {
    
            }
        }).catch(err => {
    
        })
    }
  }

  render() {
      return (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
              <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3'}}>
              </View>
              <View style={{flex: 1}}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: CSS.pixel(94)}}>
                    <Image source={this.state.success ? require("@img/my/ming_ico_Success.png") : require("@img/imchat/pay/growing_ico_fail.png")}/>
                </View>
                <View style={{marginTop: CSS.pixel(50), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#333', fontSize: CSS.textSize(36), lineHeight: CSS.pixel(50), fontWeight: '600'}}>{this.state.success ? '支付成功！' : '支付失败！'}</Text>
                </View>
                <View style={{marginTop: CSS.pixel(158), justifyContent: 'center', alignItems: 'center'}}>
                    {
                        this.state.success ? 
                        <SDTouchOpacity onPress={() => {
                            IMChat.isLogin().then(res => {
                                if(res && res != "") {
                                    // 获取后台时间
                                    if(SERVER_TIME_CONFIG.timer) {
                                      clearInterval(SERVER_TIME_CONFIG.timer);
                                    }
                                    getServerTime().then(res => {
                                        if(res.status == 'ok') {
                                          SERVER_TIME_CONFIG.time = new Date(parseInt(res.results.timestamp + "" + "000"));
                                          SERVER_TIME_CONFIG.timer = setInterval(() => {
                                            // 加一秒
                                            SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
                                          }, 1000);
                                        }
                                    }).catch(err => {
                                
                                    });

                                    this.context.navigator.pop({
                                        animated: false
                                    });
                                    
                                    this.props.getDetailThis().context.navigator.push(navScreen("ChatScreen", this.props.liveData.name, {
                                        passProps: {
                                            screen: () => <IMChatctcScreen isPayEntry={true} group={this.props.liveData}/>,
                                            fullScreen: true,
                                            noScrollView: true,
                                            header: {
                                                title: this.props.liveData.name
                                            },
                                            saveBg: '#f3f3f3',
                                            navigatorButtons: {
                                                rightButtons: [
                                                    {
                                                    icon: () => (
                                                        <Image
                                                            source={require("@img/imchat/growing_ico_more.png")}
                                                        />
                                                    ),
                                                    id: "group_chat_menu_btn"
                                                    }
                                                ]
                                            }
                                        }
                                    }));
                                    
                                } else {
                                    Toast.loading("检测到失去云通信连接, 正在重连...");
                                    if(this.context.refs && this.context.refs["personScreen"] && this.context.refs["personScreen"].loginIm) {
                                        this.context.refs["personScreen"].loginIm((loginRes) => {
                                            if(loginRes) {
                                                Toast.info("已连接云通信，请重新进入", 2);
                                            } else {
                                                Toast.info("连接失败，请重试", 2);
                                            }
                                        });
                                    } else {
                                        Toast.info("你已被强制下线，请重新登录", 2);
                                        setTimeout(() => {
                                            this.props.actions.logoutAction({});
                                        }, 2000);
                                    }
                                }
                            });
                            
                        }} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: SDMainColor, width: CSS.pixel(550), height: CSS.pixel(80), borderRadius: CSS.pixel(40)}}>
                            <Text style={{color: '#333', fontSize: CSS.textSize(32), lineHeight: CSS.pixel(44), fontWeight: '500'}}>立即进入</Text>
                        </SDTouchOpacity> : 
                        <SDTouchOpacity onPress={this.rePay.bind(this)} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: SDMainColor, width: CSS.pixel(550), height: CSS.pixel(80), borderRadius: CSS.pixel(40)}}>
                            <Text style={{color: '#333', fontSize: CSS.textSize(32), lineHeight: CSS.pixel(44), fontWeight: '500'}}>重新支付</Text>
                        </SDTouchOpacity>
                    }
                </View>
              </View>
          </View>
      )
   }
}

export default ConnectWithActions((state, props) => ({}))(PayResultScreen);