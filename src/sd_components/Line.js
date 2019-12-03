/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

type Props = {};

export default class Line extends PureComponent<Props> {
  props: Props;

  render() {
    const { style } = this.props;
    return (
      <View
        style={[
          {
            width: CSS.pixel(550),
            height: 1,
            backgroundColor: "#f00", //sdStyles.SDHelperColorline,
            position: "relative",
            top: 0,
            zIndex: 2,
            marginTop: 0
          },
          style
        ]}
      />
    );
  }
}
