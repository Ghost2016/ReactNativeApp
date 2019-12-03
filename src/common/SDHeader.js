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
  Platform,
  Image
} from "react-native";
import { CSS } from "./SDCSS";
import { SDMainColor } from "@styles";
import { isIphoneX } from "../utils/iphonex";
import SDTouchOpacity from "./SDTouchOpacity";
import { Context } from "../types";

const androidTopArea = Platform.OS == "android" ? 20 : 0;
const headerHeight =
  Platform.OS === "ios" ? (isIphoneX() ? 88 : 64) : 50 + androidTopArea;
const headerPadding =
  Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea;
const headerOffsetHeight = headerHeight + headerPadding;
// console.warn(headerOffsetHeight);
export { headerHeight, headerPadding, headerOffsetHeight, androidTopArea };

const lightBackIcon = require("@img/home/home_ico_back.png");
const darkBackIcon = require("@img/salary/home_Salary_back.png");

const styles = StyleSheet.create({
  header: {
    minHeight: headerHeight,
    paddingTop:
      Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
    alignItems: "center",
    backgroundColor: "red",
    flexDirection: "row"
  },
  title: {
    // fontWeight: "600",
    fontSize: Platform.OS == "ios" ? CSS.textSize(36) : CSS.textSize(36)
  },
  left: {
    width: 60,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: CSS.pixel(30)
  },
  center: {
    flex: 1,
    width: Dimensions.get("window").width - 60 * 2,
    alignItems: "center",
    justifyContent: "center"
  },
  right: {
    width: 60,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: CSS.pixel(30)
  }
});

type ButtonItem = {
  icon: () => Element,
  id: string,
  title: ?string
};

export type ButtonsProps = {
  rightButtons: ButtonItem[]
};

export type HeaderProps = {
  // header-title
  title: stirng,
  // header-右部按钮或者名称
  navigatorButtons: ButtonsProps,
  // 是否需要固定头部显示-此参数目前传为true后，会使header默认为透明，滚动screen-header会变为白色背景
  fixed: ?boolean,
  left: Function | Element,
  right: Function | Element,
  custom: Function | Element,
  backgroundColor: string,
  opactiy: number,
  onPressBack: ?Function,
  animate: ?boolean
};

type Event = {
  type: string,
  id: string
};

export default class SDHeader extends React.Component<HeaderProps> {
  props: Props;
  context: Context;

  static contextTypes = {
    navigator: () => null,
    navigatorEvent: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      opactiyAnimate: new Animated.Value(
        this.props.opactiy ? this.props.opactiy : 1
      ),
      backgroudnAnimate: new Animated.Value(this.props.animate ? 0 : 1)
    };
  }
  onScrollHeaderOpacity(y) {
    if (y > 0 && y <= headerOffsetHeight) {
      Animated.timing(this.state.opactiyAnimate, {
        duration: 0,
        toValue: y / headerOffsetHeight
      }).start();
    } else if (y > headerOffsetHeight) {
      Animated.timing(this.state.opactiyAnimate, {
        duration: 0,
        toValue: 1
      }).start();
    } else {
      Animated.timing(this.state.opactiyAnimate, {
        duration: 0,
        toValue: 0
      }).start();
    }
  }
  onScrollHeaderBackground(y) {
    if (y > 0 && y <= headerOffsetHeight) {
      Animated.timing(this.state.backgroudnAnimate, {
        duration: 0,
        toValue: y / headerOffsetHeight
      }).start();
    } else if (y > headerOffsetHeight) {
      Animated.timing(this.state.backgroudnAnimate, {
        duration: 0,
        toValue: 1
      }).start();
    } else {
      Animated.timing(this.state.backgroudnAnimate, {
        duration: 0,
        toValue: 0
      }).start();
    }
  }

  _dispatchNavEvent(event: Event) {
    if (
      this.context.navigatorEvent &&
      this.context.navigatorEvent.dispatchEvent
    ) {
      this.context.navigatorEvent.dispatchEvent(event);
    }
  }

  _renderRightButton(navigatorButtons: ButtonsProps) {
    if (navigatorButtons && navigatorButtons.rightButtons) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            overflow: "visible"
          }}
        >
          {navigatorButtons.rightButtons.map(c => {
            return (
              <SDTouchOpacity
                key={c.id + ""}
                onPress={this._dispatchNavEvent.bind(this, {
                  type: "NavBarButtonPress",
                  id: c.id + ""
                })}
                style={{
                  height: CSS.pixel(98, true),
                  alignItems: "flex-end",
                  justifyContent: "center"
                }}
              >
                {c.icon ? (
                  // <Text>{c.icon}</Text>
                  c.icon()
                ) : c.title ? (
                  <Text style={{ color: "#333", fontSize: CSS.textSize(32) }}>
                    {c.title}
                  </Text>
                ) : null}
              </SDTouchOpacity>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  }
  render() {
    // const { schoolName, schoolLevel, major } = this.props.ascriptionData;
    const { backgroundColor, navigatorButtons } = this.props;
    let customPosition = {};
    if (this.props.fixed) {
      customPosition = {
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 2
      };
    }
    return (
      <Animated.View
        style={[
          styles.header,
          {
            ...this.props.style
          },
          {
            ...customPosition,
            backgroundColor: backgroundColor || "transparent",
            opacity: this.state.opactiyAnimate
          }
        ]}
      >
        {!this.props.custom ? (
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                opacity: this.state.backgroudnAnimate,
                backgroundColor: "#fff"
              },
              this.props.normalStyle
            ]}
          />
        ) : null}
        {this.props.custom && this.props.custom instanceof Function ? (
          this.props.custom()
        ) : this.props.custom ? (
          this.props.custom
        ) : (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={[styles.left, { ...this.props.leftStyle }]}>
              {this.props.left ? (
                this.props.left instanceof Function ? (
                  this.props.left()
                ) : (
                  this.props.left
                )
              ) : (
                this.props.noLeft ? null : <SDTouchOpacity
                  style={{ flex: 1 }}
                  noDelay
                  onPress={
                    this.props.onPressBack
                      ? this.props.onPressBack
                      : () => {
                          this.context.navigator &&
                            this.context.navigator.pop &&
                            this.context.navigator.pop();
                        }
                  }
                >
                  <Image source={darkBackIcon} />
                </SDTouchOpacity>
              )}
            </View>
            <View style={styles.center}>
              <Text style={styles.title} numberOfLines={1}>
                {this.props.title}
              </Text>
            </View>
            <View style={styles.right}>
              {this.props.right
                ? this.props.right instanceof Function
                  ? this.props.right()
                  : this.props.right
                : this._renderRightButton(navigatorButtons)}
            </View>
          </View>
        )}
      </Animated.View>
    );
  }
}
