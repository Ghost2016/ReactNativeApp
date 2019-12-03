/* @flow */
import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { CSS } from "./SDCSS";

const styles = StyleSheet.create({});

type Props = {
  content: string
};
export default class RowSplitLine extends React.PureComponent<Props> {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: CSS.pixel(160, true),
          paddingHorizontal: CSS.pixel(30)
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#efefef" }} />
        <View style={{ marginHorizontal: CSS.pixel(5) }}>
          <Text style={{ color: "#ccc" }}>{this.props.content}</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "#efefef" }} />
      </View>
    );
  }
}
