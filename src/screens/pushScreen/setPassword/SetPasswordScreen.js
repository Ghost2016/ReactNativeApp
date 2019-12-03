import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";

import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { navScreen } from "@styles";
import { hidePhone } from "@utils/funcs";
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField } from "@utils/funcs";
import { SDMainColor } from "../../../styles";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");
const iconLoginName = require("@img/login/login_ico_name.png");

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 45,
    paddingRight: 45,
    overflow: "hidden"
  },
  inputWrap: {
    height: 70,
    paddingLeft: 25,
    paddingRight: 40
  }
});

const inputWhiteStyle = {
  backgroundColor: "#fff",
  color: sdStyles.SDFontColorMain,
  borderWidth: 1,
  borderColor: sdStyles.SDHelperColorline,
};

// 我的-设置密码
class SetPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isNeedReLoad: false, //重新获取
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      currLeftTime: 60,
      userAccount: this.props.user.phone,
      userCode: "",
      userPassword: ""
    };
    this.timer = null;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

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
              type: "recover"
            });
          }
        });
      });
    }, 200);
  };

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidMount = () => {
    if(!notValidField(this.props.user.phone, 'phone')){
      this.setState({ isValidPhone: true });
    }
  };

  onPressOk() {
    //this.props.navigator.pop();

    if(this.state.userCode == '') {
      Toast.fail("验证码不能为空", 1)
      return;
    }
    
    if (
      this.state.userPassword.length >= 6 &&
      !this.state.userPassword.match(/[ ]/i)
    ) {

      //请输入至少6位数同时含字母和数字的密码
      if(notValidField(this.state.userPassword, 'password')){
        return
      }

      Toast.loading("设置密码中");
      this.props.actions
        .findPasswordAction({
          phone: this.state.userAccount,
          code: this.state.userCode,
          password: this.state.userPassword
        })
        .then(res => {
          if(res.status == 'ok') {
            Toast.success("设置密码成功！");
            setTimeout(() => {
              this.context.navigator.pop();
            }, 1000);
          } else {
            Toast.success("设置密码失败！");
          }
        });
    } else {
      Toast.fail("请确认密码至少六位");
    }
  }

  getCountDown = () => {
    // console.log("this.state", this.state);
    return (
      <CountDownButton
        isLoadCode={this.state.isLoadCode}
        isActive={this.state.isValidPhone && this.state.isActive}
        currLeftTime={this.state.currLeftTime}
        isNeedReLoad={this.state.isNeedReLoad}
        onPress={this.onPressGetCode.bind(this)}
        style={{
          position: "relative",
          left: CSS.pixel(5, true),
        }}
      />
    );
  };

  render() {
    return (
      <ScrollView style={styles.container} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: CSS.pixel(550),
            height: CSS.pixel(480, true),
            position: "relative",
            borderWidth: 0,
            borderColor: '#f00',
            alignSelf: "center",
          }}
        >
          <SDInput2
            placeholder="输入手机号"
            type="number"
            onChange={value => {
              this.state.userAccount = value;
              if(value.match(/^1[0-9]{10}$/i)){
                this.setState({ isValidPhone: true });
              } else {
                this.setState({ isValidPhone: false });
              }
            }}
            //style={{ position: "absolute", left: 0, top: 30 }}
            refName="userAccount"
            defaultValue={this.props.user.phone}
            editable={false}
            icon={iconLoginPhone}
            inputStyle={inputWhiteStyle}
            style={{
              left: CSS.pixel(-38),
            }}
          />

          <SDInputHalf2
            placeholder="输入短信验证码"
            onChange={value => (this.state.userCode = value)}
            refName="codeText"
            type="text"
            //style={{ position: "absolute", left: 0, top: 90 }}
            icon={iconLoginCode}
            right={this.getCountDown}
            inputStyle={inputWhiteStyle}
            style={{
              left: CSS.pixel(-34),
            }}
          />

          <SDInput2
            placeholder="设置登录密码"
            onChange={value => (this.state.userPassword = value)}
            refName="passwordText"
            type="password"
            //style={{ position: "absolute", left: 0, top: 150 }}
            icon={iconLoginPasswd}
            inputStyle={inputWhiteStyle}
            style={{
              left: CSS.pixel(-38),
            }}
          />
        </View>
        <View style={{
          marginTop: CSS.pixel(40, true),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <SDTouchOpacity style={{
            width: CSS.pixel(550),
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: CSS.pixel(40),
            backgroundColor: SDMainColor
          }} onPress={this.onPressOk.bind(this)}>
            <Text style={{color: '#333', fontSize: CSS.textSize(30)}}>
              确定
            </Text>
          </SDTouchOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(SetPasswordScreen);
