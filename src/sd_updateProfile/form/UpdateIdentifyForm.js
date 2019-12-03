/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import { InputItem } from "antd-mobile";
import defaultStyle from "@styles/index";
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import LabelInput from "../../common/SDLabelInput";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    flex: 1
  }
});

// 实名认证表单
export default class UpdateIdentifyFor extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={[styles.container, { justifyContent: "space-between" }]}>
        <View style={[defaultStyle.center]}>
          <Text style={defaultStyle.fontSubColor}>实名认证</Text>
        </View>
        <View style={[{ paddingRight: 20, paddingLeft: 10 }]}>
          <LabelInput placeholder="姓名" />
          <LabelInput placeholder="学校" />
          <LabelInput placeholder="专业" />
          <LabelInput placeholder="身份证号" />
        </View>
        <ConfirmButtonGroup onCancel={() => {}} onOk={() => {}} />
      </View>
    );
  }
}
