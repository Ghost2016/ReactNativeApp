/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowMakeGoal2 from "@sd_components/GrowMakeGoal2";

const styles = StyleSheet.create({});

export default class GrowMakeGoal2Screen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowMakeGoal2 />;
  }
}
