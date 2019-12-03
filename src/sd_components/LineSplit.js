/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import Line from "@sd_components/Line";

type Props = {
  textWidth: boolean
};

export default class LineSplit extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, lineStyle, textWidth } = this.props;
    const _textWidth = textWidth ? textWidth : 60;
    const fullWidth = 550;
    const splitLineWidth = (fullWidth - _textWidth - 50) / 2;
    console.log("splitLineWidth", splitLineWidth);
    return (
      <View
        style={{
          width: CSS.pixel(fullWidth),
          flexDirection: "row",
          justifyContent: "space-between"
          //backgroundColor:'#000',
        }}
      >
        <Line style={[{ flex: 1, height: 1 }, lineStyle]} />
        <Line style={[{ flex: 1, height: 1 }, lineStyle]} />
      </View>
    );
  }
}
