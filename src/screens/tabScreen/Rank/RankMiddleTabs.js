// import { Tabs } from "antd-mobile";
import React from "react";
import { View, Animated, Text, Easing, StyleSheet, Image, Platform } from "react-native";
import { CSS } from "../../../common/SDCSS";
import * as sdStyles from "@src/styles";
import { SDTabs2 } from "@src/sd_components";

const radius = 10
const componentStyle = StyleSheet.create({
  tabItemContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    height:CSS.pixel(80, true),
    position:'relative'
  },
  patchView: {
    zIndex: -1,
    backgroundColor:'#fff', 
    // backgroundColor:'pink', 
    position:'absolute',
    left: -CSS.width()*1/8,
    height: CSS.pixel(70, true),
    width: CSS.width()/4
  },
  inactive: {
    zIndex:1,
    height: CSS.pixel(70, true),
    width: '100%',
    backgroundColor: '#e1e1e1',
    // backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  leftItemBorderRadius: {
    borderTopLeftRadius:radius,
    borderBottomRightRadius:radius,
  },
  rightItemBorderRadius: {
    borderTopRightRadius:radius,
    borderBottomLeftRadius:radius,
  },
  active: {
    zIndex:1,
    height: CSS.pixel(80, true),
    width: '100%',
    backgroundColor: '#fff',
    // backgroundColor: 'transparent',
    borderTopLeftRadius:radius,
    borderBottomRightRadius:0,
    borderTopRightRadius:radius,
    borderBottomLeftRadius:0,
  }
})
export default class RankMiddleTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      offsetX: new Animated.Value(CSS.width() / 3 / 2 - CSS.pixel(20))
    };
  }
  getTabItem = (title, isLeft, isActive) => {
    return (<View style={[componentStyle.tabItemContainer]}>
      {!isLeft && (Platform.OS === 'android') && <View style={[componentStyle.patchView]}></View>}
      {isLeft && <View style={[componentStyle.patchView, {left: CSS.width()*3/8,}]}></View>}
      <View style={[
        componentStyle.inactive,
        isLeft ? componentStyle.leftItemBorderRadius : componentStyle.rightItemBorderRadius,
        isActive && componentStyle.active]}>
        <Image source={isLeft ? require('@img/rank/rank_ico_TOP.png') : require('@img/rank/rank_ico_Position.png')}/>
        <Text style={{fontSize:CSS.textSize(28), fontWeight:sdStyles.SDFontMedium}}>{title}</Text>
      </View>
    </View>)
  }
  componentDidMount() {}
  render() {
    const { children, tabIndex, ...restProps } = this.props;
    return (
      <SDTabs2
        tabTitles={['TOP榜', '我的位次'].map((item, index) => {
          return () => this.getTabItem(item, !index, (tabIndex-0) === index)
        })}
        tabContentStyle={{width: '100%'}}
        {...restProps}
      >
        {children}
      </SDTabs2>
    );
  }
}
