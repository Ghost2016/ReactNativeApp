import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle, { antdTabsConfig } from "@styles";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    height: 80,
    width: 80,
    top: -CSS.pixel(20)
  }
});

// 我的主页 任务数量组件
export default class TaskNumItem extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={[styles.container, defaultStyle.center]}>
        <Text style={{ color: "#fed200", fontSize: CSS.textSize(60), fontFamily: "DINCondensedC" }}>
          {this.props.taskNum}
        </Text>
        <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
          {this.props.taskName}
        </Text>
      </View>
    );
  }
}
