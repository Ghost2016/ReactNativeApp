/* @flow */
import React, { PureComponent } from "react";
import { Platform, Dimensions, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Tabs } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import UnderlineText from "@sd_components/UnderlineText";

import TabItemStyle from "antd-mobile/es/tabs/style/index.native";

//定制tabs下划线颜色样式
const newTabsStyle = {};
for (const key in TabItemStyle) {
  if (Object.prototype.hasOwnProperty.call(TabItemStyle, key)) {
    newTabsStyle[key] = { ...StyleSheet.flatten(TabItemStyle[key]) };
  }
}
newTabsStyle.Tabs.topTabBarSplitLine = {
  borderBottomColor: sdStyles.SDHelperColorline,
  borderBottomWidth: 0,
  borderWidth: 0,
  borderColor:'#f00',
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: sdStyles.SDHelperColorline,
  paddingBottom: CSS.pixel(14, true),
};
//console.log("newTabsStyle", newTabsStyle);

//ios需要两种tabs做风格切换
const tabsProps = {
  tabBarBackgroundColor: "transparent", //sdStyles.SDBGColorMinor,
  tabBarInactiveTextColor: sdStyles.SDFontColorMinor,
  tabBarActiveTextColor: sdStyles.SDMainColor,
  tabBarUnderlineStyle: {
    //left: 0,
    backgroundColor: sdStyles.SDMainColor, //sdStyles.SDHelperColorline,
    height: 1,
    width: CSS.pixel(90)
  }
  //android tabs字体样式有效
  /*tabBarTextStyle: {
    fontSize: CSS.textSize(28),
    height: 28, //CSS.pixel(28),
    //borderBottomWidth: 2,
    //borderBottomColor: sdStyles.SDMainColor,
    marginTop: 0
  }*/
};

//登录tabs
const tabsPropsWhite = {
  tabBarBackgroundColor: "transparent", //sdStyles.SDBGColorMinor,
  tabBarInactiveTextColor: "#999",
  tabBarActiveTextColor: "#fff",
  tabBarUnderlineStyle: {
    //left: 0,
    backgroundColor: sdStyles.SDHelperColorline,
    height: CSS.pixel(2, true),
    width: CSS.pixel(45)
  },
  //android tabs字体样式有效
  tabBarTextStyle: {
    fontSize: CSS.textSize(28)
    //height: 28, //CSS.pixel(28),
    //borderBottomWidth: 2,
    //borderBottomColor: "#fff",
    //marginTop: 0
  }
};

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

/*const styles = StyleSheet.create({
  container: {
    height,
    width
  },
  tabs: {
    height: 360,
    width,
    paddingTop: 150,
    backgroundColor: "#bfbfbf",
    paddingBottom: 0
  },
  tabContent: {
    flex: 1,
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  }
});*/

type Props = {
  tabTitles: string,
  onChangeTab: () => void
};

export default class SDTabs extends PureComponent<Props> {
  props: Props;

  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  state = {
    currentTab: 0,
    tabs: null,
    //tabsGroup: null,
    tabTitles: [],
    tabsWidth: CSS.pixel(90),
    fontSize: CSS.textSize(28),
    tabsProps: tabsProps
  };

  componentWillMount() {
    const {
      tabTitles,
      lineWidth,
      fontSize,
      startIndex,
      isWhite,
      underLineWidth
    } = this.props;
    const _startIndex = startIndex ? startIndex : 0;
    //console.log("_startIndex", _startIndex);
    const _tabsProps = isWhite ? tabsPropsWhite : tabsProps;
    //30有两个中文字体宽度
    const _underLineWidth = underLineWidth ? underLineWidth : CSS.pixel(90);
    if (Platform.OS === "android") {
      this.setState({
        underLineWidth: _underLineWidth,
        currentTab: _startIndex,
        tabTitles: tabTitles,
        tabs: tabTitles.map(n => {
          return { title: n };
        }),
        tabsProps: _tabsProps
      });
    } else {
      this.setState({
        underLineWidth: _underLineWidth,
        currentTab: _startIndex,
        tabTitles: tabTitles,
        tabs: tabTitles.map(n => {
          return { title: n };
        }),
        /*tabsGroup: tabTitles.map((n, i) => {
          return tabTitles.map((n2, i2) => {
            let _tempLen = Array.isArray(lineWidth) ? lineWidth[i2] : lineWidth;
            let _tempSize = Array.isArray(fontSize) ? fontSize[i2] : fontSize;
            let w = _tempLen || this.state.tabsWidth;
            let s = _tempSize || this.state.fontSize;
            console.log("ws", n2, w, s);
            return {
              title: (
                <UnderlineText
                  key={"ul" + i2}
                  isShow={i === i2 ? true : false}
                  lineWidth={w}
                  fontSize={s}
                  title={n2}
                />
              )
            };
          });
        }),*/
        tabsProps: _tabsProps
      });
    }
  }

  componentDidMount() {
    this.context.refs["_currentTabs"] = this.refs["_currentTabs"];
  }

  handleTabChange = (tab, index) => {
    //console.log("handleTabChange[][]", tab, index, this.props.onChangeTab)
    this.props.onChangeTab(tab, index)
  };

  changePage(index) {
    console.log("changePage====", index)
    this.setState({
      currentTab: index
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log("changePage====", nextProps.page)
    if(nextProps.page !== this.props.page){
      this.changePage(nextProps.page);
    }

  }

  render() {
    const { style, children, page, swipeable } = this.props;
    const _swipeable = typeof swipeable === 'boolean' ? swipeable : false;
    return (
      <Tabs
        styles={newTabsStyle}
        ref="_currentTabs"
        underLineWidth={this.state.underLineWidth}
        page={this.state.currentTab}
        tabs={
          this.state.tabs
          /*Platform.OS === "android"
            ? this.state.tabs
            : this.state.tabsGroup[this.state.currentTab]*/
        }
        {...this.state.tabsProps}
        swipeable={_swipeable}
        onChange={this.handleTabChange.bind(this)}
        onTabClick={(tab, index) => {
          console.log("onTabClick", index, tab);
          this.setState({
            currentTab: index
          });
          this.handleTabChange(tab, index);
        }}
      >
        {children}
      </Tabs>
    );
  }
}
