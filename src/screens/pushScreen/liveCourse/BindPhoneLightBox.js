import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen, dismissLightBox } from "../../../styles";
import LiveCourseDetailScreen from "./LiveCourseDetailScreen";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { isIphoneX } from "../../../utils/iphonex";
import { notValidField, hidePhone } from "../../../utils/funcs";
import store from "../../../boot/store";
import { setAppToken } from "../../../boot/actions";

// 职么课堂-绑定手机号
class BindPhoneLightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        phoneText: "",
        code: "",
        password: "",

        checkBtnValid: false,
        leftTime: 0,
        isFirstCheck: true,

        isBindSuc: false
    };

    this.timer = null;
  }
  onPressBindEnterBtn() {
    if(!this.state.phoneText && this.state.phoneText.length != 11 && !/^1[0-9]{10}$/.test(this.state.phoneText)) {
        Toast.info("请输入正确格式手机号码", 1);
        return;
    }
    if(!this.state.code) {
        Toast.info("请输入验证码", 1);
        return;
    }
    if(!this.state.password) {
        Toast.info("请输入密码", 1);
        return;
    }
    this.props.actions
    .updatePhoneAction({
      phone: this.state.phoneText,
      code: this.state.code,
      //修改密码后需要同步刷新token
      password: this.state.password,
    })
    .then(res => {
      if (res.status === "ok") {
        if(res.results && res.results.token){
          store.dispatch(setAppToken(res.results.token));
        }
        // 提示绑定成功
        this.setState({
            isBindSuc: true
        })
      }
    });
  }
  render() {
    return (
      <SDTouchOpacity onPress={() => {
          dismissLightBox();
      }} style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 0,
          justifyContent: 'center',
          alignItems: 'center'
      }}>
      {
          this.state.isBindSuc ? 
          (<SDTouchOpacity onPress={null}
            style={{
                width: CSS.pixel(670),
                minHeight: CSS.pixel(540),
                backgroundColor: '#fff',
                borderRadius: CSS.pixel(20),
                overflow: 'hidden'
            }}
          >
            <View style={{paddingVertical: CSS.pixel(70)}}>
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={require("@img/my/ming_ico_Success.png")}
                    />
                </View>
                <View
                    style={{
                        marginTop: CSS.pixel(50),
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: CSS.pixel(100)
                    }}
                >
                    <Text style={{ color: "#333", fontSize: CSS.textSize(36) }}>绑定成功!</Text>
                    <Text style={{ color: "#666", fontSize: CSS.textSize(30) }}>
                        下次可使用手机号{hidePhone(this.state.phoneText || "")}登录
                    </Text>
                </View>
            </View>
            <SDTouchOpacity onPress={() => {
                dismissLightBox();
            }} style={{justifyContent: 'center', alignItems: 'center', height: CSS.pixel(100), borderTopColor: '#ddd', borderTopWidth: 1}}>
                <Text style={{fontSize: CSS.textSize(36), color: SDMainColor}}>我知道啦</Text>
            </SDTouchOpacity>
          </SDTouchOpacity>)
          :
        (<SDTouchOpacity onPress={null} activeOpacity={1} style={{
            width: CSS.pixel(670),
            minHeight: CSS.pixel(580),
            backgroundColor: '#fff',
            borderRadius: CSS.pixel(20),
            overflow: 'hidden'
        }}>
            <View style={{paddingHorizontal: CSS.pixel(80), paddingVertical: CSS.pixel(70)}}>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: CSS.textSize(34), color: '#333', fontWeight: '600'}}>请先绑定手机号</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: CSS.pixel(8), paddingVertical: CSS.pixel(24), borderBottomColor: '#ddd', borderBottomWidth: 1}}>
                    <TextInput underlineColorAndroid="transparent" onSubmitEditing={() => {
                        this.refs['_checkCodeInput'].focus();
                    }} keyboardType="numeric" onChangeText={t => {
                        this.state.phoneText = t;
                        if (!/^1[0-9]{10}$/i.test(t)) {
                            this.setState({
                                checkBtnValid: false
                            });
                        } else {
                            this.setState({
                                checkBtnValid: true
                            });
                        }
                    }} returnKeyLabel="下一项" returnKeyType="next" autoCapitalize={false} autoCorrect={false} placeholder="手机号" style={{padding: 0, fontSize: CSS.textSize(30), flex: 1}}/>
                </View>
                <View style={{marginTop: CSS.pixel(8), flexDirection: 'row', alignItems: 'center', paddingVertical: CSS.pixel(24), borderBottomColor: '#ddd', borderBottomWidth: 1}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <TextInput underlineColorAndroid="transparent" onSubmitEditing={() => {
                            this.refs['_passInput'].focus();
                        }} onChangeText={c => {
                            this.state.code = c;
                        }} ref="_checkCodeInput" returnKeyLabel="下一项" returnKeyType="next"  autoCapitalize={false} autoCorrect={false} placeholder="验证码" style={{padding: 0, fontSize: CSS.textSize(30), flex: 1}}/>
                    </View>
                    <SDTouchOpacity onPress={() => {
                        Toast.success("正在发送验证码", 1);
                        this.props.actions.getVerifyCodeAction({
                            phone: this.state.phoneText,
                            type: "phone"
                        });
                        clearInterval(this.timer);
                        this.setState({
                            checkBtnValid: false,
                            leftTime: 60,
                            isFirstCheck: false
                        }, () => {
                            this.timer = setInterval(() => {
                                if (this.state.leftTime != 0 && this.state.leftTime >= 1) {
                                    this.setState({
                                        checkBtnValid: false,
                                        leftTime: --this.state.leftTime
                                    })
                                } else {
                                    this.setState({
                                        checkBtnValid: true,
                                        leftTime: 0
                                    })
                                }
                            }, 1000);
                        })
                    }} disabled={this.state.checkBtnValid && this.state.leftTime == 0 ? false : true} style={{paddingHorizontal: CSS.pixel(20), backgroundColor: this.state.checkBtnValid && this.state.leftTime == 0 ? SDMainColor : '#bfbfbf', paddingVertical: CSS.pixel(14), width: CSS.pixel(165), alignItems: 'center', justifyContent: 'center', }}>
                    {<Text style={{color: '#333', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{this.state.isFirstCheck ? "获取验证码" : this.state.leftTime != 0 ? `剩余(${this.state.leftTime})s` : "重新获取"}</Text>}
                    </SDTouchOpacity>
                </View>
                <View style={{marginTop: CSS.pixel(8), alignItems: 'center', paddingVertical: CSS.pixel(24), justifyContent: 'flex-start', borderBottomColor: '#ddd', borderBottomWidth: 1, flexDirection: 'row'}}>
                    <TextInput underlineColorAndroid="transparent" onChangeText={c => {
                        this.state.password = c;
                    }} ref="_passInput" returnKeyLabel="确定" returnKeyType="done" autoCapitalize={false} autoCorrect={false} placeholder="设置密码" secureTextEntry={true} style={{padding: 0, fontSize: CSS.textSize(30), flex: 1}}/>
                </View>
            </View>
            <SDTouchOpacity onPress={this.onPressBindEnterBtn.bind(this)} style={{justifyContent: 'center', alignItems: 'center', height: CSS.pixel(100), borderTopColor: '#ddd', borderTopWidth: 1}}>
                <Text style={{fontSize: CSS.textSize(36), color: SDMainColor}}>提交</Text>
            </SDTouchOpacity>
        </SDTouchOpacity>)
       }
      <SDKeyboardSpacer
          topSpacing={isIphoneX() ? -34 : 0}
          onToggle={open => {
          }}
        />
    </SDTouchOpacity>
    );
  }
}

export default connectWithActions((state, props) => ({
    user: state.user
  }))(
    BindPhoneLightBox
);