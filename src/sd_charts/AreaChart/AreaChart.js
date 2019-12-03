import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import {
  VictoryChart,
  VictoryLegend,
  VictoryArea,
  VictoryGroup,
  VictoryScatter,
  VictoryTooltip,
  VictoryAxis,
  VictoryTheme,
  createContainer,
  VictoryVoronoiContainer,
  VictoryLabel,
  Line
} from "victory-native";
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg";
import { CSS } from "../../common/SDCSS";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { fromJS, is} from 'immutable';

const {
  colors,
  defaultDuration,
  props,
  getYAxisDomain,
  getTickValues
} = config.chartOption;
const {
  xAxis,
  yAxis,
  scatter,
  area,
  chart,
  tooltip,
  defaultHeight
} = props.area;
// 取假数据
const defaultData = config.chartOption.datasets.area[1];
/**
 * 面积图
 */
export default class AreaChart extends Component {
  constructor() {
    super();
    this.state = {
      showDataMarkers: true
    };
  }
  // static defaultProps = {
  //   data: config.chartOption.datasets.area[2]
  // };
  componentDidMount() {}
  static defaultProps = {
    data: defaultData,
    categary: [],
    height: CSS.pixel(defaultHeight),
    yLabel: "",
    // xLabel: '毕业年份',
    xLabel: "",
    width: CSS.width(),
    toolTipFormat: d => `${d.y >= 1000 ? parseInt(d.y / 1000) + "k" : d.y}`,
    withZoom: false
  };
  shouldComponentUpdate(nextProps) {
    // 只有当数据与上一次不致才会进行刷新
    return !is(fromJS(this.props), fromJS(nextProps))
  }
  render() {
    //console.warn('area_chart_render')
    const { showDataMarkers } = this.state;
    const {
      toolTipFormat,
      data,
      height,
      yLabel,
      xLabel,
      categary,
      width,
      withZoom,
      style
    } = this.props;
    let areaCategary = [];
    // 处理x轴
    if (categary.length === 0) {
      data.map(d => {
        d.x = d.x + "";
        areaCategary.push(d.x);
      });
    } else {
      areaCategary = categary;
    }
    // 需要添加一个空的categary
    if(areaCategary.length === 1) {
      areaCategary = areaCategary.concat("");
    }

    // 取y的数据集合
    var yData = [];
    data.map(d => {
      yData = yData.concat(d);
    });
    // const domain = getYAxisDomain(yData)
    const tickValues = getTickValues(yData, false, 5, 1.5);

    const ChartContainer = createContainer("voronoi", "zoom");
    // const ChartContainer = createContainer("voronoi");

    return (
      <ChartWrapper
      style={[
        style, 
        {
          height:height,
          width: width,
          // backgroundColor: 'pink',
        }]}
      loading={this.props.loading}
      // nodata={this.props.nodata || (data.length === 0) || data.every(item => item.y ===0)}
      nodata={this.props.nodata || (data.length === 0)}
      horizontal={withZoom}>
        <VictoryChart
          // animate={{ duration: 2000, easing: "bounce" }}
          height={height}
          width={!withZoom ? width : width / 6 * data.length}
          // {...chart}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiBlacklist={["scatter", "hide_tooltip"]}
              zoomDomain={{ x: [1, 6] }}
              zoomDimension={"x"}
              labels={(d) => {
                if(d.key&&d.key.indexOf('_copy')>-1)return null;
                return toolTipFormat(d);
              }}
              labelComponent={<VictoryTooltip {...tooltip} dy={CSS.pixel(20)}/>}
              allowZoom={false}
            />
          }
          // containerComponent={
          //   withZoom ? (<ChartContainer
          //     voronoiBlacklist={["scatter", "hide_tooltip"]}
          //     zoomDomain={{ x: [1, 5] }}
          //     zoomDimension={"x"}
          //     labels={toolTipFormat}
          //     // labelComponent={<VictoryTooltip {...tooltip} />}
          //     allowZoom={false}
          //   />) : (<VictoryVoronoiContainer
          //     voronoiBlacklist={["scatter", "hide_tooltip"]}
          //     zoomDomain={{ x: [1, 5] }}
          //     zoomDimension={"x"}
          //     labels={toolTipFormat}
          //     // labelComponent={<VictoryTooltip {...tooltip} />}
          //     allowZoom={false}
          //   />)
          // }
          padding={{
            left: CSS.pixel(xLabel ? 100 : 70),
            bottom: CSS.pixel(60),
            right: CSS.pixel(80),
            top: CSS.pixel(yLabel ? 50 : 20)
          }}
          standalone={true}
        >
          {/* x轴 */}
          <VictoryAxis
            {...xAxis}
            label={xLabel}
            tickValues={areaCategary}
            tickLabelComponent={
              <VictoryLabel
                // dx={CSS.pixel(10)}
                // dy={-CSS.pixel(36)}
                // textAnchor="start"
              />
            }
            tickComponent={<Line dx={CSS.pixel(80)} />}
            axisLabelComponent={
              <VictoryLabel
                x={CSS.pixel(0)}
                dx={CSS.pixel(80)}
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
                  if(index === areaCategary.length - 1) return '1 0';
                  else return xAxis.style.grid.strokeDasharray;
                }
              }
            }}
          />
          {/* y轴 */}
          <VictoryAxis
            {...yAxis}
            label={yLabel}
            axisLabelComponent={
              <VictoryLabel y={CSS.pixel(20)} dx={CSS.pixel(40)} angle={0} />
            }
            tickValues={tickValues}
            dependentAxis
            // tickFormat={tick => `${Math.round(tick)}`}
            tickFormat={t => `${t >= 1000 ? parseInt(t / 1000) + "k" :Math.round(t)}`}
            // tickFormat={t => `${t >= 1000 ? parseFloat(t / 1000).toFixed(1) + "k" :Math.round(t)}`}
          />
          <VictoryGroup
            // 处理长度为1时的情况
            data={data.length > 1 ? data : data.map((item) => {
              let tempItem = JSON.parse(JSON.stringify(item))
              tempItem.key = `${tempItem.key}_copy`
              return tempItem;
            }).concat(data)}
            standalone={false}>
            {/* 面积图 */}
            <VictoryArea {...area} />
            {/* 标注 */}
            {showDataMarkers && (
              <VictoryScatter
                name="scatter"
                {...scatter}
                style={{
                  data: {
                    fill: colors.colorScale[0]
                  }
                }}
              />
            )}
          </VictoryGroup>
        </VictoryChart>
      </ChartWrapper>
    );
  }
}
