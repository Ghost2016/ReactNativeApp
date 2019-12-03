import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../connectWithActions";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import SDButton from "@sd_components/SDButton";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField, responseOk, toastErr } from "@utils/funcs";
import Touchable from "@src/sd_components/Touchable";

const height = Dimensions.get("window").height;

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");

const inputWhiteStyle = {
  backgroundColor: "#fff",
  color: sdStyles.SDFontColorMain,
  borderWidth: 1,
  borderColor: sdStyles.SDHelperColorline,
};
/**
 * 忘记密码页面
 */
class ForgetPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isNeedReLoad: false, //重新获取
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      currLeftTime: 60,
      userAccount: "",
      userCode: "",
      userPassword: "",
      userPassword2: ""
    };
    this.getCountDown = this.getCountDown.bind(this);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  getCountDown() {
    //console.log("this.state", this.state)
    return (
      <CountDownButton
        isLoadCode={this.state.isLoadCode}
        isActive={this.state.isValidPhone && this.state.isActive}
        currLeftTime={this.state.currLeftTime}
        isNeedReLoad={this.state.isNeedReLoa}
        onPress={this.onPressGetCode.bind(this)}
        style={{
          position: "relative",
          left: CSS.pixel(5, true),
        }}
      />
    );
  }

  onPressFind() {
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
    if(notValidField(this.state.userPassword2, 'confirm', this.state.userPassword)){
      return
    }

    if (
      this.state.userPassword.length >= 6 &&
      !this.state.userPassword.match(/[ ]/i) &&
      this.state.userPassword === this.state.userPassword2
    ) {
      this.props.actions.findPasswordAction({
        phone: this.state.userAccount,
        code: this.state.userCode,
        password: this.state.userPassword
      }).then(res => {

        responseOk(res).then(data => {
          Toast.success("密码重置成功, 请重新登录", 2.5);
          this.context.navigator.pop();
          /* this.setState({
            isSubmitting: false,
          }) */
        }).catch(err=>{
          toastErr(Toast, err)
          /* this.setState({
            isSubmitting: false,
          }) */
        })

      });
    } else {
      Toast.fail("请输入至少6位数同时含字母和数字的密码", 2.5);
    }
  }

  onPressGetCode = async () => {
    if (this.state.isLoadCode) {
      return;
    }
    _onPressGetCode(this, Toast, () => {
      return new Promise((resolve, reject) => {
        if (notValidField(this.state.userAccount, 'phone', "请输入正确格式手机号码再获取验证码")) {
          reject(null);
        } else {
          resolve({
            phone: this.state.userAccount,
            type: "recover"
          });
        }
      });
    });
  };

  render() {
    return (
      <ScrollView style={{
        backgroundColor: '#fff',
        height: height,
        borderWidth: 0,
        borderColor: '#f00',
      }}>
        <View
          style={{
            //flex: 1,
            padding: 0,
            paddingTop: Platform.OS === "ios" ? CSS.pixel(100) : CSS.pixel(100),
            width: CSS.pixel(550),
            //height: CSS.pixel(850),
            flexDirection: "column",
            alignContent: "flex-start",
            justifyContent: "flex-start",
            //backgroundColor: '#fff',
            alignSelf: "center",
            borderWidth: 0,
            borderColor: '#f00',
          }}
        >
          <SDInput2
            placeholder="输入手机号"
            onChange={value => {
              this.setState({ userAccount: value });
              if(value.match(/^1[0-9]{10}$/i)){
                this.setState({ isValidPhone: true });
              } else {
                this.setState({ isValidPhone: false });
              }
            }}
            refName="userAccount"
            type="number"
            icon={iconLoginPhone}
            inputStyle={inputWhiteStyle}
          />

          <SDInputHalf2
            placeholder="输入短信验证码"
            onChange={value => this.setState({ userCode: value })}
            refName="userCode"
            type="text"
            icon={iconLoginCode}
            right={this.getCountDown}
            inputStyle={inputWhiteStyle}
          />

          <SDInput2
            placeholder="设置新密码"
            onChange={value => this.setState({ userPassword: value })}
            refName="userPassword"
            type="password"
            icon={iconLoginPasswd}
            inputStyle={inputWhiteStyle}
          />

          <SDInput2
            placeholder="确认新密码"
            onChange={value => this.setState({ userPassword2: value })}
            refName="userPassword2"
            type="password"
            icon={iconLoginPasswd}
            inputStyle={inputWhiteStyle}
          />

          <Touchable
            style={{
              width: CSS.pixel(550),
              height: CSS.pixel(82),
              paddingLeft: 0,
              paddingRight: 0,
              marginTop: CSS.pixel(40)
            }}
          >
            <SDButton
              style={{
                zIndex: 7,
                backgroundColor: sdStyles.SDMainColor,
                borderRadius: CSS.pixel(50),
                width: CSS.pixel(550),
                position: "relative",
                top: 0,
                marginTop: 0 //CSS.pixel(40)
              }}
              btnStyle={{
                fontSize: CSS.textSize(30),
                color: sdStyles.SDFontColorMain,
              }}
              title="确认"
              onPress={this.onPressFind.bind(this)}
            />
          </Touchable>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(ForgetPasswordScreen);
