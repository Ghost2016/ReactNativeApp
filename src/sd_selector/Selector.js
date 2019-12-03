/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { Picker, List } from "antd-mobile";

let wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({});

type optionModel = {
  label: string,
  value: number
};

type Props = {
  options: optionModel[], // 选项
  onChange: ?Function,
  onOk: ?Function
};

export default class Selector extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      sValue: []
    };
  }
  onChange(v) {
    this.setState({ sValue: v });
    this.props.onChange && this.props.onChange(v);
  }
  onOk(v) {
    this.setState({ sValue: v })
    this.props.onOk && this.props.onOk(v);
  }
  render() {
    return (
      <Picker
        data={this.props.options}
        title=""
        cols={1}
        value={this.state.sValue}
        onPickerChange={this.onChange.bind(this)}
        onOk={this.onOk.bind(this)}
      >
        <CustomChildren>
          {this.props.children}
        </CustomChildren>
      </Picker>
    );
  }
}

const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={props.onClick}>
    {props.children}
  </TouchableOpacity>
);