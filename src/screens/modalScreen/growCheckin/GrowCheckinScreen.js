/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowCheckin from "@sd_components/GrowCheckin";

const styles = StyleSheet.create({});

export default class GrowCheckinScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowCheckin />;
  }
}
