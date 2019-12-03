/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions, Image, ImageBackground } from "react-native";
import PropTypes from "prop-types";
import IntlText from "./IntlText";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Touchable } from "./index";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
const iconSwitch = require("@img/home/home_ico_switch.png");
const iconSwitchBg = require("@img/home/grpwing_pic_position_bg.png");
const iconArrowRightDark = require("@img/home/growing_btn_arrow.png");

type Props = {
  title: string,
  title2: string,
  buttonTitle: string,
  styleName: string,
  onPress: () => void
};

export default class TextTwoLink2 extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress();

  render() {
    const { style, title, title2, buttonTitle, icon, noBg } = this.props;
    return (
      <Touchable
        onPress={this.onPressAction.bind(this)}
      ><View
        style={{
          //flex: 1,
          //width: '93%',
          //marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: 'center',
          alignSelf: 'center',
          height: CSS.pixel(144, true),
          borderWidth: 0,
          borderColor: '#f0f',
          marginBottom: noBg ? CSS.pixel(0) : CSS.pixel(15, true),
        }}
      >
        {noBg ? null : <ImageBackground
            resizeMode="cover"
            source={iconSwitchBg}
            style={{
                  position: 'absolute',
                  width: CSS.pixel(714),
                  height: CSS.pixel(144, true),
                  zIndex: 1,
                  top: CSS.pixel(3, true),
                  borderWidth: 0,
                  borderColor: '#00f',
           }} />}
        <View style={{
          width: CSS.pixel(714),
          height: CSS.pixel(144, true),
          zIndex: 5,
          borderWidth: 0,
          borderColor: '#f00',
          flexDirection: "row",
          alignItems: "flex-start",
          paddingLeft: noBg ? CSS.pixel(0) : CSS.pixel(20),
          paddingRight: noBg ? CSS.pixel(0) : CSS.pixel(20),
        }}><View
          style={[{
            width: '75%',
            height: CSS.pixel(90, true),
            flexDirection: "column",
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
              fontSize: noBg ? CSS.textSize(24) : CSS.textSize(20),
              color: noBg ? sdStyles.SDFontColorSubtitle : sdStyles.SDFontColorMain,
              alignSelf: 'flex-start',
              //justifyContent: 'center',
            }}
            title={title}
          />
          <IntlText
            style={{
              //paddingTop: CSS.pixel(24, true),
              fontSize: noBg ? CSS.textSize(36) : CSS.textSize(32),
              fontWeight: 'bold',
              color: noBg ? sdStyles.SDMainColor : sdStyles.SDFontColorMain,
              alignSelf: 'flex-start',
              marginTop: CSS.pixel(6, true),
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
        </View>
      </View>

      </Touchable>
    );
  }
}
