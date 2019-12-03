/* @flow */
import React, { PureComponent } from "react";
import { Platform, Dimensions, View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {
  //当前tab index，修改page可以从外边切换tab
  page: number,
  //下划线长度，默认90
  underLineWidth: number,
  //tabs标题，个数和children个数要吻合
  tabTitles: string[],
  //整个容器样式定制属性
  style: object,
  //单个tab标题样式定制属性
  tabStyle: object,
  //tab标题区整体宽度样式定制属性，默认100%宽
  tabWidthStyle: object,
  //tab内容样式定制属性
  tabContentStyle: object,
  //tab标题下划线样式定制属性
  underlineStyle: object,
  onChangeTab: () => void,
};

export default class SDTabs2 extends PureComponent<Props> {
  props: Props;

  static contextTypes = {
    //refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };

  state = {
    currentTab: 0,
    tabTitles: [],
    tabStatus: [],
    tabsWidth: CSS.pixel(90),
    activeColor: '#fff',
    inActiveColor: '#999',
  };

  componentWillMount() {
    const {
      page,
      underLineWidth,
      tabTitles,
      activeColor,
      inActiveColor,
    } = this.props;
    const _underLineWidth = typeof underLineWidth === "number" ? underLineWidth : CSS.pixel(90);
    this.setState({
      tabsWidth: _underLineWidth,
      currentTab: typeof page === "number" ? parseInt(page, 10) : 0,
      tabStatus: tabTitles.map((n,i)=>{
        return (i==0) ? true : false;
      }),
      activeColor: activeColor? activeColor : '#fff',
      inActiveColor: inActiveColor? inActiveColor : '#999',
    });
  }

  componentDidMount() {
    //this.context.refs["_currentTabs"] = this.refs["_currentTabs"];
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.page !== this.props.page && !isNaN(nextProps.page)){
      this.setState({
        currentTab: parseInt(nextProps.page, 10),
      });
    }
  }

  handleTabChange = (index) => {
    console.log("handleTabChange[][]", index)
    this.props.onChangeTab(index)
  };

  render() {
    const {
      style,
      //swipeable,
      tabTitles,
      tabStyle,
      tabWidthStyle,
      tabContentStyle,
      underlineStyle,
      noChange,
      lineGap,
     } = this.props;
    //const _swipeable = typeof swipeable === 'boolean' ? swipeable : false;
    const _swipeable = typeof swipeable === 'boolean' ? swipeable : false;
    const _lineGap = typeof lineGap === 'number' ? lineGap : 10;
    return (
      <View style={[{
          flex: 0,
          flexDirection: 'column',
          alignItems: 'center',
          borderWidth: 0,
          borderColor: '#ff0',
        }, style]}>
        <View style={[{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }, tabWidthStyle]}>
        {(tabTitles && tabTitles.length>1) ? tabTitles.map((n,i)=>{
          if(n && typeof n === Function) return(n())
          return (<TouchableOpacity
            key={i+""}
            activeOpacity={1.0}
            onPress={() => {
              // 如果切换index由其他组件控制
              // 则这里不运行执行切换
              if (typeof noChange !== 'undefined') {
                this.handleTabChange(i)
                return;
              }
              let tabStatus = this.state.tabStatus;
              tabStatus[i] = true;
              this.setState({
                currentTab: i,
                tabStatus: tabStatus,
              });
              this.handleTabChange(i)
            }}
            style={[{
              borderWidth: 0,
              borderColor: '#f00',
              backgroundColor: "transparent",
              width: `${(100 / tabTitles.length)}%`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              minHeight: CSS.pixel(80, true),
            }, tabStyle]}
          >
            {typeof n === 'function' ? n() : <View
              style={{
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  //fontWeight: "600",
                  color: this.state.currentTab == i ? this.state.activeColor : this.state.inActiveColor,
                  width: '100%',
                  textAlign: 'center',
                  borderWidth: 0,
                  borderColor: '#f0f',
                  justifyContent: 'center',
                  fontSize: CSS.textSize(28),
                }}
              >
                {n}
              </Text>
              {n ? this.state.currentTab == i ? (
                <View
                  style={[{
                    marginTop: CSS.pixel(_lineGap, true),
                    width: n.length == 2 ? this.state.tabsWidth / 2 : this.state.tabsWidth,
                    height: CSS.pixel(4, true),
                    backgroundColor: this.state.activeColor,
                    borderRadius: 2,
                  }, underlineStyle]}
                />
              ) : (
                <View
                  style={[{
                    marginTop: CSS.pixel(_lineGap, true),
                    width: this.state.tabsWidth,
                    height: CSS.pixel(4, true),
                    backgroundColor: "transparent",
                    borderRadius: 2,
                  }, underlineStyle]}
                />
              ) : null}
            </View>}
          </TouchableOpacity>)
        }) : null}
        </View>
        {this.props.children.map((child, index) => {
            //console.log("child==", child.type.displayName , index, width)
            const _child = (tabContentStyle, child, index, visible = true) => {
              const __child = React.cloneElement(child, {
                currentTab: this.state.currentTab,
                tabStatus: this.state.tabStatus,
              });
              return (<View key={index+""} style={[{
                borderWidth: 0,
                borderColor: '#f00',
                //如果不指定宽度，可以左右拉动看见空白
                // minWidth: CSS.pixel(1000),
                // minHeight: CSS.pixel(240, true),
                alignItems: "center",
                justifyContent: "center",
                display: visible? "flex" : "none",
                //backgroundColor: "#fff"
              }, tabContentStyle]}>{__child}</View>)
            };

            if(this.state.tabStatus[index]){
              //如果已经初始化，只是切换透明度
              return (this.state.currentTab == index) ? _child(tabContentStyle, child, index, true) : _child(tabContentStyle, child, index, false);
            } else {
              //如果未初始化，返回null
              if(this.state.currentTab == index){
                return _child(tabContentStyle, child, index, true)
              }
              return null
            }
        })}
      </View>
    );
  }
}
