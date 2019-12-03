/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import UpdateProfile from "../../../sd_updateProfile/UpdateProfile";

const styles = StyleSheet.create({});

export default class UpdateProfileScreen extends PureComponent<{}> {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return <UpdateProfile />;
  }
}
