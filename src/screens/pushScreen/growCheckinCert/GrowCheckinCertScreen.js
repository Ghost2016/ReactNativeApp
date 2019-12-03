/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import GrowCheckinCert from "@sd_components/GrowCheckinCert";

const styles = StyleSheet.create({});

export default class GrowCheckinCertScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <GrowCheckinCert />;
  }
}
