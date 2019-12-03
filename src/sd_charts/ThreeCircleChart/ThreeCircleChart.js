import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import config from "../chartConfig";
import CircleChart from "../CircleChart/CircleChart";
const { width, height } = Dimensions.get("window");
const { colors } = config.chartOption;
import { CSS } from "../../common/SDCSS";
import { fromJS, is} from 'immutable';
// 三个圆形的图
export default class ThreeCircleChart extends Component {
  constructor() {
    super();
    this.state = {

    };
  }
  shouldComponentUpdate(nextProps) {
    // 只有当数据与上一次不致才会进行刷新
    return !is(fromJS(this.props), fromJS(nextProps))
  }

  render() {
    //console.warn('three_circle_render')
    const { data } = this.props;
    return (
      <View
        style={{
          flex:1,
          flexDirection: "row",
          justifyContent: "space-around",
          marginHorizontal: 30
        }}
      >
        {(data.length>0) && data.map((o, i) => {
          return (
            <View style={{ 
              // padding: CSS.pixel(38)
               }} key={o.key}>
              <CircleChart
                nodata={this.props.nodata}
                loading={this.props.loading}
                color={colors.colorScale[i]}
                key={i}
                text={o.text}
                label={o.label}
                height={o.height}
                value={o.value}
              />
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: CSS.pixel(18),
                  fontSize: CSS.textSize(24)
                }}
              >
                {o.label}
              </Text>
            </View>
          );
        })}
        {(data.length === 0) && <View style={{height:CSS.pixel(280),justifyContent:'center',alignItems:'center'}}><Text>暂无数据</Text></View>}
      </View>
    );
  }
}
