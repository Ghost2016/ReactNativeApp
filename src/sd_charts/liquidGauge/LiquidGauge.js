import React, { Component } from "react";
import RN, { Animated, Easing, View, Platform } from "react-native";
import { Text, G, Svg, Circle, TSpan, Image } from "react-native-svg";
import config from "../chartConfig";
import ChartWrapper from "../ChartWrapper";
import { CSS } from "../../common/SDCSS";
import { formatPower } from "@utils/user";

const { props } = config.chartOption;
const { defaultHeight, styles, colorScale } = props.liquidGauge;

class LiquidGaugeShape extends Component {
  render() {
    const { height, mainColor, getPixel, brushLength, text, type } = this.props;
    // 内部特殊颜色的图的半径
    const r_inner_circle = getPixel(190) / 2;
    // 外部环圆的半径
    const r_outer_circle = getPixel(244) / 2;
    // 外部灰色环的画笔宽度
    const strokeWidth_gray = getPixel(6);
    // 外部带颜色环的画笔宽度
    const strokeWidth_other = getPixel(10);
    // 静止在起点的小圆的半径
    const r_static_at_start_circle = getPixel(8) / 2;
    // 跟随向前滚动的小圆的外径
    const r_scroll_outer_circle = getPixel(20) / 2;
    // 跟随向前滚动的小圆的内径
    const r_scroll_inner_circle = getPixel(12 + 4) / 2;
    // 坐标圆点
    const origin = {
      x: height / 2,
      y: height / 2
    };
    // 外环当前处于哪个坐标
    const x_outer_circle =
      origin.x +
      r_outer_circle * Math.sin(brushLength / r_outer_circle + Math.PI / 2);
    const y_outer_circle =
      origin.y -
      r_outer_circle * Math.cos(brushLength / r_outer_circle + Math.PI / 2);
    // 圆开始转动的点，默认在正上方
    const startAngel = 0;
    return (
      <View style={{ flex: 1 }}>
        <Svg
          width={`${2 * origin.x}`}
          height={`${2 * origin.y}`}
          viewBox={`0 0 ${2 * origin.x} ${2 * origin.y}`}
        >
          <G transform={`rotate(${-90 + startAngel},${origin.x},${origin.y})`}>
            {/* 外面灰色的环 */}
            <Circle
              {...styles.outerGrayCircle}
              cx={`${origin.x}`}
              cy={`${origin.y}`}
              r={`${r_outer_circle}`}
              strokeWidth={strokeWidth_gray}
              strokeDasharray={`${10} ${0}`}
            />
            {/* 外面其他颜色的环 */}
            <Circle
              {...styles.outerOtherCircle}
              cx={`${origin.x}`}
              cy={`${origin.y}`}
              r={`${r_outer_circle}`}
              stroke={mainColor}
              strokeWidth={strokeWidth_other}
              strokeDasharray={`${brushLength} ${2 * Math.PI * r_outer_circle}`}
            />
            {/* 静止在起点处的圆 */}
            <Circle
              {...styles.outerOtherCircle}
              cx={`${r_outer_circle + origin.x}`}
              cy={`${origin.y}`}
              r={`${r_static_at_start_circle}`}
              fill={mainColor}
            />
            {/* 跟随条向前滚动的小圆 */}
            <Circle
              {...styles.scrolledCircle}
              cx={`${x_outer_circle}`}
              cy={`${y_outer_circle}`}
              r={`${r_scroll_inner_circle}`}
              strokeWidth={r_scroll_outer_circle - r_scroll_inner_circle}
              fill={mainColor}
            />
          </G>
          <Image
            x={CSS.pixel(19)}
            y={(Platform.OS === 'android' ? 1 : -1) *CSS.pixel(19)}
            width={2*origin.x - CSS.pixel(38)}
            height={2*origin.y - CSS.pixel(38)}
            // preserveAspectRatio="xMidYMid slice"
            href={
              type === "score"
                ? require("@img/home/home_pic_Fighting.png")
                : require("@img/home/home_pic_Salary.png")
            }
            // clipPath="url(#clip)"
          />
          {/* <Circle
            cx={`${origin.x}`}
            cy={`${origin.y}`}
            r={`${r_inner_circle}`}
            fill={mainColor}
          /> */}
          {type === "score" && (
            <Text
              {...styles.text}
              x={`${origin.x - getPixel(12)}`}
              y={`${origin.y}`}
            >
              <TSpan {...styles.specialText}>{text}</TSpan>
              <TSpan dx={-getPixel(text.length === 4 ? 36 : 50)}>分</TSpan>
              <TSpan
                {...styles.text}
                x={`${origin.x}`}
                y={`${origin.y + getPixel(32)}`}
              >
                职么力
              </TSpan>
            </Text>
          )}
          {type !== "score" && (
            <Text {...styles.text} x={`${origin.x - getPixel(12)}`} y={`${origin.y}`}>
              {/* <TSpan x={`${origin.x}`} y={`${origin.y}`} dx={-30}>
                ￥
              </TSpan> */}
              {/* <TSpan
                {...styles.specialText}
                dx={-getPixel(10)}
                textAnchor="start"
              >
                {text}
              </TSpan> */}
              <TSpan {...styles.specialText}>{text}</TSpan>
              <TSpan dx={-getPixel((text.length-4) *14+36)}>元</TSpan>
              <TSpan
                {...styles.text}
                x={`${origin.x}`}
                y={`${origin.y + getPixel(32)}`}
              >
                预估薪资
              </TSpan>
            </Text>
          )}
        </Svg>
      </View>
    );
  }
}
const AnimatedLiquidGauge = Animated.createAnimatedComponent(LiquidGaugeShape);
export default class LiquidGauge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 画笔长度
      brushLength: new Animated.Value(0)
    };
  }
  static defaultProps = {
    value: 70,
    // 显示文本，如果没有传递则会根据value生成用于进行显示的text
    text: "",
    // color: colorScale[0],
    height: CSS.pixel(defaultHeight),
    // score or not score
    type: "score",
    // 动画时间
    duration: 2000
  };
  // 根据传入的height进行适配
  getPixel = _px => (_px * this.props.height) / defaultHeight;
  componentDidMount() {
    const { brushLength } = this.state;
    const { value, duration } = this.props;
    // 占比
    const percentage = value / 100;
    // 外圆大小
    const R = this.getPixel(244) / 2;
    Animated.timing(brushLength, {
      toValue: percentage * 2 * Math.PI * R,
      easing: Easing.inOut(Easing.ease),
      duration: duration
    }).start();
  }
  render() {
    const { height, value, type, text } = this.props;
    const { brushLength } = this.state;
    const width = height;
    var color = type === "score" ? colorScale[0] : colorScale[1];
    return (
      <ChartWrapper
        nodata={this.props.nodata}
        loading={this.props.loading}
        style={{ height: height, width: width }}
      >
        <AnimatedLiquidGauge
          height={height}
          mainColor={color}
          getPixel={this.getPixel}
          brushLength={brushLength}
          type={type}
          text={(text || formatPower(value)) + ""}
        />
      </ChartWrapper>
    );
  }
}
