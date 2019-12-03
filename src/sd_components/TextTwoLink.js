/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import IntlText from "./IntlText";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
const iconSwitch = require("@img/home/home_ico_switch.png");
const iconArrowRightDark = require("@img/grow/growing_ico_click.png");

type Props = {
  title: string,
  title2: string,
  buttonTitle: string,
  styleName: string,
  onPress: () => void
};

export default class TextTwoLink extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress();

  render() {
    const { style, title, title2, buttonTitle, icon } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onPressAction.bind(this)}
        style={{
          borderWidth: 0,
          borderColor: '#f0f',
        }}
      ><View
        style={{
          //flex: 1,
          //width: '93%',
          //marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "flex-start",
          paddingLeft: CSS.pixel(0),
          paddingRight: CSS.pixel(32),
          height: CSS.pixel(106, true),
          borderWidth: 0,
          borderColor: '#f0f',
        }}
      >
        <View
          style={[{
            width: '75%',
            height: CSS.pixel(84, true),
            flexDirection: "row",
            alignItems: "flex-start",
            borderWidth: 0,
            borderColor: '#f00',
            alignSelf: 'center',
            overflow: 'visible',
          }, style]}
        >
          <IntlText
            style={{
              //paddingTop: CSS.pixel(24, true),
              fontSize: CSS.textSize(24),
              color: sdStyles.SDFontColorMinor,
              alignSelf: 'center',
              //justifyContent: 'center',
            }}
            title={title}
          />
          <IntlText
            style={{
              //paddingTop: CSS.pixel(24, true),
              fontSize: CSS.textSize(30),
              fontWeight: 'bold',
              color: sdStyles.SDMainColor,
              alignSelf: 'center',
            }}
            title={title2}
          />
        </View>
        <View style={{
          width: '24%',
          borderWidth: 0,
          borderColor: '#f00',
          alignSelf: 'center',
         }}>
          <View
            style={{
              alignItems: "flex-end",
              height: CSS.pixel(80, true),
              justifyContent: 'center',
              borderWidth: 0,
              borderColor: '#f0f',
            }}

          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={icon ? icon : iconArrowRightDark}
                style={{ marginRight: CSS.pixel(10) }}
              />
              {/* <Text
                style={{ color: sdStyles.SDMainColor, fontSize: CSS.pixel(28) }}
              >
                {buttonTitle}
              </Text> */}
            </View>
          </View>
        </View>
      </View></TouchableOpacity>
    );
  }
}
