/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { Avatar, Touchable } from "../sd_components/";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";

const componentStyles = StyleSheet.create({});

type Props = {
  rank: number
};

export default class RightRankBox extends PureComponent<Props> {
  context: Context;
  props: Props;

  static contextTypes = {};
  static defaultProps = {
    rank: 0
  };

  handlePress = () => {};

  render() {
    const { follow, style, rank } = this.props;

    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: "flex-end"
          },
          style
        ]}
      >
        <Touchable onPress={this.handlePress}>
          <Text
            style={{
              backgroundColor: "#fe8900",
              paddingBottom: CSS.pixel(12),
              paddingTop: CSS.pixel(12),
              paddingLeft: CSS.pixel(18),
              paddingRight: CSS.pixel(18),
              borderRadius: CSS.pixel(3),
              textAlign: "center",
              color: "#fff",
              fontWeight: "600",
              fontSize: CSS.textSize(24)
            }}
          >
            {`第${rank}名`}
          </Text>
        </Touchable>
      </View>
    );
  }
}
