/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowLightenRoad from "@sd_components/GrowLightenRoad";

const styles = StyleSheet.create({});

export default class GrowLightenRoadScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowLightenRoad />;
  }
}
