/* @flow */
import React, { Component } from "react";
import type { ChildrenArray } from "react";
import { Text } from "react-native";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "./SDCSS";
const widthScreen = Dimensions.get("window").width;

// const selectedIcon = require("@img/my/TrackRecord/mine_Resume_ico_Select.png");
// const selectNorIcon = require("@img/my/TrackRecord/mine_Resume_ico_Unselected.png");

const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");

type actionModel = {
  name: string,
  onTouch: ?Function,
  backgroundColor: string
};

type Props = {
  title: string,
  itemHeight: number,
  actionWidth: number,
  actions: actionModel[],
  other: React.CElement | Function,
  onPressCheckItem: Function,
  onPress: Function,
  checked: boolean,
  isNeedCheck: boolean
};

const styles = {
  sectionView: {
    backgroundColor: "#fff"
  },
  title: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 10
  },
  flexed: {
    flex: 1
  }
};

export default class SDTouchList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      itemHeight: this.props.itemHeight || CSS.pixel(110),
      offsetX: new Animated.Value(0),
      actionItemNum: this.props.actions ? this.props.actions.length : 0,
      actionWidth: this.props.actionWidth || CSS.pixel(160),
      previousLeft: 0,

      isNeedCheck:
        typeof this.props.isNeedCheck !== "undefined"
          ? this.props.isNeedCheck
          : false,
      checked:
        typeof this.props.checked !== "undefined" ? this.props.checked : false,
      data: this.props.data || {}
    };

    this._panResponder =
      this.props.actions && this.props.actions.length > 0
        ? PanResponder.create({
            onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture.bind(
              this
            ),
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
            onShouldBlockNativeResponder: (event, gestureState) => false //表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
          })
        : {
            panHandlers: {}
          };
  }

  hideAction() {
    Animated.timing(this.state.offsetX, {
      toValue: 0,
      duration: 100
    }).start();
  }

  /**
   * 是否需要成为move事件响应者，返回true直接走onPanResponderMove
   * @param event
   * @param gestureState
   * @returns {boolean}
   * @private
   */
  _handleMoveShouldSetPanResponderCapture(
    event: Object,
    gestureState: Object
  ): boolean {
    //当垂直滑动的距离<10 水平滑动的距离>10的时候才让捕获事件
    console.log("_handleMoveShouldSetPanResponderCapture");
    return gestureState.dy < 10 && Math.abs(gestureState.dx) > 10;
  }

  /**
   * 表示申请成功，组件成为了事件处理响应者
   * @param event
   * @param gestureState
   * @private
   */
  _handlePanResponderGrant(event: Object, gestureState: Object): void {
    // console.log("_handlePanResponderGrant");
  }

  /**
   * 处理滑动事件
   * @param event
   * @param gestureState
   * @private
   */
  _handlePanResponderMove(event: Object, gestureState: Object): void {
    // console.log("_handlePanResponderMove");
    // console.log(event);
    if (this.state.previousLeft !== null) {
      this.state.previousLeft = this.state.offsetX._value;
    }
    let nowLeft = this.state.previousLeft + gestureState.dx / 2;
    nowLeft = Math.min(nowLeft, 0); // 不让右滑
    if (nowLeft < -this.state.actionItemNum * this.state.actionWidth) {
      nowLeft = -this.state.actionItemNum * this.state.actionWidth;
    }

    this.state.offsetX.setValue(nowLeft);
  }

  /**
   * 结束事件的时候回调
   * @param event
   * @param gestureState
   * @private
   */
  _handlePanResponderEnd(event: Object, gestureState: Object): void {
    // console.log("_handlePanResponderEnd");
    if (
      Math.abs(this.state.offsetX._value) >
      (this.state.actionItemNum * this.state.actionWidth) / 2
    ) {
      Animated.timing(this.state.offsetX, {
        toValue: -this.state.actionItemNum * this.state.actionWidth,
        duration: 100
      }).start();
    } else {
      Animated.timing(this.state.offsetX, {
        toValue: 0,
        duration: 100
      }).start();
    }
  }

  _onPressCheckItem() {
    let newChecked = !this.state.checked;
    this.setState({
      checked: !this.state.checked
    });

    this.props.onPressCheckItem &&
      this.props.onPressCheckItem instanceof Function &&
      this.props.onPressCheckItem(newChecked, this.props.data);
  }

  componentWillReceiveProps(props) {
    this.setState({
      isNeedCheck: props.isNeedCheck,
      checked: props.checked
    });
  }

  render() {
    return (
      <View>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={{
            width: widthScreen,
            position: "relative",
            backgroundColor: "#fff",
            // marginLeft: this.state.offsetX
            transform: [{ translateX: this.state.offsetX }]
          }}
        >
          <TouchableOpacity
            style={{
              width: widthScreen,
              height: this.state.itemHeight, // CSS.pixel(110, true),
              paddingHorizontal: CSS.pixel(30),
              flexDirection: "row",
              alignItems: this.props.other ? 'flex-start' : "center",
              justifyContent: "space-between",
              borderBottomColor: "#efefef",
              borderBottomWidth: 1
            }}
            onPress={this.props.onPress ? this.props.onPress : null}
          >
            {this.props.other ? (
              this.props.other instanceof Function ? (
                this.props.other()
              ) : (
                this.props.other
              )
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {this.props.isNeedCheck ? (
                  <TouchableOpacity
                    style={{
                      marginRight: CSS.pixel(24),
                      height: this.state.itemHeight,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onPress={this._onPressCheckItem.bind(this)}
                  >
                    <Image
                      style={{width: CSS.pixel(36), height: CSS.pixel(36)}}
                      source={this.state.checked ? selectedIcon : selectNorIcon}
                    />
                  </TouchableOpacity>
                ) : null}

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start"
                  }}
                >
                  <Text numberOfLines={1} style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                    {this.props.title}
                  </Text>
                </View>
                <View>
                  <Image source={require("@img/my/mine_btn_list_black.png")} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
        {this.props.actions &&
          this.props.actions.map(item => {
            return (
              <TouchableOpacity
                style={{
                  height: this.state.itemHeight, //CSS.pixel(110, true),
                  width: this.state.actionWidth,
                  backgroundColor: item.backgroundColor
                    ? item.backgroundColor
                    : "#fc7771",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  zIndex: -1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={item.onTouch ? item.onTouch : null}
              >
                <Text numberOfLines={1} style={{ color: "#fff", fontSize: CSS.textSize(34) }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }
}
