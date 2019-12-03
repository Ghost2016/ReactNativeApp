import React, { Component } from "react";
import { Platform } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryScatter,
  VictoryClipContainer
} from "victory-native";
import Svg, { Text, TSpan } from "react-native-svg";
import chartConfig from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { CSS, PlatformInfo } from "../../common/SDCSS";
const {
  colors,
  defaultDuration,
  dataLabels,
  props,
  getYAxisDomain,
  fontFamily,
  getTickValues
} = chartConfig.chartOption;
const { xAxis, yAxis, scatter, height, width, hBar, chart } = props.bar;

// 取假数据
const defaultData = chartConfig.chartOption.datasets.bar[1];

const defaultXTickValues = [0, 25, 50, 75, 100];
const defaultCategary = ["软件工程", "电信工程", "计算科学技术"];
const defaultLabels = [
  { firstLine: "JAVA工程师", secondLine: "计算机" },
  { firstLine: "前端工程师", secondLine: "计算机" },
  { firstLine: "IOS工程师", secondLine: "计算机" }
  // {firstLine: 'NODE工程师', secondLine: '计算机'}
];

// 用于Bar曲线上显示TickLabel用，在柱子上
class CustomXTickLabel extends React.Component {
  render() {
    // x, y, index, data, datum, verticalAnchor, textAnchor, angle, style, text, and events.
    const { x, y, datum, style, index, labels } = this.props;
    return (
      <VictoryClipContainer style={{ style }}>
        <Text y={y} fontFamily={fontFamily}>
          <TSpan
            x={x}
            strokeWidth="0.6"
            stroke="#333"
            fontSize={CSS.textSize(24)}
            textAnchor="end"
          >
            {labels[index + 1].firstLine}
          </TSpan>
          <TSpan
            fill="#999"
            fontSize={CSS.textSize(24)}
            dy={CSS.pixel(24)}
            x={x}
            fontSize={CSS.textSize(20)}
            textAnchor="end"
          >
            {labels[index + 1].secondLine}
          </TSpan>
        </Text>
      </VictoryClipContainer>
    );
  }
}

// 用于Bar曲线上显示Label用，在柱子上
class CustomLabel extends React.Component {
  render() {
    const { x, y, datum, style, labels, index } = this.props;
    // console.warn(labels)
    return (
      <VictoryClipContainer style={{ style }}>
        <Text
          x={x}
          y={y}
          dx={-CSS.pixel(28)}
          dy={CSS.pixel(8)}
          textAnchor="end"
          fontFamily={fontFamily}
          fill="#fff"
        >
          {`${parseFloat(datum.y).toFixed(1)}%`}
        </Text>
        <Text y={y} fontFamily={fontFamily}>
          <TSpan
            x={x}
            strokeWidth="0.6"
            stroke="#333"
            fontSize={CSS.textSize(24)}
            textAnchor="start"
          >
            {labels[index + 1].firstLine}
          </TSpan>
          <TSpan
            fill="#999"
            dy={CSS.pixel(24)}
            x={x}
            fontSize={CSS.textSize(20)}
            textAnchor="start"
          >
            {labels[index + 1].secondLine}
          </TSpan>
        </Text>
      </VictoryClipContainer>
    );
  }
}

/**
 * 水平柱状图
 */
export default class HorizontalBarChart extends Component {
  constructor() {
    super();
    this.state = {
      showDataMarkers: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  static defaultProps = {
    data: [],
    // y轴label
    yLabel: "职位名称",
    // x轴label
    xLabel: "选择率\n（%）",
    // 特殊类型
    type: "special",
    // type: '',
    // 用于显示两排labels的数据来源
    labels: defaultLabels,
    // Y轴刻度数据，当不为空时，会把labels放在刻度显示
    categary: defaultCategary,
    // X刻度数据
    xTickValues: [],
    xTickLabelFormatter: d => `${d.y}%`,
    barLabelFormatter: d => d.y
  };
  handleClick() {
    //console.warn("clicked");
  }
  componentDidMount() {}
  render() {
    const { showDataMarkers } = this.state;
    const {
      data,
      type,
      style,
      yLabel,
      xLabel,
      labels,
      categary,
      xTickValues,
      xTickLabelFormatter,
      barLabelFormatter,
      left,
      bottom,
      right,
      top,
    } = this.props;
    let formattedXTickValues = xTickValues;
    let formattedCategary = [""].concat(categary);
    // let twoLineLabels = [{firstLine: '', secondLine: ''}]
    // hack方法，左右添加一项，以使正常显示
    let twoLineLabels = [{ firstLine: "", secondLine: "" }];
    labels.map((item, index) => {
      twoLineLabels.push({
        firstLine: item.firstLine,
        secondLine: item.secondLine
      });
    });
    twoLineLabels.push({ firstLine: "", secondLine: "" });
    //
    if (formattedXTickValues.length === 0) {
      const formattedData = JSON.parse(JSON.stringify(data));
      // 取y的数据集合
      let yData = [];
      formattedData.map(d => {
        yData = yData.concat(d);
      });
      formattedXTickValues = getTickValues(yData);
    }

    // console.warn(formattedXTickValues)
    return (
      <ChartWrapper
      nodata={this.props.nodata || (this.props.data.length === 0)}
      loading={this.props.loading}
      style={style}>
        <VictoryChart
          height={data.length * CSS.pixel(80) + CSS.pixel(180)}
          //  {...chart}
          // horizontal
          padding={{
            left: left? left : CSS.pixel(190),
            bottom: bottom? bottom : CSS.pixel(80),
            right: right? right : CSS.pixel(120),
            top: top? top : CSS.pixel(40)
          }}
          standalone={true}
        >
          {/* y轴 */}
          <VictoryAxis
            {...yAxis}
            style={{
              tickLabels: {
                fontSize: CSS.textSize(28)
              }
            }}
            dependentAxis
            // 显示labels项
            domain={{ y: [0, formattedCategary.length] }}
            // domain={{ y: [0, labels.length] }}
            // 这个是显示y轴刻度
            tickLabelComponent={
              type !== "special" ? (
                <CustomXTickLabel labels={twoLineLabels} />
              ) : (
                <VictoryLabel
                  style={{
                    strokeWidth: 0.6,
                    stroke: "#333",
                    dx: CSS.pixel(10),
                    fontFamily: fontFamily,
                    fontSize: CSS.textSize(24)
                  }}
                  text={x => {
                    return formattedCategary[x];
                  }}
                />
              )
            }
            label={yLabel}
            axisLabelComponent={
              <VictoryLabel
                style={[
                  {
                    fill: "#999",
                    fontFamily: fontFamily,
                    fontSize: CSS.textSize(20)
                  }
                ]}
                y={CSS.pixel(20)}
                stroke="#fff"
                angle={0}
              />
            }
          />
          {/* x轴 */}
          <VictoryAxis
            {...yAxis}
            style={{
              ...yAxis.style,
              axis: { stroke: "#fff" },
              axisLabel: { fill: "red" },
              grid: { stroke: "#eee" },
              // ticks: {stroke: "grey", size: 5},
              tickLabels: { stroke: "#eee" }
            }}
            tickValues={formattedXTickValues}
            // 刻度
            tickLabelComponent={
              <VictoryLabel
                style={{
                  fontFamily: fontFamily,
                  fill: "#999",
                  fontSize: CSS.textSize(20)
                }}
                // style={{ fontFamily: "SimSun", fontSize: 10 }}
                text={xTickLabelFormatter}
              />
            }
            label={xLabel}
            // label
            axisLabelComponent={
              <VictoryLabel
                style={{
                  fontFamily: fontFamily,
                  fill: "#999",
                  fontSize: CSS.textSize(20)
                }}
                textAnchor="middle"
                dy={-CSS.pixel(30)}
                dx={CSS.pixel(280)}
                angle={0}
              />
            }
          />
          <VictoryBar
            {...hBar}
            horizontal
            // domainPadding={{x: [10, -10], y: 5}}
            barRatio={0.8}
            // style={{data:{
            //   strokeLinejoin:"round"}
            // }}
            cornerRadius={{ top: CSS.pixel(10), bottom: CSS.pixel(10) }}
            data={data}
            labels={barLabelFormatter}
            // 定制Label
            labelComponent={
              type !== "special" ? (
                <VictoryLabel />
              ) : (
                <CustomLabel labels={twoLineLabels} />
              )
              // Platform.OS !== "ios" ? <CustomLabel /> : <VictoryLabel />
            }
          />
        </VictoryChart>
      </ChartWrapper>
    );
  }
}
