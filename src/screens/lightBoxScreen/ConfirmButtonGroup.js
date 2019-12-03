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
import { CSS } from "../../common/SDCSS";
import { SDMainColor } from "../../styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: CSS.pixel(100, true),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  }
});

// 确认取消按钮组
export default class ConfirmButtonGroup extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const _style = this.props.style || {};
    return (
      <View
        style={[styles.container, defaultStyle.center, defaultStyle.flexRow, _style]}
      >
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={this.props.onCancel ? this.props.onCancel : null}
        >
          <View style={[defaultStyle.flex, defaultStyle.center]}>
            <Text style={{ color: "#999", fontSize: CSS.textSize(36) }}>取消</Text>
          </View>
        </TouchableOpacity>
        <View style={[{
          width: 2,
          height: 26,
          borderLeftWidth: 1,
          borderColor: "#D8D8D8"
        }, defaultStyle.singleLine]} />
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={this.props.onOk ? this.props.onOk : null}
        >
          <View style={[defaultStyle.flex, defaultStyle.center]}>
            <Text style={{ color: SDMainColor, fontSize: CSS.textSize(36) }}>确定</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
