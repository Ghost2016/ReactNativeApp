/* @flow */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  UIManager,
  Animated,
  TouchableOpacity
} from "react-native";
// UIManager.measure(ReactNative.findNodeHandle(this.refs['xxx']), (x, y, w, h, px, py)=>{
//     //代码
// });

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width
  },
  contentBox: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 2 * 40,
    left: 40,
    maxHeight: 150,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 1,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef"
  }
});

// 公用的块级元素
export default class SDTipDocker extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      topOffset: this.props.topOffset ? this.props.topOffset : 80,
      tipLeftOffset: this.props.tipLeftOffset ? this.props.tipLeftOffset : 43,
      opacityValue: new Animated.Value(0),
      display: "none"
    };
  }

  componentWillReceiveProps(next) {
    this.setState({
      topOffset: next.topOffset,
      tipLeftOffset: next.tipLeftOffset
    });
  }

  show(x, y) {
    this.setState(
      {
        topOffset: y,
        tipLeftOffset: x,
        display: "flex"
      },
      () => {
        Animated.timing(
          this.state.opacityValue, // 动画中的变量值
          {
            duration: 200,
            toValue: 1
          }
        ).start();
      }
    );
  }

  hide() {
    this.setState({
      display: "none"
    });
    Animated.timing(
      this.state.opacityValue, // 动画中的变量值
      {
        duration: 200,
        toValue: 0
      }
    ).start();
  }

  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: this.state.display
        }}
      >
        <TouchableOpacity onPress={this.hide.bind(this)} style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.container,
            {
              opacity: this.state.opacityValue,
              position: "absolute",
              top: this.state.topOffset
            }
          ]}
        >
          <View
            style={{
              left: this.state.tipLeftOffset,
              width: 16,
              height: 16,
              // borderColor: "transparent",
              // borderBottomColor: "#fff",
              // borderWidth: 10,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              shadowColor: "#999",
              //注意：这一句是可以让安卓拥有灰色阴影
              elevation: 1,
              top: 8,
              backgroundColor: "#fff",
              transform: [
                {
                  rotateZ: "45deg"
                }
              ]
            }}
          />
          <View style={styles.contentBox}>
            <ScrollView>{this.props.children}</ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}
