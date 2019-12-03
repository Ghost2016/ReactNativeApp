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
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { hidePhone } from "@utils/funcs";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  iconBox: {
    width: 136,
    height: 115,
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

// 我的 - 添加手机号成功页面
class AddTelPhoneCompleteScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;
    return (
      <ScrollView style={styles.container}>
        <View style={{height: CSS.pixel(20)}}></View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 240,
            padding: 30,
            backgroundColor: '#fff'
          }}
        >
          <View style={styles.iconBox}>
            <Image
              source={require("@img/account-icon-04.jpg")}
              resizeMode="stretch"
              style={{
                width: 136,
                height: 115
              }}
            />
          </View>
          <View
            style={{
              height: 50,
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#333", fontSize: 16 }}>绑定成功!</Text>
            <Text style={{ color: "#ccc", fontSize: 12 }}>
              下次可使用手机号{hidePhone(user.phone || "")}登录
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: CSS.pixel(80),
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
            onPress={() => {
              this.context.navigator.popToRoot();
            }}
          >
            <Text style={{ fontSize: CSS.textSize(32), color: "#333" }}>
              我知道了
            </Text>
          </SDTouchOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(AddTelPhoneCompleteScreen);
