/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import PropTypes from "prop-types";
// import IntlText from "./IntlText";
import * as sdStyles from "@src/styles";
import { CSS } from "../../../common/SDCSS";
import ConnectWithActions from "../../../connectWithActions";
import { getUserPower, getUserSalary } from "../../../selectors";
import { formatPower } from "../../../utils/user";

const _styles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: CSS.pixel(30),
    paddingHorizontal: CSS.pixel(22),
    borderRadius:20
  },
  top: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: CSS.pixel(22)
  },
  topTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: CSS.textSize(56),
    fontFamily: 'DINCondensedC',
    // fontWeight: 'bold',
  },
  normalText: {
    fontSize: CSS.textSize(20),
    lineHeight: CSS.textSize(30)
  },
  bottom: {
    position: 'relative',
    width:'100%',
  },
  normalTextContainer: {
    flexDirection: 'row',
    flex: 1
  },
  subText: {
    fontSize: CSS.textSize(24),
  }
};

type Props = {
  salary: PropTypes.number,
  power: PropTypes.number
};

class TopYellowItem extends PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    style: {}
  }
  props: Props;
  render() {
    return (
      <ImageBackground
        resizeMode="stretch"
        source={require('@img/home/home_ZhiTongLi_pic_bg.png')} style={[_styles.container, this.props.style]}>
          <View style={[_styles.top]}>
          <View style={[_styles.topTextContainer]}>
            <Text><Text style={[_styles.numberText]}>{formatPower(this.props.power)}</Text>分</Text>
            <Text style={[_styles.subText]}>职么力</Text>
          </View>
          <View style={[_styles.topTextContainer]}>
            <Text>￥<Text style={[_styles.numberText]}>{this.props.salary}</Text></Text>
            <Text style={[_styles.subText]}>预估薪资</Text>
          </View>
        </View>
        <View style={[_styles.bottom]}>
          {/* <View> */}
          <View style={[_styles.normalTextContainer, { marginBottom: CSS.pixel(6)}]}>
            <Text style={[_styles.normalText]}>* </Text>
            <Text style={[_styles.normalText, {flex:1}]}>职么力是根据重点大学的综合素质测评，从大学、专业、学历、技能、社会经历等维度综合评估，反映你的潜在职场竞争力。</Text>
          </View>
          <View style={[_styles.normalTextContainer]}>
            <Text style={[_styles.normalText]}>* </Text>
            <Text style={[_styles.normalText, {flex:1}]}>预估薪资仅做参考，与毕业后实际能拿到的薪资可能存在一定偏差。</Text>
          </View>
          {/* </View> */}
        </View>
      </ImageBackground>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  salary: getUserSalary(state, props),
  power: getUserPower(state, props)
}))(TopYellowItem));