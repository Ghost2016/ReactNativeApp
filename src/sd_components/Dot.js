/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

type Props = {};

export default class Dot extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, innerStyle } = this.props;
    return (
      <View
        style={[
          {
            //backgroundColor: "transparent",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: "#fff6cf",
            borderRadius: 10,
            backgroundColor: "#fff6cf"
          },
          style
        ]}
      >
        <View
          style={[
            {
              flexDirection: "column",
              alignItems: "center",
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: sdStyles.SDMainColor
            },
            innerStyle
          ]}
        />
      </View>
    );
  }
}
