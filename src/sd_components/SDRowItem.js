/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";

type Props = {};

export default class SDRowItem extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, children } = this.props;
    return (
      <View
        style={[
          {
            //backgroundColor: "#ccc",
            flexDirection: "row",
            alignItems: "flex-start",
            paddingVertical: 5,
            borderTopWidth: 0,
            borderColor: sdStyles.SDBGColorMain
          },
          style
        ]}
      >
        {children}
      </View>
    );
  }
}
