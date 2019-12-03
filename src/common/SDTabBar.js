/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import SDTouchOpacity from "./SDTouchOpacity";
import { CSS } from "./SDCSS";
import { isIphoneX } from "../utils/iphonex";
import LottieView from 'lottie-react-native';

type Props = {
  selectIndex: number
};

export default class SDTabBar extends PureComponent<Props> {
  static contextTypes = {
    navigator: () => null
  };
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          title: "首页",
          norIcon: require("@img/home/01tab_bar/tab_bar_ico_home.png"),
          selIcon: require("@img/home/01tab_bar/tab_bar_ico_home_pre.png")
        },
        {
          title: "排名",
          norIcon: require("@img/home/01tab_bar/tab_bar_ico_Rank.png"),
          selIcon: require("@img/home/01tab_bar/tab_bar_ico_Rank_pre.png")
        },
        {
          title: "成长",
          norIcon: require("@img/home/01tab_bar/tab_bar_ico_growing.png"),
          selIcon: require("@img/home/01tab_bar/tab_bar_ico_growing_pre.png")
        },
        {
          title: "我的",
          norIcon: require("@img/home/01tab_bar/tab_bar_ico_mine.png"),
          selIcon: require("@img/home/01tab_bar/tab_bar_ico_mine_pre.png")
        }
      ]
    };
  }

  render() {
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#f3f3f3",
          height: isIphoneX() ? 34 + CSS.pixel(98, true) : CSS.pixel(98, true),
          backgroundColor: "#fff",
          paddingBottom: isIphoneX() ? 34 : 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.state.tabs.map((tab, index) => {
          return (
            <SDTouchOpacity
              key={index + ""}
              activeOpacity={1}
              onPress={() => {
                if (this.props.selectIndex == index) {
                  return;
                } else {
                  this.context.navigator.switchToTab({
                    tabIndex: index
                  });
                }
              }}
              style={{
                flex: 1
              }}
              noDelay
            >
              {this.props.selectIndex == index ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1
                  }}
                >
                  <View style={{marginTop: CSS.pixel(10), width: CSS.pixel(40), height: CSS.pixel(40), alignItems: 'center'}}>
                    <Image source={tab.selIcon} />
                  </View>
                  <View style={{alignItems: 'center', marginTop: CSS.pixel(10)}}>
                    <Text
                      style={{
                        color: "#666",
                        fontSize: CSS.textSize(18),
                        // lineHeight: 0
                      }}
                    >
                      {tab.title}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{marginTop: CSS.pixel(10), width: CSS.pixel(40), height: CSS.pixel(40), alignItems: 'center'}}>
                    <Image source={tab.norIcon} />
                  </View>
                  <View style={{alignItems: 'center', marginTop: CSS.pixel(10)}}>
                    <Text
                      style={{
                        color: "#d3d3d3",
                        fontSize: CSS.textSize(18),
                        // lineHeight: 0
                      }}
                    >
                      {tab.title}
                    </Text>
                  </View>
                </View>
              )}
            </SDTouchOpacity>
          );
        })}
      </View>
    );
  }
}
