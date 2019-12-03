/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowMakeGoal from "@sd_components/GrowMakeGoal";

const styles = StyleSheet.create({});

export default class GrowMakeGoalScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowMakeGoal />;
  }
}
