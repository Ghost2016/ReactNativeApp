/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

type Props = {};

export default class SDLine extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, children } = this.props;
    return (

        <View
          style={[{
              flexDirection: 'row',
              alignItems: "center",
              marginBottom: CSS.pixel(20, true)
          }, style]}
        >
          {children}
        </View>
        
    );
  }
}
