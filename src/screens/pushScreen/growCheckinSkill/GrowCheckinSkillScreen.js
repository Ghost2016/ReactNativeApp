/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowCheckinSkill from "@sd_components/GrowCheckinSkill";

const styles = StyleSheet.create({});

export default class GrowCheckinSkillScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowCheckinSkill />;
  }
}
