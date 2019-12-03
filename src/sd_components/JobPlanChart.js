/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { HorizontalBarChart } from "@src/sd_charts";

type Props = {};

export default class JobPlanChart extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, data, special, xTickLabelFormatter, barLabelFormatter, xTickValues, xLabel, yLabel, barLabelTail, height,
      left,
      bottom,
      right,
      top,
    } = this.props;
    const _special = special ? 'special' : '';
    let _data = Array.isArray(data) ? data : [];
    const _xLabel = xLabel ? xLabel : '选择率\n（%）';
    const _yLabel = yLabel ? yLabel : '职位名称';
    const _barLabelTail = barLabelTail ? barLabelTail : '%';
    return (
      <HorizontalBarChart
            left={left}
            bottom={bottom}
            right={right}
            top={top}
            style={[{ justifyContent: "center", alignSelf: "center" }, style]}
            //'' || 'special' 表示bar右侧为中文说明，不是百分比
            type={_special}
            xLabel={_xLabel}
            yLabel={_yLabel}
            labels={_data.map((n,i)=>{
                  return {
                    firstLine: n.firstLine,
                    secondLine: n.secondLine,
                  }
                })}
            categary={_data.map((n,i)=>{
                  return n.category + "" // + i
                })}
            // 是否要指定x刻度值
            xTickValues={
              xTickValues? xTickValues : []//[0, 20, 40, 60, 80, 100]
            }
            // 数据源
            data={_data.map((n,i)=>{
                  return {
                    x: n.x,
                    y: n.y,
                  }
                })}
            // x刻度值formatter
            xTickLabelFormatter={
              typeof xTickLabelFormatter === 'function' ? xTickLabelFormatter(text) : (text) => text > 1000 ? (parseInt(text/1000)||'0') + 'k' : text || 0
              // (text) => (parseInt(text/1000)||'0') + 'k'
            }
            // bar便签formmater
            barLabelFormatter={
              typeof barLabelFormatter === 'function' ? barLabelFormatter : (d) => (d && d.y) ? d.y + _barLabelTail : ''
            }
          />
    );
  }
}
