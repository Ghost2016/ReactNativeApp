/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowCheckinCalendar from "@sd_components/GrowCheckinCalendar";

const styles = StyleSheet.create({});

export default class GrowCheckinCalendarScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowCheckinCalendar />;
  }
}
