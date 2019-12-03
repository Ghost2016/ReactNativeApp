/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Logo } from "../common";
import { BRAND_COLOR } from "../styles";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: BRAND_COLOR
  },
  text: {
    textAlign: "center",
    color: "#333",
    fontSize: 20,
    margin: 8
  }
});

export default class CompatibilityScreen extends PureComponent<{}> {
  render() {
    const { line1, line2 } = this.props;
    return (
      <View style={styles.screen}>
        <Logo />
        <Text style={styles.text}>{line1 || '请升级您的APP！'}</Text>
        <Text style={styles.text}>
          {line2 || '请下载最新版本的职么开门APP'}
        </Text>
      </View>
    );
  }
}
