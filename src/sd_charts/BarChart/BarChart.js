import React, { Component } from "react";
import { View } from "react-native";
import {
  VictoryGroup,
  VictoryTooltip,
  VictoryBar,
  Point,
  VictoryScatter,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryLabel,
  Line
} from "victory-native";
import Svg, {
  Path,
  Text,
  Defs,
  LinearGradient,
  Stop,
  Circle
} from "react-native-svg";
import { CSS } from "../../common/SDCSS";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";

const {
  colors,
  defaultDuration,
  dataLabels,
  props,
  getYAxisDomain
} = config.chartOption;
const { xAxis, yAxis, scatter, height, width, vBar, chart } = props.bar;

// 取假数据
const data = config.chartOption.datasets.bar;

/**
 * 线图
 */
export default class BarChart extends Component {
  constructor() {
    super();
    this.state = {
      showDataMarkers: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    //console.warn("clicked");
  }
  componentDidMount() {}
  render() {
    const { showDataMarkers } = this.state;
    // 数据转换
    const charts = data[0].map((d, i) => {
      return;
    });

    return (
      <ChartWrapper style={{ width: width, height: height }}>
        {/* <Svg height={height} width={width}> */}
        {/* 定义颜色线性渐变 */}
        {/* <Defs>
            <LinearGradient id="linear" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={colors.gradient[0]} />
              <Stop offset="100%" stopColor={colors.gradient[1]} />
            </LinearGradient>
          </Defs> */}
        <VictoryChart {...chart} standalone={true}>
          <VictoryAxis
            {...xAxis}
            tickValues={[
              "Mon\n\r6.4",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun\n6.10"
            ]}
            // 把x轴grid向右移动20
            gridComponent={<Line transform={`translate(${CSS.pixel(40)})`} />}
          />
          <VictoryAxis
            domain={getYAxisDomain(data[0])}
            {...yAxis}
            dependentAxis
            tickFormat={tick => `${Math.round(tick)}`}
          />
          <VictoryBar
            // {...vBar}
            data={data[0]}
            // labels={d => d.y}
            // labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
        {/* <Text y="500">完成了100%</Text> */}
        {/* </Svg> */}
      </ChartWrapper>
    );
  }
}
