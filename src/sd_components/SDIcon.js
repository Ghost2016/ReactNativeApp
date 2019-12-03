/* @flow */
import React, { PureComponent } from "react";
import { View, Image, ImageBackground } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

type Props = {
  w: number,
  h: number
};

export default class SDIcon extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, source, imgStyle } = this.props;
    return (
      <View
        style={[
          {
            width: CSS.pixel(80),
            height: CSS.pixel(80, true),
            //overflow: "hidden",
            backgroundColor: "transparent",
            position: "relative",
            left: CSS.pixel(90),
            top: CSS.pixel(12, true),
            flexDirection: "row",
            alignItems: "center",
            zIndex: 3,
            justifyContent: "center",

          },
          style
        ]}
      >
        <ImageBackground
                resizeMode="contain" source={source} style={[{
          width: CSS.pixel(26),
          height: CSS.pixel(36, true),
           }, imgStyle]} ></ImageBackground>
      </View>
    );
  }
}
