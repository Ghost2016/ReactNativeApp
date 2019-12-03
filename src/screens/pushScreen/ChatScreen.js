// 数据查询页面
import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import SDSafeArea from "../../common/SDSafeArea";
import SDScreen from "../../common/SDScreen";
import Color from "color";
import SDHeader, { ButtonsProps, HeaderProps } from "../../common/SDHeader";
import MobStat from "../../boot/MobStat";

type Props = {
  screen: () => Element,
  header: HeaderProps,
  backgroundColor: string,
  fullScreen: ?boolean //是否全屏页面
};

// ChatScreen屏幕
export default class ChatScreen extends React.PureComponent<Props> {
  static defaultProps = {
    header: null,
    barStyle: "dark-content",
    fullScreen: false,
    noScrollView: false,
    statusBarColor: "dark"
  };

  componentDidMount() {
    if (this.props.header && this.props.header.title) {
      MobStat.onPageStart(this.props.header.title)
    }
  }

  componentWillUnmount() {
    if (this.props.header && this.props.header.title) {
      MobStat.onPageEnd(this.props.header.title)
    }
  }

  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }

  render() {
    let { header, screen, barStyle, fullScreen, navigatorButtons, statusBarColor, custom} = this.props;
    if (custom && screen) {
      return screen();
    }
    if (fullScreen != true) {
      return <SDScreen
        header={() => {
          return <SDHeader  navigatorButtons={navigatorButtons || {} } {...header}/>
        }}
      > 
        {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
        {this.props && this.props.screen ? this.props.screen() : null}
      </SDScreen>;
    }

    if (!header) {
      return (
        <SDSafeArea
          backgroundColor={this.props.backgroundColor}
          noScrollView={this.props.noScrollView}
          saveBg={this.props.saveBg}
        >
          {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
          {screen()}
        </SDSafeArea>
      );
    }

    return (
      <View
        style={{
          flex: 1
        }}
      >
        {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
        {header.fixed ? null : <SDHeader ref="_sdHeader" navigatorButtons={navigatorButtons || {}} {...header}/>}

        <SDSafeArea
          scrollEventThrottle={0.5}
          onScroll={header.fixed ? this._onScrollView.bind(this) : null}
          backgroundColor={this.props.backgroundColor}
          noScrollView={this.props.noScrollView}
          saveBg={this.props.saveBg}
        >
          {screen()}
        </SDSafeArea>

        {header.fixed ? <SDHeader ref="_sdHeader" navigatorButtons={navigatorButtons || {}} {...header} animate/> : null}
      </View>
    );
  }
}
