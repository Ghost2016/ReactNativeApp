/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowAddRead from "@sd_components/GrowAddRead";

const styles = StyleSheet.create({});

export default class GrowAddReadScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowAddRead />;
  }
}
