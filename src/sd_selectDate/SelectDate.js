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
import { Picker, DatePicker } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

let wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({});

type Props = {
  onOk: ?Function,
  mode: string,
  defaultValue: Date,
  max: object
};

export default class SelectorDate extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      sValue: this.props.defaultValue ? this.props.defaultValue : new Date()
    }
  }
  onChange(v) {
    //console.log('onChange', v);
    let y = v.getFullYear();
    let m = v.getMonth() + 1;
    let d = v.getDate();
    this.setState({
      sValue: v
    });
    this.props.onOk &&
      this.props.onOk(
        y + '',
        m < 10 ? "0" + m : m + '',
        d < 10 ? "0" + d : d + ''
      );
  }
  render() {
    return (
      <View>
        <DatePicker
          value={this.state.sValue}
          mode={this.props.mode || "month"}
          minDate={new Date(1990, 9, 1)}
          maxDate={this.props.max ? this.props.max : new Date(2030, 11, 3)}
          onChange={this.onChange.bind(this)}
          format="YYYY-MM-DD"
          itemStyle={{
            fontSize: CSS.textSize(30),
            fontWeight: 'normal',
            //padding: 2,
          }}
        >
          <CustomChildren selectable={typeof this.props.selectable !== 'undefined' ? this.props.selectable : true}>{this.props.children}</CustomChildren>
        </DatePicker>
      </View>
    );
  }
}

const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={(e) => {
    if(!props.selectable) return;
    props.onClick();
  }}>{props.children}</TouchableOpacity>
);
