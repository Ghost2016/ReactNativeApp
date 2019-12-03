import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { navScreen } from "@styles";
import AddTelPhoneScreen from '../../pushScreen/addTelPhone/AddTelPhoneScreen'
import { SDMainColor } from "../../../styles";
import { CSS } from "../../../common/SDCSS";

// 提示绑定手机
export default class PhonePoint extends React.PureComponent {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  };
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 40,
          backgroundColor: "#fff"
        }}
      >
        <TouchableOpacity
          style={{
            width: 26,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.context.refs["personScreen"].setState({
              isShowBindPhone: false
            })
          }}
        >
          <View>
            <Image source={require("@img/my/mine_btn_close.png")}/>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Text style={{ color: "#fc8825" }}>为确保账号安全，请绑定手机号</Text>
        </View>

        <TouchableOpacity
          style={{
            width: 80,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", "添加手机号", {
                passProps: {
                  screen: () => <AddTelPhoneScreen />,
                  noScrollView: true,
                  fullScrollView: true,
                  header: {
                    title: "添加手机号"
                  }
                }
              })
            );
          }}
        >
          <View
            style={{
              width: 56,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#fe8900",
              borderWidth: 1,
              borderRadius: 15
            }}
          >
            <Text style={{color: '#fc8825'}}>绑定</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
