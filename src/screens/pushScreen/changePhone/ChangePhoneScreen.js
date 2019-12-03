import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { navScreen } from "@styles";
import { InputItem } from "antd-mobile";
import { hidePhone } from "@utils/funcs";

import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import SDIcon from "@sd_components/SDIcon";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField } from "@utils/funcs";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");
const iconLoginName = require("@img/login/login_ico_name.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
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

const formatFormErr = (form = {}) => {
  let err = "";
  Object.keys(form).map((key,i) => {
    if(Array.isArray(form[key])) {
      err += form[key][0];
    } else {
      err += form[key] + "";
    }
    if(i > 0) err += ";";
  });
  return err;
}

// 我的-修改手机
class ChangePhoneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isNeedReLoad: false, //重新获取
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      currLeftTime: 60,
      userAccount: "",
      userCode: ""
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
              type: "phone"
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

  onPressOk() {
    if(notValidField(this.state.userAccount, 'phone')){
      return
    }
    // if(this.props.user.phone == this.state.userAccount){
    //   Toast.fail("请使用新手机号");
    //   return
    // }
    if(notValidField(this.state.userCode, 'code')){
      return
    }
    Toast.loading("修改手机号中");
    this.props.actions
      .updatePhoneAction({
        phone: this.state.userAccount,
        code: this.state.userCode,
      })
      .then(res => {
        if(res && res.status == "ok"){
          Toast.success("修改手机号成功, 请重新登录");
          setTimeout(() => {
            this.props.actions.logoutAction();
          }, 1000);
        } else {
          //msg":"form error
          //console.log("res.msg===", res.msg)

          if(res && res.msg){
            if(res.msg == "form error"){
              Toast.fail(formatFormErr(res.results.form));
            } else {
              Toast.fail(res.msg);
            }
          } else{
            Toast.fail("修改失败");
          }

        }
      }).catch(err => {
        //console.warn(err);
      });

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
    const { user } = this.props;
    return (
      <ScrollView style={styles.container} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.inputWrap,
            {
              marginTop: 20,
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }
          ]}
        >
          <Text style={{ fontSize: 14 }}>
            当前手机号：{hidePhone(user.phone)}
          </Text>
        </View>
        <View
          style={[
            styles.inputWrap,
            { justifyContent: "center", alignItems: "center" }
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#fe8900",
              lineHeight: 20,
              textAlign: "center",
              marginBottom: 20,
              left: 5
            }}
          >
            温馨提示：更换手机号后，该手机号将被注销，下次请使用新手机号进行登录
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 180,
            position: "relative",
            width: CSS.pixel(550),
            borderWidth: 0,
            borderColor: '#f00',
            alignSelf: "center",
          }}
        >
          <SDInput2
            placeholder="输入新手机号"
            type="text"
            onChange={value => {
              this.state.userAccount = value;
              if(value.match(/^1[0-9]{10}$/i)){
                this.setState({ isValidPhone: true });
              } else {
                this.setState({ isValidPhone: false });
              }
            }}
            //style={{ position: "absolute", left: 0, top: 30 }}
            // editable={false}
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
}))(ChangePhoneScreen);
