/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { CSS } from "./SDCSS";
const styles = StyleSheet.create({
  separator: {
    height: CSS.pixel(30, true),
    margin: CSS.pixel(0),
    backgroundColor: 'transparent',
  }
});

export default class SectionViewSeparator extends PureComponent {
  render() {
    return <View style={[styles.separator, this.props.style]} />;
  }
}
