/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground
} from "react-native";
//import { List } from "../common/index";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";
import SDBoxCard from "@sd_components/SDBoxCard";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {};

const iconClose = require("@img/grow/growing_ico_close.png");

//lightBox弹窗组件
export default class SDBox extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  onPressDismiss() {
    this.context.navigator.dismissLightBox();
  }

  render() {
    const { children, noClose, style, innerStyle, ..._props } = this.props;
    //console.log("title====", title);
    return (
      <View
        style={[{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          width: width,
          height: height,
          overflow: "visible",
          borderWidth: 0,
          borderColor: "#f0f",
        }, style]}
      >
        <SDBoxCard
          containerStyle={[{
            borderWidth: 0,
            borderColor: "#f00"
          }, innerStyle]}
          {..._props}
        >
          {children}
        </SDBoxCard>
        {noClose ? null : (
          <SDButton
            style={{
              flexDirection: "column",
              alignContent: "stretch",
              justifyContent: "center",
              backgroundColor: "transparent",
              borderRadius: 0,
              zIndex: 8,
              borderWidth: 0,
              borderColor: "#f0f",
              //marginTop: CSS.pixel(20, true),
              width: CSS.pixel(500),
              height: CSS.pixel(80, true)
            }}
            btnStyle={{
              fontSize: CSS.pixel(30),
              color: sdStyles.SDFontColorMain,
              borderWidth: 0,
              borderColor: "#0ff"
            }}
            onPress={this.onPressDismiss.bind(this)}
            title={() => {
              return (
                <Image
                  source={iconClose}
                  style={{
                    width: CSS.pixel(43),
                    height: CSS.pixel(43, true)
                  }}
                />
              );
            }}
          />
        )}
      </View>
    );
  }
}
