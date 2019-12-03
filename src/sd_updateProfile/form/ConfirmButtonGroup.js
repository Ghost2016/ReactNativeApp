/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import defaultStyle from "@styles/index";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
  }
});

// 确认取消按钮组
export default class ConfirmButtonGroup extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View
        style={[styles.container, defaultStyle.center, defaultStyle.flexRow]}
      >
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={this.props.onCancel ? this.props.onCancel : null}
        >
          <View style={[defaultStyle.flex, defaultStyle.center]}>
            <Text style={{ color: "#666" }}>取消</Text>
          </View>
        </TouchableOpacity>
        <View style={[defaultStyle.singleLine]} />
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={this.props.onOk ? this.props.onOk : null}
        >
          <View style={[defaultStyle.flex, defaultStyle.center]}>
            <Text style={{ color: "#fed200" }}>确定</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
