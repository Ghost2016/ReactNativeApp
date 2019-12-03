/* @flow */
import React, { PureComponent } from "react";
import { Platform, View } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@src/sd_components/SDButton";

type Props = {
  onPress: () => void
};

export default class CountDownButton extends PureComponent<Props> {
  props: Props;

  constructor(props){
    super(props);
    this.state = {
      backgroundColor: "#bfbfbf",
    }
  }

  onPressGetCode = () => {
    const { isLoadCode } = this.props;
    // 如果还在倒计时，则不会发送
    !isLoadCode && this.props.onPress();
  }

  componentWillReceiveProps(nextProp){
    const { isLoadCode, isActive } = nextProp;
    this.setState({
      backgroundColor: isLoadCode ?  "#bfbfbf" : isActive?sdStyles.SDMainColor : "#bfbfbf",
    })
  }

  render() {
    const { style, isLoadCode, currLeftTime, isNeedReLoad, isActive, outerStyle } = this.props;
    return (
      <SDButton
        style={[{
          //zIndex: 5,
          backgroundColor: this.state.backgroundColor,
          borderRadius: 0, //CSS.pixel(50),
          height: Platform.OS === "android" ? CSS.pixel(82, true) : CSS.pixel(80, true),
          width: CSS.pixel(170),
          position: "relative",
          left: CSS.pixel(6),
          borderWidth: 0,
          borderColor: '#f00',
        }, style]}
        outerStyle={[{
          position: "relative",
          left: CSS.pixel(-8),
          width: CSS.pixel(180),
          height: CSS.pixel(80, true),
          top: Platform.OS === "android" ? CSS.pixel(-15, true) : CSS.pixel(-15, true),
          borderWidth: 0,
          borderColor: '#00f',
        }, outerStyle]}
        btnStyle={{
          fontSize: CSS.textSize(24),
          color: isLoadCode ? "#fff" : sdStyles.SDFontColorMain,
          textAlign: "center",
          position: "relative",
          top: Platform.OS === "android" ? CSS.pixel(0, true) : CSS.pixel(0, true)
        }}
        title={
          isLoadCode
            ? "重新获取(" + currLeftTime + ")"
            : isNeedReLoad
              ? "重新获取"
              : "获取验证码"
        }
        onPress={this.onPressGetCode.bind(this)}
        disabled={isLoadCode}
      />
    );
  }
}
