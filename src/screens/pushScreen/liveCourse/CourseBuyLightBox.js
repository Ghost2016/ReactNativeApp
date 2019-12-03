import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Animated
} from "react-native";
import { Toast } from 'antd-mobile';
import * as WeChat from 'react-native-wechat';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import { SDMainColor, dismissLightBox, navScreen } from "../../../styles";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import PayResultScreen from "./PayResultScreen";
import IMChat from "../../../boot/IMChat";
const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");
// 职么课堂-购买课程弹窗
class CourseBuyLightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectPayType: 1, // 1-支付宝 2-微信
        backgroundColorAnimate: new Animated.Value(0)
    }
  }
  static contextTypes = {
    navigator: () => null
  }
  componentDidMount() {
      setTimeout(() => {
          Animated.timing(this.state.backgroundColorAnimate, {
              duration: 300,
              toValue: 255
          }).start()
        //   this.state.backgroundColorAnimate.setValue(255);
      }, 300)
  }
  render() {
    let backgroundColor = this.state.backgroundColorAnimate.interpolate({
        inputRange: [0, 255],
        outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']
    })
    return (
        <Animated.View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: backgroundColor
        }}>
            <View style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: CSS.pixel(576),
                backgroundColor: '#fff',
                
            }}>
                <View style={{
                    height: CSS.pixel(88),
                    borderTopRightRadius: CSS.pixel(20),
                    borderTopLeftRadius: CSS.pixel(20),
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    borderBottomColor: '#eee',
                    borderBottomWidth: 2
                }}>
                    <View style={{marginRight: CSS.pixel(30), justifyContent: 'center', opacity: 0}}>
                        <Image source={require("@img/imchat/pay/btn_close.png")}/>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#333', fontSize: CSS.textSize(30), lineHeight: CSS.pixel(42)}}>支付</Text>
                    </View>
                    <SDTouchOpacity onPress={() => {
                        dismissLightBox();
                    }} style={{marginRight: CSS.pixel(30), justifyContent: 'center'}}>
                        <Image source={require("@img/imchat/pay/btn_close.png")}/>
                    </SDTouchOpacity>
                </View>
                <View style={{height: CSS.pixel(400)}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: CSS.pixel(44)}}>
                        <Text style={{color: '#333', fontSize: CSS.textSize(34), lineHeight: CSS.pixel(48), fontWeight: '600'}}>需支付: {this.props.liveData && this.props.liveData.price}</Text>
                    </View>
                    <View style={{marginLeft: CSS.pixel(60), marginRight: CSS.pixel(30), marginTop: CSS.pixel(72)}}>
                        <SDTouchOpacity onPress={() => {
                            this.setState({
                                selectPayType: 1
                            })
                        }} style={{flexDirection: 'row',  alignItems: 'center'}}>
                            <View style={{justifyContent: 'center'}}>
                                <Image source={require("@img/imchat/pay/growing_ico_ZhiFuBao.png")}/>
                            </View>
                            <View style={{flex: 1, marginLeft: CSS.pixel(20), justifyContent: 'center'}}>
                                <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40), fontWeight: '600'}}>支付宝支付</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                {this.state.selectPayType == 1 ? <Image style={{width: CSS.pixel(40), height: CSS.pixel(40)}} source={selectedIcon}/> : <View style={{width: CSS.pixel(38), height: CSS.pixel(38), borderRadius: CSS.pixel(20), borderWidth: 2, borderColor: '#333'}}></View>}
                            </View>
                        </SDTouchOpacity>
                        <SDTouchOpacity onPress={() => {
                            this.setState({
                                selectPayType: 2
                            })
                        }} style={{flexDirection: 'row', marginTop: CSS.pixel(60), alignItems: 'center'}}>
                            <View style={{justifyContent: 'center'}}>
                                <Image source={require("@img/imchat/pay/growing_ico_WeChat.png")}/>
                            </View>
                            <View style={{flex: 1, marginLeft: CSS.pixel(20), justifyContent: 'center'}}>
                                <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40), fontWeight: '600'}}>微信支付</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                {this.state.selectPayType == 2 ? <Image style={{width: CSS.pixel(40), height: CSS.pixel(40)}} source={selectedIcon}/> : <View style={{width: CSS.pixel(38), height: CSS.pixel(38), borderRadius: CSS.pixel(20), borderWidth: 2, borderColor: '#333'}}></View>}
                            </View>
                        </SDTouchOpacity>
                    </View>
                </View>
                <SDTouchOpacity onPress={() => {
                    // 判断选择的是支付宝还是微信
                    if (this.state.selectPayType == 1) {
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
                                            dismissLightBox();
                                            this.props.getDetailThis && this.props.getDetailThis().fetNewData();
                                            this.props.getContext().navigator.push(navScreen("PushScreen", "课程支付", {
                                                passProps: {
                                                    screen: () => <PayResultScreen getDetailThis={this.props.getDetailThis} getContext={this.props.getContext} payWay={"ali"} liveData={this.props.liveData} success={true}/>,
                                                    noScrollView: true,
                                                    fullScreen: true,
                                                    header: {
                                                        title: "课程支付"
                                                    }
                                                } 
                                                }))
                                        }).catch(err => {
                                            dismissLightBox();
                                            if(err && err.status_code == '400') {
                                                Toast.fail(err.msg || "参与失败");
                                            }
                                            this.props.getDetailThis && this.props.getDetailThis() && this.props.getDetailThis().fetNewData(true);
                                        })
                                    }, 1000)
                                }).catch(errr => {
                                    dismissLightBox();
                                    this.props.getContext().navigator.push(navScreen("PushScreen", "课程支付", {
                                        passProps: {
                                            screen: () => <PayResultScreen getDetailThis={this.props.getDetailThis} getContext={this.props.getContext} payWay={"ali"} liveData={this.props.liveData}/>,
                                            noScrollView: true,
                                            fullScreen: true,
                                            header: {
                                                title: "课程支付"
                                            }
                                        } 
                                    }))
                                });
                            } else {

                            }
                        }).catch(err => {

                        })
                    } else {
                        // 微信
                        WeChat.isWXAppInstalled().then(isInstalled => {
                            if (isInstalled) {
                                this.props.actions.getWxpayUrlAction({
                                    object_id: this.props.liveData.id
                                }).then(res => {
                                    if (res.status == 'ok') {
                                        IMChat.wxPay(res.results).then(res => {
                                            // 跳转到支付成功界面
                                            // 判断是否成功
                                            if (res.errCode == 0) { // 支付成功
                                                Toast.loading("返回支付结果中", 1);
                                                setTimeout(() => {
                                                    this.props.actions.addLiveCourseStudentAction({
                                                        id: this.props.liveData.id
                                                    }).then(res => {
                                                        dismissLightBox();
                                                        this.props.getDetailThis && this.props.getDetailThis().fetNewData();
                                                        this.props.getContext().navigator.push(navScreen("PushScreen", "课程支付", {
                                                            passProps: {
                                                                screen: () => <PayResultScreen getDetailThis={this.props.getDetailThis} getContext={this.props.getContext} payWay={"wx"} liveData={this.props.liveData} success={true}/>,
                                                                noScrollView: true,
                                                                fullScreen: true,
                                                                header: {
                                                                    title: "课程支付"
                                                                }
                                                            } 
                                                        }))
                                                    }).catch(err => {
                                                        dismissLightBox();
                                                        if(err && err.status_code == '400') {
                                                            Toast.fail(err.msg || "参与失败");
                                                        }
                                                        this.props.getDetailThis && this.props.getDetailThis() && this.props.getDetailThis().fetNewData(true);
                                                    })
                                                }, 1000);
                                            } else {    // -1 支付失败   -2 用户取消
                                                dismissLightBox();
                                                this.props.getContext().navigator.push(navScreen("PushScreen", "课程支付", {
                                                    passProps: {
                                                        screen: () => <PayResultScreen getDetailThis={this.props.getDetailThis} getContext={this.props.getContext} payWay={"wx"} liveData={this.props.liveData}/>,
                                                        noScrollView: true,
                                                        fullScreen: true,
                                                        header: {
                                                            title: "课程支付"
                                                        }
                                                    } 
                                                }))
                                            }
                                        }).catch(errr => {
                                            dismissLightBox();
                                            Toast.info("出错啦", 2);
                                            this.props.getDetailThis && this.props.getDetailThis() && this.props.getDetailThis().fetNewData(true);
                                        })
                                    }
                                }).catch(err => {

                                })
                            } else {
                                Toast.info("微信暂未安装，请使用支付宝支付");
                            }
                        }).catch(err => {
                            Toast.info("微信暂未安装或版本较低，请使用支付宝支付");
                        })
                    }
                }} style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: SDMainColor, justifyContent: 'center', alignItems: 'center', height: CSS.pixel(80)}}>
                    <Text style={{color: '#333', fontSize: CSS.textSize(32), lineHeight: CSS.pixel(44), fontWeight: '500'}}>立即支付</Text>
                </SDTouchOpacity>
            </View>
        </Animated.View>
    );
  }
}

export default connectWithActions((state, props) => ({
    user: state.user
  }))(
    CourseBuyLightBox
);