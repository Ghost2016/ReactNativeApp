/* @flow */
import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";
import { DatePickerView } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "../../common/SDCSS";
import { SDMainColor, dismissLightBox } from "../../styles";
import moment from "moment";
import { shiftAnimatedStyles } from "react-native-snap-carousel/src/utils/animations";

type Props = {
//可以是日期date,时间time,日期+时间datetime,年year,月month
mode: string,
onOk: ?Function
}
const defaultMinTime = new Date(2017, 0, 1)
const defaultMaxTime = new Date(2018, 11, 31)
const _now = new Date()

const selectDateItemStyle = {
  fontSize: CSS.textSize(30),
  //color: sdStyles.SDFontColorMain,
  fontWeight: 'normal',
  padding: 2,
};

export default class SelectRangeDate extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      startValue: props.startTime || _now,
      endValue: props.endTime || _now,
      startMinValue: props.defaultMinTime,
      startMaxValue: props.defaultMaxTime,
      // 初始化最大可选时间点
      endMinValue: this.getEndMinValue(), //props.distance ? props.startTime || _now : props.defaultMinTime,
      endMaxValue: this.getEndMaxVale()
    }
  }
  getEndMinValue() {
    const {distance, startTime, unit, defaultMinTime} = this.props;
    const calcMinTime = (startTime || _now);
    return distance ? (calcMinTime < defaultMinTime) ? defaultMinTime : calcMinTime : defaultMinTime
  }
  getEndMaxVale() {
    const {distance, startTime, unit, defaultMaxTime} = this.props;
    const calcMaxTime = new Date(moment((startTime || _now)).add(distance, unit).format());
    return distance ? (calcMaxTime > defaultMaxTime) ? defaultMaxTime : calcMaxTime : defaultMaxTime;
  }
  static defaultProps = {
    // 开始时间与结束时间最大间隔
    distance: 0,
    // 单位 day month year
    unit: 'month',
    defaultMinTime: new Date(1970, 0, 1),
    defaultMaxTime: new Date(2030, 11, 31)
  }
  hide() {
    dismissLightBox();
  }
  onOk() {
    dismissLightBox();
    this.props.onOk && this.props.onOk(this.state.startValue, this.state.endValue);
  }
  onStartTimeChange = (v) => {
    const {defaultMaxTime, distance, unit} = this.props;
    const {endValue} = this.state;
    let endMaxValue = 0
    if(distance !== 0) {
      endMaxValue = new Date(moment(v).add(distance, unit).format())
    } else {
      endMaxValue = defaultMaxTime
    }
    let tempState = {}
    if (distance !== 0) {
      tempState = {
        endMinValue: v,
        endMaxValue: endMaxValue > defaultMaxTime ? defaultMaxTime : endMaxValue
      }
    }
    this.setState({
      ...tempState,
      startValue: v,
      endValue: (endValue < v) ? v : (endValue > endMaxValue) ? endMaxValue : endValue
    })
  }
  componentDidMount() {
    // this.onStartTimeChange(this.state.startValue)
  }
  render() {
    const {startMinValue, startMaxValue, endMaxValue, endMinValue} = this.state
    const {startTitle, endTitle} = this.props
    // console.warn(endMinValue)
    return (
      <View
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        height: 380,
        backgroundColor: "#fff"
      }}
      >
        <View
      style={{
        padding: CSS.pixel(30),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#efefef",
        borderBottomWidth: 1
      }}
      >
          <TouchableOpacity style={{
        flex: 1
      }} onPress={this.hide.bind(this)}>
            <Text
          style={{
            color: sdStyles.SDFontColorSubtitle,
            fontSize: CSS.textSize(30)
          }}
          >
              取消
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
      style={{
        justifyContent: "center"
      }}
      onPress={this.onOk.bind(this)}
      >
            <Text style={{
        color: SDMainColor,
        fontSize: CSS.textSize(30)
      }}>
              确定
            </Text>
          </TouchableOpacity>
        </View>

        <View
      style={{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === 'ios' ? 10 : 0
      }}
      >
          <Text style={{
        color: "#ccc",
        fontSize: 14
      }}>{startTitle? startTitle : "开始时间"}</Text>
        </View>

        <DatePickerView
          style={{
            height: 120,
            overflow: 'hidden',
            borderWidth: 0,
            borderColor:'#f00',
          }}
          itemStyle={selectDateItemStyle}
          value={this.state.startValue}
          mode= {this.props.mode || "date"}
          minDate={startMinValue}
          maxDate={startMaxValue}
          onChange={this.onStartTimeChange}
        />

        <View
      style={{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        borderWidth: 0,
        borderColor:'#f00',
      }}
      >
          <Text style={{
        color: "#ccc",
        fontSize: 14
      }}>{endTitle ? endTitle : "结束时间"}</Text>
        </View>
        <DatePickerView
      style={{
        height: 120,
        overflow: 'hidden'
      }}
      itemStyle={selectDateItemStyle}
      mode={this.props.mode || "date"}
      onChange={(v) => {
        this.setState({
          endValue: v
        })
      }}
      value={this.state.endValue}
      minDate={endMinValue}
      maxDate={endMaxValue}
      />
      </View>
      );
  }
}
