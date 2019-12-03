/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View, Text
} from "react-native";
//import { List } from "../common/index";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

// 成长 - 职么力
export default class GrowPower extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text>xx职么力</Text>
        </View>
      </ScrollView>
    );
  }
}
