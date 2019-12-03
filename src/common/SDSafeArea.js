/* @flow */
import React, { Component } from "react";
import ReactNative, { View, ScrollView, Dimensions } from "react-native";
import { isIphoneX } from "../utils/iphonex";

// 公用的块级元素
export default class SDSafeArea extends React.PureComponent {
  render() {
    if (this.props.noScrollView) {
      return (
        <View
          style={{
            position: "relative",
            flex: 1,
            // paddingBottom: isIphoneX() ? 34 : 0,
            backgroundColor: this.props.backgroundColor
              ? this.props.backgroundColor
              : "transparent"
          }}
          {...this.props}
        >
          {this.props.children}
          {isIphoneX() ? <View style={{ height: 34, width: "100%", backgroundColor: this.props.saveBg ? this.props.saveBg : 'transparent'}} /> : null}
        </View>
      );
    }
    return (
      <ScrollView
        style={{
          position: "relative",
          flex: 1,
          // paddingBottom: isIphoneX() ? 34 : 0,
          backgroundColor: this.props.backgroundColor
            ? this.props.backgroundColor
            : "transparent"
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        {...this.props}
      >
        {this.props.children}
        {isIphoneX() ? <View style={{ height: 34, width: "100%", backgroundColor: this.props.saveBg ? this.props.saveBg :  'transparent'}} /> : null}
      </ScrollView>
    );
  }
}
