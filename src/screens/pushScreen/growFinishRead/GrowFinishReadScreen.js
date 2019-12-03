/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowFinishRead from "@sd_components/GrowFinishRead";

const styles = StyleSheet.create({});

export default class GrowFinishReadScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowFinishRead />;
  }
}
