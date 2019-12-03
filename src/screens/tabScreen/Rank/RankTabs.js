// import { Tabs } from "antd-mobile";
import React from "react";
import { View, Animated, Text, Easing, StyleSheet, Platform } from "react-native";
import { CSS } from "../../../common/SDCSS";
import * as sdStyles from "@src/styles";
import { SDTabs2 } from "@src/sd_components";
const componentStyle = StyleSheet.create({
  title: {
    color: '#333',
    fontSize: CSS.textSize(32),
  },
  selectedTitle: {
    fontWeight: sdStyles.SDFontMedium
  }
})
export default class RankTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      offsetX: new Animated.Value(CSS.width() / 3 / 2 - CSS.pixel(13))
    };
  }
  componentDidMount() {}
  render() {
    const { offsetX } = this.state;
    const { onChangeTab, children } = this.props;
    return (
      <View style={{flex:1}}>
        <Animated.View
          style={{
            zIndex: 5,
            // 设置一个高度宽度以显示
            width: CSS.pixel(40),
            height: CSS.pixel(40),
            // 与Tab控件的height相同
            marginTop: Platform.OS === 'ios' ? CSS.pixel(74, true) : CSS.pixel(70, true),
            // marginTop: CSS.pixel(88, true),
            position: "absolute",
            transform: [{ translateX: offsetX }]
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderLeftWidth: CSS.pixel(13),
              borderRightWidth: CSS.pixel(13),
              borderBottomWidth: CSS.pixel(13),
              borderTopWidth: CSS.pixel(13),
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: sdStyles.SDMainColor,
              borderBottomColor: "transparent"
            }}
          />
        </Animated.View>
        {/* <SDTabs2/> */}
        <SDTabs2
        tabWidthStyle={{
          backgroundColor: sdStyles.SDMainColor
        }}
        tabStyle={{
          minHeight: CSS.pixel(74, true),
          backgroundColor:sdStyles.SDMainColor,
        }}
        tabTitles={[
            () => (<Text style={
              [componentStyle.title, 
              this.state.currentIndex===0&&componentStyle.selectedTitle]}>
              登峰榜
            </Text>), 
            () => (<Text style={
              [componentStyle.title, 
              this.state.currentIndex===1&&componentStyle.selectedTitle]}>关注榜</Text>),
             () => (<Text style={
              [componentStyle.title, 
              this.state.currentIndex===2&&componentStyle.selectedTitle]}>进步榜</Text>)]}
        page={0}
        style={{flex:1}}
        underLineWidth={CSS.pixel(0)}
        onChangeTab={(index) => {
          this.setState(
            {
              currentIndex: index
            },
            () => {
              Animated.timing(this.state.offsetX, {
                toValue:
                  (index / 3) * CSS.width() +
                  CSS.width() / 3 / 2 -
                  CSS.pixel(13),
                duration: 100
              }).start();
              onChangeTab && onChangeTab instanceof Function && onChangeTab(index);
            }
          );
          
        }}
        tabContentStyle={{
          flex:1
        }}
      >
      {children}
      </SDTabs2>
        {/* <Tabs
          {...this.props}
          // 修改文字激活时的fontWeight
          tabBarActiveTextWeight={"bold"}
          onChange={(tab, index) => {
            this.setState(
              {
                currentIndex: index
              },
              () => {
                Animated.timing(this.state.offsetX, {
                  toValue:
                    (index / 3) * CSS.width() +
                    CSS.width() / 3 / 2 -
                    CSS.pixel(20),
                  duration: 100
                }).start();
              }
            );
            onChange && onChange instanceof Function && onChange(arguments);
          }}
        >
          {children}
        </Tabs> */}
      </View>
    );
  }
}
