import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { SDMainColor, navScreen, navLightBox } from "../../../styles/index";
import { CSS } from "../../../common/SDCSS";
import config from "../../../config";
import ShareButton from "../../../sd_shareButton/ShareButton";
import { isIphoneX } from "../../../utils/iphonex";
import CalcSalaryScreen from "./CalcSalaryScreen";
import * as HOSTS from "@src/host";

const wIs320 = Dimensions.get("window").width <= 320;

const sWidth = Dimensions.get("window").width;
const sHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#fb7f49",
    position: "relative"
  }
});

// 计算薪资首页
export default class CalcSalaryHomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight
          }}
        >
          <Image
            source={
              isIphoneX()
                ? require("@img/salary/home_Salary_bg_iPhone_x.png")
                : require("@img/salary/home_Salary_bg.png")
            }
            style={{ width: sWidth, height: sHeight }}
            resizeMode="stretch"
          />
        </View>
        <View
          style={{
            position: "absolute",
            left: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.context.navigator.popToRoot({
                animated: true,
                animationType: "fade"
              });
            }}
            style={{
              width: CSS.pixel(100)
            }}
          >
            <Image source={require("@img/login/home_ico_back.png")} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // this.refs["_shareButton"].show();
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => {
                    return (
                      <ShareButton
                        timeLineOptions={{
                          type: "news",
                          title: `大家快来职么开门里算薪资试试👊`,
                          description: `大家快来职么开门里算薪资试试👊`,
                          webpageUrl: `${HOSTS.SHARE}/`
                        }}
                        sessionOptions={{
                          type: "news",
                          title: `大家快来职么开门里算薪资试试👊`,
                          description: `大家快来职么开门里算薪资试试👊`,
                          webpageUrl: `${HOSTS.SHARE}/`
                        }}
                      />
                    );
                  }
                }
              });
            }}
          >
            <Image source={require("@img/salary/home_ico_share.png")} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            left: CSS.pixel(60),
            bottom: isIphoneX() ? CSS.pixel(255, true) : CSS.pixel(160, true)
            // bottom: isIphoneX() ? CSS.pixel(255, true) : CSS.pixel(160, true),
          }}
        >
          <Image
            source={
              isIphoneX()
                ? require("@img/salary/home_Salary_banner_iPhone_x.png")
                : require("@img/salary/home_Salary_banner.png")
            }
            style={{
              width: CSS.pixel(630),
              height: isIphoneX() ? CSS.pixel(702, true) : CSS.pixel(860, true)
            }}
            resizeMode="stretch"
          />
        </View>

        <View
          style={{
            width: "100%",
            position: "absolute",
            bottom:
              Platform.OS === "ios"
                ? isIphoneX()
                  ? CSS.pixel(100, true)
                  : CSS.pixel(30, true)
                : CSS.pixel(56, true),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: CSS.pixel(350),
              height: CSS.pixel(80, true),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: SDMainColor,
              paddingHorizontal: CSS.pixel(8),
              paddingVertical: CSS.pixel(5),
              borderRadius: CSS.pixel(50)
            }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "算薪资", {
                  passProps: {
                    screen: () => <CalcSalaryScreen />,
                    fullScreen: true,
                    header: false,
                    statusBarColor: "light"
                  }
                })
              );
            }}
          >
            <Text style={{ color: "#fff", fontSize: CSS.textSize(32) }}>
              开始算薪资
            </Text>
          </TouchableOpacity>
        </View>
        {/* <ShareButton
          ref="_shareButton"
          height={Dimensions.get("window").height}
        /> */}
      </View>
    );
  }
}
