import React, { Component } from "react";
import { View, Dimensions, Text as RNText } from "react-native";
import {
  VictoryGroup,
  VictoryTooltip,
  VictoryLine,
  Point,
  VictoryScatter,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  Line,
  Curve,
  VictoryVoronoiContainer,
  VictoryLabel,
  VictoryZoomContainer,
  createContainer,
  VictoryClipContainer,
  VictoryArea
} from "victory-native";
import Svg, {
  Path,
  Text,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G
} from "react-native-svg";
import { CSS } from "../../common/SDCSS";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { fromJS, is} from 'immutable';

const _ = require('lodash')
const allData = _.range(0, 10, 0.01).map(x => ({
	x: x,
  y: Math.sin(Math.PI*x/2) * x / 10
}));

const {
  colors,
  defaultDuration,
  dataLabels,
  getYAxisDomain,
  getTickValues,
  props,
  fontFamily
} = config.chartOption;

// 取假数据
const defaultData = config.chartOption.datasets.line;
const {
  xAxis,
  yAxis,
  scatter,
  height,
  width,
  chart,
  line,
  defaultHeight,
  tooltip
} = props.line;

const xAxisLabel = "";
/**
 * 线图
 */
export default class LineChart extends Component {
  constructor() {
    super();
    this.state = {
      isZooming: true
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    //console.warn("clicked");
  }

  static defaultProps = {
    // 显示Marker
    showDataMarkers: true,
    // 显示图例
    showLegend: false,
    // y轴label
    yLabel: "",
    // x轴label
    xLabel: "",
    series: [],
    data: [],
    legend: [],
    // 颜色的数组
    lineColors: colors.colorScale,
    categary: [],
    height: CSS.pixel(defaultHeight),
    width: Dimensions.get("window")["width"],
    type: "normal",
    toolTipFormat: d => `${d.y >= 1000 ? parseInt(d.y / 1000) + "k" : d.y}`,
    withZoom: false,
    maxValuePixel: 1.5,
    copyNode:false,
    yTickFormat: t => ((typeof t === 'number') && t > 10) ? '' : t,
    flex: 5
  };
  // 获取数据子项目最大长度
  getMaxLengthOfData = () => {
    const { data } = this.props;
    let maxLength = 0;
    data.map((arr, index) => {
      maxLength = maxLength >= arr.length ? maxLength : arr.length;
    });
    return maxLength
  }
  componentDidMount() {}
  shouldComponentUpdate(nextProps) {
    // 只有当数据与上一次不致才会进行刷新
    return !is(fromJS(this.props), fromJS(nextProps))
  }
  render() {
    console.log('line_chart_render')
    const {
      showDataMarkers,
      showLegend,
      yLabel,
      xLabel,
      data,
      legend,
      categary,
      height,
      type,
      toolTipFormat,
      withZoom,
      width,
      maxValuePixel,
      // 复制了一个新的点
      copyNode,
      yTickFormat,
      flex,
      lineColors,
      style
    } = this.props;
    if(data.length === 0 || this.props.nodata || (this.props.data.every((item) => JSON.stringify(item) === '[]'))) {
      return (
        <ChartWrapper
          style={{height:height,width:width}}
          loading={this.props.loading}
          nodata={true}>
          <Text></Text>
        </ChartWrapper>)
    }
    console.log('ly88', 'line_chart_data', data)

    // 记录legend的最长长度
    let maxLengthOfLegend = 0;
    let lineCategary = [];
    // 使X轴数据从小到大
    data.map(item => {
      item.sort((d1, d2) => d1.x -d2.x)
    })
    let formattedData = JSON.parse(JSON.stringify(data));
    // 处理x轴
    if (categary.length === 0) {
      formattedData[0].map(d => {
        d.x = d.x + "";
        lineCategary.push(d.x);
      });
      // 需要添加一个空的categary
      if(lineCategary.length === 1) lineCategary.push("");
      // 把所有的x轴数据都换成字符串
      formattedData.map((dataSeries, i) => {
        dataSeries.map((item, index) => {
          item.x= item.x+''
          return item
          // item.x = lineCategary[index];
        });
      });
    } else {
      lineCategary = categary;
      if(lineCategary.length > 0 && (typeof lineCategary[0] === "string")) {
        // 需要添加一个空的categary
        if(lineCategary.length === 1) lineCategary.push("");
      }
    }


    // 处理legend
    var lineLegend = [];
    // 处理legend
    if (legend.length === 0) {
      formattedData.map((d, i) => {
        lineLegend.push({ name: i });
      });
    } else {
      legend.map((d, i) => {
        // d = '学学学学学学学学学学学'
        maxLengthOfLegend = (d.length > maxLengthOfLegend) ? d.length : maxLengthOfLegend
        lineLegend.push({ name: d});
      });
    }
    // console.warn(lineLegend)
    // 取y的数据集合
    var yData = [];
    formattedData.map(d => {
      yData = yData.concat(d);
    });

    // const domain = getYAxisDomain(yData)
    const tickValues = getTickValues(yData,false,flex ,maxValuePixel);
    var getPixel = _px => (_px * height) / defaultHeight;
    const ChartContainer = createContainer("voronoi", "zoom");
    // const ChartContainer = createContainer('zoom')
    // const ChartContainer = createContainer("voronoi");
    // console.log("ly88","lineCategary", lineCategary);
    // console.log("ly88","formattedData", formattedData);
    // let offsetX = 30;
    // setTimeout(() => {
    //   offsetX+=10
    // }, 1000);
    return (

      // <View style={[{backgroundColor:'red',position:'relative'}]}>
      // <View style={{
      //   zIndex:100,
      //   backgroundColor:'white',
      //   position:'absolute',
      //   top: CSS.pixel(45),
      //   left:0,
      //   height: height - CSS.pixel(showLegend ? 210: 90),
      //   justifyContent: "space-between",
      //   width: CSS.pixel(70),
      //   paddingRight: CSS.pixel(10),
      //   borderRightWidth:1
      // }}>
      // {tickValues.sort((()=>-1)).map(item => (
      //   <RNText style={{
      //     fontSize: CSS.pixel(24),
      //     textAlign:'right'
      //   }}>{item < 1000 ? item : (parseInt(item / 1000) + 'k')}</RNText>
      // ))}
      // </View>
      <ChartWrapper
      style={[style, {height:height,width: width}]}
      loading={this.props.loading}
      nodata={this.props.nodata || this.props.data.every((item) => JSON.stringify(item) === '[]')}
      horizontal={withZoom}
      >
        <VictoryChart
          width={!withZoom ? width : width / 5 * (this.getMaxLengthOfData()||1)}
          // width={width}
          height={height}
          // domainPadding={{x:[25,25]}}
          containerComponent={
            <VictoryVoronoiContainer
              // <ChartContainer
              voronoiBlacklist={["scatter", "hide_tooltip"]}
              zoomDomain={{ x: [1, 6] }}
              zoomDimension={"x"}
              // labels={(d) => ` 产品经理 \n ${d.y >= 1000 ? parseInt(d.y/1000) + 'k': d.y}`}
              // labels={(d) => {
              //   console.warn(d);
              //   return `${d.y >= 1000 ? parseInt(d.y/1000) + 'k': d.y}`}}
              labels={(d) => {
                // console.warn(d.key)
                // 如果带有添加的假点，则不显示
                if((d.key)&&((''+d.key).indexOf('_copy') > -1))return null
                return toolTipFormat(d)
              }}
              // tickFormat={(t) => `${t >= 1000 ? parseInt(t/1000) + 'k': t}`}
              labelComponent={<VictoryTooltip {...tooltip} dy={CSS.pixel(20)} fontFamily={fontFamily}/>}
              allowZoom={false}
              // 添加左右的padding会造成左右数据会滑出图表框
              // clipContainerComponent={<VictoryClipContainer clipPadding={{top:CSS.pixel(60)}}/>}
            />
          }
          // clipContainerComponent={<VictoryClipContainer clipPadding={{left: 40, right: 40}}/>}
          // 把x轴grid向右移动20
          // gridComponent={<Line transform={`translateX(${CSS.pixel(40)})`} />}
          padding={{
            left: CSS.pixel(xLabel ? 100 : 70),
            bottom: CSS.pixel(showLegend ? 160 : 50),
            right: CSS.pixel(70),
            top: CSS.pixel(50)
          }}
          standalone={true}
        >
          {/* x轴 */}
          <VictoryAxis
            {...xAxis}
            standalone={false}
            label={xLabel}
            tickValues={lineCategary}
            tickFormat={yTickFormat}
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
                dx={CSS.pixel(90)}
                dy={-CSS.pixel(24)}
                angle={0}
              />
            }
            style={{
              ...xAxis.style,
              grid: {
                ...xAxis.style.grid,
                // 最后一根线为实线
                strokeDasharray: (t, index) => {
                  // 数据长度为1时，实线
                  if(data.length > 0 && data[0].length === 1 ) return '1 0';
                  if(index === lineCategary.length - 1) return '1 0';
                  else return xAxis.style.grid.strokeDasharray;
                }
              }
            }}
          />
          {/* y轴 */}
          <VictoryAxis
            {...yAxis}
            // offsetX={offsetX}
            dependentAxis
            tickValues={tickValues}
            label={yLabel}
            // label
            axisLabelComponent={
              <VictoryLabel y={CSS.pixel(20)} dx={CSS.pixel(50)} angle={0}/>
            }
            tickFormat={t => `${t >= 1000 ? parseInt(t / 1000) + "k" : t}`}
          />
          {showLegend && (
            <VictoryLegend
              x={(() => {
                let marginX = CSS.pixel(100) - ((maxLengthOfLegend>8) ? (maxLengthOfLegend-8)* CSS.pixel(30):0)
                return marginX < 0 ? 0 : marginX
              })()}
              y={height - CSS.pixel(80)}
              // fill="blue"
              dataComponent={
                <Point
                  // 返回图例的形状
                  getPath={(x, y, size) => {
                    // 圆的半径
                    const r = CSS.pixel(6);
                    const lineWidth = CSS.pixel(4);
                    const halfLineWidth = lineWidth / 2;
                    // 偏离值
                    const lineLength = CSS.pixel(80);
                    const left_circle = `M${x},${y} A${r},${r},0,1,0,${x + 2 * r},${y} A${r},${r},0,1,0,${x},${y}`;
                    const right_circle = `M${x + lineLength},${y} A${r},${r},0,1,0,${x + lineLength +2 * r},${y} A${r},${r},0,1,0,${x + lineLength},${y}`;
                    const middle_line = `M${x},${y + halfLineWidth} L${x + lineLength},${y + halfLineWidth} L${x + lineLength},${y - halfLineWidth} L${x},${y - halfLineWidth} Z`
                    return `${left_circle} ${right_circle} ${middle_line}`
                  }}
                  // symbol="minus"
                  events={{ onClick: this.handleClick }}
                />
              }
              // height={500}
              colorScale={lineColors}
              orientation="horizontal"
              gutter={CSS.pixel(100) + maxLengthOfLegend * CSS.pixel(5)}
              padding={{ left: CSS.pixel(10) }}
              symbolSpacer={CSS.pixel(10)}
              data={lineLegend}
              style={{
                labels: { fontFamily:fontFamily, dx: CSS.pixel(100) }
              }}
            />
          )}
          {formattedData.map((d, i) => {
            console.log('ly88', 'lineChart', i, d)
            let _d = null
            // 如果长度为0
            if(d.length === 0) {
              return null;
            }
            // 如果长度为1时，需要补充一个假点
            if(d.length === 1) {
              _d = d.map((item, index) => {
                let tempItem = JSON.parse(JSON.stringify(item))
                tempItem.key = `${tempItem.key}_copy`
                return tempItem;
              }).concat(d)
            } else {
              _d = d;
            }
            return (
              <VictoryGroup
                key={d+i+''}
                height={height}
                width={width}
                // 线图没有加载动画，有两种解决办法：1.降低react-native-svg版本号2.Replacing the groupComponent in VictoryLine with a standard <G/> tag
                // This issue is caused by a change in react-native-svg@^6.2.x. Since this change ClipPath components are not updating their widths which causes animating line and area charts to always be rendered with a 0 width ClipPath.
                // animate={{
                //   duration: 500,
                //   onLoad: { duration: 1000 }
                // }}
              >
                {/* 需要改成面积图 */}
                {true && <VictoryArea
                  // {...line}
                  data={_d}
                  // 如果是需要职么力成长趋势图，需要隐藏一个
                  name={
                    (() => {
                      if((JSON.stringify(formattedData[0]) !== '[]')&&( i === 1 && type === "trend")) {
                        return "hide_tooltip"
                      }
                      return "line"
                    })()
                  }
                  height={height}
                  width={width}
                  standalone={false}
                  interpolation={"monotoneX"}
                  style={{
                    data: {
                      strokeWidth: CSS.pixel(4),
                      // ...line.style.data,
                      // 10%透明度
                      fill: lineColors[i] + '18',
                      stroke: lineColors[i],
                      dx: CSS.pixel(40),
                      strokeDasharray: `10 ${
                        i === 0 && type === "trend" ? 5 : 0
                      }`
                    }
                  }}
                  // Replacing the groupComponent in VictoryLine with a standard <G/> tag. You will not see curtaining transitions (no more 'onLoad' transitions, or nice transitions for changing numbers of data points), but regular animations will work correctly.
                  // groupComponent={<G/>}
                />}
                {/* {true && <VictoryLine
                  {...line}
                  data={_d}
                  // 如果是需要职么力成长趋势图，需要隐藏一个
                  name={
                    (() => {
                      if((JSON.stringify(formattedData[0]) !== '[]')&&( i === 1 && type === "trend")) {
                        return "hide_tooltip"
                      }
                      return "line"
                    })()
                  }
                  height={height}
                  width={width}
                  standalone={false}
                  style={{
                    data: {
                      ...line.style.data,
                      stroke: lineColors[i],
                      dx: CSS.pixel(40),
                      strokeDasharray: `10 ${
                        i === 0 && type === "trend" ? 5 : 0
                      }`
                    }
                  }}
                  // Replacing the groupComponent in VictoryLine with a standard <G/> tag. You will not see curtaining transitions (no more 'onLoad' transitions, or nice transitions for changing numbers of data points), but regular animations will work correctly.
                  // groupComponent={<G/>}
                />} */}
                {showDataMarkers && (
                  <VictoryScatter
                    name="scatter"
                    {...scatter}
                    style={{
                      data: {
                        fill: lineColors[i]
                      }
                    }}
                    data={_d}
                  />
                )}
              </VictoryGroup>
            );
          })}
        </VictoryChart>
        {/* </Svg> */}
      </ChartWrapper>
      // </View>
    );
  }
}

// 10000 points (10 / 0.001 = 10000) - see what happens when you render 50k or 100k
// const allData = _.range(0, 10, 0.001).map(x => ({
// 	x: x,
//   y: Math.sin(Math.PI*x/2) * x / 10
// }));
// console.log('underscore',allData)
export class BigDataChart extends React.Component {
  constructor(props) {
  	super();
    this.entireDomain = this.getEntireDomain(props);
   	this.state = {
    	zoomedXDomain: this.entireDomain.x,
    };
  }
  static defaultProps = {
    data: allData,
    maxPoints: 120
  }
	onDomainChange(domain) {
  	this.setState({
    	zoomedXDomain: domain.x,
    });
  }
  getData() {
  	const { zoomedXDomain } = this.state;
    const { data, maxPoints } = this.props;
  	const filtered = data.filter(
    	(d) => (d.x >= zoomedXDomain[0] && d.x <= zoomedXDomain[1]));

    if (filtered.length > maxPoints ) {
      const k = Math.ceil(filtered.length / maxPoints);
    	return filtered.filter(
      	(d, i) => ((i % k) === 0)
      );
    }
    return filtered;
  }
  getEntireDomain(props) {
  	const { data } = props;
    return {
    	y: [_.minBy(data, d => d.y).y, _.maxBy(data, d => d.y).y],
      x: [ data[0].x, _.last(data).x ]
    };
  }
  getZoomFactor() {
    const { zoomedXDomain } = this.state;
    const factor = 10 / (zoomedXDomain[1] - zoomedXDomain[0]);
    return _.round(factor, factor < 3 ? 1 : 0);
  }
	render() {
    const renderedData = this.getData();
  	return (
    	<View style={{height:500,width:CSS.width()}}>
        <VictoryChart
          domain={this.entireDomain}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            onZoomDomainChange={this.onDomainChange.bind(this)}
            minimumZoom={{x: 1/1000}}
          />}
        >
          <VictoryScatter data={renderedData} />
        </VictoryChart>
        <RNText>
          {this.getZoomFactor()}x zoom;
          rendering {renderedData.length} of {this.props.data.length}
        </RNText>
      </View>
    );
  }
}

// ReactDOM.render(<BigDataChart data={allData} maxPoints={120} />, mountNode);