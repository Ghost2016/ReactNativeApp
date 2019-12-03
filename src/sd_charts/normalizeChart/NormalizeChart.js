import React, { Component } from "react";
import Rn, { Platform, Dimensions } from "react-native";
import {
  VictoryChart,
  VictoryArea,
  VictoryClipContainer,
  VictoryTooltip,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis,
  VictoryPortal
} from "victory-native";
import Svg, {
  G,
  Path,
  Text,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  TSpan
} from "react-native-svg";

import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { CSS } from "../../common/SDCSS";
import { formatPower } from "@utils/user";
import { fromJS, is} from 'immutable';
const {
  colors,
  defaultDuration,
  dataLabels,
  props,
  getYAxisDomain,
  getTickValues,
  fontFamily
} = config.chartOption;

const {
  xAxis,
  yAxis,
  scatter,
  width,
  area,
  defaultHeight
} = props.normalize;

// 取假数据
let defaultData = config.chartOption.datasets.normalize;
// defaultData = _formatDefalutData(defaultData, 100)
function _formatDefalutData(data, yMaxTickValues) {
  let defaultData = JSON.parse(JSON.stringify(data))
  // 抽样
  defaultData = defaultData.filter((d, i) => {
    return i % 1 === 0;
  });
  // 处理x轴,把数据映射到 0 - 100
  const min = defaultData[0].x;
  const max = defaultData[defaultData.length - 1].x;
  defaultData.map((item, index) => {
    item.x = parseInt((item.x - min) * ((max - min) / 100));
  });
  // 处理y轴,把数据映射到 0 - yMaxTickValues
  let y_min = defaultData[0].y
  let y_max = defaultData[0].y
  defaultData.map(item => {
    if(item.y > y_max) y_max = item.y
    else if(item.y < y_min) y_min = item.y
    return item
  })
  defaultData.map((item, index) => {
    item.y = (item.y - y_min) * yMaxTickValues / (y_max - y_min)
  });
  return defaultData;
}


// 用于正态曲线上显示Label用
class CustomLabel extends React.PureComponent {
  render() {
    const { x, y, datum, selectedValue } = this.props;
    const selectedX = selectedValue;
    // 过滤选中的点
    if ((datum.x - 0) !== (Math.round(selectedValue)-0)) return "";
    // console.log('ly88', 'selectedValue', Math.round(selectedValue))
    // 距离原点的距离
    const offsetY = -CSS.pixel(10),
      // 气泡框(包含了小三角)
      width = CSS.pixel(110),
      height = CSS.pixel(80),
      // 气泡上的小三角
      triWidth = CSS.pixel(8),
      triHeight = CSS.pixel(8),
      borderRadius = CSS.pixel(8);
    const props = this.props;
    // 气泡底端的Y
    const newY = y - offsetY;
    // 边界
    const leftBorder = 0,
      rightBorder = 0,
      topBorder = 0,
      bottomBorder = newY - triHeight;
    // 生成的气泡的path
    const path = `M${x},${newY}\n L${x - triWidth / 2},${newY -
      triHeight}\n L${x - width / 2 + borderRadius},${bottomBorder} S${x -
      width / 2},${bottomBorder},${x - width / 2},${newY -
      triHeight -
      borderRadius} L${x - width / 2},${newY -
      triHeight -
      height +
      borderRadius} S${x - width / 2},${bottomBorder - height},${x -
      width / 2 +
      borderRadius},${bottomBorder - height} L${x +
      width / 2 -
      borderRadius},${bottomBorder - height} S${x + width / 2},${newY -
      triHeight -
      height},${x + width / 2},${newY -
      triHeight -
      height +
      borderRadius} L${x + width / 2},${bottomBorder - borderRadius} S${x +
      width / 2},${bottomBorder},${x + width / 2 - borderRadius},${newY -
      triHeight} L${x + triWidth / 2},${bottomBorder} Z`;
    return (
      <VictoryPortal>
        <G>
        <Path d={path} stroke="#fff" strokeWidth="0" fill="orange" />
        <Text
          // stroke="#fff"
          fontSize={CSS.textSize(16)}
          strokeWidth={0}
          fill="#fff"
          x={x}
          y={newY - height + CSS.pixel(20)}
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          <TSpan x={x} dy={CSS.pixel(0)}>{`我在这里`}</TSpan>
          <TSpan x={x} dy={CSS.pixel(16)}>{`职么力${formatPower(selectedValue)}`}</TSpan>
          <TSpan x={x} dy={CSS.pixel(16)}>{`人数${datum.y}人`}</TSpan>
        </Text>
        {/* 绘制点下面的一条线 */}
        <Path
          d={`M${x},${y + CSS.pixel(20)} L${x},${CSS.pixel(350)}`}
          stroke="#fe8900"
          strokeWidth={CSS.pixel(2)}
          fill="#fff"
        />
        </G>
      </VictoryPortal>
    );
  }
}

/**
 * 线图
 */
export default class NormalizeChart extends Component {
  constructor() {
    super();
    this.state = {
      showDataMarkers: true
    };
  }
  static defaultProps = {
    // 显示Marker
    showDataMarkers: true,
    // 显示图例
    showLegend: false,
    // y轴label
    yLabel: "人数",
    // x轴label
    xLabel: "分数",
    series: [],
    data: defaultData,
    legend: [],
    // 颜色的数组
    categary: [],
    height: defaultHeight,
    width: Dimensions.get("window")["width"],
    type: "normal",
    toolTipFormat: d => `${d.y >= 1000 ? parseInt(d.y / 1000) + "k" : d.y}`,
    selectedValue: defaultData[10].x,
    style: {}
  };

  shouldComponentUpdate(nextProps) {
    // 只有当数据与上一次不致才会进行
    const needRefresh = !is(fromJS(this.props), fromJS(nextProps))
    return needRefresh;
  }

  componentDidMount() {}
  render() {
    const { showDataMarkers } = this.state;
    const {
      data,
      height,
      xLabel,
      categary,
      selectedValue,
      yLabel,
      width,
    } = this.props;
    // const selectedValue = 0
    var formattedData = JSON.parse(JSON.stringify(data));
    formattedData.sort((a, b) => {
      return a.x - b.x;
    });
    // x轴
    var normalizeCategary = [0, 20, 40, 60, 80, 100];

    // 取y的数据集合
    var yData = [];
    formattedData.map(d => {
      yData = yData.concat(d);
    });
    const tickValues = getTickValues(yData, false, 5, 2);
    // console.log('ly88', 'tickValues', tickValues)
    // console.log('ly88', 'formattedData', formattedData);
    //const formattedDefaultData = _formatDefalutData(defaultData, tickValues[4])
    console.log('normalize_chart_render')
    return (
      <ChartWrapper
        nodata={this.props.nodata || (this.props.data.length === 0)}
        loading={this.props.loading}
        style={{ ...this.props.style, height: height, width: width }}
      >
          <VictoryChart
            height={height}
            width={width}
            padding={{
              left: CSS.pixel(90),
              bottom: CSS.pixel(50),
              right: CSS.pixel(100),
              top: CSS.pixel(40)
            }}
            standalone={true}
            clipContainerComponent={<VictoryClipContainer clipPadding={{left:CSS.pixel(40), right: CSS.pixel(40)}}/>}
          >
            {/* x轴 */}
            <VictoryAxis
              {...xAxis}
              label={xLabel}
              tickValues={normalizeCategary}
              tickLabelComponent={<VictoryLabel/>}
              axisLabelComponent={
                <VictoryLabel
                  x={CSS.pixel(0)}
                  dx={width - CSS.pixel(18)}
                  dy={-CSS.pixel(24)}
                  angle={0}
                />
              }
              style={{
                ...xAxis.style,
                grid: {
                  ...xAxis.style.grid,
                  // 最后一根线为实线
                  strokeDasharray: (t, index, arr) => {
                    if(index === normalizeCategary.length - 1) return '1 0';
                    else return xAxis.style.grid.strokeDasharray;
                  }
                }
              }}
            />
            {/* y轴 */}
            <VictoryAxis
              dependentAxis
              {...yAxis}
              tickValues={tickValues}
              label={yLabel}
              axisLabelComponent={
                <VictoryLabel y={CSS.pixel(20)} dx={CSS.pixel(30)} angle={0} />
              }
            />
            {/* 添加默认正态分布曲线图 */}
            {/* <VictoryArea
              {...area}
              data={formattedDefaultData}
              style= {{
                data: {
                  // 20%透明度
                  fill: "#fed20018",
                  // stroke: "#fed200",
                  strokeWidth: CSS.pixel(0),
                  strokeLinecap: "round"
                }
              }}
            /> */}
            <VictoryArea
              {...area}
              labels={datum => {
                return (datum.x - 0) === Math.round(selectedValue) ? `你在这里：${datum.y}人` : "";
              }}
              labelComponent={
                // Platform.OS === "ios" ? (
                  <CustomLabel selectedValue={selectedValue} />
                // ) : (
                //   <VictoryLabel/>
                // )
              }
              data={formattedData}
            />
            <VictoryScatter
              {...scatter}
              data={formattedData.filter(d => (d.x - 0) === Math.round(selectedValue))}
            />
          </VictoryChart>
      </ChartWrapper>
    );
  }
}
