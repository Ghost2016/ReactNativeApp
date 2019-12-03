/* @flow */
import React, { PureComponent } from "react";
import { View, Switch, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: CSS.pixel(40)
  }
});

type Props = {};

export default class SDSwitch extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, toggleSwitch, switchValue } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Switch
          onValueChange={toggleSwitch}
          onTintColor={sdStyles.SDMainColor}
          thumbTintColor="#fff"
          tintColor={sdStyles.SDBGColorMain}
          value={switchValue}
        />
      </View>
    );
  }
}
