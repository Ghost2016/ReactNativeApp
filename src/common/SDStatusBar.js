/* @flow */
import React, { PureComponent } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Color from 'color';

// import type { Dimensions, StatusBarStyle, ThemeType } from '../types';
import connectWithActions from '../connectWithActions';
import { getSession } from '../selectors';
// import { getSession, getSettings, getTitleBackgroundColor, getTitleTextColor } from '../selectors';
// import getStatusBarStyle from '../utils/getStatusBarStyle';
// import getStatusBarColor from '../utils/getStatusBarColor';

type Props = {
  // barStyle?: StatusBarStyle,
  hidden: boolean,
  // theme: ThemeType,
  backgroundColor: string,
  safeAreaInsets: Dimensions,
  textColor: string,
  orientation: string,
};

class SDStatusBar extends PureComponent<Props> {
  static contextTypes = {
    styles: () => null,
  };
  state = {

  }
  props: Props;

  static defaultProps = {
    theme: 'light',
    hidden: false,
    orientation: 'PORTRAIT',
    textColor: '#000'
  };
  
  render() {
    const {
      theme,
      backgroundColor,
      textColor,
      hidden,
      barStyle,
      safeAreaInsets,
      orientation,
      statusBarBackgroundColor
    } = this.props;
    // const style = { height: hidden ? 0 : safeAreaInsets.top }
    const style = { height: hidden ? 0 : safeAreaInsets.top, backgroundColor: statusBarBackgroundColor };
    // const statusBarStyle = !barStyle
    //   ? getStatusBarStyle(backgroundColor, textColor, theme)
    //   : barStyle;
    // const statusBarColor = getStatusBarColor(backgroundColor, theme);
    return (
      orientation === 'PORTRAIT' && (
        <View style={style}>
          <StatusBar
            animated
            // android
            // backgroundColor="blue"
            // showHideTransition="slide"
            hidden={hidden && Platform.OS !== 'android'}
            backgroundColor={statusBarBackgroundColor}
            // backgroundColor={Color(statusBarColor).darken(0.1)}
            // barStyle={statusBarStyle}
          />
        </View>
      )
    );
  }
}

export default connectWithActions((state, props) => ({
  safeAreaInsets: getSession(state).safeAreaInsets,
  statusBarBackgroundColor: getSession(state).statusBarBackgroundColor,
  // theme: getSettings(state).theme,
  // backgroundColor: !props.backgroundColor
  //   ? getTitleBackgroundColor(props.narrow)(state)
  //   : props.backgroundColor,
  // textColor: getTitleTextColor(props.narrow)(state),
  // orientation: getSession(state).orientation,
}))(SDStatusBar);
