/* @flow */
import React, { PureComponent } from "react";
import ReactNative, {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  UIManager
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
//import { getUserPower } from "../directSelectors";
import { getUserPowerSalary } from "@src/selectors";
import { otherUserInfoModel } from "../types";
import { formatPower } from "@src/utils/user";

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  baseLine: {
    width: Dimensions.get("window").width - 2 * 60,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    top: Platform.OS == "ios" ? 5 : -10
  },
  tip: {
    width: 0,
    height: 0,
    borderWidth: 5,
    borderColor: "transparent",
    borderTopColor: Platform.OS == "ios" ? "#fff" : "#ddd",
    top: Platform.OS == "ios" ? 5 : 0
  },
  textRemark: {
    color: "#333",
    top: 5
  }
});

type Props = {
  scoreNum: number, // 得分
  otherUserInfo: otherUserInfoModel
};

class ScroeProgress extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.fullWidth = Dimensions.get("window").width - 2 * 60;
    this.state = {
      widthAnim: new Animated.Value(0), // 宽度初始值设为0
      leftAnim: new Animated.Value(0),
      leftTipAnim: new Animated.Value(0)
    };
  }

  static contextTypes = {
    otherId: PropTypes.number.isRequired
  };

  countPower(){
    let power = this.props.salary ? this.props.powerInfo.salary : this.props.powerInfo.power;
    if(this.props.salary){
      power = parseInt((power / 20000) * 10000, 10) / 100;
    }
    return power
  }

  componentDidMount() {
    setTimeout(() => {
      let scoreNum = 0;
      const power = this.countPower();
      if (this.context.otherId === 0) {
        scoreNum = isNaN(power)?0:power <= 100 ? power : 100;
      } else {
        return;
      }
      if(this.refs["_baseLine"] && this.refs["_tip"]) {
        UIManager.measure(
          ReactNative.findNodeHandle(this.refs["_baseLine"]),
          (x, y, w, h, px, py) => {
            // debugger;
            let targetValue = (parseFloat(scoreNum) / 100) * w;
            // debugger;
            UIManager.measure(
              ReactNative.findNodeHandle(this.refs["_tip"]),
              (x2, y2, w2, h2, px2, py2) => {
                Animated.parallel([
                  // 在decay之后并行执行：
                  Animated.timing(
                    this.state.widthAnim, // 动画中的变量值
                    {
                      duration: 1000,
                      toValue: targetValue // 宽度最终变为1，即完全不透明
                    }
                  ),
                  Animated.timing(
                    this.state.leftAnim, // 动画中的变量值
                    {
                      duration: 1000,
                      toValue: targetValue - w2 / 2 + CSS.pixel(30) - (scoreNum == 100 ? 50 : 0)// left最终变为1，即完全不透明
                    }
                  )
                ]).start();
              }
            );
          }
        );
      }
    });
  }

  componentDidUpdate() {
    let scoreNum = 0;
    const power = this.countPower();
    if (this.context.otherId === 0) {
      scoreNum = isNaN(power)?0:power <= 100 ? power : 100;
    } else {
      scoreNum = isNaN(this.props.otherUserInfo.power) ? 0: this.props.otherUserInfo.power <= 100 ? this.props.otherUserInfo.power : 100;
    }
    if(this.refs["_baseLine"] && this.refs["_tip"]) {
      UIManager.measure(
        ReactNative.findNodeHandle(this.refs["_baseLine"]),
        (x, y, w, h, px, py) => {
          // debugger;
          let targetValue = (parseFloat(scoreNum) / 100) * w;
          // debugger;
          UIManager.measure(
            ReactNative.findNodeHandle(this.refs["_tip"]),
            (x2, y2, w2, h2, px2, py2) => {
              Animated.parallel([
                // 在decay之后并行执行：
                Animated.timing(
                  this.state.widthAnim, // 动画中的变量值
                  {
                    duration: 1000,
                    toValue: targetValue // 宽度最终变为1，即完全不透明
                  }
                ),
                Animated.timing(
                  this.state.leftAnim, // 动画中的变量值
                  {
                    duration: 1000,
                    toValue: targetValue - w2 / 2 + CSS.pixel(30)  - (scoreNum == 100 ? 50 : 0)// left最终变为1，即完全不透明
                  }
                )
              ]).start();
            }
          );
        }
      );
    }
    
  }

  render() {
    const { style, barColor, barStyle, noTip, fixedTip } = this.props;
    let scoreNum = 0;
    const power = this.countPower();
    if (this.context.otherId === 0) {
      scoreNum = isNaN(power)?0:power;
    } else {
      scoreNum = isNaN(this.props.otherUserInfo.power)?0:this.props.otherUserInfo.power;
    }
    return (
      <View
        style={[{
          height: noTip ? CSS.pixel(25, true) : CSS.pixel(140, true),
          paddingHorizontal: noTip ? CSS.pixel(0, true) : CSS.pixel(30),
          backgroundColor: "#fff",
          //borderTopColor: '#F3F3F3',
          //borderTopWidth: 1
        }, style]}
      >
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: noTip ? CSS.pixel(0, true) : CSS.pixel(65, true),
            left: this.state.leftAnim,
            display: noTip ? "none" : "flex",
          }}
        >
          <View
            ref="_tip"
            style={{
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              shadowColor: "#999",
              //注意：这一句是可以让安卓拥有灰色阴影
              elevation: 1,
              backgroundColor: "#fff",
              paddingHorizontal: CSS.pixel(10),
              paddingVertical: CSS.pixel(5, true),
              borderRadius: 3
            }}
          >
            <Text>职么力：{scoreNum ? formatPower(scoreNum) : 0}</Text>
          </View>
          <View
            style={{
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              shadowColor: "#999",
              //注意：这一句是可以让安卓拥有灰色阴影
              elevation: 1,
              width: CSS.pixel(10),
              height: CSS.pixel(10, true),
              top: -CSS.pixel(5, true),
              backgroundColor: "#fff",
              transform: [
                {
                  rotateZ: "45deg"
                }
              ]
            }}
          />
        </Animated.View>

        <View
          ref="_baseLine"
          style={[{
            height: noTip ? CSS.pixel(10, true) : CSS.pixel(18, true),
            marginTop: noTip ? CSS.pixel(8, true) : CSS.pixel(78, true),
            overflow: "hidden",
            backgroundColor: "#eee",
            borderRadius: noTip ? CSS.pixel(6, true) : CSS.pixel(10)
          }, barStyle]}
        >
          <Animated.View
            style={{
              backgroundColor: barColor || "#fed200",
              width: this.state.widthAnim,
              height: "100%",
              borderRadius: noTip ? CSS.pixel(6, true) : CSS.pixel(10)
            }}
          />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //scoreNum: getUserPower(state, props),
  powerInfo: getUserPowerSalary(state, props),
  otherUserInfo: state.otherUserInfo
}))(ScroeProgress);
