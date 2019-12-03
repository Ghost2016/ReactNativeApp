/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
// import IntlText from "./IntlText";
import * as sdStyles from "@src/styles";
import { CSS } from "../../common/SDCSS";

const _styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center",
    color: "#999",
    fontSize: CSS.textSize(24)
  },
  specitalText: {
    fontWeight: "500",
    color: "#333"
  }
});

type Props = {
  score: PropTypes.number,
  majorName: PropTypes.string,
  rank: PropTypes.number
};

export default class ScoreText extends PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    percentage: 0
  }
  props: Props;
  render() {
    let _percentage = parseInt(this.props.percentage, 10);
    _percentage = isNaN(_percentage) ? 0 : _percentage;
    let msg = ''
    if(_percentage >= 80) {
      msg = '你已经成为“别人家的孩子”！'
    } else if(_percentage >= 60){
      msg = '都是腰间盘，为何你这么突出？'
    } else if(_percentage >= 40){
      msg = '恭喜你，成绩不好不坏，提升其实最快！'
    } else if(_percentage >= 30){
      msg = '我知道你只是想学孔融让梨，才把好名次让给别人。'
    } else if(this.props.studentAccount === 1) {
      msg = '一大波学霸正在赶来与你一决高下，准备好了吗？'
    }else {
      msg = '终有一日，逆袭的快感，会排山倒海的涌向你。'
    }
    return (
      <View style={[_styles.container, this.props.style]}>
        <Text style={_styles.text}>
          {"当前职么力"}
          <Text style={_styles.specitalText}>{this.props.score || 0}分</Text>
          {"，在"}
          <Text style={_styles.specitalText}>
            “{this.props.compareItem || `-`}”
          </Text>
          <Text style={_styles.specitalText}>
            {this.props.studentAccount || `0`}人
          </Text>
          {"中排名"}
          <Text style={_styles.specitalText}>第{this.props.rank || 0}位</Text>
          {`，超过`}
          <Text style={_styles.specitalText}>
            {_percentage + '%'}
          </Text>
          {`的人！`}
          {msg}
        </Text>
      </View>
    );
  }
}
