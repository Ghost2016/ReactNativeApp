/* @flow */
import React, { PureComponent } from "react";
import { ScrollView, View, Dimensions, Platform } from "react-native";
import PropTypes from "prop-types";
//import { WhiteSpace } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";
// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {
  title: string,
  height: number,
  onPress: () => void
};

export default class ButtonSection extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress();
  render() {
    const { style, title, height, containerStyle, btnStyle, btnTextStyle, noButton } = this.props;
    const _height = height ? height : 340;
    return (
      <View style={containerStyle}><View
        style={[{
          flexDirection: "column",
          alignItems: "center"
        }]}
      >
        <ScrollView
          style={[
            {
              zIndex: 5,
              width: CSS.pixel(690),
              minHeight: CSS.pixel(_height),
              alignContent: "stretch",
              padding: 0,
              borderRadius: CSS.pixel(20),
              backgroundColor: "#fff",
              overflow: "scroll"
            },
            style
          ]}
        >
          {this.props.children}
        </ScrollView>
        {noButton ? null : <View
          style={{
            zIndex: 6,
            backgroundColor: "transparent",
            position: "relative",
            top: -20
          }}
        >
          <SDButton
            style={[{
              zIndex: 7,
              backgroundColor: sdStyles.SDBGColorGreyBtn,
              borderRadius: 20,
              width: CSS.pixel(550),
              zIndex: 6,
              position: "relative",
              top: Platform.OS === "android"? CSS.pixel(0, true) : CSS.pixel(10, true),
            }, btnStyle]}
            btnStyle={[{
              fontSize: CSS.textSize(32),
              color: sdStyles.SDFontColorMain,
            }, btnTextStyle]}
            onPress={this.onPressAction.bind(this)}
            title={title}
          />
        </View>}
      </View></View>
    );
  }
}
