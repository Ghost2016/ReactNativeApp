/* @flow */
import React from "react";
import { Image, StyleSheet } from "react-native";

import logoImg from "../../img/logo.png";

const styles = StyleSheet.create({
  logo: {
    width: 120,
    //height: 40,
    margin: 20,
    alignSelf: "center"
  }
});

export default () => (
  <Image style={styles.logo} source={require("@img/my/mine_ico_about.png")} resizeMode="contain" />
);
