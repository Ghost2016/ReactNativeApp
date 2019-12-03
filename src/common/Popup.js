/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
  PanResponder,
  Platform
} from "react-native";
import { isIphoneX } from "../utils/iphonex";
import { dismissLightBox } from "../styles";
import {Navigation} from 'react-native-navigation'
import GestureRecognizer from "react-native-swipe-gestures";
const styles = StyleSheet.create({});

type Props = {
  isShow: boolean
};

export default class Popup extends React.Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      // topOffset: new Animated.Value(Dimensions.get("window").height - 60),
      topOffset: Platform.OS == "ios" ? (isIphoneX() ? 88 : 64) : 50 + 30 // android 加30状态栏
    };

    this._gestureHandlers = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // this.setState({ bg: "red" });
      },
      onPanResponderMove: () => {
        //console.warn(123);
      },
      onPanResponderRelease: () => {
        // this.setState({ bg: "white" });
      }
    });
  }
  // componentWillReceiveProps(next) {
  //   if (next.isShow === true) {
  //     Animated.timing(this.state.topOffset, {
  //       toValue: 0,
  //       easing: Easing.inOut(Easing.ease),
  //       duration: 300
  //     }).start();
  //   } else {
  //     Animated.timing(this.state.topOffset, {
  //       toValue:
  //         Platform.OS == "ios"
  //           ? isIphoneX()
  //             ? Dimensions.get("window").height - 88
  //             : Dimensions.get("window").height - 64
  //           : Dimensions.get("window").height - 50,
  //       easing: Easing.inOut(Easing.ease),
  //       duration: 300
  //     }).start();
  //   }
  // }

  // show() {
  //   Animated.timing(this.state.topOffset, {
  //     toValue: 0,
  //     easing: Easing.inOut(Easing.ease),
  //     duration: 300
  //   }).start();
  // }

  hide() {
    dismissLightBox();
    //console.warn(333);
  }

  render() {
    // const { schoolName, schoolLevel, major } = this.props.ascriptionData;
    return (
      <View
        style={{
          height:
            Platform.OS == "ios"
              ? isIphoneX()
                ? Dimensions.get("window").height - 88
                : Dimensions.get("window").height - 64
              : Dimensions.get("window").height - 50 - 30,
          width: Dimensions.get("window").width,
          backgroundColor: "#fff",
          position: "absolute",
          zIndex: 9999,
          top: this.state.topOffset
        }}
      >
        {/* <GestureRecognizer
        onSwipeRight={state => {
          this.hide();
        }}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        }}
        style={{
          height:
            Platform.OS == "ios"
              ? isIphoneX()
                ? Dimensions.get("window").height - 88
                : Dimensions.get("window").height - 64
              : Dimensions.get("window").height - 50,
          width: Dimensions.get("window").width,
          backgroundColor: "#fff",
          position: "absolute",
          zIndex: 9999,
          top: this.state.topOffset
        }}
      > */}
        <GestureRecognizer
          onSwipeDown={state => {
            dismissLightBox();
          }}
          config={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 40
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              this.hide();
            }}
          >
            <Image source={require("@img/home/home_btn_back_on.png")} />
          </TouchableOpacity>
        </GestureRecognizer>

        {this.props.children}
        {/* </GestureRecognizer> */}
      </View>
    );
  }
}
