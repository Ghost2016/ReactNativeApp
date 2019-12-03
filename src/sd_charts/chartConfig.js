import { VictoryTheme } from "victory-native";
import { Platform } from "react-native";
import { CSS, PlatformInfo } from "../common/SDCSS";

// 颜色表
const colorScale = ["#fed200", "#00adfe", "#00eea2", "#fe8900", "#cf4cff", "#ff766f"];

// 饼图的颜色---蓝
const pieColorScaleBlue = [
  "#0060fe",
  "#0083fe",
  "#00adfe",
  "#00c5fe",
  "#7bdbf7",
  "#b2e8f8"
];
// 饼图的颜色---紫
const pieColorScalePurple = [
  "#834aff",
  "#ad4cff",
  "#cf4cff",
  "#da76ff",
  "#ebb3ff",
  "#f4d7ff"
];
// 饼图的颜色---蓝
const pieColorScaleMix = [
  "#fed200",
  "#fea100",
  "#ff766f",
  "#D04DFF",
  "#01ADFF",
  "#00EEA2"
];
// 图表辅助色
const assistantColorScale = [
  "#00adfe",
  "#00fead",
  "#fe8900",
  "#fe8900",
  "#cf4cff",
  "#ff766f"
];
// 图表的字体
// const fontFamily = "SimSun";
// const fontFamily = "";
// const fontFamily = "SimHei";
const fontFamily = "PingFang SC";
const digitFontFamily = "DINCondensedC";
// const fontFamily = "PingFang-SC-Regular";

// 图表的字体的颜色
const fontColor = "#999999";
const gridColor = "#d0d0d0";
// 默认高度
const defaultHeight = 500;
// 默认宽度
const defaultWidth = PlatformInfo.width();
let initNormalizeDataString = '';
const get_init_nomalize_data = () => {
  if(!initNormalizeDataString) {
    let temp = []
    for(let i=0;i<=100;i++) {
      temp.push({
        x: i,
        y: 0
      })
    }
    // console.log('ly88', 'init_nomalize_data', temp)
    initNormalizeDataString = JSON.stringify(temp)
  }
  return JSON.parse(initNormalizeDataString)
}
const defalutTextStyle = {
  fontSize: CSS.textSize(24),
  fontFamily: fontFamily,
  fill: "#fff",
  // fontWeight:"bold",
  textAnchor: "middle"
  // dominantBaseLine:"middle"
};
/**
 * 获取图表的Y方向的domain
 * @param {Array} data 数据
 * 形如
 * [
 *   { x: 1, y: 51},
 *   { x: 2, y: 73}
 * ]
 *
 */
function getYAxisDomain(data, isHorizontal, maxValuePixel, flex) {
  // 数据转换
  let domainYMin,
    domainYMax = 0;
  // 获取最大值与最小值
  data.forEach((d, i) => {
    if (i === 0) {
      domainYMin = d.y;
      domainYMax = d.y;
    } else {
      if (d.y < domainYMin) domainYMin = d.y;
      else if (d.y > domainYMax) domainYMax = d.y;
    }
  });

  // 根据比对的次数，1次为10，2次为100，3次为1000
  let count = 1;
  domainYMax = domainYMax * maxValuePixel
  while (domainYMax > 100) {
    domainYMax = domainYMax / 10;
    count *= 10;
  }

  //domainYMax += domainYMax % 2 === 1 ? 1 : 0;
  // console.warn(domainYMax)
  // 此处前两位取偶数值
  if (domainYMax >= 10) {
    domainYMax = domainYMax + flex - domainYMax % flex
  }
  // console.warn(domainYMax)
  // 此处是可以进行优化的点
  domainYMax = Math.round(domainYMax) * count;
  return !isHorizontal ? { y: [0, domainYMax] } : { x: [0, domainYMax] };
}
/**
 *
 * @param {*} data
 * @param {*} isHorizontal
 * @param {*} flex 几等分
 * @param {*} maxValuePixel 轴的最大值与数据最大值的比率
 */
function getTickValues(
  data,
  isHorizontal = false,
  flex = 5,
  maxValuePixel = 1.5
) {
  flex += 1
  const domain = getYAxisDomain(data, isHorizontal, maxValuePixel, flex);
  let maxValue = 0;
  if (!isHorizontal) {
    maxValue = domain.y[1];
  } else {
    maxValue = domain.x[1];
  }
  // 整理数据为flex的整数倍率
  if (maxValue % flex !== 0) {
    maxValue = (parseInt(maxValue / flex) + 1) * flex;
  }
  // 如果小于10，则等于10
  // maxValue = maxValue < 10 ? 10 : maxValue;
  // 如果等于0，则取等分数
  maxValue = maxValue === 0 ? flex : maxValue;
  const tickValues = [0];
  for (let i = 1; i < flex; i++) {
    tickValues.push(Math.ceil((maxValue * i) / flex));
  }
  // console.warn(tickValues)
  return tickValues;
}

const baseProps = {
  height: defaultHeight,
  width: defaultWidth,
  chart: {
    padding: { left: 50, bottom: 40, right: 50, top: 0 },
    // domainPadding: { x: 50 },
    standalone: false
  },
  // x轴
  xAxis: {
    style: {
      grid: {
        stroke: gridColor,
        // strokeWidth: 1,
        strokeDasharray: `${CSS.pixel(15)} ${CSS.pixel(9.27)}`
        // dx: 40
      },
      tickLabels: {
        padding:CSS.pixel(5),
        fontFamily: fontFamily,
        fontSize: CSS.textSize(22),
        fill: fontColor
      },
      axis: {
        stroke: gridColor
      },
      ticks: {
        stroke: "#dfdfdf",
        size: CSS.pixel(20),
        // stroke: "red",
        strokeDasharray: `${CSS.pixel(15)} ${CSS.pixel(9.27)}`,
        strokeDashoffset: `${CSS.pixel(4)}`
      },
      axisLabel: {
        fontFamily: fontFamily,
        fontSize: CSS.textSize(20),
        fill: "#c5c5c5",
        textAnchor: "end"
      }
    },
    theme: VictoryTheme.material,
    standalone: false
  },
  // y轴
  yAxis: {
    style: {
      grid: {
        stroke: gridColor,
        strokeWidth: 1
        // strokeDasharray: "5 5"
      },
      tickLabels: {
        fontFamily: fontFamily,
        fontSize: CSS.textSize(22),
        fill: fontColor
      },
      axis: {
        stroke: gridColor
      },
      axisLabel: {
        fontFamily: fontFamily,
        fontSize: CSS.textSize(20),
        fill: "#c5c5c5"
      }
    },
    theme: VictoryTheme.material
    // standalone: false
    //
  },
  // 标注
  scatter: {
    // labels: ["a", "b", "c", "d", "e", "f", "g", "h"],
    size: (datum, active) => (active ? CSS.pixel(10) : CSS.pixel(6)),
    style: {
      data: {
        fill: "#fff",
        stroke: colorScale[0],
        strokeWidth: CSS.pixel(6)
      },
      labels: {
        fontSize: CSS.textSize(28),
        padding: CSS.pixel(24)
      }
    }
  },
  // 图例
  legend: {
    standalone: false,
    colorScale: colorScale,
    orientation: "vertical",
    ...Platform.select({
      ios: {
        // ios初始状态
        symbolSpacer: CSS.pixel(-6),
        rowGutter: { bottom: CSS.pixel(20) }
      },
      android: {
        // android初始状态
        symbolSpacer: CSS.pixel(15)
      }
    })
  },
  // 面积图
  area: {
    // standalone: false,
    // “basis”, "bundle", “cardinal”, “catmullRom”, “linear”, "monotoneX", “monotoneY”, “natural”, “step”, “stepAfter”, “stepBefore”
    interpolation: "monotoneX",
    style: {
      data: {
        // 20%透明度
        fill: "#fed20036",
        stroke: "#fed200",
        strokeWidth: CSS.pixel(4),
        strokeLinecap: "round"
      }
    }
  },
  // tooltip
  tooltip: {
    cornerRadius: d => CSS.pixel(10),
    pointerLength: d => CSS.pixel(10),
    // width={CSS.pixel(150)}
    style: {
      fontFamily: fontFamily,
      textAnchor: "middle",
      padding: CSS.pixel(20)
    }
  }
};
const config = {
  chartOption: {
    fontFamily: fontFamily,
    digitFontFamily: digitFontFamily,
    getYAxisDomain: getYAxisDomain,
    getTickValues: getTickValues,
    defaultDuration: {
      duration: 400,
      onLoad: {
        duration: 600
      }
    },
    // dataLabels: ["a", "b", "c", "d", "e", "f", "g", "h"],
    datasets: {
      pie: [
        [
          { x: "早起打卡abcdefghijklmn", y: 55 },
          { x: "证书考取", y: 55 },
          { x: "阅读书单", y: 45 },
          { x: "智慧书单", y: 45 },
          { x: "每日打卡", y: 45 }
        ],
        [
          { x: "A", y: 25 },
          { x: "B", y: 50 },
          { x: "C", y: 75 },
          { x: "D", y: 100 }
        ],
        [
          { x: "A", y: 40 },
          { x: "B", y: 20 },
          { x: "C", y: 210 },
          { x: "D", y: 30 }
        ]
      ],
      bar: [
        [
          { x: 1, y: 51, fill: colorScale[0] },
          { x: 2, y: 73, fill: colorScale[1] },
          { x: 3, y: 32, fill: colorScale[2] },
          { x: 4, y: 41, fill: colorScale[3] },
          { x: 5, y: 35, fill: colorScale[4] },
          { x: 6, y: 102, fill: colorScale[4] },
          { x: 7, y: 95, fill: colorScale[4] }
        ],
        [
          { x: 1, y: 45, fill: colorScale[0] },
          { x: 2, y: 20, fill: colorScale[1] },
          { x: 3, y: 32, fill: colorScale[2] },
          { x: 4, y: 30, fill: colorScale[3] },
          { x: 5, y: 30, fill: colorScale[0] }
        ],
        [
          { x: 1, y: 3, fill: colorScale[0] },
          { x: 2, y: 2, fill: colorScale[1] },
          { x: 3, y: 4, fill: colorScale[2] },
          { x: 4, y: 2, fill: colorScale[3] }
        ]
      ],
      area: [
        [
          // 最好是以时间缀的形式传入
          { x: "6月4号", y: 32 },
          { x: "6月5号", y: 54 },
          { x: "6月6号", y: 35 },
          { x: "6月7号", y: 26 },
          { x: "6月8号", y: 72 }
          // { x: '', y: null}
        ],
        [
          // { x: 0, y: 8 },
          { x: 1, y: 13 },
          { x: 2, y: 24 },
          { x: 3, y: 52 },
          { x: 4, y: 65 },
          { x: 5, y: 28 }
        ],
        [
          // 最好是以时间缀的形式传入
          { x: "2010.1", y: 32 },
          { x: "2010.2", y: 7 },
          { x: "2010.3", y: 30 },
          { x: "2010.4", y: 10 },
          { x: "2010.5", y: 10.5 }
        ]
      ],
      line: [
        // 职么力分值用
        [
          { x: "2010.01", y: 20, key: '3849' },
          { x: "2010.02", y: 26, key: '0' },
          { x: "2010.03", y: 46, key: '1' },
          { x: "2010.04", y: 47, key: '2' },
          { x: "2010.05", y: 51, key: '3' },
          { x: "2010.06", y: 56, key: '4' },
          { x: "2010.07", y: 61, key: '5' },
          { x: "2010.08", y: 61, key: '6' },
          { x: "2010.09", y: 61, key: '7' },
          { x: "2010.10", y: 61, key: '8' },
          { x: "2010.11", y: 61, key: '9' },
          { x: "2010.12", y: 61, key: '10' },
          { x: "2011.01", y: 61, key: '11' },
          { x: "2011.02", y: 61, key: '12' },
        ],
        [
          { x: 0, y: 2000, key: '2001' },
          { x: 1, y: 3000, key: '7' },
          { x: 2, y: 4000, key: '8' },
          { x: 3, y: 6000, key: '9' },
          { x: 4, y: 8000, key: '10' },
          { x: 5, y: 12000, key: '11' },
          { x: 6, y: 12000, key: '12' },
          { x: 7, y: 12000, key: '13' },
          { x: 8, y: 12000, key: '14' },
          { x: 9, y: 12000, key: '15' }
        ]
      ],
      scatter: {
        0: [
          { x: 1, y: 3, symbol: "triangleDown", fill: colorScale[0] },
          { x: 1.5, y: 2, symbol: "plus", fill: colorScale[1] },
          { x: 2, y: 4, symbol: "star", fill: colorScale[2] },
          { x: 2.5, y: 2.5, symbol: "square", fill: colorScale[3] },
          { x: 3, y: 3.5, symbol: "circle", fill: colorScale[0] },
          { x: 3.5, y: 1.5, symbol: "triangleUp", fill: colorScale[1] },
          { x: 4, y: 3, symbol: "diamond", fill: colorScale[2] }
        ],
        1: [
          { x: 1, y: 1, symbol: "triangleDown", fill: colorScale[0] },
          { x: 1.5, y: 3, symbol: "plus", fill: colorScale[1] },
          { x: 2, y: 2, symbol: "star", fill: colorScale[2] },
          { x: 2.5, y: 2.5, symbol: "square", fill: colorScale[3] },
          { x: 3, y: 4, symbol: "circle", fill: colorScale[0] },
          { x: 3.5, y: 3, symbol: "triangleUp", fill: colorScale[1] },
          { x: 4, y: 5, symbol: "diamond", fill: colorScale[2] }
        ],
        2: [
          { x: 1, y: 5, symbol: "triangleDown", fill: colorScale[0] },
          { x: 1.5, y: 3.5, symbol: "plus", fill: colorScale[1] },
          { x: 2, y: 4, symbol: "star", fill: colorScale[2] },
          { x: 2.5, y: 1.5, symbol: "square", fill: colorScale[3] },
          { x: 3, y: 2, symbol: "circle", fill: colorScale[0] },
          { x: 3.5, y: 2.5, symbol: "triangleUp", fill: colorScale[1] },
          { x: 4, y: 1, symbol: "diamond", fill: colorScale[2] }
        ]
      },
      normalize: [
        // 身高：频率},
        { x: 128, y: 1 },
        { x: 132, y: 1 },
        { x: 133, y: 1 },
        { x: 134, y: 1 },
        { x: 135, y: 1 },
        { x: 136, y: 2 },
        { x: 137, y: 4 },
        { x: 138, y: 8 },
        { x: 139, y: 11 },
        { x: 140, y: 14 },
        { x: 141, y: 19 },
        { x: 142, y: 28 },
        { x: 143, y: 41 },
        { x: 144, y: 54 },
        { x: 145, y: 80 },
        { x: 146, y: 133 },
        { x: 147, y: 153 },
        { x: 148, y: 235 },
        { x: 149, y: 333 },
        { x: 150, y: 429 },
        { x: 151, y: 598 },
        { x: 152, y: 764 },
        { x: 153, y: 1059 },
        { x: 154, y: 1314 },
        { x: 155, y: 1776 },
        { x: 156, y: 2290 },
        { x: 157, y: 2835 },
        { x: 158, y: 3503 },
        { x: 159, y: 4373 },
        { x: 160, y: 5513 },
        { x: 161, y: 6475 },
        { x: 162, y: 7809 },
        { x: 163, y: 9437 },
        { x: 164, y: 11189 },
        { x: 165, y: 13282 },
        { x: 166, y: 15020 },
        { x: 167, y: 17239 },
        { x: 168, y: 19215 },
        { x: 169, y: 21597 },
        { x: 170, y: 24336 },
        { x: 171, y: 26684 },
        { x: 172, y: 29000 },
        { x: 173, y: 31413 },
        { x: 174, y: 33179 },
        { x: 175, y: 35027 },
        { x: 176, y: 37084 },
        { x: 177, y: 38047 },
        { x: 178, y: 38968 },
        { x: 179, y: 39635 },
        { x: 180, y: 39700 },
        { x: 181, y: 39548 },
        { x: 182, y: 38960 },
        { x: 183, y: 38074 },
        { x: 184, y: 36648 },
        { x: 185, y: 35020 },
        { x: 186, y: 33224 },
        { x: 187, y: 30538 },
        { x: 188, y: 29198 },
        { x: 189, y: 26668 },
        { x: 190, y: 23893 },
        { x: 191, y: 21662 },
        { x: 192, y: 19476 },
        { x: 193, y: 16898 },
        { x: 194, y: 15056 },
        { x: 195, y: 13046 },
        { x: 196, y: 10971 },
        { x: 197, y: 9456 },
        { x: 198, y: 7928 },
        { x: 199, y: 6697 },
        { x: 200, y: 5370 },
        { x: 201, y: 4334 },
        { x: 202, y: 3548 },
        { x: 203, y: 2810 },
        { x: 204, y: 2330 },
        { x: 205, y: 1765 },
        { x: 206, y: 1350 },
        { x: 207, y: 1093 },
        { x: 208, y: 797 },
        { x: 209, y: 595 },
        { x: 210, y: 371 },
        { x: 211, y: 328 },
        { x: 212, y: 255 },
        { x: 213, y: 165 },
        { x: 214, y: 121 },
        { x: 215, y: 91 },
        { x: 216, y: 71 },
        { x: 217, y: 29 },
        { x: 218, y: 32 },
        { x: 219, y: 28 },
        { x: 220, y: 20 },
        { x: 221, y: 6 },
        { x: 222, y: 7 },
        { x: 223, y: 7 },
        { x: 224, y: 3 },
        { x: 225, y: 2 },
        { x: 228, y: 1 }
      ]
    },
    colors: {
      // 渐变颜色
      gradient: [colorScale[0], "#57f1d5"],
      // 更深的一点渐变颜色
      gradientDeeper: [colorScale[0], "green"],
      // 图表列颜色
      colorScale: colorScale
    },
    props: {
      area: {
        ...baseProps,
        defaultHeight: 400
      },
      bar: {
        ...baseProps,
        // 水平BarChart属性
        hBar: {
          barRatio: 0.8,
          style: {
            data: {
              stroke: colorScale[0],
              fill: colorScale[0]
            },
            labels: {
              fontFamily: fontFamily,
              strokeWidth: 0.6,
              stroke: "#333",
              fontSize: CSS.textSize(20)
            }
          }
        },
        // 竖直BarChart属性
        vBar: {
          // bar宽度占比
          barRatio: 0.5,
          style: {
            data: {
              // strokeWidth: ,
              stroke: colorScale[0],
              fill: colorScale[0]
            }
          }
        }
      },
      pie: {
        ...baseProps,
        defaultHeight: 260,
        pieColorScaleBlue: pieColorScaleBlue,
        pieColorScalePurple: pieColorScalePurple,
        pieColorScaleMix: pieColorScaleMix,
        pie: {
          colorScale: pieColorScaleBlue,
          standalone: false,
          style: {
            labels: {
              fontSize: CSS.textSize(30),
              fill: "#333",
              fontWeight: "500"
            }
          }
        },
        legend: {
          ...baseProps.legend,
          colorScale: pieColorScaleBlue
        }
      },
      colorfulPie: {
        ...baseProps,
        defaultHeight: 260,
        pieColorScaleBlue: pieColorScaleBlue,
        pieColorScalePurple: pieColorScalePurple,
        pieColorScaleMix: pieColorScaleMix,
        pie: {
          colorScale: pieColorScaleMix,
          standalone: false,
          style: {
            labels: {
              fontSize: CSS.textSize(30),
              fill: "#333",
              fontWeight: "500"
            }
          }
        },
        legend: {
          ...baseProps.legend,
          colorScale: pieColorScaleMix,
          orientation: "horizontal",
        }
      },
      normalize: {
        ...baseProps,
        defaultHeight: CSS.pixel(400),
        // defaultHeight: defaultHeight,
        get_empty_data: get_init_nomalize_data,
        scatter: {
          ...baseProps.scatter,
          labels: [],
          style: {
            data: {
              fill: "#fff",
              stroke: colorScale[0],
              strokeWidth: 2
            }
          }
        },
        // 其中的线图
        line: {
          style: {
            data: {
              stroke: colorScale[0],
              strokeWidth: CSS.pixel(4)
            },
            labels: {
              fill: colorScale[0],
              fontSize: 14
            }
          },
          // “basis”, “bundle”, “cardinal”, “catmullRom”, “linear”, “monotoneX”, “monotoneY”, “natural”, “step”, “stepAfter”, “stepBefore”
          interpolation: "monotoneX"
        }
      },
      // 线图
      line: {
        ...baseProps,
        defaultHeight: 420,
        line: {
          interpolation: "monotoneX",
          style: {
            data: {
              strokeWidth: CSS.pixel(4)
            }
          }
        }
      },
      // 力导向图
      forceMap: {
        colorScale: assistantColorScale,
        defaultHeight: 500,
        styles: {
          dataLabel: {
            ...defalutTextStyle,
            dy: CSS.textSize(10),
          }
        }
      },
      //
      liquidGauge: {
        colorScale: assistantColorScale,
        // 最外圈大圆的半径径127 + 5(跟着一起前进的球延伸出去的宽度)
        defaultHeight: 132 * 2,
        styles: {
          outerGrayCircle: {
            stroke: "#dedede",
            fill: "transparent"
          },
          outerOtherCircle: {
            strokeWidth: 0,
            fill: "transparent"
          },
          scrolledCircle: {
            stroke: "#fff"
          },
          text: {
            ...defalutTextStyle,
            stroke: "#fff",
            strokeWidth: 1,
          },
          specialText: {
            fontSize: CSS.textSize(50),
            stroke: "#fff",
            strokeWidth: 2,
            fontFamily: fontFamily
          }
        }
      },
      circle: {
        // 最外圈大圆的直径
        defaultHeight: 142,
        styles: {
          text: {
            fontSize: CSS.textSize(40),
            textAnchor: "middle",
            stroke: "#333",
            fontFamily: fontFamily
          },
          staticCircle: {
            stroke: "#dedede",
            strokeDasharray: "1 0",
            fill: "transparent"
          }
        }
      }
    }
  }
};

export default config;
