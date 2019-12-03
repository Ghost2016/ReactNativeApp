/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowReadOk from "@sd_components/GrowReadOk";

const styles = StyleSheet.create({});

export default class GrowReadOkScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowReadOk />;
  }
}
