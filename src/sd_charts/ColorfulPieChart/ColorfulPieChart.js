import React, { Component } from "react";
import { View, Dimensions, Platform } from "react-native";
import {
  VictoryPie,
  VictoryLegend,
  VictoryGroup,
  Slice,
  Point,
  VictoryVoronoiContainer,
  VictoryLabel
} from "victory-native";
import Svg, { Defs, LinearGradient, Stop, Text, TSpan, G } from "react-native-svg";
import { CSS, PlatformInfo } from "../../common/SDCSS";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { CircleChart } from "../index.js"
import { fromJS, is} from 'immutable';
import { getStringLength, sliceStringLength } from "@utils/chart";

const { defaultDuration, props, fontFamily, digitFontFamily } = config.chartOption;
// 取假数据
const defaultData = config.chartOption.datasets.pie[0];
const { defaultHeight, width, pie, legend, pieColorScaleMix } = props.colorfulPie;

class CatPoint extends React.Component {
  render() {
    const {
      x,
      y, 
      datum,
      index, 
      formattedData, 
      category, 
      colorScale, 
      height,
      type,
      getPixel,
      maxCategoryNameLength,
      piePadding,
      nodata,
      ...restProps} = this.props; 
    const size = 5;
    // 文字长度，超过省略
    const textLength = Platform.OS === 'android' ? 18 : 18;
    // const _y = y + index * (height - (type === "small" ? getPixel(100) : getPixel(200))) / (category.length)
    // const _y = index * height / category.length
    // 修正小图图例居中
    const _y_fix_height = (type === 'small' ? 0 : 0)
    // 距离上方高度
    // const _y = y + CSS.pixel(40) * index + (height - category.length * CSS.pixel(40)) / 2 + _y_fix_height;
    const _y = CSS.pixel(50) * index + (height - category.length * CSS.pixel(50)) / 2 + _y_fix_height + CSS.pixel(20);
    // 左边距离
    const _x = (x + 20 + maxCategoryNameLength * CSS.textSize(24));
    // 离左边最大距离
    const _xMax = CSS.width()-CSS.pixel(50);
    // 离左边最小距离
    const _xMin = x + CSS.pixel(200);
    // console.warn(_x)
    return (
      <G y={height}>
        <Point {...restProps} x={x} y={_y} size={size}></Point>
        <Text x={x+20} y={_y+size} fontFamily={fontFamily} fill={'#333'} lineHeight={20}>
          <TSpan fontSize={CSS.textSize(24)}>{getStringLength(category[index].name) > textLength ? sliceStringLength(category[index].name,textLength)+'...':category[index].name}</TSpan>
          {!nodata && <TSpan
          textAnchor="end" 
          x={_x > _xMax ? _xMax : _x < _xMin ? _xMin : _x}
          fontSize={CSS.textSize(30)} 
          fontFamily={digitFontFamily}>{'    '+formattedData[index].y+'%'}</TSpan>}
        </Text>
      </G>
    );
  }
}
/**
 * 面积图
 */
export default class ColorfulPieChart extends Component {
  constructor() {
    super();
    this.state = {};
  }
  static defaultProps = {
    data: defaultData,
    pieColors: pieColorScaleMix,
    height: CSS.pixel(420),
    width: Dimensions.get("window")["width"],
    type: "big",
    onItemPress: () => {}
  };
  componentDidMount() {}
  getPixel = _px => (_px * this.props.height) / defaultHeight;
  handleClick = (type, item) => {
    console.log(type);
    if (type === "press-pie") {
      this.props.onItemPress(item);
    }
  };
  shouldComponentUpdate(nextProps) {
    // 只有当数据与上一次不致才会进行刷新
    return !is(fromJS(this.props), fromJS(nextProps))
  }
  render() {
    console.log('slice_pie_chart_render')
    const { data, pieColors, height, type, width } = this.props;
    let category = [];
    let formattedData = [];
    // 整理数据
    var total = 0;
    total = data.reduce((all, d) => {
      return all + d.y;
    }, 0);
    
    const prefixReg = new RegExp(/^[\u2E80-\u9FFF|\w|\d]+\/[\u2E80-\u9FFF|\w|\d]+/)
    data.forEach((d, i) => {
      let y = parseFloat((d.y / total) * 100).toFixed(2) - 0;
      formattedData.push({ x: d.x, y: isNaN(y) ? 0 : y });
      // if(prefixReg.test(d.x)) {
      //   category.push({ name: d.x.match(prefixReg)[0]+'...' });
      //   return
      // }
      category.push({ name: d.x });
    });
    
    const nodata = this.props.nodata || (data.length === 0) || data.every(item => item.y === 0)
    
    // 获取Category最长Name长度
    let maxCategoryNameLength = 0
    category.map(item => {
      let len = getStringLength(item.name)
      maxCategoryNameLength = maxCategoryNameLength > len ? maxCategoryNameLength : len
    })
    // 饼图padding
    const piePadding = type==='small' ? CSS.pixel(38) : CSS.pixel(30);
    const pieWidth = type==='small' ? width * 1 / 2 : width * 2 / 5;
    return (
      <ChartWrapper
      loading={this.props.loading}
      style={{ 
        width: width, 
        height: height * 2,
      }}
      >
      {nodata && (<CircleChart
            color={'#e1e1e1'}
            key={"sliced_no_data_pie"}
            text={'0'}
            value={100}
            styles={{
              position:'absolute',
              height: height,
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: CSS.pixel(130), 
            }}
          />)}
        <Svg height={height} width={width}>
        {!nodata && <VictoryPie
            {...pie}
            padding={piePadding}
            data={formattedData}
            width={pieWidth}
            height={height}
            innerRadius={type==='small' ? CSS.pixel(46) : CSS.pixel(70)}
            colorScale={pieColors}
            // 大于1才会进行显示
            // labels={d => d.y > 1 ? `${Math.round(d.y)}%` : null}
            labels={d => null}
          />}
          <VictoryLegend
            {...legend}
            itemsPerRow={2}
            x={pieWidth + (type==='big' ? CSS.pixel(50) : 0)}
            y={height}
            data={
              category.map((item,index) => {
                return {...item,name:''}
              })
            }
            dataComponent={<CatPoint
              type={type}
              height={height}
              colorScale={nodata ? ['#e1e1e1'] : pieColors}
              formattedData={formattedData}
              piePadding={piePadding}
              getPixel={this.getPixel}
              maxCategoryNameLength={maxCategoryNameLength}
              nodata={nodata}
              category={category}/>}
            colorScale={nodata ? ['#e1e1e1'] : pieColors}
            style={{
              labels: {
                fontFamily:fontFamily,
                dx: CSS.pixel(20)
               }
            }}
          />
        </Svg>
      </ChartWrapper>
    );
  }
}
