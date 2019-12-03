/* @flow */
import React, { PureComponent } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {};

export default class SDLoading extends PureComponent<Props> {
  props: Props;

  render() {
    const { style } = this.props;
    return (
      <View
        style={[
          {
            //backgroundColor: "transparent",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: '100%', //CSS.pixel(80),
            height: CSS.pixel(80, true)
            //backgroundColor: "#fff6cf"
          },
          style
        ]}
      >
        <ActivityIndicator
          style={{
            borderWidth: 0,
            borderColor: "#f00"
          }}
          size="small"
          color="#666"
        />
      </View>
    );
  }
}
