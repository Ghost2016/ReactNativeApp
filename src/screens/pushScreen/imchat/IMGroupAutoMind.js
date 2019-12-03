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
import { Switch } from "antd-mobile";
import PropTypes from "prop-types";
import { isIphoneX } from "../../../utils/iphonex";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { CSS } from "../../../common/SDCSS";
import { dismissLightBox, SDMainColor } from "../../../styles";
import { headerHeight } from "../../../common/SDHeader";

let switchOff = require("@img/my/mine_btn_switch.png");
let switchOn = require("@img/my/mine_btn_switch_pre.png");

// 顶部菜单自动提示已经默认开启只听老师消息
export default class IMGroupAutoMind extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: CSS.pixel(240),
          top: 40,
          right: 8,
          paddingTop: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 0,
            height: 0,
            borderColor: "transparent",
            borderWidth: 10,
            borderBottomColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            right: 7,
            top: 10,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            shadowColor: "#000",
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: CSS.pixel(8),
            overflow: "hidden",
            width: CSS.pixel(440),
            height: CSS.pixel(210, true),
            position: "absolute",
            right: 0,
            top: 30,
            paddingHorizontal: CSS.pixel(60),
            paddingVertical: CSS.pixel(40),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View>
            <Text style={{fontFamily: "PingFang SC", color: '#fff', fontSize: CSS.textSize(28)}}>已为你默认开启只听导师</Text>
          </View>
          <SDTouchOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: CSS.pixel(24), 
              height: CSS.pixel(60, true),
              width: CSS.pixel(170),
              borderRadius: CSS.pixel(12),
              backgroundColor: SDMainColor,
            }}
            onPress={() => {
              dismissLightBox();
            }}
          >
            <Text style={{textAlign: 'center', fontSize: CSS.textSize(24), fontFamily: 'PingFang SC', color: "#333" }}>
              我知道啦
            </Text>
          </SDTouchOpacity>
        </View>
      </View>
    );
  }
}
