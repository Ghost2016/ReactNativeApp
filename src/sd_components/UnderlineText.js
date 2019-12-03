/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  //ScrollView,
  Text,
  StyleSheet,
  //TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import IntlText from "./IntlText";
import * as sdStyles from "@styles";

type Props = {
  title: string,
  styleName: string,
  title: string,
  isShow: boolean,
  lineWidth: number
};

const lineWidthDefault = 100;
const styles = StyleSheet.create({
  underline: {
    flex: 1,
    flexGrow: 1,
    width: lineWidthDefault,
    flexDirection: "column",
    height: 18
  },
  font: {
    flexDirection: "column",
    fontSize: 18,
    color: sdStyles.SDMainColor,
    marginTop: 10
  },
  fontnoline: {
    flexDirection: "column",
    fontSize: 18,
    color: sdStyles.SDFontColorMinor,
    marginTop: 11
  },
  line: {
    height: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: sdStyles.SDMainColor,
    marginTop: 2
  },
  noline: {
    height: 0,
    flexDirection: "column",
    borderWidth: 0,
    borderColor: sdStyles.SDMainColor,
    marginTop: 2
  }
});

//只适用于ios， 安卓不支持text组件嵌套
export default class UnderlineText extends PureComponent<Props> {
  props: Props;
  state = {
    lineWidth: lineWidthDefault,
    fontSize: 18
  };
  componentWillMount() {
    const { lineWidth, fontSize } = this.props;
    if (typeof lineWidth === "number")
      this.setState({
        lineWidth: lineWidth
      });
    if (typeof fontSize === "number")
      this.setState({
        fontSize: fontSize
      });
  }

  render() {
    const { style, styleName, title, isShow } = this.props;
    //console.log("this.state.lineWidth", this.state.lineWidth)
    //isShow是否展示下划线
    const _isShow = isShow ? true : false;
    return (
      <View style={[styles.underline, { width: this.state.lineWidth }]}>
        <Text
          style={[
            _isShow ? styles.font : styles.fontnoline,
            { fontSize: this.state.fontSize }
          ]}
        >
          {title}
        </Text>
        <View style={_isShow ? styles.line : styles.noline} />
      </View>
    );
  }
}
