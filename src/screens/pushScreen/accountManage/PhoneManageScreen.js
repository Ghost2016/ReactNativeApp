import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import FeedBackForm from "../../../sd_feedBack/FeedBackForm";
import defaultStyle, { navScreen } from "@styles";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { hidePhone } from "../../../utils/funcs";

//我的 - 设置密码
import SetPasswordScreen from "@src/screens/pushScreen/setPassword/SetPasswordScreen";
//我的 - 修改手机号
import ChangePhoneScreen from "@src/screens/pushScreen/changePhone/ChangePhoneScreen";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  footter: {
    height: CSS.pixel(120, true)
  },
  saveBtnBox: {
    marginBottom: CSS.pixel(40, true),
    height: CSS.pixel(90, true),
    width: CSS.pixel(550),
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden",
    alignSelf: "center"
  }
});

// 我的-手机号码
class PhoneManageScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  onPressSetPwd() {
    this.context.navigator.push(
      navScreen("PushScreen", "设置密码", {
        passProps: {
          screen: () => <SetPasswordScreen />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "设置密码",
            //fixed: true,
          }
        }
      })
    );
  }

  onPressChangePhone() {
    this.context.navigator.push(
      navScreen("PushScreen", "修改手机", {
        passProps: {
          screen: () => <ChangePhoneScreen />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "修改手机",
            //fixed: true,
          }
        },
      })
    );
  }

  render() {
    const { user } = this.props;
    return (
      <ScrollView style={styles.container}>
        <View style={[defaultStyle.center, { height: 300 }]}>
          <Image
            style={{ width: CSS.pixel(200), height: CSS.pixel(200) }}
            source={require("@img/my/mine_ico_phone.png")}
            resizeMode="stretch"
          />
          <Text style={{ color: "#333", marginTop: CSS.pixel(40, true) }}>
            你的手机号：{user.phone && typeof user.phone === 'string' && user.phone.length == 11 ? hidePhone(user.phone): "暂未绑定"}
          </Text>
          {this.props.loginType == "phoneCode" ? (
            <Text
              style={{
                width: CSS.pixel(550),
                color: "#fe8900",
                textAlign: "center",
                fontSize: CSS.pixel(24),
                marginTop: 10,
                lineHeight: CSS.pixel(36)
              }}
            >
              系统检测到你是通过手机验证码登录，建议设置密码提升账号安全性
            </Text>
          ) : null}
        </View>
        <View style={{
          marginTop: CSS.pixel(40, true),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <SDTouchOpacity style={{
            backgroundColor: SDMainColor,
            width: CSS.pixel(550),
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: CSS.pixel(40)
          }} onPress={this.onPressSetPwd.bind(this)}>
            <Text style={{color: '#333', fontSize: CSS.textSize(30)}}>
              设置密码
            </Text>
          </SDTouchOpacity>
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
            borderWidth: 1,
            borderColor: SDMainColor
          }} onPress={this.onPressChangePhone.bind(this)}>
            <Text style={{color: SDMainColor, fontSize: CSS.textSize(30)}}>
              更换手机号
            </Text>
          </SDTouchOpacity>
        </View>
      </ScrollView>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  loginType: state.loginType
}))(PhoneManageScreen);
