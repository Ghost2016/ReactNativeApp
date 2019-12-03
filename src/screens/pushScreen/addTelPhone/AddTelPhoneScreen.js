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
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import store from "@boot/store";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { navScreen } from "@styles";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";
import AddTelPhoneCompleteScreen from './AddTelPhoneCompleteScreen';
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField } from "@utils/funcs";
import { isTesting, testAccount, testPassword } from 'react-native-dotenv'
import { setAppToken } from "@boot/actions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    height: 45,
    marginBottom: 10,
    flexDirection: "row"
  },
  iconBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  saveBtnBox: {
    marginTop: 0,
    height: 46,
    paddingLeft: 30,
    paddingRight: 30,
    overflow: "hidden"
  }
});

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");

const inputWhiteStyle = {
  backgroundColor: "#fff",
  color: sdStyles.SDFontColorMain,
  borderWidth: 1,
  borderColor: sdStyles.SDHelperColorline,
};

// 我的 - 添加手机号页面
class AddTelPhoneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      isNeedReLoad: false, //重新获取
      currLeftTime: 60,
      userAccount: "",
      userCode: "",
      userPassword: ""
    };
    this.timer = null;
    this.getCountDown = this.getCountDown.bind(this);
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onPressOk() {
    //this.props.navigator.pop();
    if(notValidField(this.state.userAccount, 'phone')){
      return
    }
    if(notValidField(this.state.userCode, 'code')){
      return
    }
    if(notValidField(this.state.userPassword, 'password')){
      return
    }
    if (
      this.state.userPassword.length >= 6 &&
      !this.state.userPassword.match(/[ ]/i)
    ) {
      this.props.actions
        .updatePhoneAction({
          phone: this.state.userAccount,
          code: this.state.userCode,
          //修改密码后需要同步刷新token
          password: this.state.userPassword,
        })
        .then(res => {
          if (res.status === "ok") {
            if(res.results && res.results.token){
              store.dispatch(setAppToken(res.results.token));
            }
            this.context.navigator.push(
              navScreen("PushScreen", "添加手机号", {
                passProps: {
                  screen: () => <AddTelPhoneCompleteScreen />,
                  noScrollView: true,
                  fullScreen: true,
                  header: {
                    title: "添加手机号"
                  }
                }
              })
            );
          }
        });
    } else {
      Toast.fail("请确认密码至少六位");
    }
  }

  onPressGetCode = () => {
    if (this.state.isLoadCode) {
      return;
    }
    this.setState({
      isActive: false
    });
    setTimeout(() => {
      _onPressGetCode(this, Toast, () => {
        return new Promise((resolve, reject) => {
          this.setState({
            isActive: true
          })
          if (notValidField(this.state.userAccount, 'phone', "请输入正确格式手机号获取验证码！")) {
            reject(null);
          } else {
            resolve({
              phone: this.state.userAccount,
              type: "phone"
            });
          }
        });
      });
    }, 200);
  };

  getCountDown() {
    return (
      <CountDownButton
        isLoadCode={this.state.isLoadCode}
        isActive={this.state.isValidPhone && this.state.isActive}
        currLeftTime={this.state.currLeftTime}
        isNeedReLoad={this.state.isNeedReLoa}
        onPress={this.onPressGetCode}
        style={{
          position: "relative",
          left: CSS.pixel(5, true),
        }}
      />
    );
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{height: CSS.pixel(100, true)}}></View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#fff',
            borderWidth: 0,
            borderColor: '#f00',

          }}
        >
          <View style={{ width: CSS.pixel(550)}}>
          <SDInput2
              placeholder="输入手机号"
              onChange={value => {
                this.setState({ userAccount: value })
                //this.setState({ userPhone: value });
                if(value.match(/^1[0-9]{10}$/i)){
                  this.setState({ isValidPhone: true });
                } else {
                  this.setState({ isValidPhone: false });
                }
              }}
              type={isTesting === "true" ? "number" : "text"}
              returnKeyLabel="下一步"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.refs["_userCodeInput"].refs.userCode.focus();
              }}
              refName="userAccount"
              defaultValue={isTesting === "true" ? testAccount : this.state.userAccount}
              icon={iconLoginPhone}
              testID={"loginPhone_AddTelPhoneScreen"}
              inputStyle={inputWhiteStyle}
            />

            <SDInputHalf2
                  placeholder="输入短信验证码"
                  ref="_userCodeInput"
                  onChange={value => this.setState({ userCode: value })}
                  refName="userCode"
                  type="text"
                  returnKeyLabel="下一步"
                  returnKeyType="next"
                  onSubmitEditing={e => {
                    this.refs["_passwdInput"].refs.userPassword.focus();
                  }}
                  icon={iconLoginCode}
                  right={this.getCountDown}
                  inputStyle={{
                    marginBottom: CSS.pixel(0, true),
                  }}
                  testID={"code_AddTelPhoneScreen"}
                  inputStyle={inputWhiteStyle}
                />

              <SDInput2
                  ref="_passwdInput"
                  placeholder="设置密码"
                  onChange={value => this.setState({ userPassword: value })}
                  type={isTesting === "true" ? "number" : "text"}
                  refName="userPassword"
                  returnKeyLabel="登录"
                  returnKeyType="done"
                  onSubmitEditing={this.onPressOk.bind(this)}
                  // type="number"
                  type="password"
                  icon={iconLoginPasswd}
                  defaultValue={isTesting === "true" ? testPassword : ""}
                  testID={"password_AddTelPhoneScreen"}
                  inputStyle={inputWhiteStyle}
                />

          </View>
        </View>

        <View
          style={{
            marginTop: CSS.pixel(30),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SDTouchOpacity
            style={{
              width: CSS.pixel(550),
              height: CSS.pixel(80),
              borderRadius: CSS.pixel(40),
              backgroundColor: SDMainColor,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={this.onPressOk.bind(this)}
          >
            <Text style={{ fontSize: CSS.textSize(32), color: "#333" }}>
              提交
            </Text>
          </SDTouchOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state)
}))(AddTelPhoneScreen);
