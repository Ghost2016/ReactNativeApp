/* @flow */
import React, { PureComponent } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";

type Props = {};

export default class SDTitle extends PureComponent<Props> {
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
            fontSize: 18,
            //fontWeight: 'bold',
            color: sdStyles.SDMainColor
          },
          style
        ]}
      >
        {children}
      </Text>
    );
  }
}
