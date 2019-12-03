/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
// import IntlText from "./IntlText";
import * as sdStyles from "@src/styles";
import { CSS } from "../common/SDCSS";
import { formatPower } from "@utils/user";

const _styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center",
    fontSize: 12,
  },
  specitalText: {
    fontSize: 17,
    fontWeight: sdStyles.SDFontBold
  }
});

type Props = {
  score: PropTypes.number,
  percentage: PropTypes.number
  // rank: PropTypes.number
};

export default class ScoreText extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress();
  static defaultProps = {
    score: 0,
    percentage: 0
  };
  render() {
    const { score, percentage, style } = this.props;
    return (
      <View style={[_styles.container, style]}>
        <Text style={_styles.text}>
          {"上周增长分数"}
          <Text style={_styles.specitalText}>{`${formatPower(score)}分`}</Text>
          {"，较上周进步了"}
          <Text style={_styles.specitalText}>{`${parseInt((percentage)*100)}%`}</Text>
        </Text>
      </View>
    );
  }
}
