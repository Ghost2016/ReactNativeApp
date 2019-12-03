import React, { Component } from "react";
import RN, { Animated, Easing, View, Button } from "react-native";
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
import { CSS } from "../../common/SDCSS";

const { colors, fontFamily, props, digitFontFamily } = config.chartOption;
const { defaultHeight, styles } = props.circle;
class FullCircle extends Component {
  render() {
    const { brushLength, text, label, color, height, getPixel } = this.props;
    // 内部空圆半径
    const r1 = getPixel(112) / 2;
    // 外环半径
    const r2 = getPixel(15) / 2;
    // 整个图半径大小
    const R = r1 + r2;
    // 坐标圆点
    const origin = {
      x: height / 2,
      y: height / 2
    };
    // 外环当前处于哪个坐标
    const cx = origin.x + R * Math.sin(brushLength / R + Math.PI / 2);
    const cy = origin.y - R * Math.cos(brushLength / R + Math.PI / 2);
    // 圆开始转动的点，默认在正上方
    const startAngel = 0;

    return (
      <View style={{ flex: 1 }}>
        <Svg
          width={`${2 * origin.x}`}
          // 40是标签的高度
          height={`${2 * origin.y}`}
          viewBox={`0 0 ${2 * origin.x} ${2 * origin.y}`}
        >
          {/* 画图 */}
          <G transform={`rotate(${-90 + startAngel},${origin.x},${origin.y})`}>
            {/* 初始默认灰色的圆 */}
            <Circle
              {...styles.staticCircle}
              cx={`${origin.x}`}
              cy={`${origin.y}`}
              r={`${r1 + r2}`}
              strokeWidth={r2 * 2}
            />
            {/* 初始圆 */}
            <Circle
              cx={`${origin.x}`}
              cy={`${origin.y}`}
              r={`${r1 + r2}`}
              stroke={color}
              strokeWidth={r2 * 2}
              // strokeDasharray={`${brushLength} ${2 * Math.PI * r1}`}
              fill="transparent"
            />
            {/* 静止在起点处的圆 */}
            <Circle
              cx={`${R + origin.x}`}
              cy={`${origin.y}`}
              r={`${r2}`}
              fill={color}
            />
            {/* 跟随动画前进的圆 */}
            <Circle
              cx={`${cx}`}
              cy={`${cy}`}
              r={`${r2}`}
              stroke="#fff"
              strokeWidth="0"
              fill={color}
            />
          </G>
          {/* 放在图表中心的文本 */}
          <Text
            {...styles.text}
            x={`${origin.x}`}
            y={`${origin.y + getPixel(16)}`}
            fontFamily={digitFontFamily}
            fontSize={CSS.textSize(40)}
            strokeWidth="0"
          >
            {text}
          </Text>
        </Svg>
      </View>
    );
  }
}
const AnimatedFullCircle = Animated.createAnimatedComponent(FullCircle);
export default class CircleChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushLength: new Animated.Value(0)
    };
  }
  static defaultProps = {
    value: 100,
    text: "",
    label: "",
    color: "red",
    height: CSS.pixel(defaultHeight),
    // 动画时间
    duration: 2000,
    styles: {}
  };
  // 根据传入的height进行适配
  getPixel = _px => (_px * this.props.height) / defaultHeight;
  componentDidMount() {
    const { brushLength } = this.state;
    const { value, duration } = this.props;
    // 占比
    const percentage = value / 100;
    const R = this.getPixel(112 + 15) / 2;
    Animated.timing(brushLength, {
      toValue: percentage * 2 * Math.PI * R,
      easing: Easing.inOut(Easing.ease),
      duration: duration
    }).start();
  }
  render() {
    const { value, text, label, color, height, styles } = this.props;
    const width = height;
    const { brushLength } = this.state;
    console.log('_render')
    return (
      <ChartWrapper
      style={[{height:height,width:width}, styles]}
      nodata={this.props.nodata}
      loading={this.props.loading}>
        <AnimatedFullCircle
          brushLength={brushLength}
          color={color}
          label={label || ""}
          text={`${text ? text : `${value}%`}`}
          height={height}
          getPixel={this.getPixel}
        />
      </ChartWrapper>
    );
  }
}
