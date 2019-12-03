import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { Text, G, Path, Svg, Circle } from "react-native-svg";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { CSS } from "../../common/SDCSS";
import * as sdStyle from "../../styles/index";
const { props } = config.chartOption;
const { styles, defaultHeight, colorScale } = props.forceMap;
import { getStringLength, sliceStringLength } from "@utils/chart";

// 获取1个-1到1的随机数
function getRandom() {
  return Math.random() * (Math.random() >= 0.5 ? 1 : 1);
}

// 产生随机点
function generateRandomPoint({ width, height, r, R }) {
  const x = 2 * r + getRandom() * (width - 4 * r);
  const y = 2 * r + getRandom() * (height - 4 * r);
  // 排除与中心会碰撞的点
  // 如果出现，则重新生成点
  // x 方向圆外加三个小圆的半径
  // y 方向圆外加两个小圆的半径
  if (
    Math.abs(width / 2 - x) < R + 3 * r &&
    Math.abs(height / 2 - y) < R + 2 * r
  ) {
    return arguments.callee(arguments[0]);
  }
  return { x: x, y: y };
}

/**
 * 获取一个点到另外两个点构成的点直线的距离
 * @param {*} point
 * @param {*} point1 直线上的点
 * @param {*} point2 直线上的点
 */
function getDistanceOfPointToLine(point, point1, point2) {
  // 方程参数ax+by+c=0
  const a = point1.y - point2.y;
  const b = point2.x - point1.x;
  const c = (point1.x - point2.x) * point1.y - (point1.y - point2.y) * point1.x;
  // 距离
  const d = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
  return d;
}
/**
 * 求两点之间距离
 * @param {Array} point1 {x, y}
 * @param {Array} point2
 *
 */
function getDistanceOf2Points(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

// 碰撞检测
function collisionCheck({
  sourceCenter,
  pointCenter,
  R,
  r,
  gap,
  points,
  paddingBetweenLineAndCircle
}) {
  const length = points.length;
  for (let i = 0; i < length; i++) {
    // 检查两个圆点是否会碰撞
    if (getDistanceOf2Points(points[i], pointCenter) < 2 * r + gap) {
      return false;
    }
    // 检查圆与其他的线是否会碰撞
    // if(getDistanceOfPointToLine(pointCenter,sourceCenter,points[i]) < r + paddingBetweenLineAndCircle) {
    //   return false
    // }
  }
  return true;
}

// 记录生成一个点所花的次数
let times = 0
// 生成一个点
function generatePoint({
  width,
  height,
  R,
  r,
  gap,
  sourceCenter,
  paddingBetweenLineAndCircle,
  points
}) {
  // console.warn(times)
  if(times > 40) {
    return null;
  }
  // 次数加1
  times += 1
  const newPoint = generateRandomPoint({ width, height, r, R });
  // 检测与其他的点是否碰撞
  if (
    collisionCheck({
      sourceCenter,
      pointCenter: newPoint,
      R,
      r,
      gap,
      points,
      paddingBetweenLineAndCircle
    })
  ) {
    return newPoint;
  } else {
    // 如果没有检测通过，则再次生成
    return arguments.callee(arguments[0]);
  }
}

class ForceMapSvg extends Component {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {}
  render() {
    // 定义高度宽度
    const { height, width, data, color, getPixel } = this.props;
    // 圆心
    const sourceCenter = { x: width / 2, y: height / 2 };
    // 中心大圆的半径
    const R = CSS.pixel(70);
    // 边上小圆的半径
    const r = CSS.pixel(52);
    // 用于两个圆边距的最小距离
    const gap = 0;
    // 线和圆之间的间距
    const paddingBetweenLineAndCircle = 2;
    // 已存在的点
    let points = [];
    // 根据数据获取点布局的位置
    const filteredData = data.skill.filter((item) => {
      // 过滤字体长度大于10的技能
      return getStringLength(item.name) <= 10
    }).slice(0, data.skill.length >= 11 ? 11 : data.skill.length)
    const filteredDataLength = filteredData.length;
    // 可优化，放到非UI线程计算
    for(let index = 0;index<filteredDataLength;index++ ) {
      // console.warn(times)
      times = 0
      let pointCenter = generatePoint({
        width,
        height,
        R,
        r,
        gap,
        sourceCenter,
        paddingBetweenLineAndCircle,
        points
      });
      // 如果大于了40次，则重新循环一次
      if(pointCenter !== null) {
        pointCenter.name = filteredData[index].name;
        pointCenter.key = index;
        // pointCenter.name = '软件工程师';
        points.push(pointCenter);
      } else {
        index = -1;
        points = [];
      }
    }
    const goalTextLength = getStringLength(data.goal)
    return (
      <View>
        <Svg ref="svg" width={width} height={height}>
          {points.map((pointCenter, index) => {
            const textLength = getStringLength(pointCenter.name)
            return (
              <G key={pointCenter.key}>
                <Path
                  d={`M${pointCenter.x},${pointCenter.y} L${sourceCenter.x},${
                    sourceCenter.y
                  }`}
                  stroke={"#ddd"}
                />
                <Circle
                  cx={pointCenter.x}
                  cy={pointCenter.y}
                  r={r}
                  fill={color[index % 2]}
                />
                <Text
                  {...styles.dataLabel}
                  x={pointCenter.x}
                  y={pointCenter.y}
                  fontSize={textLength <= 10 ? CSS.textSize(20) : CSS.textSize(28 - textLength)}
                  fill={"#333"}
                  dy={4}
                >
                  {pointCenter.name}
                </Text>
              </G>
            );
          })}
          <Circle
            cx={sourceCenter.x}
            cy={sourceCenter.y}
            r={R}
            fill={sdStyle.SDMainColor}
          />
          <Text
            {...styles.dataLabel}
            x={sourceCenter.x}
            y={sourceCenter.y}
            fontSize={goalTextLength <= 10 ? CSS.textSize(28) : CSS.textSize(34 - goalTextLength)}
            fill={"#333"}
            fontWeight={'bold'}
          >
            {data.goal}
          </Text>
        </Svg>
      </View>
    );
  }
}
export default class ForceMap extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    color: colorScale,
    height: CSS.pixel(600, true),
    // height: CSS.pixel(defaultHeight),
    width: Dimensions.get("window")["width"],
    data: {}
  };
  getPixel = _px => (_px * this.props.height) / defaultHeight;
  componentDidMount() {}
  render() {
    const { width, height, color, data } = this.props;
    return (
      <ChartWrapper
      nodata={this.props.nodata || (JSON.stringify(this.props.data) === "{}")}
      loading={this.props.loading}
      style={{ width: width, height: height }}>
        {/* {JSON.stringify(this.props.data) !== "{}" ? ( */}
          <ForceMapSvg
            getPixel={this.getPixel}
            width={width}
            height={height}
            data={data}
            color={color}
          />
        {/* ) : null} */}
      </ChartWrapper>
    );
  }
}
