/* @flow */
import React, { PureComponent } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";

type Props = {};

export default class SDSubtitle extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, children, ...otherProps } = this.props;
    return (
      <Text
      {...otherProps}
        style={[
          {
            //backgroundColor: "#ccc",
            textAlign: "center",
            fontSize: 16,
            color: sdStyles.SDFontColorMinor
          },
          style
        ]}
      >
        {children}
      </Text>
    );
  }
}
