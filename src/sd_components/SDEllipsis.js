/* @flow */
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

type Props = {};

export default class SDEllipsis extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, size, numberOfLines, ellipsizeMode } = this.props;
    const _size = typeof size == "number" ? size : 200;
    const _numberOfLines = typeof numberOfLines == "number" ? numberOfLines : 1;
    ////'head', 'middle', 'tail'
    const _ellipsizeMode = typeof ellipsizeMode == "string" ? ellipsizeMode : 'tail';
    return (
      <View
        style={[
          {
            //backgroundColor: "transparent",
            flexDirection: "column",
            alignItems: "flex-start",
            //justifyContent: "center",
            maxWidth: CSS.pixel(_size),
            //width: CSS.pixel(_size),
          },
          style
        ]}
      >
        {this.props.children.map((child, index) => {
          return (React.cloneElement(child, {
            numberOfLines: _numberOfLines,
            ellipsizeMode: _ellipsizeMode,
          }))
        })}
      </View>
    );
  }
}
