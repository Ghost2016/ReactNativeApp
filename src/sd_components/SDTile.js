/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ImageBackground,
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

export default class SDTile extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
      const {width, bgImg, title, textStyle} = this.props;
    return (
    <ImageBackground
        resizeMode="center"
        borderRadius={CSS.pixel(parseInt(width / 2))}
        style={{
          width: Platform.OS=="android"? CSS.pixel(width) :CSS.pixel(width),
          height: Platform.OS=="android"? CSS.pixel(width, true) :CSS.pixel(width, true),
          borderWidth: 0,
          borderColor: "#f00",
          flexDirection: "row",
          alignItems: 'center',
          justifyContent: "center",
        }}
        source={bgImg}
      >
        <Text style={[{
          color: sdStyles.SDFontColorSubtitle,
          fontSize: CSS.textSize(20),
          marginTop: CSS.pixel(0, true),
        }, textStyle]}>
            {title}
        </Text>
      </ImageBackground>
    );
  }
}
