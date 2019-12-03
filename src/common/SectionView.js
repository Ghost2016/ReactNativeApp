/* @flow */
import React, { Component } from "react";
import type { ChildrenArray } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";

type Props = {
  children: ChildrenArray<*>
};
const styles = {
  sectionView: {
    backgroundColor: "#fff",
    paddingVertical: CSS.pixel(30),
    // backgroundColor: 'pink'
  },
  titleLeftIcon: {
    height: CSS.pixel(28, true),
    borderLeftColor: "#333",
    borderLeftWidth: CSS.pixel(4)
  },
  header: {
    paddingHorizontal: CSS.pixel(30),
    flexDirection: "row",
    alignItems: "center"
  },
  titleText:{
    fontSize: CSS.textSize(28),
    paddingLeft: CSS.textSize(14),
  },
  flexed: {
    // flex: 1
  }
};

// 公用的块级元素
export default class SectionView extends Component<Props> {
  props: Props;
  static defaultProps ={
    withTitleLeftIcon: true,
    right: null
  }
  render() {
    const { children, title, right, withTitleLeftIcon, style, ...restProps } = this.props;
    return (
      <View style={[styles.sectionView, style]}>
        {title && (
          <View style={[styles.header]}>
            {withTitleLeftIcon && <View style={[styles.titleLeftIcon]}></View>}
            <Text style={[styles.titleText]}>{title}</Text>
            {right}
          </View>
        )}
        <View style={styles.flexed} {...restProps}>
          {children}
        </View>
      </View>
    );
  }
}
