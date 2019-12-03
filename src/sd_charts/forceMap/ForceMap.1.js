import React, { Component } from "react";
import RN, { Animated, Easing, View, Button, Dimensions } from "react-native";
import {
  Text,
  LinearGradient,
  Stop,
  G,
  Defs,
  Path,
  Svg,
  Circle
} from "react-native-svg";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import * as force from "d3-force";
import * as d3 from "d3";
const { colors, fontFamily, props } = config.chartOption;
const { styles } = props.forceMap;

// 获取1个-1到1的随机数
function getRandom() {
  return Math.random() * (Math.random() >= 0.5 ? -1 : 1);
}
// 产生随机点
function generateRandomPoint({ width, height, r, R, borderGap, sourceCenter }) {
  // const x = (width - 6 * r) * getRandom() + 3*r
  // const y = (height - 4 * r) * getRandom() + 2*r
  // const R1 = R + 3*r + (Math.random()>=0.5?(-1):1) *r
  const R1 = R + 3 * r;
  const x = getRandom() * R1;
  const y = Math.sqrt(R1 * R1 - x * x) * (Math.random() >= 0.5 ? -1 : 1);
  // 象限
  var p = 0;
  // 排除与中心会碰撞的点
  // 如果出现，则重新生成点
  // if((Math.abs(width/2 -x) < R + 3*r)&&(Math.abs(height/2 -y) < R + 2*r)) {
  //   return arguments.callee(arguments[0])
  // }
  // 象限
  if (x >= sourceCenter.x && y >= sourceCenter.y) {
    p = 1;
  } else if (x < sourceCenter.x && y > sourceCenter.y) {
    p = 2;
  } else if (x <= sourceCenter.x && y <= sourceCenter.y) {
    p = 3;
  } else if (x > sourceCenter.x && y < sourceCenter.y) {
    p = 3;
  }

  return { x: width / 2 + x, y: height / 2 + y, p: p };
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
  // console.log(point2)
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}
// 更新一个点
function updatePoint(point, oldPoint, r, gap) {
  const theta = Math.atan((point.y - oldPoint.y) / (oldPoint.x - point.x));
  //console.warn("theta", theta);
  const x0 = point.x + (2 * r + gap) * Math.sin(theta);
  const y0 = point.y + (2 * r + gap) * Math.cos(theta);
  return { x: x0, y: y0 };
}

// 碰撞检测,并解决返回新的点的数组
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
  // 用于返回数组
  var newPoints = [].concat(points);
  for (let i = 0; i < length; i++) {
    // 两个圆碰撞
    if (getDistanceOf2Points(points[i], pointCenter) < 2 * r + gap) {
      // var oldPoints = [].contat(points)
      oldPoint = newPoints.splice(i, 1)[0];
      oldPoint = updatePoint(pointCenter, oldPoint, r, gap);
      newPoints = arguments.callee(
        Object.assign({}, arguments[0], { pointCenter: oldPoint, newPoints })
      );
      return newPoints;
    }
    // if(getDistanceOfPointToLine(pointCenter,sourceCenter,points[i]) < r + paddingBetweenLineAndCircle) {
    //   return false
    // }
  }
  // 如果都没有碰撞了
  newPoints.push(pointCenter);
  return newPoints;
}

// 生成一个点
let time = 0;
function generatePoint({
  width,
  height,
  R,
  r,
  gap,
  sourceCenter,
  lineWidth,
  paddingBetweenLineAndCircle,
  points,
  borderGap
}) {
  const newPoint = generateRandomPoint({
    width,
    height,
    r,
    R,
    borderGap,
    sourceCenter
  });
  // 检测与其他的点是否碰撞
  // return collisionCheck({sourceCenter, pointCenter:newPoint, R, r, gap, points, paddingBetweenLineAndCircle})
  // if(collisionCheck({sourceCenter, pointCenter:newPoint, R, r, gap, points, paddingBetweenLineAndCircle})) {
  // console.warn('newPoint',newPoint)
  return newPoint;
  // } else {
  //   time++
  //   console.log('repeat')
  //   // 如果没有检测通过，则再次生成
  // }
}

class ForceMapSvg extends Component {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {}
  render() {
    // 定义高度宽度
    const { height, width, data, color } = this.props;
    // 圆心
    const sourceCenter = { x: width / 2, y: height / 2 };
    // 两种圆的半径
    // const R = 30;
    // const r = 15;
    const R = width / 10;
    const r = width / 15;
    // 距离中心圆边距的最小距离为3*r,距离外边距的最小距离也为3*r
    const borderGap = 3 * r;
    // 两个圆边距的最小距离
    const gap = 0;
    // 线和圆之间的间距
    const paddingBetweenLineAndCircle = 0;
    // 线的宽度
    const lineWidth = 1;
    const fontSize = 16;
    // 已存在的点
    var points = [];
    data.skill.map((item, index) => {
      // points = generatePoint({width,height,R,r,gap,sourceCenter,lineWidth,paddingBetweenLineAndCircle,points,borderGap})
      // return;
      var pointCenter = generatePoint({
        width,
        height,
        R,
        r,
        gap,
        sourceCenter,
        lineWidth,
        paddingBetweenLineAndCircle,
        points,
        borderGap
      });
      pointCenter.name = item.name;
      points.push(pointCenter);
    });
    return (
      // <View style={{backgroundColor:'pink' }}>
      <View>
        <Svg ref="svg" width={width} height={height}>
          {points.map((pointCenter, index) => {
            return (
              <G>
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
                  fill={color[1]}
                />
                {/* <Text {...styles.dataLabel} x={pointCenter.x} y={pointCenter.y} fontSize={8} dy={4}>{pointCenter.name}</Text> */}
              </G>
            );
          })}
          <Circle
            cx={sourceCenter.x}
            cy={sourceCenter.y}
            r={R}
            fill={color[0]}
          />
          <Text {...styles.dataLabel} x={sourceCenter.x} y={sourceCenter.y}>
            {data.goal}
          </Text>
        </Svg>
      </View>
    );
  }
}
// const AnimatedForceMapSvg = Animated.createAnimatedComponent(ForceMapSvg);
export default class ForceMap extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    color: [],
    height: 300,
    width: Dimensions.get("window")["width"]
  };
  componentDidMount() {}
  render() {
    const { width, height, color } = this.props;
    // const height = 300;
    const data = {
      goal: "产品经理",
      skill: [
        {
          key: 1,
          name: "竞品分析"
        },
        {
          key: 2,
          name: "prd"
        },
        {
          key: 3,
          name: "产品策划"
        },
        {
          key: 4,
          name: "用户反馈"
        },
        {
          key: 5,
          name: "用户体验"
        },
        {
          key: 6,
          name: "产品体验"
        },
        {
          key: 7,
          name: "产品原型"
        },
        {
          key: 8,
          name: "用户保真"
        },
        {
          key: 9,
          name: "功能设计"
        },
        {
          key: 10,
          name: "原型设计"
        },
        {
          key: 11,
          name: "axure"
        }
      ]
    };
    // console.warn(width)
    return (
      <ChartWrapper style={{ width: width, height: height }}>
        <ForceMapSvg
          width={width}
          height={height}
          data={data}
          color={color.concat(colors.colorScale)}
        />
      </ChartWrapper>
    );
  }
}
