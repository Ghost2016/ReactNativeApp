import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

// 我的数据报告收藏
export default class CollectDataGroup extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return <View style={styles.container} />;
  }
}
