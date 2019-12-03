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
import { dismissLightBox } from "../../../styles";
import { headerHeight } from "../../../common/SDHeader";

let switchOff = require("@img/my/mine_btn_switch.png");
let switchOn = require("@img/my/mine_btn_switch_pre.png");

// 顶部菜单
export default class IMGroupHeaderMenu extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      backgroundAnimate: new Animated.Value(0),
      isMasterOnly: this.props.isMasterOnly ? true : false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(this.state.backgroundAnimate, {
        duration: 300,
        toValue: 1
      }).start();
    }, Platform.OS == 'ios' ? 420 : 0);
  }

  render() {
    let backgroundColor = this.state.backgroundAnimate.interpolate({
      inputRange: [0, 1], //输入值
      outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.3)"] //输出值
    });
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          top: Platform.OS == 'ios' ? headerHeight + 2 : headerHeight,
          right: 0,
          paddingTop: 30,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: backgroundColor
        }}
      >
        <SDTouchOpacity
          onPress={() => {
            Animated.timing(this.state.backgroundAnimate, {
                duration: 0,
                toValue: 0
            }).start(() => {
                dismissLightBox();
            });
          }}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <View
          style={{
            position: "absolute",
            width: CSS.pixel(240),
            top: Platform.OS == 'ios' ? -30 : -20,
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
              borderBottomColor: "#fff",
              position: "absolute",
              right: 7,
              top: 12,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              shadowColor: "#000",
            }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              overflow: "hidden",
              width: CSS.pixel(240)
            }}
          >
            <SDTouchOpacity
              style={{
                height: 40,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "#efefef",
                borderBottomWidth: 1,
                flex: 1,
              }}
              onPress={() => {
                // dismissLightBox();
                this.props.getGroupRoom().refs["containerScroll"].scrollTo({y: 0});
              }}
            >
              <Image source={require("@img/imchat/growing_ico_back_top.png")} />
              <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
                顶部
              </Text>
            </SDTouchOpacity>
            <SDTouchOpacity
              style={{
                height: 40,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                borderBottomColor: "#efefef",
                borderBottomWidth: 1
              }}
              onPress={() => {
                // dismissLightBox();
                this.props.getGroupRoom().refs["containerScroll"].scrollToEnd();
              }}
            >
              <Image
                source={require("@img/imchat/growing_ico_back_down.png")}
              />
              <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
                底部
              </Text>
            </SDTouchOpacity>
            <SDTouchOpacity
              style={{
                height: 40,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flex: 1
              }}
              onPress={() => {
                // dismissLightBox();
                this.props.getGroupRoom().setState({
                  isMasterOnly: !this.state.isMasterOnly
                })
                this.setState({
                    isMasterOnly: !this.state.isMasterOnly
                });
              }}
            >
              {
                  this.state.isMasterOnly ? 
                  <Image
                    source={switchOn}
                /> :
                <Image
                    source={switchOff}
                />
              }
              <Text style={{ marginLeft: 2, fontSize: 16, color: "#333" }}>
                只听导师
              </Text>
            </SDTouchOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
}
